import * as THREE from 'three';

export type EarthTextureTier = 'hi' | 'lo';

export function pickEarthTextureTier(): EarthTextureTier {
  if (typeof window === 'undefined') return 'lo';

  const narrow = window.matchMedia('(max-width: 720px)').matches;
  const coarse =
    window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1024;
  const lowMemory =
    'deviceMemory' in navigator &&
    Number(navigator.deviceMemory) > 0 &&
    Number(navigator.deviceMemory) <= 4;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  const saveData = Boolean(connection?.saveData);

  return narrow || coarse || lowMemory || saveData ? 'lo' : 'hi';
}

export function configureEarthTexture(
  texture: THREE.Texture,
  {
    color,
    anisotropy,
  }: {
    color: boolean;
    anisotropy: number;
  },
) {
  texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.anisotropy = anisotropy;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
