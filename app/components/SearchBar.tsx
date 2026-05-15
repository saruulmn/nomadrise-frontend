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
      <div className="bg-white border-b border-gray-100 px-4 pt-8 pb-5">
        <div className="max-w-6xl mx-auto">
          {title && <h1 className="text-2xl font-bold text-gray-900 mb-0.5">{title}</h1>}
          {subtitle && <p className="text-gray-400 text-sm mb-4">{subtitle}</p>}
          <div className="flex gap-2 items-center">
            {filters && <div className="shrink-0">{filters}</div>}
            <div className="flex flex-1 items-center border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-gray-400 transition-all">
              <span className="pl-3.5 text-gray-400 shrink-0 pointer-events-none">
                <SearchOutlined />
              </span>
              <input
                type="text"
                value={localValue}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 px-3 py-2.5 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm"
              />
              <button
                onClick={handleSearchClick}
                className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors shrink-0 border-l border-gray-200"
              >
                {placeholder.toLowerCase().includes('хайх') ? 'Хайх' : 'Search'}
              </button>
            </div>
          </div>
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
