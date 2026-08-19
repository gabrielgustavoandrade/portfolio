import * as THREE from 'three';
import { easeMotion } from '../../utils/heroMotion';

export const DUST_HI = 3600;
export const DUST_LO = 1400;
export const DUST_COLOR = 0xe8eef6;
export const DUST_OPACITY = 0.76;
export const DUST_SIZE = 2.55;

export const COMET_WAIT_FIRST = 0.35;
export const COMET_WAIT_MIN = 22;
export const COMET_WAIT_MAX = 38;
export const COMET_FLIGHT = 3.8;
export const COMET_FROM = new THREE.Vector3(-3.35, 3.35, -2.6);
export const COMET_TO = new THREE.Vector3(3.4, 2.85, -3.8);

const EARTH_RADIUS = 2.592;
const DUST_DRIFT = 0.00016;
const COMET_POINTS = 48;
const COMET_COLOR = 0xeef3f9;

export type HeroAtmosphere = {
  group: THREE.Group;
  update: (dt: number, active: boolean) => void;
  setViewSize: (width: number, height: number) => void;
  dispose: () => void;
};

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function createDust(count: number) {
  const positions = new Float32Array(count * 3);
  const alphas = new Float32Array(count);
  let written = 0;

  while (written < count) {
    const radius = 3.2 + Math.random() * 2.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta) * 0.86;
    let z = radius * Math.cos(phi);

    if (z > 0.65) {
      z = -Math.abs(z) * 0.6 - 0.8;
    }

    const xy = Math.hypot(x, y);
    const inEarth = Math.hypot(x, y, z) < EARTH_RADIUS + 0.42;
    const onFace = z > 0.35 && xy < EARTH_RADIUS + 0.24;
    if (inEarth || onFace || xy > 5.1) continue;

    positions[written * 3] = x;
    positions[written * 3 + 1] = y;
    positions[written * 3 + 2] = z;
    alphas[written] = 0.3 + 0.7 * smoothstep(4.9, 3.15, xy);
    written += 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(DUST_COLOR) },
      uOpacity: { value: DUST_OPACITY },
      uSize: { value: DUST_SIZE },
    },
    vertexShader: `
      attribute float aAlpha;
      uniform float uSize;
      varying float vAlpha;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec4 clip = projectionMatrix * mvPosition;
        vec2 ndc = clip.xy / max(clip.w, 0.0001);
        float radial = length(ndc);
        float edge = 1.0 - smoothstep(0.5, 0.78, radial);
        vAlpha = aAlpha * edge;
        gl_PointSize = uSize;
        gl_Position = clip;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;
      void main() {
        if (vAlpha < 0.012) discard;
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float d = length(p);
        if (d > 1.0) discard;
        float soft = 1.0 - smoothstep(0.08, 1.0, d);
        gl_FragColor = vec4(uColor, uOpacity * vAlpha * soft);
      }
    `,
    transparent: true,
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
    color: COMET_COLOR,
    size: 3.4,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
  });

  const points = new THREE.Points(geometry, material);
  points.renderOrder = 2;
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
  const scratch = new THREE.Vector3();

  const update = (dt: number, active: boolean) => {
    group.visible = active;
    if (!active) {
      if (comet) comet.points.visible = false;
      return;
    }

    dust.points.rotation.y += DUST_DRIFT;
    dust.points.rotation.x += DUST_DRIFT * 0.14;

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
    const raw = Math.min(1, flight / COMET_FLIGHT);
    const t = easeMotion(raw);
    const fadeIn = smoothstep(0, 0.06, raw);
    const fadeOut = 1 - smoothstep(0.84, 1, raw);
    comet.material.opacity = 0.94 * fadeIn * fadeOut;
    comet.points.visible = raw > 0 && raw < 1;

    for (let i = 0; i < COMET_POINTS; i += 1) {
      const trail = t - i * 0.0075;
      const u = THREE.MathUtils.clamp(trail, 0, 1);
      scratch.lerpVectors(COMET_FROM, COMET_TO, u);
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

  const setViewSize = () => undefined;

  const dispose = () => {
    dust.geometry.dispose();
    dust.material.dispose();
    comet?.geometry.dispose();
    comet?.material.dispose();
  };

  return { group, update, setViewSize, dispose };
}
