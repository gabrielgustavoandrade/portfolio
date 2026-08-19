import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  COMET_FROM,
  COMET_TO,
  COMET_WAIT_FIRST,
  DUST_COLOR,
  DUST_HI,
  DUST_LO,
  DUST_OPACITY,
  DUST_SIZE,
  getHeroAtmosphere,
} from './getHeroAtmosphere';

describe('getHeroAtmosphere', () => {
  it('keeps a compact cool field around the globe, not on its face', () => {
    const atmosphere = getHeroAtmosphere({
      compact: false,
      includeStreak: true,
    });
    const dust = atmosphere.group.children[0] as THREE.Points;
    const positions = dust.geometry.getAttribute('position');
    const material = dust.material as THREE.ShaderMaterial;
    const color = material.uniforms.uColor.value as THREE.Color;

    expect(positions.count).toBe(DUST_HI);
    expect(material.blending).toBe(THREE.AdditiveBlending);
    expect(material.uniforms.uSize.value).toBeGreaterThanOrEqual(2);
    expect(material.uniforms.uOpacity.value).toBeGreaterThan(0.5);
    expect(material.toneMapped).toBe(false);
    expect(material.uniforms.uSize.value).toBe(DUST_SIZE);
    expect(material.uniforms.uOpacity.value).toBe(DUST_OPACITY);
    expect(color.getHex()).toBe(DUST_COLOR);
    expect(color.b).toBeGreaterThanOrEqual(color.r);
    expect(color.g).toBeGreaterThan(0.8);
    expect(material.fragmentShader).toContain('gl_FragCoord');
    expect(material.fragmentShader).toContain('smoothstep(0.48, 0.74, field)');

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

  it('brings one in-frame cool streak on early, not a shower', () => {
    expect(COMET_WAIT_FIRST).toBeLessThanOrEqual(1);
    expect(Math.abs(COMET_FROM.x)).toBeLessThan(3.6);
    expect(Math.abs(COMET_FROM.y)).toBeLessThan(3.8);
    expect(Math.abs(COMET_TO.x)).toBeLessThan(3.6);
    expect(Math.abs(COMET_TO.y)).toBeLessThan(3.8);
    expect(COMET_FROM.z).toBeLessThan(0);
    expect(COMET_TO.z).toBeLessThan(0);

    const atmosphere = getHeroAtmosphere({
      compact: false,
      includeStreak: true,
    });
    const streak = atmosphere.group.children[1] as THREE.Points;
    expect(streak).toBeInstanceOf(THREE.Points);
    const material = streak.material as THREE.ShaderMaterial;
    const color = material.uniforms.uColor.value as THREE.Color;
    expect(material.toneMapped).toBe(false);
    expect(color.b).toBeGreaterThanOrEqual(color.r);

    atmosphere.update(0.7, true);
    expect(streak.visible).toBe(true);

    atmosphere.update(20, true);
    expect(streak.visible).toBe(false);

    atmosphere.dispose();
  });
});
