'use client';

import { SearchOutlined } from '@ant-design/icons';
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
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          {title && <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{title}</h1>}
          {subtitle && <p className="text-blue-100 text-sm mb-5">{subtitle}</p>}
          <div className="flex gap-2 items-stretch">
            {filters && (
              <div className="hidden md:flex items-center gap-2 shrink-0">{filters}</div>
            )}
            <div className="flex flex-1 items-center bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <span className="pl-4 text-white/70 shrink-0">
                <SearchOutlined />
              </span>
              <input
                type="text"
                value={localValue}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 px-3 py-3 bg-transparent text-white placeholder-white/60 outline-none text-sm"
              />
              <button
                onClick={handleSearchClick}
                className="px-5 py-3 bg-white text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors shrink-0 flex items-center gap-1.5"
              >
                <SearchOutlined />
                {placeholder.includes('Search') || placeholder.includes('хайх') ? (
                  <span className="hidden sm:inline">
                    {placeholder.toLowerCase().includes('хайх') ? 'Хайх' : 'Search'}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
          {filters && (
            <div className="flex md:hidden items-center gap-2 flex-wrap mt-3">{filters}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <SearchOutlined />
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
