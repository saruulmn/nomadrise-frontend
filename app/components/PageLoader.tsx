import React from 'react';
import { NavBarSkeleton, HeroSkeleton } from './Skeleton';

export function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBarSkeleton />
      <HeroSkeleton />
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4">
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded" />
          <div className="animate-pulse bg-gray-200 h-4 w-full rounded" />
          <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded" />
        </div>
      </div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}
