import { describe, expect, it } from 'vitest';
import { getGlobePose, getRailProgress } from './heroMotion';

describe('heroMotion', () => {
  it('keeps the globe large and centered at beat 1', () => {
    const pose = getGlobePose(0, 1440, 900);

    expect(pose.scale).toBe(1);
    expect(pose.interactive).toBe(true);
    expect(pose.x).toBeCloseTo((1440 - pose.size) / 2);
    expect(pose.size).toBeGreaterThan(400);
  });

  it('moves the same globe to a small upper-left mark at beat 2', () => {
    const pose = getGlobePose(1, 1440, 900);

    expect(pose.scale).toBeLessThan(0.25);
    expect(pose.interactive).toBe(false);
    expect(pose.x).toBe(28);
    expect(pose.y).toBe(24);
    expect(pose.size * pose.scale).toBeCloseTo(104);
  });

  it('holds the work rail until the pin is underway', () => {
    expect(getRailProgress(0)).toBe(0);
    expect(getRailProgress(0.2)).toBe(0);
    expect(getRailProgress(1)).toBe(1);
  });
});
