import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { easeMotion } from '../../utils/heroMotion';

export const DUST_HI = 3600;
export const DUST_LO = 1400;
export const DUST_COLOR = 0xe8eef6;
export const DUST_OPACITY = 0.7;
export const DUST_SIZE = 2.4;

export const COMET_WAIT_FIRST = 0.7;
export const COMET_WAIT_MIN = 22;
export const COMET_WAIT_MAX = 38;
export const COMET_FLIGHT = 3.4;
export const COMET_FROM = new THREE.Vector3(-3.2, 3.05, -2.7);
export const COMET_TO = new THREE.Vector3(3.25, 2.2, -3.9);

const EARTH_RADIUS = 2.592;
const DUST_DRIFT = 0.00016;
const COMET_POINTS = 36;
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
    const radius = 3.1 + Math.random() * 2.05;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta) * 0.82;
    let z = radius * Math.cos(phi);

    if (z > 0.85) {
      z = -Math.abs(z) * 0.55 - 0.7;
    }

    const xy = Math.hypot(x, y);
    const depthSlack = Math.max(0, -z) * 0.22;
    const maxXy = 3.28 + depthSlack;
    const inEarth = Math.hypot(x, y, z) < EARTH_RADIUS + 0.38;
    const onFace = z > 0.45 && xy < EARTH_RADIUS + 0.2;
    if (inEarth || onFace || xy > maxXy) continue;

    positions[written * 3] = x;
    positions[written * 3 + 1] = y;
    positions[written * 3 + 2] = z;
    alphas[written] = 0.22 + 0.78 * smoothstep(maxXy, maxXy * 0.58, xy);
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
        vAlpha = aAlpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;
      void main() {
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float d = length(p);
        if (d > 1.0) discard;
        float soft = 1.0 - smoothstep(0.12, 1.0, d);
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
  const colors = new Float32Array(COMET_POINTS * 3);
  const color = new THREE.Color(COMET_COLOR);

  for (let i = 0; i < COMET_POINTS; i += 1) {
    const fade = 1 - i / (COMET_POINTS - 1);
    const strength = fade * fade;
    colors[i * 3] = color.r * strength;
    colors[i * 3 + 1] = color.g * strength;
    colors[i * 3 + 2] = color.b * (0.96 + 0.04 * strength);
  }

  const geometry = new LineGeometry();
  geometry.setPositions(Array.from(positions));
  geometry.setColors(Array.from(colors));

  const material = new LineMaterial({
    color: COMET_COLOR,
    linewidth: 1.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.86,
    dashed: false,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
    worldUnits: false,
  });
  material.resolution.set(1280, 720);

  const line = new Line2(geometry, material);
  line.renderOrder = -1;
  line.frustumCulled = false;
  line.visible = false;
  line.computeLineDistances();
  return { line, geometry, material, positions, colors };
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
    group.add(comet.line);
  }

  let wait = COMET_WAIT_FIRST;
  let flight = 0;
  let flying = false;
  const scratch = new THREE.Vector3();

  const writeTrail = (t: number) => {
    if (!comet) return;
    for (let i = 0; i < COMET_POINTS; i += 1) {
      const trail = t - i * 0.012;
      const u = THREE.MathUtils.clamp(trail, 0, 1);
      scratch.lerpVectors(COMET_FROM, COMET_TO, u);
      comet.positions[i * 3] = scratch.x;
      comet.positions[i * 3 + 1] = scratch.y;
      comet.positions[i * 3 + 2] = scratch.z;
    }
    comet.geometry.setPositions(Array.from(comet.positions));
    comet.line.computeLineDistances();
  };

  const update = (dt: number, active: boolean) => {
    group.visible = active;
    if (!active) {
      if (comet) comet.line.visible = false;
      return;
    }

    dust.points.rotation.y += DUST_DRIFT;
    dust.points.rotation.x += DUST_DRIFT * 0.14;

    if (!comet) return;

    if (!flying) {
      wait -= dt;
      comet.line.visible = false;
      if (wait > 0) return;
      flying = true;
      flight = 0;
      wait = randomInRange(COMET_WAIT_MIN, COMET_WAIT_MAX);
    }

    flight += dt;
    const t = easeMotion(Math.min(1, flight / COMET_FLIGHT));
    const fadeIn = smoothstep(0, 0.08, t);
    const fadeOut = 1 - smoothstep(0.82, 1, t);
    comet.material.opacity = 0.86 * fadeIn * fadeOut;
    comet.line.visible = t > 0 && t < 1;
    writeTrail(t);

    if (flight >= COMET_FLIGHT) {
      flying = false;
      comet.line.visible = false;
    }
  };

  const setViewSize = (width: number, height: number) => {
    comet?.material.resolution.set(Math.max(1, width), Math.max(1, height));
  };

  const dispose = () => {
    dust.geometry.dispose();
    dust.material.dispose();
    comet?.geometry.dispose();
    comet?.material.dispose();
  };

  return { group, update, setViewSize, dispose };
}
