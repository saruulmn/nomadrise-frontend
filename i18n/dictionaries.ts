import type { Locale } from './config';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  mn: () => import('./dictionaries/mn.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const dict = dictionaries[locale];
  if (!dict) {
    return dictionaries.mn();
  }
  return dict();
};
