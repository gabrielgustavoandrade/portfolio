import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  COMET_FROM,
  COMET_TO,
  COMET_WAIT_FIRST,
  DUST_BASE_SIZE,
  DUST_COLOR,
  DUST_HI,
  DUST_LO,
  DUST_SPREAD,
  getHeroAtmosphere,
} from './getHeroAtmosphere';

describe('getHeroAtmosphere', () => {
  it('uses the React Bits sparse circular field, not a globe halo', () => {
    const atmosphere = getHeroAtmosphere({
      compact: false,
      includeStreak: true,
    });
    const dust = atmosphere.group.children[0] as THREE.Points;
    const positions = dust.geometry.getAttribute('position');
    const material = dust.material as THREE.ShaderMaterial;
    const color = material.uniforms.uColor.value as THREE.Color;

    expect(positions.count).toBe(DUST_HI);
    expect(positions.count).toBe(200);
    expect(material.uniforms.uSpread.value).toBe(DUST_SPREAD);
    expect(material.uniforms.uBaseSize.value).toBe(DUST_BASE_SIZE);
    expect(material.blending).toBe(THREE.AdditiveBlending);
    expect(material.depthWrite).toBe(false);
    expect(material.fragmentShader).toContain('smoothstep(0.5, 0.4, d) * 0.8');
    expect(material.vertexShader).toContain('-abs(pos.z) * 10.0');
    expect(material.vertexShader).toContain('clamp(sized, 1.0, 2.8)');
    expect(material.vertexShader).not.toContain('particles.rotation');
    expect(color.getHex()).toBe(DUST_COLOR);

    for (let i = 0; i < positions.count; i += 1) {
      expect(
        Math.hypot(positions.getX(i), positions.getY(i), positions.getZ(i)),
      ).toBeLessThanOrEqual(1.0001);
    }

    atmosphere.update(2, true);
    expect(dust.rotation.x).toBe(0);
    expect(dust.rotation.y).toBe(0);
    expect(dust.rotation.z).toBe(0);
    expect(atmosphere.group.rotation.x).toBe(0);
    expect(atmosphere.group.rotation.y).toBe(0);
    expect(atmosphere.group.rotation.z).toBe(0);

    atmosphere.dispose();
  });

  it('keeps a cheaper set on compact viewports', () => {
    const atmosphere = getHeroAtmosphere({
      compact: true,
      includeStreak: true,
    });
    const dust = atmosphere.group.children[0] as THREE.Points;
    expect(dust.geometry.getAttribute('position').count).toBe(DUST_LO);
    expect(atmosphere.group.children.length).toBe(2);
    atmosphere.dispose();
  });

  it('brings one faint diagonal, not a shower', () => {
    expect(COMET_WAIT_FIRST).toBeLessThanOrEqual(1);
    expect(COMET_FROM.x * COMET_TO.x).toBeLessThan(0);
    expect(COMET_FROM.y - COMET_TO.y).toBeGreaterThan(1);
    expect(COMET_FROM.z).toBeLessThan(0);
    expect(COMET_TO.z).toBeLessThan(COMET_FROM.z);

    const atmosphere = getHeroAtmosphere({
      compact: false,
      includeStreak: true,
    });
    const streak = atmosphere.group.children[1] as THREE.Line;
    expect(streak).toBeInstanceOf(THREE.Line);
    const material = streak.material as THREE.LineBasicMaterial;
    expect(material.color.b).toBeGreaterThanOrEqual(material.color.r);

    atmosphere.update(0.9, true);
    expect(streak.visible).toBe(true);

    atmosphere.update(20, true);
    expect(streak.visible).toBe(false);

    atmosphere.dispose();
  });
});
