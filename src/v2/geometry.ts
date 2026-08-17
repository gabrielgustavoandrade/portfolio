import * as THREE from 'three';

export function roundedRectShape(
  width: number,
  height: number,
  radius: number,
) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const corner = Math.min(radius, halfWidth, halfHeight);
  const shape = new THREE.Shape();

  shape.moveTo(-halfWidth + corner, -halfHeight);
  shape.lineTo(halfWidth - corner, -halfHeight);
  shape.quadraticCurveTo(
    halfWidth,
    -halfHeight,
    halfWidth,
    -halfHeight + corner,
  );
  shape.lineTo(halfWidth, halfHeight - corner);
  shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - corner, halfHeight);
  shape.lineTo(-halfWidth + corner, halfHeight);
  shape.quadraticCurveTo(
    -halfWidth,
    halfHeight,
    -halfWidth,
    halfHeight - corner,
  );
  shape.lineTo(-halfWidth, -halfHeight + corner);
  shape.quadraticCurveTo(
    -halfWidth,
    -halfHeight,
    -halfWidth + corner,
    -halfHeight,
  );

  return shape;
}

export function makeRoundedBox(
  width: number,
  height: number,
  depth: number,
  radius: number,
) {
  const shape = roundedRectShape(width, height, radius);
  const bevel = Math.min(0.055, radius * 0.35);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 6,
  });
  geometry.center();
  return geometry;
}
