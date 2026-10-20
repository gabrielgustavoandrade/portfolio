import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import { LANG_STORAGE_KEY } from '../../i18n/detectLanguage';
import { I18nProvider } from '../../i18n/I18nProvider';
import { HomePage } from '../HomePage';

const earthSpy = vi.fn();

vi.mock('../../components/earth/EarthCanvas', () => ({
  EarthCanvas: (props: { spin?: number }) => {
    earthSpy(props);
    return <div data-testid="earth-canvas" />;
  },
}));

vi.mock('../../components/earth/HeroDustCanvas', () => ({
  HeroDustCanvas: () => <div data-testid="hero-dust" />,
}));

function LocationProbe() {
  const { pathname, hash } = useLocation();
  return <output data-testid="location">{`${pathname}${hash}`}</output>;
}

const renderHomePage = (path = '/') =>
  render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <I18nProvider>
        <HomePage />
        <LocationProbe />
      </I18nProvider>
    </MemoryRouter>,
  );

const mockReducedMotion = () => {
  const original = window.matchMedia;
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
  return () => {
    window.matchMedia = original;
  };
};

const BANNED = [
  /freelanc/i,
  /node\.?js/i,
  /plasma/i,
  /marmoraria/i,
  /langgraph/i,
  // The harness is publicly called Holdout.
  /agent-lab/i,
  /langfuse/i,
  /lang\s?chain/i,
  // No location or availability copy.
  /madrid/i,
  /goi[âa]nia/i,
  /based in/i,
  /\bremote\b/i,
  /brazil/i,
  /relocat/i,
  // M&M's stays "via Valtech" with no metrics.
  /\bmars\b/i,
  /\bMACH\b/,
  /amplience/i,
  /end-to-end/i,
  /joined early/i,
  /25% fewer bugs/i,
  /\$100M/i,
  /intentional youtube/i,
  /us remote/i,
  /\bcv\b|résumé|resume/i,
];

describe('HomePage', () => {
  beforeEach(() => {
    earthSpy.mockClear();
    window.localStorage.clear();
  });

  it('renders the hero with name, approved headline and the live Earth', async () => {
    renderHomePage();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Gabriel Andrade' }),
    ).toBeInTheDocument();
    // Exact approved headline, one segment per line with no dangling pipe.
    const headline = document.querySelector('.hero__headline');
    expect(headline).toHaveTextContent(
      'Senior Full Stack Engineer | AI agents in production | React, TypeScript, Next.js, Python',
      { normalizeWhitespace: false },
    );
    expect(
      Array.from(
        headline?.querySelectorAll('.hero__segment') ?? [],
        (node) => node.textContent,
      ),
    ).toEqual([
      'Senior Full Stack Engineer',
      'AI agents in production',
      'React, TypeScript, Next.js, Python',
    ]);
    // The stack is in the headline; no second stack line under it.
    expect(
      screen.queryByText('React · TypeScript · Next.js · Python'),
    ).toBeNull();
    // Poster first; the Three.js scene is code-split and mounts after paint.
    expect(document.querySelector('.earth__poster')).toHaveAttribute(
      'src',
      '/earth/poster-1600.webp',
    );
    expect(await screen.findByTestId('earth-canvas')).toBeInTheDocument();
    expect(await screen.findByTestId('hero-dust')).toBeInTheDocument();
    expect(earthSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ spin: 1 }),
    );

    const nav = screen.getByRole('navigation', { name: /primary/i });
    const links = within(nav)
      .getAllByRole('link')
      .map((link) => [link.textContent, link.getAttribute('href')]);
    expect(links).toEqual([
      ['Work', '#work'],
      ['Harness', '#harness'],
      ['Projects', '#projects'],
      ['Experience', '#experience'],
      ['Contact', '#contact'],
    ]);
    // Nav follows page order, and every target exists.
    const sections = Array.from(document.querySelectorAll('section[id]')).map(
      (section) => section.id,
    );
    const positions = links.map(([, href]) =>
      sections.indexOf(String(href).slice(1)),
    );
    expect(positions).not.toContain(-1);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('shows three outcome-led project cards with public images', () => {
    renderHomePage();

    const work = screen.getByRole('region', { name: 'Work' });
    const cards = within(work).getAllByRole('article');
    expect(cards).toHaveLength(3);

    const [interactive, sdi, mms] = cards;
    // The project name is the card title; the slogan is a descriptor.
    expect(
      cards.map(
        (card) => within(card).getByRole('heading', { level: 3 }).textContent,
      ),
    ).toEqual(['InteractiveAI', 'smart-date-input', 'M&M’s Design Your Own']);
    expect(within(interactive).getByText('Current')).toBeInTheDocument();
    expect(
      within(interactive).getByText('Agent platform: React/Next.js and Python'),
    ).toBeInTheDocument();
    expect(work.textContent).not.toMatch(/in production/i);
    expect(within(interactive).queryByRole('definition')).toBeNull();
    expect(within(interactive).getByRole('img')).toHaveAttribute(
      'src',
      '/work/interactiveai-desktop.png',
    );

    expect(within(sdi).getByRole('img')).toHaveAttribute(
      'src',
      '/work/sdi-render-readable.png',
    );
    expect(within(sdi).getByRole('link', { name: /npm/i })).toHaveAttribute(
      'href',
      'https://www.npmjs.com/package/@gabrielgustavoandrade/smart-date-input',
    );

    expect(within(mms).getByText(/via valtech/i)).toBeInTheDocument();
    expect(within(mms).getByRole('img')).toHaveAttribute(
      'src',
      '/work/m-ms-desktop.png',
    );
    expect(
      within(mms).getByText(
        'Frontend for the product configurator used to personalize M&M’s in 12 countries.',
      ),
    ).toBeInTheDocument();
    expect(within(mms).queryByRole('definition')).toBeNull();
    expect(mms.textContent).not.toMatch(/500K|65%|50%/);
  });

  it('embeds the live smart-date-input demo', () => {
    renderHomePage();

    const section = screen.getByRole('region', { name: 'Open source' });
    expect(section).toHaveAttribute('id', 'projects');
    expect(
      within(section).getByRole('heading', {
        level: 3,
        name: 'smart-date-input',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /try smart-date-input/i }),
    ).toBeInTheDocument();
  });

  it('lists contract experience and public contact links', () => {
    renderHomePage();

    const experience = screen.getByRole('region', { name: /experience/i });
    for (const company of [
      'InteractiveAI',
      'Red Ventures',
      'Valtech',
      'Pacto',
    ]) {
      expect(
        within(experience).getByRole('heading', { name: company }),
      ).toBeInTheDocument();
    }
    const engagements = Array.from(
      experience.querySelectorAll('.experience__engagement'),
    ).map((node) => node.textContent);
    // Role-level dates from the CV; no per-client dates inside Valtech.
    expect(engagements).toEqual([
      'Contract · Mar 2026 – Present',
      'Contract · May 2024 – Mar 2026',
      'Contract · Sep 2021 – May 2024',
      'Contract · Jul 2019 – Sep 2021',
    ]);
    expect(within(experience).getAllByText(/\b20\d\d\b/)).toHaveLength(4);
    expect(
      within(experience).getByText(
        'Good Eggs: 7,000+ products, web (React/Next.js) and mobile (React Native)',
      ),
    ).toBeInTheDocument();
    expect(experience.textContent).not.toMatch(/see 03/i);
    // Points stay a real list on every viewport.
    expect(within(experience).getAllByRole('list')).toHaveLength(4);
    expect(
      within(experience).getByText(
        'Security hardening of auth and secrets handling',
      ),
    ).toBeInTheDocument();

    const contact = screen.getByRole('region', { name: /contact/i });
    expect(
      within(contact).getByRole('link', {
        name: /gabrielgustavoandrade@gmail\.com/i,
      }),
    ).toHaveAttribute('href', 'mailto:gabrielgustavoandrade@gmail.com');
    expect(
      within(contact).getByRole('link', { name: /linkedin/i }),
    ).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/gabrielgustavoandrade',
    );
    expect(
      within(contact).getByRole('link', { name: /github/i }),
    ).toHaveAttribute('href', 'https://github.com/gabrielgustavoandrade');
  });

  it('shows Holdout as in progress with a real session replay and no repo link', () => {
    const restore = mockReducedMotion();
    try {
      renderHomePage();
      const harness = screen.getByRole('region', { name: 'Agent harness' });
      expect(
        within(harness).getByRole('heading', { level: 3, name: 'Holdout' }),
      ).toBeInTheDocument();
      expect(within(harness).getByText('Still in progress')).toHaveClass(
        'status-badge',
      );
      expect(
        within(harness).getByText(
          'Private repository while the project is still in progress.',
        ),
      ).toBeInTheDocument();
      expect(harness.textContent).toMatch(/factory-style/i);
      expect(harness.textContent).toMatch(/orchestration/i);
      const transcript = within(harness).getByRole('region', {
        name: /transcript/i,
      });
      expect(transcript).toHaveTextContent(
        '$ bun src/index.ts session start demo',
      );
      expect(transcript).toHaveTextContent('spawned: worker-1 pid=713651');
      expect(transcript).toHaveTextContent(
        'path=.holdout/sessions/20261012-205802-demo',
      );
      expect(transcript).toHaveTextContent(
        'evals look honest: naive fails, correct passes.',
      );
      expect(transcript.textContent).not.toMatch(
        /\/tmp\/|\/workspace\/|\/Users\//,
      );
      expect(within(harness).queryAllByRole('link')).toHaveLength(0);
    } finally {
      restore();
    }
  });

  it('shows the Fourier drawing section', () => {
    renderHomePage();
    const section = screen.getByRole('region', { name: 'Side project' });
    expect(
      within(section).getByRole('heading', {
        level: 3,
        name: 'Fourier series drawing',
      }),
    ).toBeInTheDocument();
    expect(
      within(section).getByRole('img', { name: /capybara outline/i }),
    ).toBeInTheDocument();
  });

  it('keeps retired copy off the page, including the full replay', () => {
    const check = () => {
      const text = document.body.textContent ?? '';
      for (const pattern of BANNED) {
        expect(text).not.toMatch(pattern);
      }
      expect(text).not.toMatch(/agent systems — traces/i);
      // Plain business-casual copy from the review.
      expect(text).not.toMatch(
        /scalable|agentic|selected systems|craft proof|capybara, in circles|lives in|keep it honest|fail-open|exposed secrets/i,
      );
    };

    renderHomePage();
    check();
    cleanup();

    const restore = mockReducedMotion();
    try {
      renderHomePage();
      check();
    } finally {
      restore();
    }
  });

  it('holds the Earth still and skips scroll animations with reduced motion', async () => {
    const restore = mockReducedMotion();
    try {
      renderHomePage();

      expect(document.querySelector('.hero')).toHaveClass('hero--reduced');
      expect(await screen.findByTestId('earth-canvas')).toBeInTheDocument();
      expect(earthSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ spin: 0 }),
      );
      expect(screen.queryByTestId('hero-dust')).toBeNull();
      for (const card of document.querySelectorAll('.work-card')) {
        expect(card).toHaveAttribute('data-reveal', 'in');
      }
      expect(screen.queryByRole('button', { name: 'Replay' })).toBeNull();
      expect(document.querySelector('.experience__list')).toHaveClass('is-in');
      expect(document.querySelector('.about__text')).toHaveClass('is-in');
    } finally {
      restore();
    }
  });

  describe('language toggle', () => {
    const setNavigatorLanguages = (languages: string[]) => {
      const spy = vi
        .spyOn(window.navigator, 'languages', 'get')
        .mockReturnValue(languages);
      return () => spy.mockRestore();
    };

    afterEach(() => {
      document.documentElement.lang = 'en';
    });

    it('switches every section to pt-BR via /pt-BR/, updates <html lang> and persists', async () => {
      const user = userEvent.setup();
      renderHomePage('/#contact');

      const toggle = screen.getByRole('group', { name: 'Language' });
      const en = within(toggle).getByRole('button', { name: 'EN' });
      const pt = within(toggle).getByRole('button', { name: 'PT' });
      expect(en).toHaveAttribute('aria-pressed', 'true');
      expect(pt).toHaveAttribute('aria-pressed', 'false');
      expect(document.documentElement.lang).toBe('en');

      await user.click(pt);

      // The toggle moves between the two prerendered URLs, keeping the hash.
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/pt-BR/#contact',
      );
      expect(pt).toHaveAttribute('aria-pressed', 'true');
      expect(en).toHaveAttribute('aria-pressed', 'false');
      expect(document.documentElement.lang).toBe('pt-BR');
      expect(document.title).toBe(
        'Gabriel Andrade — Engenheiro Full Stack Sênior',
      );
      expect(window.localStorage.getItem(LANG_STORAGE_KEY)).toBe('pt');

      const nav = screen.getByRole('navigation', { name: 'Principal' });
      expect(
        within(nav)
          .getAllByRole('link')
          .map((link) => link.textContent),
      ).toEqual(['Trabalhos', 'Harness', 'Projetos', 'Experiência', 'Contato']);
      expect(screen.getByRole('group', { name: 'Idioma' })).toBeInTheDocument();

      const harness = screen.getByRole('region', {
        name: 'Harness de agentes',
      });
      expect(
        within(harness).getByRole('heading', { level: 3, name: 'Holdout' }),
      ).toBeInTheDocument();
      expect(within(harness).getByText('Em andamento')).toHaveClass(
        'status-badge',
      );
      expect(
        screen.getByRole('region', { name: 'Experiência' }).textContent,
      ).toMatch(/Contrato · Mar 2026 – Atual/);
      expect(
        screen.getByRole('textbox', { name: 'Teste o smart-date-input' }),
      ).toBeInTheDocument();

      // Brazilian, not European, Portuguese; and none of the retired copy.
      const text = document.body.textContent ?? '';
      expect(text).not.toMatch(
        /\b(ecrã|telemóvel|ficheiro|equipa|utilizador)/i,
      );
      for (const pattern of BANNED) {
        expect(text).not.toMatch(pattern);
      }

      await user.click(within(toggle).getByRole('button', { name: 'EN' }));
      expect(screen.getByTestId('location')).toHaveTextContent('/#contact');
      expect(document.documentElement.lang).toBe('en');
      expect(window.localStorage.getItem(LANG_STORAGE_KEY)).toBe('en');
      expect(
        screen.getByRole('region', { name: 'Agent harness' }),
      ).toBeInTheDocument();
    });

    it('renders pt-BR at /pt-BR/ regardless of browser language', () => {
      const restore = setNavigatorLanguages(['en-US']);
      try {
        renderHomePage('/pt-BR/');
        expect(screen.getByRole('button', { name: 'PT' })).toHaveAttribute(
          'aria-pressed',
          'true',
        );
        expect(document.documentElement.lang).toBe('pt-BR');
        expect(document.querySelector('.hero__headline')).toHaveTextContent(
          'Engenheiro Full Stack Sênior',
        );
      } finally {
        restore();
      }
    });

    it('sends / to /pt-BR/ when pt-BR was saved on a previous visit', () => {
      window.localStorage.setItem(LANG_STORAGE_KEY, 'pt');
      renderHomePage('/#work');
      expect(screen.getByTestId('location')).toHaveTextContent('/pt-BR/#work');
      expect(screen.getByRole('button', { name: 'PT' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(
        screen.getByRole('heading', { level: 1, name: 'Gabriel Andrade' }),
      ).toBeInTheDocument();
      expect(document.documentElement.lang).toBe('pt-BR');
    });

    it('stays in English on / without a saved choice, even for pt browsers', () => {
      const restore = setNavigatorLanguages(['pt-BR', 'en']);
      try {
        renderHomePage();
        expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
        expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute(
          'aria-pressed',
          'true',
        );
        expect(document.documentElement.lang).toBe('en');
      } finally {
        restore();
      }
    });
  });
});
