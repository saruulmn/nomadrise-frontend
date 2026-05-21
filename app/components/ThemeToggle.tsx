'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  try {
    const { theme, toggleTheme } = useTheme();

    return (
      <button
        onClick={toggleTheme}
        style={{
          padding: '0.5rem',
          background: 'transparent',
          border: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.3)'}`,
          borderRadius: '0.375rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme === 'light' ? '#374151' : 'white',
          fontSize: '1.2rem',
          transition: 'all 0.3s ease',
        }}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
      </button>
    );
  } catch (error) {
    // If ThemeProvider is not available, don't render the toggle
    return null;
  }
}
