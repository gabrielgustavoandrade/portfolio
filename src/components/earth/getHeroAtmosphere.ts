import * as THREE from 'three';
import { easeMotion } from '../../utils/heroMotion';

export const DUST_HI = 3600;
export const DUST_LO = 1400;

const EARTH_RADIUS = 2.592;
const DUST_COLOR = 0xe8eef6;
const DUST_OPACITY = 0.72;
const DUST_SIZE = 2.35;
const DUST_DRIFT = 0.00018;

const COMET_POINTS = 28;
const COMET_WAIT_FIRST = 1.6;
const COMET_WAIT_MIN = 14;
const COMET_WAIT_MAX = 26;
const COMET_FLIGHT = 7.5;

export type HeroAtmosphere = {
  group: THREE.Group;
  update: (dt: number, active: boolean) => void;
  dispose: () => void;
};

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createDust(count: number) {
  const positions = new Float32Array(count * 3);
  let written = 0;

  while (written < count) {
    const radius = 3.35 + Math.random() * 3.9;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta) * 0.78;
    let z = radius * Math.cos(phi);

    if (z > 1.15) {
      z = -Math.abs(z) * 0.45 - 0.8;
    }

    const radial = Math.hypot(x, y);
    const inEarth = Math.hypot(x, y, z) < EARTH_RADIUS + 0.35;
    const onFace = z > 0.6 && radial < EARTH_RADIUS + 0.15;
    if (inEarth || onFace) continue;

    positions[written * 3] = x;
    positions[written * 3 + 1] = y;
    positions[written * 3 + 2] = z;
    written += 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: DUST_COLOR,
    size: DUST_SIZE,
    sizeAttenuation: false,
    transparent: true,
    opacity: DUST_OPACITY,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
  });

  const points = new THREE.Points(geometry, material);
  points.renderOrder = -1;
  points.frustumCulled = false;
  return { points, geometry, material };
}

function createComet() {
  const positions = new Float32Array(COMET_POINTS * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xf2f6fb,
    size: 2.8,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.82,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
  });

  const points = new THREE.Points(geometry, material);
  points.renderOrder = -1;
  points.frustumCulled = false;
  points.visible = false;
  return { points, geometry, material, positions };
}

export function getHeroAtmosphere({
  compact,
  includeStreak,
}: {
  compact: boolean;
  includeStreak: boolean;
}): HeroAtmosphere {
  const group = new THREE.Group();
  const dust = createDust(compact ? DUST_LO : DUST_HI);
  group.add(dust.points);

  const comet = includeStreak ? createComet() : null;
  if (comet) {
    group.add(comet.points);
  }

  let wait = COMET_WAIT_FIRST;
  let flight = 0;
  let flying = false;
  const from = new THREE.Vector3(-8.5, 4.6, -3.4);
  const to = new THREE.Vector3(8.2, -3.8, -5.2);
  const scratch = new THREE.Vector3();

  const update = (dt: number, active: boolean) => {
    group.visible = active;
    if (!active) {
      if (comet) comet.points.visible = false;
      return;
    }

    dust.points.rotation.y += DUST_DRIFT;
    dust.points.rotation.x += DUST_DRIFT * 0.16;

    if (!comet) return;

    if (!flying) {
      wait -= dt;
      comet.points.visible = false;
      if (wait > 0) return;
      flying = true;
      flight = 0;
      wait = randomInRange(COMET_WAIT_MIN, COMET_WAIT_MAX);
    }

    flight += dt;
    const t = easeMotion(Math.min(1, flight / COMET_FLIGHT));
    comet.points.visible = t > 0 && t < 1;

    for (let i = 0; i < COMET_POINTS; i += 1) {
      const trail = t - i * 0.018;
      const u = Math.max(0, trail);
      scratch.lerpVectors(from, to, u);
      comet.positions[i * 3] = scratch.x;
      comet.positions[i * 3 + 1] = scratch.y;
      comet.positions[i * 3 + 2] = scratch.z;
    }
    comet.geometry.attributes.position.needsUpdate = true;

    if (flight >= COMET_FLIGHT) {
      flying = false;
      comet.points.visible = false;
    }
  };

  const dispose = () => {
    dust.geometry.dispose();
    dust.material.dispose();
    comet?.geometry.dispose();
    comet?.material.dispose();
  };

  return { group, update, dispose };
}
