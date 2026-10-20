import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { detectLanguage, storeLang } from './detectLanguage';
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

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLanguage);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    storeLang(next);
  }, []);

  const t = MESSAGES[lang];

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
    document.title = t.meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t.meta.description);
  }, [lang, t]);

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
