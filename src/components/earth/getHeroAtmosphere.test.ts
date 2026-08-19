import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { DUST_HI, DUST_LO, getHeroAtmosphere } from './getHeroAtmosphere';

describe('getHeroAtmosphere', () => {
  it('keeps a compact cool field around the globe, not on its face', () => {
    const atmosphere = getHeroAtmosphere({
      compact: false,
      includeStreak: true,
    });
    const dust = atmosphere.group.children[0] as THREE.Points;
    const positions = dust.geometry.getAttribute('position');
    const material = dust.material as THREE.PointsMaterial;

    expect(positions.count).toBe(DUST_HI);
    expect(material.blending).toBe(THREE.AdditiveBlending);
    expect(material.size).toBeGreaterThanOrEqual(2);
    expect(material.opacity).toBeGreaterThan(0.5);
    expect(material.toneMapped).toBe(false);

    let beside = 0;
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      expect(Math.hypot(x, y, z)).toBeGreaterThan(2.7);
      if (Math.hypot(x, y) > 2.7) beside += 1;
    }
    expect(beside).toBeGreaterThan(positions.count * 0.35);

    atmosphere.dispose();
  });

  it('keeps a cheaper visible set on compact viewports', () => {
    const atmosphere = getHeroAtmosphere({
      compact: true,
      includeStreak: true,
    });
    const dust = atmosphere.group.children[0] as THREE.Points;
    expect(dust.geometry.getAttribute('position').count).toBe(DUST_LO);
    expect(atmosphere.group.children.length).toBe(2);
    atmosphere.dispose();
  });
});
