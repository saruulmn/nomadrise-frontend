'use client';

import { usePathname, notFound } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import {
  PlayCircleOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { masterClasses } from '@/lib/data/masterClasses';

interface Props {
  params: Promise<{ id: string; lang: string }>;
}

export default function MasterClassDetailPage({ params }: Props) {
  const { id } = use(params);
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'mn';

  const mc = masterClasses.find((m) => m.id === id);
  if (!mc) return notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="relative h-56 md:h-72 overflow-hidden bg-gray-900">
        <img src={mc.thumbnail} alt={mc.title} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-linear-to-r from-indigo-900/80 to-violet-900/60" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-8 max-w-5xl mx-auto">
          <Link
            href={`/${lang}/masterclass`}
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-4 w-fit"
          >
            <ArrowLeftOutlined />
            {lang === 'mn' ? 'Буцах' : 'Back to master classes'}
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            {mc.categories.map((cat) => (
              <span key={cat} className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30">
                {cat}
              </span>
            ))}
            {mc.price === null && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/80 text-white">
                Free
              </span>
            )}
          </div>
          <h1 className="text-xl md:text-3xl font-bold text-white leading-tight">{mc.title}</h1>
          <p className="text-white/70 text-sm mt-2 flex items-center gap-2">
            <ClockCircleOutlined />
            {mc.duration}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: content & sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {lang === 'mn' ? 'Тухай' : 'About this class'}
            </h2>
            <p className="text-gray-600 leading-relaxed">{mc.about}</p>
          </section>

          {/* Sections / curriculum */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {lang === 'mn' ? 'Хөтөлбөр' : 'Course Content'}
              <span className="ml-2 text-sm font-normal text-gray-400">
                {mc.sections.length} {lang === 'mn' ? 'хэсэг' : 'sections'}
              </span>
            </h2>
            <div className="divide-y divide-gray-50">
              {mc.sections.map((section, i) => (
                <div key={i} className="py-3 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                    <PlayCircleOutlined className="text-indigo-400 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-gray-800 text-sm">{section.title}</p>
                      <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1">
                        <ClockCircleOutlined className="text-xs" />
                        {section.duration}
                      </span>
                    </div>
                    {section.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right sidebar: teacher + enroll */}
        <div className="space-y-4">
          {/* Price / enroll card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="text-center mb-5">
              {mc.price !== null ? (
                <>
                  <p className="text-3xl font-bold text-gray-900">${mc.price}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {lang === 'mn' ? 'Нэг удаагийн төлбөр' : 'One-time payment'}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-green-600">
                  {lang === 'mn' ? 'Үнэгүй' : 'Free'}
                </p>
              )}
            </div>
            <ul className="space-y-2 mb-5">
              {[
                lang === 'mn' ? 'Насан туршийн хандалт' : 'Lifetime access',
                lang === 'mn' ? `${mc.sections.length} хичээл` : `${mc.sections.length} lessons`,
                lang === 'mn' ? mc.duration + ' нийт хугацаа' : mc.duration + ' total duration',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckOutlined className="text-green-500 text-xs shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-3.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md">
              {mc.price !== null
                ? (lang === 'mn' ? 'Худалдаж авах' : 'Enroll now')
                : (lang === 'mn' ? 'Үнэгүй элсэх' : 'Enroll for free')}
            </button>
          </div>

          {/* Teacher card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
              {lang === 'mn' ? 'Багш' : 'Instructor'}
            </h3>
            <div className="flex items-center gap-4 mb-3">
              <img
                src={mc.teacher.avatar}
                alt={mc.teacher.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100 shrink-0"
              />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{mc.teacher.name}</p>
                <p className="text-xs text-indigo-600">{mc.teacher.title}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{mc.teacher.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
