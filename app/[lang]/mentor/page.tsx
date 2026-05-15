'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { StarFilled, FireOutlined } from '@ant-design/icons';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';
import GridContainer from '@/app/components/GridContainer';
import ThumbnailCard from '@/app/components/ThumbnailCard';
import { Skeleton } from '@/app/components/Skeleton';
import { mentors, MENTOR_SKILLS } from '@/lib/data/mentors';

const PAGE_SIZE = 10;

export default function MentorPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'mn';
  const [query, setQuery] = useState('');
  const [activeSkill, setActiveSkill] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading] = useState(false);

  const trending = useMemo(() => mentors.filter((m) => m.trending).slice(0, 5), []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return mentors.filter((m) => {
      const matchQ = !q || `${m.name} ${m.title} ${m.expertise}`.toLowerCase().includes(q);
      const matchSkill = !activeSkill || m.skills.includes(activeSkill);
      return matchQ && matchSkill;
    });
  }, [query, activeSkill]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={(v) => { setQuery(v); setVisibleCount(PAGE_SIZE); }}
        placeholder={lang === 'mn' ? 'Ментор хайх...' : 'Search mentors...'}
        colored
        title={lang === 'mn' ? 'Ментор хөтөлбөр' : 'Mentor Program'}
        subtitle={lang === 'mn' ? 'Туршлагатай мэргэжилтнүүдтэй хамт хөгжи' : 'Grow with experienced professionals'}
        filters={
          <select
            value={activeSkill}
            onChange={(e) => { setActiveSkill(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:border-gray-400 transition-all"
          >
            <option value="">{lang === 'mn' ? 'Бүх ур чадвар' : 'All skills'}</option>
            {MENTOR_SKILLS.map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Trending row */}
        {trending.length > 0 && !query && !activeSkill && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FireOutlined className="text-orange-500" />
              {lang === 'mn' ? 'Шилдэг менторууд' : 'Top Mentors'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {trending.map((mentor) => (
                <Link
                  key={mentor.id}
                  href={`/${lang}/mentor/${mentor.id}`}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all p-4 text-center"
                >
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-violet-100"
                  />
                  <p className="font-semibold text-gray-900 text-xs mt-2 leading-tight line-clamp-2">{mentor.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{mentor.title}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <StarFilled className="text-yellow-400 text-xs" />
                    <span className="text-xs font-medium text-gray-700">{mentor.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {lang === 'mn' ? 'Бүх менторууд' : 'All Mentors'}
            <span className="ml-2 text-sm font-normal text-gray-400">{filtered.length}</span>
          </h2>
        </div>

        {loading ? (
          <GridContainer>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton variant="text" className="w-3/4 h-5" />
                  <Skeleton variant="text" className="w-1/2 h-4" />
                </div>
              </div>
            ))}
          </GridContainer>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M15 7a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-lg font-medium">
              {lang === 'mn' ? 'Ментор олдсонгүй' : 'No mentors found'}
            </p>
          </div>
        ) : (
          <>
            <GridContainer>
              {visible.map((mentor) => (
                <ThumbnailCard
                  key={mentor.id}
                  href={`/${lang}/mentor/${mentor.id}`}
                  image={mentor.avatar}
                  imageAlt={mentor.name}
                  isAvatar
                >
                  <p className="font-semibold text-gray-900 truncate">{mentor.name}</p>
                  <p className="text-sm text-gray-500 truncate">{mentor.title}</p>
                  <div className="flex flex-wrap gap-1 my-1">
                    {mentor.skills.slice(0, 3).map((s) => (
                      <span key={s} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <StarFilled className="text-yellow-400 text-xs" />
                      <span className="text-sm font-medium text-gray-700">{mentor.rating}</span>
                      <span className="text-xs text-gray-400">({mentor.reviewCount})</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">${mentor.price}/mo</span>
                  </div>
                </ThumbnailCard>
              ))}
            </GridContainer>
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  className="px-8 py-2.5 bg-white border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {lang === 'mn' ? 'Дэлгэрэнгүй үзэх' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

