import { describe, expect, it } from 'vitest';
import {
  damp,
  getGlobePose,
  getRailItemProgress,
  getRailProgress,
  getTitleLeave,
  MOTION,
  windowProgress,
} from './heroMotion';

describe('heroMotion', () => {
  it('keeps the globe large and centered at beat 1', () => {
    const pose = getGlobePose(0, 1440, 900);

    expect(pose.scale).toBe(1);
    expect(pose.interactive).toBe(true);
    expect(pose.visualX).toBeCloseTo((1440 - pose.size) / 2);
    expect(pose.size).toBeGreaterThan(400);
  });

  it('moves the same globe to a small upper-left mark at beat 2', () => {
    const pose = getGlobePose(1, 1440, 900);

    expect(pose.scale).toBeLessThan(0.25);
    expect(pose.interactive).toBe(false);
    expect(pose.visualX).toBeCloseTo(28);
    expect(pose.visualY).toBeCloseTo(24);
    expect(pose.size * pose.scale).toBeCloseTo(104);
  });

  it('holds the name, then lets the line leave', () => {
    expect(getTitleLeave(0)).toBe(0);
    expect(getTitleLeave(MOTION.titleHold)).toBe(0);
    expect(getTitleLeave(0.2)).toBeGreaterThan(0);
    expect(getTitleLeave(1)).toBe(1);
  });

  it('holds the work rail until the pin is underway', () => {
    expect(getRailProgress(0)).toBe(0);
    expect(getRailProgress(MOTION.railStart)).toBe(0);
    expect(getRailProgress(1)).toBe(1);
    expect(getRailItemProgress(0.4, 2)).toBeLessThan(
      getRailItemProgress(0.4, 0),
    );
  });

  it('maps windows with the shared ease', () => {
    expect(windowProgress(0.5, 0, 1)).toBeCloseTo(0.5);
    expect(windowProgress(0.25, 0, 1)).toBeLessThan(0.25);
  });

  it('trails the target instead of snapping', () => {
    const next = damp(0, 1, 1 / 60, MOTION.scrubSeconds);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(0.1);
  });
});
