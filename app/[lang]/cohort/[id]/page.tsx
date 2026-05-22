'use client';

import { usePathname, notFound } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UsersIcon, CalendarDaysIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { cohorts, type CohortStatus } from '@/lib/data/cohorts';
import { checkCohortContentAccess, createEnrollmentRequest } from '@/lib/api/approvals';
import CohortCommunity from '@/app/components/cohort/CohortCommunity';

const STATUS_STYLES: Record<CohortStatus, string> = {
  Active: 'bg-green-100 text-green-700',
  Upcoming: 'bg-blue-100 text-blue-700',
  Completed: 'bg-gray-100 text-gray-500',
};

const STATUS_MN: Record<CohortStatus, string> = {
  Active: 'Идэвхтэй',
  Upcoming: 'Удахгүй',
  Completed: 'Дууссан',
};

interface Props {
  params: Promise<{ id: string; lang: string }>;
}

export default function CohortDetailPage({ params }: Props) {
  const { id } = use(params);
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'mn';
  const { data: session, status: authStatus } = useSession();
  const [hasAccess, setHasAccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'community'>('overview');

  const cohort = cohorts.find((c) => c.id === id);

  useEffect(() => {
    if (authStatus !== 'authenticated' || !session?._at) return;
    checkCohortContentAccess(id, session._at)
      .then((data) => setHasAccess(data.has_access))
      .catch(() => setHasAccess(false));
  }, [authStatus, id, session?._at]);

  const requestJoin = async () => {
    if (!session?._at) {
      setError(lang === 'mn' ? 'Эхлээд нэвтэрнэ үү.' : 'Please sign in first.');
      return;
    }
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      await createEnrollmentRequest(id, session._at);
      setMessage(lang === 'mn' ? 'Элсэх хүсэлт илгээгдлээ.' : 'Enrollment request sent.');
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === 'mn' ? 'Хүсэлт амжилтгүй боллоо.' : 'Request failed.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!cohort) return notFound();

  const fmt = (date: string) =>
    new Date(date).toLocaleDateString(lang === 'mn' ? 'mn-MN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="lms-list-page">
      {/* Cover image */}
      <div className="relative h-72 md:h-[26rem] overflow-hidden bg-gray-200">
        <img src={cohort.cover} alt={cohort.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-950/25 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 px-6 max-w-[1360px] mx-auto">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[cohort.status]}`}>
              {lang === 'mn' ? STATUS_MN[cohort.status] : cohort.status}
            </span>
            {cohort.categories.map((cat) => (
              <span key={cat} className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30">
                {cat}
              </span>
            ))}
          </div>
          <h1 className="max-w-4xl text-3xl md:text-5xl font-extrabold tracking-[-0.04em] text-white drop-shadow">{cohort.name}</h1>
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-[1360px] mx-auto px-5 pt-6">
        <Link href={`/${lang}/cohort`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" />
          {lang === 'mn' ? 'Буцах' : 'Back to cohorts'}
        </Link>
      </div>

      <div className="max-w-[1360px] mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem] gap-8 xl:gap-10">
        {/* Main content */}
        <div className="space-y-8">
          <div className="premium-card flex gap-2 p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
            >
              {lang === 'mn' ? 'Тухай' : 'Overview'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('community')}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-all ${activeTab === 'community' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
            >
              {lang === 'mn' ? 'Community' : 'Community'}
            </button>
          </div>

          {activeTab === 'overview' ? (
            <>
              <section className="premium-card p-6 md:p-7">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {lang === 'mn' ? 'Тухай' : 'About this cohort'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-7">{cohort.about}</p>
              </section>

              <section className="premium-card p-6 md:p-7">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {lang === 'mn' ? 'Хичээлийн контент' : 'Cohort content'}
                </h2>
                {hasAccess ? (
                  <div className="rounded-lg bg-green-50 border border-green-100 p-4 text-sm text-green-700">
                    {lang === 'mn' ? 'Таны элсэлт баталгаажсан. Контент үзэх боломжтой.' : 'Your enrollment is approved. Protected content is available.'}
                  </div>
                ) : (
                  <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 text-sm text-amber-700">
                    {lang === 'mn' ? 'Контент үзэхийн тулд элсэлтийн хүсэлт батлагдсан байх ёстой.' : 'Your enrollment must be approved before you can access cohort content.'}
                  </div>
                )}
              </section>

              <section className="premium-card p-6 md:p-7">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {lang === 'mn' ? 'Багш нар' : 'Instructors'}
                </h2>
                <div className="space-y-4">
                  {cohort.teachers.map((teacher) => (
                    <div key={teacher.name} className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50/70 p-3 dark:border-white/10 dark:bg-white/5">
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-blue-100 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{teacher.name}</p>
                        <p className="text-sm text-blue-600">{teacher.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <CohortCommunity
              cohortId={id}
              token={session?._at}
              lang={lang}
              enabled={authStatus === 'authenticated' && hasAccess}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats card */}
          <div className="premium-card sticky top-24 p-6 space-y-5">
            <div className="flex items-start gap-3">
              <CalendarDaysIcon className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  {lang === 'mn' ? 'Эхлэх огноо' : 'Start date'}
                </p>
                <p className="text-sm font-semibold text-gray-800">{fmt(cohort.startDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDaysIcon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  {lang === 'mn' ? 'Дуусах огноо' : 'End date'}
                </p>
                <p className="text-sm font-semibold text-gray-800">{fmt(cohort.endDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <UsersIcon className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  {lang === 'mn' ? 'Оролцогчид' : 'Members'}
                </p>
                <p className="text-sm font-semibold text-gray-800">{cohort.memberCount} {lang === 'mn' ? 'оролцогч' : 'students'}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          {message && <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}
          {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <button
            onClick={requestJoin}
            disabled={submitting || cohort.status === 'Completed'}
            className="premium-button premium-button-primary w-full disabled:opacity-50"
          >
            {cohort.status === 'Upcoming'
              ? (submitting ? (lang === 'mn' ? 'Илгээж байна...' : 'Sending...') : (lang === 'mn' ? 'Бүртгүүлэх' : 'Apply now'))
              : cohort.status === 'Active'
              ? (submitting ? (lang === 'mn' ? 'Илгээж байна...' : 'Sending...') : (lang === 'mn' ? 'Элсэх' : 'Join cohort'))
              : (lang === 'mn' ? 'Дууссан' : 'Cohort ended')}
          </button>
        </div>
      </div>
    </div>
  );
}
