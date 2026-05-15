'use client';

import { usePathname, notFound } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import { TeamOutlined, CalendarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { cohorts, type CohortStatus } from '@/lib/data/cohorts';

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

  const cohort = cohorts.find((c) => c.id === id);
  if (!cohort) return notFound();

  const fmt = (date: string) =>
    new Date(date).toLocaleDateString(lang === 'mn' ? 'mn-MN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover image */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gray-200">
        <img src={cohort.cover} alt={cohort.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 px-6 max-w-5xl mx-auto">
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
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow">{cohort.name}</h1>
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link href={`/${lang}/cohort`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeftOutlined />
          {lang === 'mn' ? 'Буцах' : 'Back to cohorts'}
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {lang === 'mn' ? 'Тухай' : 'About this cohort'}
            </h2>
            <p className="text-gray-600 leading-relaxed">{cohort.about}</p>
          </section>

          {/* Teachers */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {lang === 'mn' ? 'Багш нар' : 'Instructors'}
            </h2>
            <div className="space-y-4">
              {cohort.teachers.map((teacher) => (
                <div key={teacher.name} className="flex items-center gap-4">
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
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <CalendarOutlined className="text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  {lang === 'mn' ? 'Эхлэх огноо' : 'Start date'}
                </p>
                <p className="text-sm font-semibold text-gray-800">{fmt(cohort.startDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarOutlined className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  {lang === 'mn' ? 'Дуусах огноо' : 'End date'}
                </p>
                <p className="text-sm font-semibold text-gray-800">{fmt(cohort.endDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TeamOutlined className="text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  {lang === 'mn' ? 'Оролцогчид' : 'Members'}
                </p>
                <p className="text-sm font-semibold text-gray-800">{cohort.memberCount} {lang === 'mn' ? 'оролцогч' : 'students'}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md">
            {cohort.status === 'Upcoming'
              ? (lang === 'mn' ? 'Бүртгүүлэх' : 'Apply now')
              : cohort.status === 'Active'
              ? (lang === 'mn' ? 'Нэгдэх' : 'Join cohort')
              : (lang === 'mn' ? 'Дууссан' : 'Cohort ended')}
          </button>
        </div>
      </div>
    </div>
  );
}
