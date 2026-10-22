import { buildHead, buildJsonLd, langFromPath, SAME_AS } from './site';

const parseJsonLd = (head: string) => {
  const match = head.match(
    /<script type="application\/ld\+json">(.*?)<\/script>/s,
  );
  return JSON.parse(match?.[1] ?? '');
};

describe('seo/site', () => {
  it('derives the language from the URL path', () => {
    expect(langFromPath('/')).toBe('en');
    expect(langFromPath('/pt-BR')).toBe('pt');
    expect(langFromPath('/pt-BR/')).toBe('pt');
    expect(langFromPath('/pt-BRX')).toBe('en');
  });

  it.each([
    ['en', 'https://andradegabriel.com/', 'en_US', 'pt_BR'],
    ['pt', 'https://andradegabriel.com/pt-BR/', 'pt_BR', 'en_US'],
  ] as const)(
    'writes per-language head tags for %s',
    (lang, url, locale, alternate) => {
      const head = buildHead(lang);
      expect(head).toContain(`<link rel="canonical" href="${url}" />`);
      expect(head).toContain(`<meta property="og:url" content="${url}" />`);
      expect(head).toContain(
        `<meta property="og:locale" content="${locale}" />`,
      );
      expect(head).toContain(
        `<meta property="og:locale:alternate" content="${alternate}" />`,
      );
      for (const [hreflang, href] of [
        ['en', 'https://andradegabriel.com/'],
        ['pt-BR', 'https://andradegabriel.com/pt-BR/'],
        ['x-default', 'https://andradegabriel.com/'],
      ]) {
        expect(head).toContain(
          `<link rel="alternate" hreflang="${hreflang}" href="${href}" />`,
        );
      }
      expect(head.match(/<title>/g)).toHaveLength(1);
      expect(head).toMatch(
        /name="description" content="Gabriel Andrade [^"]*Madri/,
      );
      expect(parseJsonLd(head)).toEqual(buildJsonLd(lang));
    },
  );

  it('describes a Person in Madrid with the profiles linked on the site', () => {
    const [person, website] = buildJsonLd('en')['@graph'];
    expect(person).toMatchObject({
      '@type': 'Person',
      name: 'Gabriel Andrade',
      jobTitle: 'Senior Full Stack Engineer',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Madrid',
        addressCountry: 'ES',
      },
      worksFor: { name: 'InteractiveAI' },
    });
    expect(SAME_AS).toEqual([
      'https://github.com/gabrielgustavoandrade',
      'https://www.linkedin.com/in/gabrielgustavoandrade',
      'https://www.npmjs.com/package/@gabrielgustavoandrade/smart-date-input',
    ]);
    expect(website['@type']).toBe('WebSite');
  });
});
