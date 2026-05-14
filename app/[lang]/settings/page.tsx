'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import AuthGuard from '@/app/components/AuthGuard';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

// ---------- types ----------

interface LinkedAccount {
  provider: string;
  uid: string;
  date_joined: string;
}

interface LinkedAccountsData {
  accounts: LinkedAccount[];
  has_password: boolean;
}

type Tab = 'security' | 'connected';

// ---------- helpers ----------

function ProviderIcon({ provider }: { provider: string }) {
  if (provider === 'google') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    );
  }
  if (provider === 'facebook') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
        <path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073c0 6.027 4.388 11.025 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.024 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.93-1.956 1.885v2.265h3.328l-.532 3.49h-2.796v8.437C19.612 23.098 24 18.1 24 12.073z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

// ---------- main component ----------

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const lang = (pathname.startsWith('/en') ? 'en' : 'mn') as Locale;

  const [dictionary, setDictionary] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('security');

  // password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  // linked accounts
  const [linkedData, setLinkedData] = useState<LinkedAccountsData | null>(null);
  const [linkedLoading, setLinkedLoading] = useState(false);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null);
  const [linkedError, setLinkedError] = useState('');

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push(`/${lang}/login`);
    }
  }, [status, lang, router]);

  const fetchLinkedAccounts = useCallback(async () => {
    const token = session?._at;
    if (!token) return;
    setLinkedLoading(true);
    setLinkedError('');
    try {
      const res = await fetch(`${apiBase}/auth/settings/linked-accounts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setLinkedData(await res.json());
      } else {
        setLinkedError(dictionary?.settings?.loadError ?? 'Failed to load connected accounts.');
      }
    } catch {
      setLinkedError(dictionary?.settings?.loadError ?? 'Failed to load connected accounts.');
    } finally {
      setLinkedLoading(false);
    }
  }, [session?._at, apiBase, dictionary]);

  useEffect(() => {
    if (activeTab === 'connected' && session?._at) {
      fetchLinkedAccounts();
    }
  }, [activeTab, session?._at, fetchLinkedAccounts]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?._at) return;
    setPwError('');
    setPwSuccess('');

    if (newPassword !== confirmPassword) {
      setPwError(dictionary?.settings?.passwordMismatch ?? 'Passwords do not match.');
      return;
    }

    setPwSaving(true);
    try {
      const res = await fetch(`${apiBase}/auth/settings/password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session._at}`,
        },
        body: JSON.stringify({
          current_password: currentPassword || undefined,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });
      if (res.ok) {
        setPwSuccess(dictionary?.settings?.passwordSuccess ?? 'Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        const msg =
          data?.current_password?.[0] ??
          data?.new_password?.[0] ??
          data?.confirm_password?.[0] ??
          data?.detail ??
          data?.non_field_errors?.[0] ??
          (dictionary?.settings?.passwordError ?? 'Failed to update password.');
        setPwError(msg);
      }
    } catch {
      setPwError(dictionary?.settings?.passwordError ?? 'Failed to update password.');
    } finally {
      setPwSaving(false);
    }
  };

  const handleUnlink = async (provider: string) => {
    if (!session?._at) return;
    setLinkedError('');
    setUnlinkingProvider(provider);
    try {
      const res = await fetch(`${apiBase}/auth/settings/linked-accounts/${provider}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session._at}` },
      });
      if (res.status === 204) {
        await fetchLinkedAccounts();
      } else {
        const data = await res.json().catch(() => ({}));
        setLinkedError(
          data?.detail ??
          data?.non_field_errors?.[0] ??
          (dictionary?.settings?.unlinkError ?? 'Failed to unlink account.')
        );
      }
    } catch {
      setLinkedError(dictionary?.settings?.unlinkError ?? 'Failed to unlink account.');
    } finally {
      setUnlinkingProvider(null);
    }
  };

  if (!dictionary || status === 'loading') return null;

  const d = dictionary.settings ?? {};
  const hasPassword = linkedData?.has_password ?? false;
  const linkedAccounts = linkedData?.accounts ?? [];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'security', label: d.tabSecurity ?? 'Security' },
    { key: 'connected', label: d.tabConnected ?? 'Connected Accounts' },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {d.title ?? 'Settings'}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {d.subtitle ?? 'Manage your account security and connected services.'}
            </p>
          </div>

          {/* Profile shortcut */}
          <a
            href={`/${lang}/profile`}
            className="flex items-center gap-4 p-4 mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
          >
            <div className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {d.profileCard ?? 'Profile & Avatar'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {d.profileCardDesc ?? 'Update your personal information and photo.'}
              </p>
            </div>
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Tabs */}
          <div className="flex gap-1 p-1 mb-6 rounded-lg bg-gray-100 dark:bg-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── SECURITY TAB ── */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                {hasPassword ? (d.changePassword ?? 'Change Password') : (d.createPassword ?? 'Create Password')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {hasPassword
                  ? (d.changePasswordDesc ?? 'Enter your current password to set a new one.')
                  : (d.createPasswordDesc ?? 'You signed in with a social account. Set a password to also sign in with email.')}
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {hasPassword && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {d.currentPassword ?? 'Current Password'}
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {d.newPassword ?? 'New Password'}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {d.confirmPassword ?? 'Confirm New Password'}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {pwError && (
                  <p className="text-sm text-red-600 dark:text-red-400">{pwError}</p>
                )}
                {pwSuccess && (
                  <p className="text-sm text-green-600 dark:text-green-400">{pwSuccess}</p>
                )}

                <button
                  type="submit"
                  disabled={pwSaving}
                  className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium transition-colors"
                >
                  {pwSaving
                    ? (d.saving ?? 'Saving…')
                    : hasPassword
                      ? (d.changePassword ?? 'Change Password')
                      : (d.createPassword ?? 'Create Password')}
                </button>
              </form>
            </div>
          )}

          {/* ── CONNECTED ACCOUNTS TAB ── */}
          {activeTab === 'connected' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                {d.connectedTitle ?? 'Connected Accounts'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {d.connectedDesc ?? 'Manage the social accounts linked to your profile.'}
              </p>

              {linkedError && (
                <p className="mb-4 text-sm text-red-600 dark:text-red-400">{linkedError}</p>
              )}

              {linkedLoading ? (
                <div className="flex justify-center py-8">
                  <svg className="w-6 h-6 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : linkedAccounts.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  {d.noConnected ?? 'No connected social accounts.'}
                </p>
              ) : (
                <ul className="space-y-3">
                  {linkedAccounts.map((account) => {
                    const isLast = linkedAccounts.length === 1 && !hasPassword;
                    const isUnlinking = unlinkingProvider === account.provider;
                    return (
                      <li
                        key={account.provider}
                        className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <ProviderIcon provider={account.provider} />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                              {account.provider}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(account.date_joined).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUnlink(account.provider)}
                          disabled={isLast || isUnlinking}
                          title={isLast ? (d.unlinkDisabledTooltip ?? 'Set a password before unlinking') : undefined}
                          className="text-xs px-3 py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          {isUnlinking
                            ? (d.unlinking ?? 'Unlinking…')
                            : (d.unlink ?? 'Unlink')}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {linkedData && !hasPassword && linkedAccounts.length > 0 && (
                <p className="mt-4 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856C18.48 20 19 19.105 19 18l-7-12-7 12c0 1.105.52 2 1.08 2z" />
                  </svg>
                  <span>{d.unlinkWarning ?? 'To unlink your last social account, first set a password on the Security tab.'}</span>
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </AuthGuard>
  );
}
