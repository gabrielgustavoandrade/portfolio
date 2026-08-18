import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { HomePage } from '../HomePage';

vi.mock('../../components/earth/EarthCanvas', () => ({
  EarthCanvas: () => <div data-testid="earth-canvas" />,
}));

vi.mock('../../components/HeroStarfield', () => ({
  HeroStarfield: () => <div data-testid="hero-starfield" />,
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

describe('HomePage', () => {
  it('renders beat 1 copy, the live earth canvas, and beat 2 work cards', () => {
    renderHomePage();

    expect(
      screen.getByRole('heading', { name: /gabriel andrade/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/commerce, built for speed/i)).toBeInTheDocument();
    expect(
      screen.getByText(/agent systems — traces, latency, cost, evals/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId('earth-canvas')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /^work$/i })).toHaveAttribute(
      'href',
      '#work',
    );
    expect(screen.getByRole('link', { name: /^about$/i })).toHaveAttribute(
      'href',
      '#about',
    );
    expect(screen.getByRole('link', { name: /^lab$/i })).toHaveAttribute(
      'href',
      '#build-log',
    );

    expect(screen.getByRole('link', { name: /01\s+earth/i })).toHaveAttribute(
      'href',
      '#build-log',
    );
    expect(
      screen.getByRole('link', { name: /02\s+smart-date-input/i }),
    ).toHaveAttribute('href', '/work/smart-date-input');
    expect(
      screen.getByText((_, node) => {
        return (
          node?.classList.contains('hero-rail__label') === true &&
          /03/.test(node.textContent ?? '') &&
          /commerce/i.test(node.textContent ?? '')
        );
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /03\s+commerce/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/still to come/i)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /selected work/i }),
    ).toBeInTheDocument();
  });

  it('jumps to the beat 2 end pose when reduced motion is preferred', () => {
    const matchMedia = window.matchMedia;
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

    renderHomePage();

    expect(document.querySelector('.hero')).toHaveClass('hero--reduced');
    expect(screen.getByTestId('earth-canvas')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /01\s+earth/i })).toBeInTheDocument();

    window.matchMedia = matchMedia;
  });
});
