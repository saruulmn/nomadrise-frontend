'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { UsersIcon, FireIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';
import CorpDropdown from '@/app/components/CorpDropdown';
import GridContainer from '@/app/components/GridContainer';
import ThumbnailCard from '@/app/components/ThumbnailCard';
import { Skeleton } from '@/app/components/Skeleton';
import { cohorts, COHORT_CATEGORIES, type CohortStatus } from '@/lib/data/cohorts';

const PAGE_SIZE = 12;

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
    <div className="lms-list-page">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={(v) => { setQuery(v); setVisibleCount(PAGE_SIZE); }}
        placeholder={lang === 'mn' ? 'Элсэлт хайх...' : 'Search cohorts...'}
        colored
        title={lang === 'mn' ? 'Элсэлт' : 'Cohorts'}
        subtitle={lang === 'mn' ? 'Хамт суралцаж, хамтдаа хөгжицгөөе' : 'Learn together, grow together'}
        filters={
          <CorpDropdown
            value={activeCategory}
            onChange={(v) => { setActiveCategory(v); setVisibleCount(PAGE_SIZE); }}
            options={[
              { value: '', label: lang === 'mn' ? 'Бүх ангилал' : 'All categories' },
              ...COHORT_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
            ]}
          />
        }
      />

      <div className="lms-page-container">
        {/* Trending row */}
        {trending.length > 0 && !query && !activeCategory && (
          <div className="mb-10">
            <h2 className="lms-section-title mb-4 flex items-center gap-2">
              <FireIcon className="w-5 h-5 text-orange-500" />
              {lang === 'mn' ? 'Трендийн элсэлт' : 'Trending Cohorts'}
            </h2>
            <div className="lms-trending-grid">
              {trending.map((cohort) => (
                <Link
                  key={cohort.id}
                  href={`/${lang}/cohort/${cohort.id}`}
                  className="lms-mini-card"
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
                      <UsersIcon className="w-3 h-3" />{cohort.memberCount}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="lms-section-head">
          <h2 className="lms-section-title">
            {lang === 'mn' ? 'Бүх элсэлт' : 'All Cohorts'}
            <span className="lms-count-pill ml-2">{filtered.length}</span>
          </h2>
        </div>

        {loading ? (
          <GridContainer>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="premium-card overflow-hidden">
                <Skeleton className="h-44 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton variant="text" className="w-3/4 h-5" />
                  <Skeleton variant="text" className="w-1/2 h-4" />
                </div>
              </div>
            ))}
          </GridContainer>
        ) : filtered.length === 0 ? (
          <div className="lms-empty-state">
            <UsersIcon className="w-16 h-16 opacity-30" />
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
                      <span key={cat} className="premium-chip">{cat}</span>
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
                      <UsersIcon className="w-3 h-3" />{cohort.memberCount}
                    </span>
                  </div>
                </ThumbnailCard>
              ))}
            </GridContainer>
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  className="premium-button premium-button-secondary"
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
