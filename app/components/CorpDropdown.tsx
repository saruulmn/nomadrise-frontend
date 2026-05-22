'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Option {
  value: string;
  label: string;
}

interface CorpDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export default function CorpDropdown({ value, onChange, options }: CorpDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="premium-input w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-200 focus:outline-none"
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDownIcon
          className="w-3 h-3 shrink-0 text-gray-400"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg z-50 dark:border-white/10 dark:bg-slate-900">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                opt.value === value
                  ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-500/10 dark:text-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-white/5'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
