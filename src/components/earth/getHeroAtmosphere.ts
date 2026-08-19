import * as THREE from 'three';
import { easeMotion } from '../../utils/heroMotion';

const DUST_HI = 2400;
const DUST_LO = 800;
const DUST_COLOR = 0xd6dee8;
const DUST_OPACITY = 0.22;
const DUST_SIZE = 0.65;
const DUST_DRIFT = 0.00012;

const COMET_POINTS = 18;
const COMET_WAIT_MIN = 18;
const COMET_WAIT_MAX = 32;
const COMET_FLIGHT = 11;

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

  for (let i = 0; i < count; i += 1) {
    const radius = 3.1 + Math.random() * 3.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
    let z = radius * Math.cos(phi);
    if (z > -1.2) {
      z = -1.4 - Math.abs(z) * 0.55;
    }
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
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
  });

  const points = new THREE.Points(geometry, material);
  points.renderOrder = -1;
  return { points, geometry, material };
}

function createComet() {
  const positions = new Float32Array(COMET_POINTS * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: DUST_COLOR,
    size: 0.8,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
  });

  const points = new THREE.Points(geometry, material);
  points.renderOrder = -1;
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

  let wait = randomInRange(COMET_WAIT_MIN, COMET_WAIT_MAX);
  let flight = 0;
  let flying = false;
  const from = new THREE.Vector3(-13, 3.4, -11);
  const to = new THREE.Vector3(12, -2.6, -13);
  const scratch = new THREE.Vector3();

  const update = (dt: number, active: boolean) => {
    group.visible = active;
    if (!active) {
      if (comet) comet.points.visible = false;
      return;
    }

    dust.points.rotation.y += DUST_DRIFT;
    dust.points.rotation.x += DUST_DRIFT * 0.18;

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
      const trail = t - i * 0.012;
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
