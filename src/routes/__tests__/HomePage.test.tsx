import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
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

const renderHomePage = () =>
  render(
    <MemoryRouter
      initialEntries={['/']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <HomePage />
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
  /langfuse/i,
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
  });

  it('renders the hero with name, approved headline and the live Earth', () => {
    renderHomePage();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Gabriel Andrade' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Senior Full Stack Engineer | AI agents in production | React, TypeScript, Next.js, Python',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('React · TypeScript · Next.js · Python'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('earth-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('hero-dust')).toBeInTheDocument();
    expect(earthSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ spin: 1 }),
    );

    const nav = screen.getByRole('navigation', { name: /primary/i });
    expect(within(nav).getByRole('link', { name: 'Work' })).toHaveAttribute(
      'href',
      '#work',
    );
    expect(
      within(nav).getByRole('link', { name: 'Experience' }),
    ).toHaveAttribute('href', '#experience');
    expect(within(nav).getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '#contact',
    );
  });

  it('shows three outcome-led project cards with public images', () => {
    renderHomePage();

    const work = screen.getByRole('region', {
      name: /selected systems \/ 2026/i,
    });
    const cards = within(work).getAllByRole('article');
    expect(cards).toHaveLength(3);

    const [interactive, sdi, mms] = cards;
    expect(within(interactive).getByText('InteractiveAI')).toBeInTheDocument();
    expect(
      within(interactive).getByRole('heading', {
        name: /ai agents in production/i,
      }),
    ).toBeInTheDocument();
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
      within(mms).getByRole('heading', { name: /500k\+ customizations/i }),
    ).toBeInTheDocument();
    for (const value of ['−65%', '−50%', '12']) {
      expect(within(mms).getByText(value)).toBeInTheDocument();
    }
  });

  it('embeds the live smart-date-input demo', () => {
    renderHomePage();

    expect(
      screen.getByRole('heading', { level: 2, name: 'smart-date-input' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /try smart-date-input/i }),
    ).toBeInTheDocument();
  });

  it('lists contract experience and public contact links', () => {
    renderHomePage();

    const experience = screen.getByRole('region', { name: /experience/i });
    for (const company of ['Red Ventures', 'Valtech', 'Pacto']) {
      expect(
        within(experience).getByRole('heading', { name: company }),
      ).toBeInTheDocument();
    }
    expect(within(experience).getAllByText('Contract')).toHaveLength(3);
    expect(
      within(experience).getByText('Good Eggs: 7,000+ products'),
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

  it('keeps retired copy off the page', () => {
    renderHomePage();

    const text = document.body.textContent ?? '';
    for (const pattern of BANNED) {
      expect(text).not.toMatch(pattern);
    }
    expect(text).not.toMatch(/agent systems — traces/i);
  });

  it('holds the Earth still and skips scroll animations with reduced motion', () => {
    const restore = mockReducedMotion();
    try {
      renderHomePage();

      expect(document.querySelector('.hero')).toHaveClass('hero--reduced');
      expect(screen.getByTestId('earth-canvas')).toBeInTheDocument();
      expect(earthSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ spin: 0 }),
      );
      expect(screen.queryByTestId('hero-dust')).toBeNull();
      expect(document.querySelector('.work__grid')).toHaveClass('is-in');
      expect(document.querySelector('.experience__list')).toHaveClass('is-in');
      expect(document.querySelector('.about__text')).toHaveClass('is-in');
    } finally {
      restore();
    }
  });
});
