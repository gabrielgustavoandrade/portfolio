import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { getHeroAtmosphere } from './getHeroAtmosphere';

describe('getHeroAtmosphere', () => {
  it('keeps the dust behind the globe as a compact cool field', () => {
    const atmosphere = getHeroAtmosphere({
      compact: false,
      includeStreak: true,
    });
    const dust = atmosphere.group.children[0] as THREE.Points;
    const positions = dust.geometry.getAttribute('position');

    expect(positions.count).toBe(2400);
    expect((dust.material as THREE.PointsMaterial).blending).toBe(
      THREE.AdditiveBlending,
    );

    for (let i = 0; i < positions.count; i += 1) {
      expect(positions.getZ(i)).toBeLessThan(-1.1);
    }

    atmosphere.dispose();
  });

  it('uses a cheaper set on compact viewports', () => {
    const atmosphere = getHeroAtmosphere({
      compact: true,
      includeStreak: false,
    });
    const dust = atmosphere.group.children[0] as THREE.Points;
    expect(dust.geometry.getAttribute('position').count).toBe(800);
    expect(atmosphere.group.children.length).toBe(1);
    atmosphere.dispose();
  });
});
