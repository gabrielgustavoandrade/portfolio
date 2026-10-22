import {
  buildCapybaraSeries,
  evaluate,
  frameAt,
  MAX_TERMS,
  parseSeek,
  STAGES,
  TOTAL_SECONDS,
} from './fourier';

describe('fourier', () => {
  it('reconstructs the outline with the full series', () => {
    const series = buildCapybaraSeries();
    const [x, y] = evaluate(series, MAX_TERMS, 0);
    const [ox, oy] = series.outline[0];
    expect(Math.hypot(x - ox, y - oy)).toBeLessThan(2);
  });

  it('walks the stages and ends on the finished drawing', () => {
    expect(frameAt(0)).toEqual({ stage: 0, terms: 1, angle: 0 });
    const end = frameAt(TOTAL_SECONDS);
    expect(end.terms).toBe(STAGES[STAGES.length - 1]);
    expect(end.angle).toBeCloseTo(Math.PI * 2);
  });

  it('parses seek params', () => {
    expect(parseSeek('?fourier=0.5', 'fourier')).toBe(0.5);
    expect(parseSeek('?fourier=50', 'fourier')).toBe(0.5);
    expect(parseSeek('?replay=end', 'replay')).toBe(1);
    expect(parseSeek('?fourier=nope', 'fourier')).toBeNull();
    expect(parseSeek('', 'fourier')).toBeNull();
  });
});
