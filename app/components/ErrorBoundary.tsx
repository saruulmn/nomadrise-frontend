'use client';

import React from 'react';
import { getCurrentLocale } from '@/lib/api/errors';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

const COPY = {
  en: {
    title: 'Something went wrong.',
    body: 'Please refresh the page and try again.',
    reload: 'Refresh page',
  },
  mn: {
    title: 'Алдаа гарлаа.',
    body: 'Хуудсыг шинэчлээд дахин оролдоно уу.',
    reload: 'Хуудсыг шинэчлэх',
  },
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const lang = getCurrentLocale();
    const copy = COPY[lang];
    return (
      <div className="mx-auto my-12 max-w-md rounded-xl border border-red-100 bg-red-50 p-6 text-center">
        <h2 className="text-base font-semibold text-red-900">{copy.title}</h2>
        <p className="mt-2 text-sm text-red-700">{copy.body}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {copy.reload}
        </button>
      </div>
    );
  }
}
