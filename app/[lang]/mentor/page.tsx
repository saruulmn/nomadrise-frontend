'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { StarFilled } from '@ant-design/icons';
import SearchBar from '@/app/components/SearchBar';
import GridContainer from '@/app/components/GridContainer';
import ThumbnailCard from '@/app/components/ThumbnailCard';
import { Skeleton } from '@/app/components/Skeleton';
import { mentors } from '@/lib/data/mentors';

export default function MentorPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'mn';
  const [query, setQuery] = useState('');
  const [loading] = useState(false);

  const filtered = useMemo(
    () =>
      mentors.filter((m) =>
        `${m.name} ${m.title} ${m.expertise}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={lang === 'mn' ? 'Ментор хайх...' : 'Search mentors...'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {lang === 'mn' ? 'Ментор хөтөлбөр' : 'Mentor Program'}
          <span className="ml-2 text-sm font-normal text-gray-400">{filtered.length} mentors</span>
        </h1>

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
            <svg
              className="w-16 h-16 mb-4 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M15 7a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-lg font-medium">
              {lang === 'mn' ? 'Ментор олдсонгүй' : 'No mentors found'}
            </p>
          </div>
        ) : (
          <GridContainer>
            {filtered.map((mentor) => (
              <ThumbnailCard
                key={mentor.id}
                href={`/${lang}/mentor/${mentor.id}`}
                image={mentor.avatar}
                imageAlt={mentor.name}
                isAvatar
              >
                <p className="font-semibold text-gray-900 truncate">{mentor.name}</p>
                <p className="text-sm text-blue-600 truncate">{mentor.title}</p>
                <p className="text-xs text-gray-500 truncate">{mentor.expertise}</p>
                <div className="flex items-center gap-1 pt-1">
                  <StarFilled className="text-yellow-400 text-xs" />
                  <span className="text-sm font-medium text-gray-700">{mentor.rating}</span>
                  <span className="text-xs text-gray-400">({mentor.reviewCount})</span>
                </div>
              </ThumbnailCard>
            ))}
          </GridContainer>
        )}
      </div>
    </div>
  );
}
