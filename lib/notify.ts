import { message } from 'antd';
import type { Locale } from '@/i18n/config';
import { getCurrentLocale } from '@/lib/api/errors';

type NoticeType = 'success' | 'warning' | 'error' | 'info';
type NoticeCopy = string | { en: string; mn: string };

function pick(copy: NoticeCopy, lang: Locale) {
  return typeof copy === 'string' ? copy : copy[lang] || copy.en;
}

export function notify(type: NoticeType, copy: NoticeCopy, lang: Locale = getCurrentLocale()) {
  message[type](pick(copy, lang));
}

export const commonNotices = {
  retry: {
    en: 'Retry',
    mn: 'Дахин оролдох',
  },
  refreshPage: {
    en: 'Refresh page',
    mn: 'Хуудсыг шинэчлэх',
  },
  sessionExpired: {
    en: 'Your session expired. Please sign in again.',
    mn: 'Таны session дууссан байна. Дахин нэвтэрнэ үү.',
  },
};
