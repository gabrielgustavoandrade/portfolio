import * as THREE from 'three';

type StarfieldOptions = {
  count?: number;
  texture?: string;
};

export function getStarfield({
  count = 1500,
  texture = '/textures/earth/stars/circle.png',
}: StarfieldOptions = {}) {
  const positions: number[] = [];
  const colors: number[] = [];
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions.push(x, y, z);
    color.setHSL(0.6, 0.2, Math.random());
    colors.push(color.r, color.g, color.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load(texture),
  });

  return new THREE.Points(geometry, pointsMaterial);
}
