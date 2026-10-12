import { describe, expect, it } from 'vitest';
import { EARTH_FILL } from '../components/earth/earthGeometry';
import {
  damp,
  easeInOutCubic,
  getDockPose,
  getDockProgress,
  getEarthFrame,
  getHeroPose,
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
});
