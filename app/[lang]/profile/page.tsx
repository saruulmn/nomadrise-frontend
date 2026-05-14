'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import AuthGuard from '@/app/components/AuthGuard';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

const EDUCATION_KEYS = [
  'secondary_student',
  'high_school_graduate',
  'bachelor_student',
  'bachelor_graduate',
  'master_student',
  'master_graduate',
  'phd_student',
  'phd_graduate',
] as const;

type UserRole = 'student' | 'teacher' | 'mentor' | 'teamMember';

function detectRole(groups: string[]): UserRole {
  if (groups.includes('teacher')) return 'teacher';
  if (groups.includes('mentor')) return 'mentor';
  if (groups.includes('teamMember')) return 'teamMember';
  return 'student';
}

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
  country: string;
  city: string;
  highest_education: string;
  avatar_url: string | null;
  groups: string[];
  // role-specific fields
  subject: string;
  current_status: string;
  preferred_language: string;
  bio_en: string;
  bio_mn: string;
}

const EMPTY_PROFILE: ProfileData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  birth_date: '',
  country: '',
  city: '',
  highest_education: '',
  avatar_url: null,
  groups: [],
  subject: '',
  current_status: '',
  preferred_language: '',
  bio_en: '',
  bio_mn: '',
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const lang = (pathname.startsWith('/en') ? 'en' : 'mn') as Locale;

  const [dictionary, setDictionary] = useState<any>(null);
  const [form, setForm] = useState<ProfileData>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  // Prevents sending a second request when the session re-renders after fetch
  const hasFetched = useRef(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  // ── Effect 1: pre-fill from NextAuth session immediately ─────────────────
  // Fires as soon as status === 'authenticated', BEFORE the API responds.
  // This ensures the header and form inputs are in sync from the start.
  // The API fetch (Effect 2) will overwrite with authoritative DB values.
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return;

    const [socialFirst = '', ...rest] = (session.user.name || '').split(' ');
    const socialLast = rest.join(' ');

    setForm(prev => ({
      ...prev,
      first_name: prev.first_name || socialFirst,
      last_name: prev.last_name || socialLast,
      email: prev.email || session.user?.email || '',
      avatar_url: prev.avatar_url || session.user?.image || null,
    }));
  }, [status, session?.user?.name, session?.user?.email, session?.user?.image]);

  // ── Effect 2: fetch authoritative profile data from Django ────────────────
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || session?.authError) {
      router.push(`/${lang}/login`);
      return;
    }

    const token = session?._at;

    if (!token) {
      // Authenticated by NextAuth but backend token not yet available.
      // Stop the spinner so the form pre-filled by Effect 1 is visible.
      setLoading(false);
      return;
    }

    // Don't re-fetch if we already have data (prevents double-fetch in
    // React StrictMode and on shallow session updates).
    if (hasFetched.current) return;
    hasFetched.current = true;

    const controller = new AbortController();

    fetch(`${apiBase}/auth/me/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 401) {
          signOut({ callbackUrl: `/${lang}/login` });
          return null;
        }
        if (!res.ok) throw new Error(`Profile fetch failed: HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Record<string, any> | null) => {
        if (!data) return;

        const [sf = '', ...sr] = (session?.user?.name || '').split(' ');
        const sl = sr.join(' ');

        setForm({
          first_name:         data.first_name         || sf || '',
          last_name:          data.last_name          || sl || '',
          email:              data.email              || session?.user?.email || '',
          phone:              data.phone              || '',
          birth_date:         data.birth_date         || '',
          country:            data.country            || '',
          city:               data.city               || '',
          highest_education:  data.highest_education  || '',
          avatar_url:         data.avatar_url         || session?.user?.image || null,
          groups:             data.groups             || [],
          subject:            data.subject            || '',
          current_status:     data.current_status     || '',
          preferred_language: data.preferred_language || '',
          bio_en:             data.bio_en             || '',
          bio_mn:             data.bio_mn             || '',
        });
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return;
        setErrorMsg(dictionary?.profile?.errorMessage || 'Failed to load profile data.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [status, session?._at, session?.authError, apiBase, lang]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = session?._at;
    if (!token) return;

    setUploadingAvatar(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch(`${apiBase}/auth/me/profile/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setForm((prev) => ({ ...prev, avatar_url: data.avatar_url || prev.avatar_url }));
    } catch {
      setErrorMsg('Failed to upload avatar.');
    } finally {
      setUploadingAvatar(false);
      // Reset so the same file can be re-selected
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = session?._at;
    
    console.log('session:', session);
    console.log('_at:', session?._at);
    
    if (!token) {
      if (status === 'unauthenticated') {
        router.push(`/${lang}/login`);
      } else {
        setErrorMsg('Session not ready. Please try again.');
      }
      return;
    }

    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`${apiBase}/auth/me/profile/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        signOut({ callbackUrl: `/${lang}/login` });
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const detail =
          errData?.detail ||
          Object.values(errData).flat().join(' ') ||
          'Failed to update profile.';
        throw new Error(String(detail));
      }
      setSuccessMsg(dictionary?.profile?.successMessage || 'Profile updated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      setErrorMsg(msg || dictionary?.profile?.errorMessage || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!dictionary) return null;

  const t = dictionary.profile;
  const role = detectRole(form.groups);
  const hasRoleSection = role !== 'student';
  const avatarSrc = form.avatar_url || session?.user?.image;
  const displayName =
    [form.first_name, form.last_name].filter(Boolean).join(' ') ||
    session?.user?.name ||
    'User';

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* ── Header card ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="relative group shrink-0 focus:outline-none"
              title={t.changeAvatar}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                {uploadingAvatar ? (
                  <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M3 12h2m14 0h2M5.636 5.636l1.414 1.414m9.9 9.9 1.414 1.414M5.636 18.364l1.414-1.414m9.9-9.9 1.414-1.414" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                )}
              </span>
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-500 text-sm">{form.email || session?.user?.email}</p>
              {role !== 'student' && (
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium capitalize">
                  {t.roles?.[role] || role}
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── Block 1: Personal Information ─────────────────────────── */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-6">
                  {t.personalInfo}
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={t.firstName}>
                      <input
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </Field>
                    <Field label={t.lastName}>
                      <input
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </Field>
                  </div>

                  <Field label={t.email}>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={t.phone}>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </Field>
                    <Field label={t.birthDate}>
                      <input
                        name="birth_date"
                        type="date"
                        value={form.birth_date}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={t.country}>
                      <input
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </Field>
                    <Field label={t.city}>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </Field>
                  </div>

                  <Field label={t.education}>
                    <select
                      name="highest_education"
                      value={form.highest_education}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">—</option>
                      {EDUCATION_KEYS.map((key) => (
                        <option key={key} value={key}>
                          {t.educationOptions?.[key] || key}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* ── Block 2: Role-specific Information ─────────────────────── */}
              {hasRoleSection && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-6">
                    {t.roleInfo?.[role] || t.roleInfo?.title || 'Role Information'}
                  </h2>
                  <div className="space-y-4">
                    {/* Teacher only: subject */}
                    {role === 'teacher' && (
                      <Field label={t.subject || 'Subject'}>
                        <input
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </Field>
                    )}

                    {/* Teacher + TeamMember: current_status */}
                    {(role === 'teacher' || role === 'teamMember') && (
                      <Field label={t.currentStatus}>
                        <input
                          name="current_status"
                          value={form.current_status}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </Field>
                    )}

                    {/* All non-student roles: preferred_language */}
                    <Field label={t.preferredLanguage}>
                      <input
                        name="preferred_language"
                        value={form.preferred_language}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </Field>

                    {/* Bio EN */}
                    <Field label={t.bioEn}>
                      <textarea
                        name="bio_en"
                        value={form.bio_en}
                        onChange={handleChange}
                        rows={3}
                        className="input-field resize-none"
                      />
                    </Field>

                    {/* Bio MN */}
                    <Field label={t.bioMn}>
                      <textarea
                        name="bio_mn"
                        value={form.bio_mn}
                        onChange={handleChange}
                        rows={3}
                        className="input-field resize-none"
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── Save button ──────────────────────────────────────────────── */}
              <div className="bg-white rounded-lg shadow-md p-6">
                {successMsg && (
                  <p className="text-green-600 text-sm font-medium mb-4">{successMsg}</p>
                )}
                {errorMsg && (
                  <p className="text-red-500 text-sm font-medium mb-4">{errorMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {saving ? t.saving : t.saveChanges}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
