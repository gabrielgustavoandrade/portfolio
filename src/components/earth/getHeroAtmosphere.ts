import * as THREE from 'three';
import { easeMotion } from '../../utils/heroMotion';

export const DUST_HI = 3600;
export const DUST_LO = 1400;
export const DUST_COLOR = 0xe8eef6;
export const DUST_OPACITY = 0.74;
export const DUST_SIZE = 2.5;

export const COMET_WAIT_FIRST = 0.65;
export const COMET_WAIT_MIN = 22;
export const COMET_WAIT_MAX = 38;
export const COMET_FLIGHT = 3.6;
export const COMET_FROM = new THREE.Vector3(-3.15, 3.1, -2.8);
export const COMET_TO = new THREE.Vector3(3.2, 2.15, -4.0);

const EARTH_RADIUS = 2.592;
const DUST_DRIFT = 0.00016;
const COMET_COLOR = 0xeef3f9;
const Y_AXIS = new THREE.Vector3(0, 1, 0);

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
    const radius = 3.15 + Math.random() * 2.7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta) * 0.84;
    let z = radius * Math.cos(phi);

    if (z > 0.7) {
      z = -Math.abs(z) * 0.58 - 0.75;
    }

    const xy = Math.hypot(x, y);
    const inEarth = Math.hypot(x, y, z) < EARTH_RADIUS + 0.4;
    const onFace = z > 0.4 && xy < EARTH_RADIUS + 0.22;
    if (inEarth || onFace || xy > 5.4) continue;

    positions[written * 3] = x;
    positions[written * 3 + 1] = y;
    positions[written * 3 + 2] = z;
    alphas[written] = 0.28 + 0.72 * smoothstep(5.2, 3.2, xy);
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
        float edge = 1.0 - smoothstep(0.58, 0.9, radial);
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
        if (vAlpha < 0.01) discard;
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float d = length(p);
        if (d > 1.0) discard;
        float soft = 1.0 - smoothstep(0.1, 1.0, d);
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
  const geometry = new THREE.CylinderGeometry(0.02, 0.004, 1, 8, 1, true);
  const material = new THREE.MeshBasicMaterial({
    color: COMET_COLOR,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = -1;
  mesh.frustumCulled = false;
  mesh.visible = false;
  return { mesh, geometry, material };
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
    group.add(comet.mesh);
  }

  let wait = COMET_WAIT_FIRST;
  let flight = 0;
  let flying = false;
  const head = new THREE.Vector3();
  const tail = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const update = (dt: number, active: boolean) => {
    group.visible = active;
    if (!active) {
      if (comet) comet.mesh.visible = false;
      return;
    }

    dust.points.rotation.y += DUST_DRIFT;
    dust.points.rotation.x += DUST_DRIFT * 0.14;

    if (!comet) return;

    if (!flying) {
      wait -= dt;
      comet.mesh.visible = false;
      if (wait > 0) return;
      flying = true;
      flight = 0;
      wait = randomInRange(COMET_WAIT_MIN, COMET_WAIT_MAX);
    }

    flight += dt;
    const t = easeMotion(Math.min(1, flight / COMET_FLIGHT));
    const fadeIn = smoothstep(0, 0.07, t);
    const fadeOut = 1 - smoothstep(0.8, 1, t);
    comet.material.opacity = 0.9 * fadeIn * fadeOut;

    head.lerpVectors(COMET_FROM, COMET_TO, t);
    tail.lerpVectors(COMET_FROM, COMET_TO, Math.max(0, t - 0.18));
    dir.subVectors(head, tail);
    const len = Math.max(0.22, dir.length());
    comet.mesh.position.copy(head).add(tail).multiplyScalar(0.5);
    comet.mesh.quaternion.setFromUnitVectors(Y_AXIS, dir.normalize());
    comet.mesh.scale.set(1, len, 1);
    comet.mesh.visible = t > 0 && t < 1;

    if (flight >= COMET_FLIGHT) {
      flying = false;
      comet.mesh.visible = false;
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
