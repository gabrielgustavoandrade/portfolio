import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { canonicalUrl, LANG_PATH, langFromPath, OG_LOCALE } from '../seo/site';
import { readStoredLang, storeLang } from './detectLanguage';
import { HTML_LANG, type Lang, MESSAGES, type Messages } from './messages';

interface I18nValue {
  lang: Lang;
  t: Messages;
  setLang: (lang: Lang) => void;
}

// Outside a provider (isolated component tests) everything renders in English.
const I18nContext = createContext<I18nValue>({
  lang: 'en',
  t: MESSAGES.en,
  setLang: () => {},
});

const setMeta = (selector: string, attribute: string, value: string) =>
  document.querySelector(selector)?.setAttribute(attribute, value);

/** The language comes from the URL: `/pt-BR/` is pt-BR, everything else EN. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const lang = langFromPath(pathname);

  const setLang = useCallback(
    (next: Lang) => {
      storeLang(next);
      navigate({ pathname: LANG_PATH[next], hash });
    },
    [navigate, hash],
  );

  // A saved pt-BR choice sends `/` to `/pt-BR/`; explicit URLs are kept.
  // biome-ignore lint/correctness/useExhaustiveDependencies: first load only
  useEffect(() => {
    if (pathname === '/' && readStoredLang() === 'pt') {
      navigate({ pathname: LANG_PATH.pt, hash }, { replace: true });
    }
  }, []);

  const t = MESSAGES[lang];

  // The prerendered head already matches; this keeps it right after a toggle.
  useEffect(() => {
    const url = canonicalUrl(lang);
    document.documentElement.lang = HTML_LANG[lang];
    document.title = t.meta.title;
    setMeta('meta[name="description"]', 'content', t.meta.description);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:locale"]', 'content', OG_LOCALE[lang]);
  }, [lang, t]);

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
