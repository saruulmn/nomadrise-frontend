'use client';

import Link from 'next/link';

interface ThumbnailCardProps {
  href: string;
  image: string;
  imageAlt?: string;
  isAvatar?: boolean;
  children: React.ReactNode;
}

export default function ThumbnailCard({
  href,
  image,
  imageAlt = '',
  isAvatar = false,
  children,
}: ThumbnailCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <div
        className={`relative bg-gray-100 overflow-hidden ${isAvatar ? 'flex items-center justify-center p-6' : ''}`}
        style={{ height: isAvatar ? 160 : 180 }}
      >
        <img
          src={image}
          alt={imageAlt}
          className={
            isAvatar
              ? 'w-24 h-24 rounded-full object-cover ring-4 ring-white shadow'
              : 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
          }
        />
      </div>
      <div className="p-4 space-y-1">{children}</div>
    </Link>
  );
}
