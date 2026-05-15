'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { TeamOutlined, FireOutlined } from '@ant-design/icons';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';
import GridContainer from '@/app/components/GridContainer';
import ThumbnailCard from '@/app/components/ThumbnailCard';
import { Skeleton } from '@/app/components/Skeleton';
import { cohorts, COHORT_CATEGORIES, type CohortStatus } from '@/lib/data/cohorts';

const PAGE_SIZE = 10;

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

export default function CohortPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'mn';
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading] = useState(false);

  const trending = useMemo(() => cohorts.filter((c) => c.trending).slice(0, 5), []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return cohorts.filter((c) => {
      const matchQ = !q || c.name.toLowerCase().includes(q);
      const matchCat = !activeCategory || c.categories.includes(activeCategory);
      return matchQ && matchCat;
    });
  }, [query, activeCategory]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={(v) => { setQuery(v); setVisibleCount(PAGE_SIZE); }}
        placeholder={lang === 'mn' ? 'Элсэлт хайх...' : 'Search cohorts...'}
        colored
        title={lang === 'mn' ? 'Элсэлт' : 'Cohorts'}
        subtitle={lang === 'mn' ? 'Хамт суралцаж, хамтдаа өс' : 'Learn together, grow together'}
        filters={
          <select
            value={activeCategory}
            onChange={(e) => { setActiveCategory(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:border-gray-400 transition-all"
          >
            <option value="">{lang === 'mn' ? 'Бүх ангилал' : 'All categories'}</option>
            {COHORT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        }
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Trending row */}
        {trending.length > 0 && !query && !activeCategory && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FireOutlined className="text-orange-500" />
              {lang === 'mn' ? 'Трендийн элсэлт' : 'Trending Cohorts'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {trending.map((cohort) => (
                <Link
                  key={cohort.id}
                  href={`/${lang}/cohort/${cohort.id}`}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img src={cohort.thumbnail} alt={cohort.name} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[cohort.status]}`}>
                      {lang === 'mn' ? STATUS_MN[cohort.status] : cohort.status}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-gray-900 text-xs leading-snug line-clamp-2">{cohort.name}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <TeamOutlined />{cohort.memberCount}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {lang === 'mn' ? 'Бүх элсэлт' : 'All Cohorts'}
            <span className="ml-2 text-sm font-normal text-gray-400">{filtered.length}</span>
          </h2>
        </div>

        {loading ? (
          <GridContainer>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <Skeleton className="h-44 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton variant="text" className="w-3/4 h-5" />
                  <Skeleton variant="text" className="w-1/2 h-4" />
                </div>
              </div>
            ))}
          </GridContainer>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <TeamOutlined style={{ fontSize: 64, opacity: 0.3 }} />
            <p className="text-lg font-medium mt-4">
              {lang === 'mn' ? 'Элсэлт олдсонгүй' : 'No cohorts found'}
            </p>
          </div>
        ) : (
          <>
            <GridContainer>
              {visible.map((cohort) => (
                <ThumbnailCard
                  key={cohort.id}
                  href={`/${lang}/cohort/${cohort.id}`}
                  image={cohort.thumbnail}
                  imageAlt={cohort.name}
                >
                  <div className="flex flex-wrap gap-1 mb-1">
                    {cohort.categories.map((cat) => (
                      <span key={cat} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{cat}</span>
                    ))}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm leading-snug">{cohort.name}</p>
                  <p className="text-xs text-gray-500">
                    {lang === 'mn' ? 'Эхлэх: ' : 'Starts: '}
                    {new Date(cohort.startDate).toLocaleDateString(
                      lang === 'mn' ? 'mn-MN' : 'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[cohort.status]}`}>
                      {lang === 'mn' ? STATUS_MN[cohort.status] : cohort.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <TeamOutlined />{cohort.memberCount}
                    </span>
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

