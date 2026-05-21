'use client';

import { usePathname, notFound } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon, GlobeAltIcon, CalendarDaysIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { mentors } from '@/lib/data/mentors';

interface Props {
  params: Promise<{ id: string; lang: string }>;
}

export default function MentorDetailPage({ params }: Props) {
  const { id } = use(params);
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'mn';

  const mentor = mentors.find((m) => m.id === id);
  if (!mentor) return notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 pt-12 pb-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href={`/${lang}/mentor`}
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            {lang === 'mn' ? 'Буцах' : 'Back to mentors'}
          </Link>
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-28 h-28 rounded-2xl object-cover border-4 border-white/30 shadow-xl shrink-0"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{mentor.name}</h1>
              <p className="text-violet-200 text-sm mt-1">{mentor.title}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">{mentor.rating}</span>
                <span className="text-violet-200 text-sm">({mentor.reviewCount} {lang === 'mn' ? 'үнэлгээ' : 'reviews'})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {lang === 'mn' ? 'Танилцуулга' : 'Introduction'}
            </h2>
            <p className="text-gray-600 leading-relaxed">{mentor.bio}</p>
          </section>

          {/* Skills */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {lang === 'mn' ? 'Ур чадвар' : 'Skills'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {mentor.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-violet-50 text-violet-700 text-sm font-medium rounded-lg border border-violet-100 flex items-center gap-1.5"
                >
                  <CheckCircleIcon className="w-3 h-3 text-violet-400" />
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Intro video */}
          {mentor.introVideoUrl && (
            <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {lang === 'mn' ? 'Танилцуулга видео' : 'Introduction Video'}
              </h2>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                <iframe
                  src={mentor.introVideoUrl}
                  title="Introduction video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Pricing & sessions card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="text-center mb-5">
              <p className="text-3xl font-bold text-gray-900">${mentor.price}</p>
              <p className="text-sm text-gray-400">{lang === 'mn' ? '/ сар' : '/ month'}</p>
            </div>
            <div className="bg-violet-50 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-3">
                <CalendarDaysIcon className="w-5 h-5 text-violet-500 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {mentor.meetingsPerMonth} {lang === 'mn' ? 'уулзалт / сар' : 'meetings / month'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {lang === 'mn'
                      ? `Сар бүр ${mentor.meetingsPerMonth} удаагийн менторшип уулзалт`
                      : `${mentor.meetingsPerMonth} mentorship sessions per month`}
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full py-3.5 bg-linear-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md">
              {lang === 'mn' ? 'Ментор сонгох' : 'Book a session'}
            </button>
          </div>

          {/* Links card */}
          {(mentor.linkedinUrl || mentor.websiteUrl) && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
              {mentor.linkedinUrl && (
                <a
                  href={mentor.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-700 transition-colors group"
                >
                  <span className="w-9 h-9 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </span>
                  <span className="truncate">LinkedIn</span>
                </a>
              )}
              {mentor.websiteUrl && (
                <a
                  href={mentor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-indigo-700 transition-colors group"
                >
                  <span className="w-9 h-9 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center shrink-0 transition-colors">
                    <GlobeAltIcon className="w-4 h-4 text-indigo-600" />
                  </span>
                  <span className="truncate">{mentor.websiteUrl.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
