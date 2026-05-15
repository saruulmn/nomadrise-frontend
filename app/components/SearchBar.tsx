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
          <div className="flex gap-[10%] items-center">
            {filters && <div className="w-[20%] [&>select]:w-full">{filters}</div>}
            <div className="flex w-[70%] items-center border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:border-gray-400 transition-all">
              <input
                type="text"
                value={localValue}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 px-3 py-2.5 bg-transparent text-gray-800 placeholder-[#7d838c] outline-none text-sm"
              />
              <button
                onClick={handleSearchClick}
                className="px-3 py-2.5 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                <SearchOutlined />
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
