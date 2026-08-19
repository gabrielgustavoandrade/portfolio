import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  COMET_FROM,
  COMET_TO,
  COMET_WAIT_FIRST,
  DUST_COLOR,
  DUST_HI,
  DUST_LO,
  getHeroAtmosphere,
} from './getHeroAtmosphere';

describe('getHeroAtmosphere', () => {
  it('keeps a sparse circular field in a large volume', () => {
    const atmosphere = getHeroAtmosphere({
      compact: false,
      includeStreak: true,
    });
    const dust = atmosphere.group.children[0] as THREE.Points;
    const positions = dust.geometry.getAttribute('position');
    const material = dust.material as THREE.ShaderMaterial;
    const color = material.uniforms.uColor.value as THREE.Color;

    expect(positions.count).toBe(DUST_HI);
    expect(positions.count).toBeGreaterThanOrEqual(200);
    expect(positions.count).toBeLessThanOrEqual(600);
    expect(material.blending).toBe(THREE.AdditiveBlending);
    expect(material.depthWrite).toBe(false);
    expect(material.toneMapped).toBe(false);
    expect(material.fragmentShader).toContain('gl_PointCoord');
    expect(material.fragmentShader).toContain('smoothstep(0.5, 0.4, d) * 0.8');
    expect(color.getHex()).toBe(DUST_COLOR);
    expect(color.b).toBeGreaterThanOrEqual(color.r);

    let far = 0;
    let behind = 0;
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      if (Math.hypot(x, y) > 6) far += 1;
      if (z < -2) behind += 1;
    }
    expect(far).toBeGreaterThan(positions.count * 0.25);
    expect(behind).toBe(positions.count);

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

  it('brings one far cool streak on early, not a shower', () => {
    expect(COMET_WAIT_FIRST).toBeLessThanOrEqual(1);
    expect(Math.abs(COMET_FROM.x)).toBeGreaterThan(8);
    expect(Math.abs(COMET_TO.x)).toBeGreaterThan(8);
    expect(COMET_FROM.z).toBeLessThan(0);
    expect(COMET_TO.z).toBeLessThan(0);

    const atmosphere = getHeroAtmosphere({
      compact: false,
      includeStreak: true,
    });
    const streak = atmosphere.group.children[1] as THREE.Points;
    const material = streak.material as THREE.ShaderMaterial;
    const color = material.uniforms.uColor.value as THREE.Color;
    expect(material.fragmentShader).toContain('gl_PointCoord');
    expect(color.b).toBeGreaterThanOrEqual(color.r);

    atmosphere.update(0.8, true);
    expect(streak.visible).toBe(true);

    atmosphere.update(20, true);
    expect(streak.visible).toBe(false);

    atmosphere.dispose();
  });
});
