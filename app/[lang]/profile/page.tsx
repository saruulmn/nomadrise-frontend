'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
  country: string;
  city: string;
  highest_education: string;
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
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    if (status === 'loading') return; // wait for session
    if (!session?._at) {
      setLoading(false);
      return;
    }

    fetch(`${apiBase}/auth/me/profile/`, {
      headers: { Authorization: `Bearer ${session._at}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          birth_date: data.birth_date || '',
          country: data.country || '',
          city: data.city || '',
          highest_education: data.highest_education || '',
          current_status: data.current_status || '',
          preferred_language: data.preferred_language || '',
          bio_en: data.bio_en || '',
          bio_mn: data.bio_mn || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?._at, apiBase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?._at) {
      setErrorMsg('Your session has expired. Please sign in again.');
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
          Authorization: `Bearer ${session._at}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(JSON.stringify(errData) || 'Failed');
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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {(session?.user?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
                <p className="text-gray-500 text-sm">{session?.user?.email}</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                  {t.personalInfo}
                </h2>

                {/* Name row */}
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

                {/* Email */}
                <Field label={t.email}>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                  />
                </Field>

                {/* Phone & Birth date */}
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

                {/* Country & City */}
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

                {/* Education */}
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

                {/* Current status & Preferred language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={t.currentStatus}>
                    <input
                      name="current_status"
                      value={form.current_status}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </Field>
                  <Field label={t.preferredLanguage}>
                    <input
                      name="preferred_language"
                      value={form.preferred_language}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </Field>
                </div>

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

                {/* Messages */}
                {successMsg && (
                  <p className="text-green-600 text-sm font-medium">{successMsg}</p>
                )}
                {errorMsg && (
                  <p className="text-red-500 text-sm font-medium">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {saving ? t.saving : t.saveChanges}
                </button>
              </form>
            )}
          </div>
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
