'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { TeamOutlined } from '@ant-design/icons';
import SearchBar from '@/app/components/SearchBar';
import GridContainer from '@/app/components/GridContainer';
import ThumbnailCard from '@/app/components/ThumbnailCard';
import { Skeleton } from '@/app/components/Skeleton';
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

export default function CohortPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'mn';
  const [query, setQuery] = useState('');
  const [loading] = useState(false);

  const filtered = useMemo(
    () =>
      cohorts.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={lang === 'mn' ? 'Элсэлт хайх...' : 'Search cohorts...'}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {lang === 'mn' ? 'Элсэлт' : 'Cohorts'}
          <span className="ml-2 text-sm font-normal text-gray-400">{filtered.length} cohorts</span>
        </h1>

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
          <GridContainer>
            {filtered.map((cohort) => (
              <ThumbnailCard
                key={cohort.id}
                href={`/${lang}/cohort/${cohort.id}`}
                image={cohort.thumbnail}
                imageAlt={cohort.name}
              >
                <p className="font-semibold text-gray-900 text-sm leading-snug">{cohort.name}</p>
                <p className="text-xs text-gray-500">
                  {lang === 'mn' ? 'Эхлэх огноо: ' : 'Starts: '}
                  {new Date(cohort.startDate).toLocaleDateString(
                    lang === 'mn' ? 'mn-MN' : 'en-US',
                    { year: 'numeric', month: 'short', day: 'numeric' }
                  )}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[cohort.status]}`}
                  >
                    {lang === 'mn' ? STATUS_MN[cohort.status] : cohort.status}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <TeamOutlined />
                    {cohort.studentCount}
                  </span>
                </div>
              </ThumbnailCard>
            ))}
          </GridContainer>
        )}
      </div>
    </div>
  );
}
