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
      className="group premium-card premium-card-hover block overflow-hidden"
    >
      <div
        className={`relative bg-gray-100 dark:bg-slate-800 overflow-hidden ${isAvatar ? 'flex items-center justify-center p-6' : ''}`}
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
        {!isAvatar && <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/28 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />}
      </div>
      <div className="p-4 space-y-2">{children}</div>
    </Link>
  );
}
