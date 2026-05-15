'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { PlayCircleOutlined } from '@ant-design/icons';
import SearchBar from '@/app/components/SearchBar';
import GridContainer from '@/app/components/GridContainer';
import ThumbnailCard from '@/app/components/ThumbnailCard';
import { Skeleton } from '@/app/components/Skeleton';
import { masterClasses } from '@/lib/data/masterClasses';

export default function MasterClassPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'mn';
  const [query, setQuery] = useState('');
  const [loading] = useState(false);

  const filtered = useMemo(
    () =>
      masterClasses.filter((mc) =>
        `${mc.title} ${mc.instructor}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={lang === 'mn' ? 'Мастер класс хайх...' : 'Search master classes...'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {lang === 'mn' ? 'Мастер Класс' : 'Master Classes'}
          <span className="ml-2 text-sm font-normal text-gray-400">{filtered.length} classes</span>
        </h1>

        {loading ? (
          <GridContainer>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <Skeleton className="h-44 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton variant="text" className="w-full h-5" />
                  <Skeleton variant="text" className="w-2/3 h-4" />
                </div>
              </div>
            ))}
          </GridContainer>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <PlayCircleOutlined style={{ fontSize: 64, opacity: 0.3 }} />
            <p className="text-lg font-medium mt-4">
              {lang === 'mn' ? 'Мастер класс олдсонгүй' : 'No master classes found'}
            </p>
          </div>
        ) : (
          <GridContainer>
            {filtered.map((mc) => (
              <ThumbnailCard
                key={mc.id}
                href={`/${lang}/masterclass/${mc.id}`}
                image={mc.thumbnail}
                imageAlt={mc.title}
              >
                <p className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">
                  {mc.title}
                </p>
                <p className="text-xs text-gray-500">{mc.instructor}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-gray-400">{mc.duration}</span>
                  {mc.price !== null ? (
                    <span className="text-sm font-semibold text-blue-600">${mc.price}</span>
                  ) : (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Free
                    </span>
                  )}
                </div>
              </ThumbnailCard>
            ))}
          </GridContainer>
        )}
      </div>
    </div>
  );
}
