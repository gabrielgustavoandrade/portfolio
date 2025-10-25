import * as THREE from 'three';

type StarfieldOptions = {
  count?: number;
  texture?: string;
};

// Starfield configuration
const DEFAULT_STAR_COUNT = 1500;
const DEFAULT_STAR_TEXTURE = '/textures/earth/stars/circle.png';
const STAR_RADIUS_MIN = 25;
const STAR_RADIUS_MAX = 50;
const STAR_HUE = 0.6; // Bluish tint
const STAR_SATURATION = 0.2;
const STAR_SIZE = 0.2;

/**
 * Generates a uniformly distributed starfield using spherical coordinates.
 * Uses the Fibonacci sphere algorithm for even distribution.
 */
export function getStarfield({
  count = DEFAULT_STAR_COUNT,
  texture = DEFAULT_STAR_TEXTURE,
}: StarfieldOptions = {}) {
  const positions: number[] = [];
  const colors: number[] = [];
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    // Random radius between min and max
    const radius =
      Math.random() * (STAR_RADIUS_MAX - STAR_RADIUS_MIN) + STAR_RADIUS_MIN;

    // Uniform sphere distribution using spherical coordinates
    const uniformU = Math.random();
    const uniformV = Math.random();
    const theta = 2 * Math.PI * uniformU;
    const phi = Math.acos(2 * uniformV - 1);

    // Convert spherical to Cartesian coordinates
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions.push(x, y, z);

    // Vary lightness for star brightness variation
    color.setHSL(STAR_HUE, STAR_SATURATION, Math.random());
    colors.push(color.r, color.g, color.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const pointsMaterial = new THREE.PointsMaterial({
    size: STAR_SIZE,
    vertexColors: true,
    map: new THREE.TextureLoader().load(texture),
  });

  return new THREE.Points(geometry, pointsMaterial);
}
