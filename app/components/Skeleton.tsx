import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const style: React.CSSProperties = {
    backgroundColor: 'var(--border-color, rgba(0,0,0,0.1))'
  };
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function ScholarshipDetailSkeleton() {
  return (
    <div style={{ minHeight: "100vh", padding: "4rem 2rem", background: "var(--surface)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Back button */}
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Main card */}
        <div style={{ background: "var(--card-bg)", borderRadius: "12px", boxShadow: "0 4px 6px var(--shadow-color)", padding: "2rem" }}>
          {/* Title */}
          <Skeleton className="h-10 w-3/4 mb-6" />
          
          {/* Organization */}
          <Skeleton className="h-6 w-1/2 mb-8" />
          
          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
          
          {/* Description section */}
          <div style={{ marginTop: "2rem" }}>
            <Skeleton className="h-7 w-40 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          
          {/* Dates section */}
          <div style={{ marginTop: "2rem" }}>
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="flex gap-8">
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>
            </div>
          </div>
          
          {/* Apply button */}
          <div style={{ marginTop: "2rem" }}>
            <Skeleton className="h-12 w-full max-w-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <Skeleton className="h-9 w-48 mb-6" />
          
          <div className="border-t border-gray-200 pt-6">
            <Skeleton className="h-7 w-40 mb-4" />
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <Skeleton variant="circular" width={80} height={80} />
                <div className="flex-1">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-5 w-64" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScholarshipCardSkeleton() {
  return (
    <div className="rounded-lg shadow-md p-6" style={{ background: 'var(--card-bg)' }}>
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6 mb-4" />
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  );
}

export function ScholarshipListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <ScholarshipCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="h-12 w-3/4 mx-auto mb-6 animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px' }} />
          <div className="h-6 w-2/3 mx-auto mb-8 animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px' }} />
          <div className="h-12 w-40 mx-auto animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );
}

export function NavBarSkeleton() {
  return (
    <nav className="shadow-md" style={{ background: 'var(--card-bg)' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    </nav>
  );
}
