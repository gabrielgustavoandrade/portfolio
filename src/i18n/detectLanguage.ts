import type { Lang } from './messages';

export const LANG_STORAGE_KEY = 'lang';

const isLang = (value: unknown): value is Lang =>
  value === 'en' || value === 'pt';

export function readStoredLang(): Lang | null {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    return isLang(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function storeLang(lang: Lang) {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Private mode or storage disabled: the choice lasts for this visit.
  }
}

/** Saved choice, else the browser language (pt* → PT), else English. */
export function detectLanguage(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = readStoredLang();
  if (stored) return stored;
  const preferred = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];
  return preferred.some((tag) => tag?.toLowerCase().startsWith('pt'))
    ? 'pt'
    : 'en';
}
