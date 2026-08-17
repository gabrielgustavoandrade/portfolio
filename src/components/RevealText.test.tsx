import { render } from '@testing-library/react';
import { RevealText } from './RevealText';

describe('RevealText', () => {
  it('keeps normal word spacing when staggering About copy', () => {
    const { container } = render(
      <RevealText as="p" stagger={true} delay={0}>
        I'm a Brazilian software engineer based in Madrid.
      </RevealText>,
    );

    expect(container.textContent).toBe(
      "I'm\u00A0a\u00A0Brazilian\u00A0software\u00A0engineer\u00A0based\u00A0in\u00A0Madrid.",
    );
  });
});
