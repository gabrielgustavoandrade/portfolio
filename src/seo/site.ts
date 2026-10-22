import { contactLinks, EMAIL } from '../data/contact';
import { SMART_DATE_INPUT_LINKS } from '../data/projects';
import { HTML_LANG, type Lang, MESSAGES } from '../i18n/messages';

export const SITE_URL = 'https://andradegabriel.com';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

/** Each language lives at its own path; `/` is English and the x-default. */
export const LANG_PATH: Record<Lang, string> = { en: '/', pt: '/pt-BR/' };

export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', pt: 'pt_BR' };

export const langFromPath = (pathname: string): Lang =>
  /^\/pt-BR(\/|$)/.test(pathname) ? 'pt' : 'en';

export const canonicalUrl = (lang: Lang) => `${SITE_URL}${LANG_PATH[lang]}`;

const linkUrl = (label: string) =>
  contactLinks.find((link) => link.label === label)?.url;

/** Profiles linked on the site: GitHub, LinkedIn and the npm package. */
export const SAME_AS = [
  linkUrl('GitHub'),
  linkUrl('LinkedIn'),
  SMART_DATE_INPUT_LINKS.npm,
].filter((url): url is string => Boolean(url));

export function buildJsonLd(lang: Lang) {
  const t = MESSAGES[lang];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Gabriel Andrade',
        jobTitle: t.hero.headline[0],
        description: t.meta.description,
        url: `${SITE_URL}/`,
        email: `mailto:${EMAIL}`,
        image: OG_IMAGE,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Madrid',
          addressCountry: 'ES',
        },
        // The site lists InteractiveAI as the current contract.
        worksFor: { '@type': 'Organization', name: 'InteractiveAI' },
        knowsAbout: ['React', 'TypeScript', 'Next.js', 'Python'],
        sameAs: SAME_AS,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'Gabriel Andrade',
        inLanguage: HTML_LANG[lang],
        author: { '@id': `${SITE_URL}/#person` },
      },
    ],
  };
}

const escapeAttr = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Per-language <head> tags written into the prerendered HTML. */
export function buildHead(lang: Lang) {
  const t = MESSAGES[lang];
  const other: Lang = lang === 'en' ? 'pt' : 'en';
  const url = canonicalUrl(lang);
  const title = escapeAttr(t.meta.title);
  const description = escapeAttr(t.meta.description);
  const imageAlt = escapeAttr(`Gabriel Andrade, ${t.hero.headline[0]}`);
  // `<` is escaped so the JSON can never close the script tag.
  const jsonLd = JSON.stringify(buildJsonLd(lang)).replace(/</g, '\\u003c');

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="en" href="${canonicalUrl('en')}" />`,
    `<link rel="alternate" hreflang="pt-BR" href="${canonicalUrl('pt')}" />`,
    `<link rel="alternate" hreflang="x-default" href="${canonicalUrl('en')}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Gabriel Andrade" />',
    `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`,
    `<meta property="og:locale:alternate" content="${OG_LOCALE[other]}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    '<meta property="og:image:type" content="image/png" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:image:alt" content="${imageAlt}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ');
}
