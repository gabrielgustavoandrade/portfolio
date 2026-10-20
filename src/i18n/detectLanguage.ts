import type { Lang } from './messages';

export const LANG_STORAGE_KEY = 'lang';

const isLang = (value: unknown): value is Lang =>
  value === 'en' || value === 'pt';

export function readStoredLang(): Lang | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    return isLang(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function storeLang(lang: Lang) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Private mode or storage disabled: the choice lasts for this visit.
  }
}
