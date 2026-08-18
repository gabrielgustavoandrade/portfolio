import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useEnterList } from './useEnterList';

function Probe() {
  const ref = useEnterList();
  return (
    <section ref={ref}>
      <div data-enter className="enter">
        Hello
      </div>
    </section>
  );
}

describe('useEnterList', () => {
  it('jumps enter items to the end pose when reduced motion is preferred', () => {
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

    const { container } = render(<Probe />);
    expect(container.querySelector('[data-enter]')).toHaveClass('is-in');

    window.matchMedia = matchMedia;
  });
});
