import type { Locale } from '@/i18n/config';

export type LocalizedMessage = {
  en?: string;
  mn?: string;
  selected?: string;
};

export type NormalizedApiError = {
  message: string;
  code: string;
  details: Record<string, unknown>;
  status?: number;
};

const FALLBACK = {
  en: 'Something went wrong. Please try again.',
  mn: 'Алдаа гарлаа. Дахин оролдоно уу.',
};

const NETWORK = {
  en: 'You appear to be offline. Please check your internet connection.',
  mn: 'Интернэт холболтоо шалгана уу.',
};

const TIMEOUT = {
  en: 'The request took too long. Please try again.',
  mn: 'Хүсэлт хэт удаан үргэлжиллээ. Дахин оролдоно уу.',
};

const STATUS_MESSAGES: Record<number, Record<Locale, string>> = {
  401: {
    en: 'Your session expired. Please sign in again.',
    mn: 'Таны session дууссан байна. Дахин нэвтэрнэ үү.',
  },
  403: {
    en: 'You do not have access to this content.',
    mn: 'Та энэ контентод хандах эрхгүй байна.',
  },
  404: {
    en: 'The requested resource was not found.',
    mn: 'Хүссэн мэдээлэл олдсонгүй.',
  },
};

export function getCurrentLocale(): Locale {
  if (typeof window !== 'undefined') {
    const segment = window.location.pathname.split('/').filter(Boolean)[0];
    return segment === 'mn' ? 'mn' : 'en';
  }
  return 'en';
}

function pickMessage(message: unknown, lang: Locale): string | null {
  if (!message) return null;
  if (typeof message === 'string') return message;
  if (typeof message === 'object') {
    const localized = message as LocalizedMessage;
    return localized[lang] || localized.selected || localized.en || localized.mn || null;
  }
  return null;
}

function firstDetail(details: unknown): string | null {
  if (!details || typeof details !== 'object') return null;
  for (const value of Object.values(details as Record<string, unknown>)) {
    if (Array.isArray(value) && value.length > 0) return String(value[0]);
    if (typeof value === 'string') return value;
  }
  return null;
}

export function normalizeApiError(error: unknown, lang: Locale = getCurrentLocale()): NormalizedApiError {
  if (error && typeof error === 'object' && 'status' in error) {
    const apiError = error as { status?: number; data?: unknown };
    const data = apiError.data;
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      const details = (record.details && typeof record.details === 'object'
        ? record.details
        : {}) as Record<string, unknown>;
      const message =
        pickMessage(record.message, lang) ||
        firstDetail(details) ||
        firstDetail(record) ||
        pickMessage(record.detail, lang) ||
        pickMessage(record.error, lang) ||
        (apiError.status ? STATUS_MESSAGES[apiError.status]?.[lang] : null) ||
        FALLBACK[lang];
      return {
        message,
        code: String(record.code || (apiError.status === 401 ? 'AUTH_REQUIRED' : 'API_ERROR')),
        details,
        status: apiError.status,
      };
    }
    return {
      message: (apiError.status ? STATUS_MESSAGES[apiError.status]?.[lang] : null) || FALLBACK[lang],
      code: apiError.status === 401 ? 'AUTH_REQUIRED' : 'API_ERROR',
      details: {},
      status: apiError.status,
    };
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return { message: TIMEOUT[lang], code: 'TIMEOUT', details: {} };
  }
  if (error instanceof TypeError) {
    return { message: NETWORK[lang], code: 'NETWORK_ERROR', details: {} };
  }
  if (error instanceof Error) {
    return { message: error.message || FALLBACK[lang], code: 'CLIENT_ERROR', details: {} };
  }
  return { message: FALLBACK[lang], code: 'UNKNOWN_ERROR', details: {} };
}

export function getApiErrorMessage(error: unknown, lang: Locale = getCurrentLocale()) {
  return normalizeApiError(error, lang).message;
}
