import { describe, expect, it } from 'vitest';
import { EARTH_FILL } from '../components/earth/earthGeometry';
import {
  damp,
  EXIT_END_SCALE,
  easeInOutCubic,
  getDockPose,
  getDockProgress,
  getEarthFrame,
  getExitFrame,
  getExitProgress,
  getHeroPose,
  smoothstep,
} from './earthDock';

const visibleCenter = (frame: ReturnType<typeof getEarthFrame>) => ({
  x: frame.x + frame.boxSize / 2,
  y: frame.y + frame.boxSize / 2,
  diameter: frame.boxSize * frame.scale * EARTH_FILL,
});

describe('earthDock', () => {
  it('matches the 1440×900 hero still', () => {
    const hero = getHeroPose(1440, 900);
    expect(hero.centerX).toBe(1180);
    expect(hero.centerY).toBe(450);
    expect(hero.diameter).toBe(811);
  });

  it('starts at the hero pose and ends as the corner mark', () => {
    const start = visibleCenter(getEarthFrame(0, 1440, 900));
    expect(start.x).toBeCloseTo(1180, 0);
    expect(start.diameter).toBeCloseTo(811, -1);

    const end = getEarthFrame(1, 1440, 900);
    const dock = getDockPose(1440);
    expect(end.scale).toBe(1);
    expect(visibleCenter(end).x).toBeCloseTo(dock.centerX, 0);
    expect(visibleCenter(end).y).toBeCloseTo(dock.centerY, 0);
    expect(visibleCenter(end).diameter).toBeCloseTo(dock.diameter, -1);
  });

  it('shrinks monotonically while travelling', () => {
    const sizes = [0, 0.25, 0.5, 0.75, 0.99].map(
      (p) => visibleCenter(getEarthFrame(p, 1440, 900)).diameter,
    );
    for (let i = 1; i < sizes.length; i += 1) {
      expect(sizes[i]).toBeLessThan(sizes[i - 1]);
    }
  });

  it('uses the mobile still below 720px', () => {
    expect(getHeroPose(390, 844).centerX).toBe(240);
    expect(getDockPose(390)).toEqual({
      centerX: 346,
      centerY: 44,
      diameter: 38,
    });
  });

  it('maps scroll to progress and eases without overshoot', () => {
    expect(getDockProgress(0, 900)).toBe(0);
    expect(getDockProgress(405, 900)).toBeCloseTo(0.5);
    expect(getDockProgress(5000, 900)).toBe(1);
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(2)).toBe(1);
    expect(damp(0, 1, 1, 0)).toBe(1);
    expect(damp(0, 1, 0.016, 0.18)).toBeGreaterThan(0);
    expect(damp(0, 1, 0.016, 0.18)).toBeLessThan(1);
  });

  describe('mobile exit', () => {
    const W = 390;
    const H = 844;
    const samples = Array.from({ length: 101 }, (_, i) => i / 100);

    it('maps scroll through the hero to 0..1 against the cached hero height', () => {
      expect(getExitProgress(0, H)).toBe(0);
      expect(getExitProgress(H / 4, H)).toBeCloseTo(0.25);
      expect(getExitProgress(H, H)).toBe(1);
      expect(getExitProgress(H * 3, H)).toBe(1);
      expect(getExitProgress(-40, H)).toBe(0);
      expect(getExitProgress(100, 0)).toBe(1);
    });

    it('starts exactly on the hero frame, so there is no jump', () => {
      const exit = getExitFrame(0, W, H);
      const dock = getEarthFrame(0, W, H);
      expect(exit.boxSize).toBe(dock.boxSize);
      expect(exit.x).toBeCloseTo(dock.x);
      expect(exit.y).toBeCloseTo(dock.y);
      expect(exit.scale).toBe(1);
      expect(exit.opacity).toBe(1);
    });

    it('ends fully above the viewport and transparent', () => {
      const end = getExitFrame(1, W, H);
      expect(end.scale).toBeCloseTo(EXIT_END_SCALE);
      expect(end.opacity).toBe(0);
      const bottom = end.y + end.boxSize / 2 + (end.boxSize * end.scale) / 2;
      expect(bottom).toBeLessThan(0);
      expect(getExitFrame(2, W, H)).toEqual(end);
    });

    it('moves, shrinks and fades monotonically with small steps', () => {
      const frames = samples.map((p) => getExitFrame(p, W, H));
      for (let i = 1; i < frames.length; i += 1) {
        const prev = frames[i - 1];
        const next = frames[i];
        expect(next.y).toBeLessThan(prev.y);
        expect(next.scale).toBeLessThan(prev.scale);
        expect(next.opacity).toBeLessThanOrEqual(prev.opacity);
        // Continuous: 1% of scroll never moves more than ~2% of the hero.
        expect(prev.y - next.y).toBeLessThan(H * 0.02);
        expect(prev.opacity - next.opacity).toBeLessThan(0.05);
        expect(next.boxSize).toBe(prev.boxSize);
        expect(next.x).toBe(prev.x);
      }
    });

    it('holds full opacity until the fade starts', () => {
      expect(getExitFrame(0.5, W, H).opacity).toBe(1);
      expect(getExitFrame(0.8, W, H).opacity).toBeGreaterThan(0);
      expect(getExitFrame(0.8, W, H).opacity).toBeLessThan(1);
    });

    it('ignores viewport height: only the hero height drives the pose', () => {
      // Same hero height → same frame, whatever the toolbar is doing.
      expect(getExitFrame(0.4, W, H)).toEqual(getExitFrame(0.4, W, H));
      expect(getExitFrame(0.4, W, 700).y).not.toBe(getExitFrame(0.4, W, H).y);
    });

    it('smoothstep clamps and eases', () => {
      expect(smoothstep(0.5, 1, 0)).toBe(0);
      expect(smoothstep(0.5, 1, 0.75)).toBeCloseTo(0.5);
      expect(smoothstep(0.5, 1, 2)).toBe(1);
    });
  });
});
