'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, type KeyboardEvent, type ReactNode } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  colored?: boolean;
  title?: string;
  subtitle?: string;
  filters?: ReactNode;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  colored = false,
  title,
  subtitle,
  filters,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (onSearch) {
        onSearch(localValue);
      } else {
        onChange(localValue);
      }
    }
  };

  const handleChange = (v: string) => {
    setLocalValue(v);
    if (!onSearch) onChange(v);
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(localValue);
    } else {
      onChange(localValue);
    }
  };

  if (colored) {
    return (
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-[1360px] mx-auto">
          <div className="premium-card p-5 md:p-6">
            {title && <h1 className="text-2xl md:text-3xl font-extrabold tracking-[-0.03em] text-gray-950 dark:text-white mb-1">{title}</h1>}
            {subtitle && <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-5">{subtitle}</p>}
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {filters && <div className="md:w-64">{filters}</div>}
              <div className="premium-input flex flex-1 items-center overflow-hidden">
              <input
                type="text"
                value={localValue}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 px-4 py-3.5 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 outline-none text-sm"
              />
              <button
                onClick={handleSearchClick}
                className="mr-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 transition-colors shrink-0"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
      <div className="max-w-[1360px] mx-auto relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <MagnifyingGlassIcon className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
        />
      </div>
    </div>
  );
}
