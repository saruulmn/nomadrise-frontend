'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { PlayCircleIcon, FireIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';
import CorpDropdown from '@/app/components/CorpDropdown';
import GridContainer from '@/app/components/GridContainer';
import ThumbnailCard from '@/app/components/ThumbnailCard';
import { Skeleton } from '@/app/components/Skeleton';
import { masterClasses, MASTERCLASS_CATEGORIES } from '@/lib/data/masterClasses';

const PAGE_SIZE = 12;

export default function MasterClassPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'mn';
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading] = useState(false);

  const trending = useMemo(() => masterClasses.filter((m) => m.trending).slice(0, 5), []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return masterClasses.filter((mc) => {
      const matchQ = !q || `${mc.title} ${mc.instructor}`.toLowerCase().includes(q);
      const matchCat = !activeCategory || mc.categories.includes(activeCategory);
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
        placeholder={lang === 'mn' ? 'Мастер класс хайх...' : 'Search master classes...'}
        colored
        title={lang === 'mn' ? 'Мастер Класс' : 'Master Classes'}
        subtitle={lang === 'mn' ? 'Мэргэжилтнүүдээс суралц' : 'Learn from the best in the field'}
        filters={
          <CorpDropdown
            value={activeCategory}
            onChange={(v) => { setActiveCategory(v); setVisibleCount(PAGE_SIZE); }}
            options={[
              { value: '', label: lang === 'mn' ? 'Бүх ангилал' : 'All categories' },
              ...MASTERCLASS_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
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
              {lang === 'mn' ? 'Трендийн мастер класс' : 'Trending Master Classes'}
            </h2>
            <div className="lms-trending-grid">
              {trending.map((mc) => (
                <Link
                  key={mc.id}
                  href={`/${lang}/masterclass/${mc.id}`}
                  className="lms-mini-card"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img src={mc.thumbnail} alt={mc.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <PlayCircleIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-gray-900 text-xs leading-snug line-clamp-2">{mc.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">{mc.duration}</span>
                      {mc.price !== null ? (
                        <span className="text-xs font-semibold text-indigo-600">${mc.price}</span>
                      ) : (
                        <span className="text-xs font-medium text-green-600">Free</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="lms-section-head">
          <h2 className="lms-section-title">
            {lang === 'mn' ? 'Бүх мастер класс' : 'All Master Classes'}
            <span className="lms-count-pill ml-2">{filtered.length}</span>
          </h2>
        </div>

        {loading ? (
          <GridContainer>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="premium-card overflow-hidden">
                <Skeleton className="h-44 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton variant="text" className="w-full h-5" />
                  <Skeleton variant="text" className="w-2/3 h-4" />
                </div>
              </div>
            ))}
          </GridContainer>
        ) : filtered.length === 0 ? (
          <div className="lms-empty-state">
            <PlayCircleIcon className="w-16 h-16 opacity-30" />
            <p className="text-lg font-medium mt-4">
              {lang === 'mn' ? 'Мастер класс олдсонгүй' : 'No master classes found'}
            </p>
          </div>
        ) : (
          <>
            <GridContainer>
              {visible.map((mc) => (
                <ThumbnailCard
                  key={mc.id}
                  href={`/${lang}/masterclass/${mc.id}`}
                  image={mc.thumbnail}
                  imageAlt={mc.title}
                >
                  <div className="flex flex-wrap gap-1 mb-1">
                    {mc.categories.map((cat) => (
                      <span key={cat} className="premium-chip">{cat}</span>
                    ))}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">{mc.title}</p>
                  <p className="text-xs text-gray-500">{mc.instructor}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-400">{mc.duration}</span>
                    {mc.price !== null ? (
                      <span className="text-sm font-semibold text-gray-800">${mc.price}</span>
                    ) : (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Free</span>
                    )}
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
