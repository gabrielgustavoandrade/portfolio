import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppShell } from './App';
import { HTML_LANG, type Lang } from './i18n/messages';
import { buildHead, LANG_PATH } from './seo/site';

export const PRERENDER_LANGS: readonly Lang[] = ['en', 'pt'];

/** Static HTML, head tags and `<html lang>` for one language's homepage. */
export function render(lang: Lang) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={LANG_PATH[lang]}>
        <AppShell />
      </StaticRouter>
    </StrictMode>,
  );
  return {
    html,
    head: buildHead(lang),
    htmlLang: HTML_LANG[lang],
    path: LANG_PATH[lang],
  };
}
