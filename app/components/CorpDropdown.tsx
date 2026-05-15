'use client';

import { useState, useRef, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';

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
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:border-gray-500 transition-colors"
      >
        <span className="truncate">{selected?.label}</span>
        <DownOutlined
          className="shrink-0 text-gray-400 text-[10px]"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full w-full bg-white border border-gray-300 border-t-0 z-50">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`px-3 py-2.5 my-0.5 mx-1 text-sm cursor-pointer transition-colors ${
                opt.value === value
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
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
