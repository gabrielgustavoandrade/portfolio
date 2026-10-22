import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  configureEarthTexture,
  pickEarthTextureTier,
} from './loadEarthTextures';

describe('loadEarthTextures', () => {
  it('picks the compact set on a narrow viewport', () => {
    const matchMedia = window.matchMedia;
    window.matchMedia = (query: string): MediaQueryList => ({
      matches: query.includes('max-width: 720px'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });

    expect(pickEarthTextureTier()).toBe('lo');
    window.matchMedia = matchMedia;
  });

  it('sets anisotropy, mipmaps, and the right color space', () => {
    const texture = new THREE.Texture();
    configureEarthTexture(texture, { color: true, anisotropy: 8 });

    expect(texture.colorSpace).toBe(THREE.SRGBColorSpace);
    expect(texture.anisotropy).toBe(8);
    expect(texture.generateMipmaps).toBe(true);
    expect(texture.minFilter).toBe(THREE.LinearMipmapLinearFilter);
    expect(texture.magFilter).toBe(THREE.LinearFilter);

    configureEarthTexture(texture, { color: false, anisotropy: 4 });
    expect(texture.colorSpace).toBe(THREE.NoColorSpace);
  });
});
