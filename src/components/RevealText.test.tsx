import { render } from '@testing-library/react';
import { RevealText } from './RevealText';

describe('RevealText', () => {
  it('keeps extractable word spaces for innerText, SEO, and screen readers', () => {
    const { container } = render(
      <RevealText as="p" stagger={true} delay={0}>
        I'm a Brazilian software engineer based in Madrid.
      </RevealText>,
    );

    const paragraph = container.querySelector('p');
    const wordSpans = Array.from(
      paragraph?.querySelectorAll('.reveal-text__word') ?? [],
    );

    expect(paragraph?.textContent).toBe(
      "I'm a Brazilian software engineer based in Madrid.",
    );
    expect(
      wordSpans.some(
        (span) =>
          span.nextSibling?.nodeType === Node.TEXT_NODE &&
          /\s/.test(span.nextSibling.textContent ?? ''),
      ),
    ).toBe(true);
  });

  it('does not emit empty word spans from indented About copy', () => {
    const { container } = render(
      <RevealText as="p" stagger={true} delay={0}>
        {`
            I'm a Brazilian software engineer based in Madrid.
          `}
      </RevealText>,
    );

    const words = container.querySelectorAll('.reveal-text__word');

    expect(words).toHaveLength(8);
    expect(Array.from(words).every((word) => word.textContent?.trim())).toBe(
      true,
    );
  });
});
