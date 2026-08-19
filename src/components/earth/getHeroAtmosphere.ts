import * as THREE from 'three';

export const DUST_HI = 420;
export const DUST_LO = 160;
export const DUST_COLOR = 0xe8eef2;
export const DUST_OPACITY = 0.8;
export const DUST_SIZE = 2.4;

export const COMET_WAIT_FIRST = 0.55;
export const COMET_WAIT_MIN = 22;
export const COMET_WAIT_MAX = 38;
export const COMET_FLIGHT = 3.4;
export const COMET_FROM = new THREE.Vector3(-12.5, 5.4, -7);
export const COMET_TO = new THREE.Vector3(11.5, 3.8, -11);

const DUST_DRIFT = 0.00011;
const COMET_POINTS = 36;
const COMET_COLOR = 0xe8eef2;
const SPREAD_X = 18;
const SPREAD_Y = 12;
const SPREAD_Z = 16;

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

function createCircleMaterial(color: number, opacity: number, size: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uSize: { value: size },
      uField: { value: 1 },
    },
    vertexShader: `
      attribute float aAlpha;
      uniform float uSize;
      varying float vAlpha;
      varying float vEdge;
      void main() {
        vAlpha = aAlpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec4 clip = projectionMatrix * mvPosition;
        vec2 ndc = clip.xy / max(clip.w, 0.0001);
        float edgeX = 1.0 - smoothstep(0.8, 0.97, abs(ndc.x));
        float edgeY = 1.0 - smoothstep(0.8, 0.97, abs(ndc.y));
        vEdge = edgeX * edgeY;
        gl_PointSize = uSize;
        gl_Position = clip;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uField;
      varying float vAlpha;
      varying float vEdge;
      void main() {
        vec2 uv = gl_PointCoord.xy;
        float d = length(uv - vec2(0.5));
        float circle = smoothstep(0.5, 0.4, d) * 0.8;
        if (circle < 0.01 || vEdge < 0.01) discard;
        gl_FragColor = vec4(uColor, uOpacity * uField * vAlpha * vEdge * circle);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
  });
}

function createDust(count: number) {
  const positions = new Float32Array(count * 3);
  const alphas = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    let x = 0;
    let y = 0;
    let z = 0;
    let len = 0;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
      len = x * x + y * y + z * z;
    } while (len > 1 || len === 0);

    const radius = Math.cbrt(Math.random());
    positions[i * 3] = x * radius * SPREAD_X;
    positions[i * 3 + 1] = y * radius * SPREAD_Y;
    positions[i * 3 + 2] = -Math.abs(z * radius * SPREAD_Z) - 2.4;
    alphas[i] = 0.35 + Math.random() * 0.65;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

  const material = createCircleMaterial(DUST_COLOR, DUST_OPACITY, DUST_SIZE);
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return { points, geometry, material };
}

function createComet() {
  const positions = new Float32Array(COMET_POINTS * 3);
  const alphas = new Float32Array(COMET_POINTS);
  for (let i = 0; i < COMET_POINTS; i += 1) {
    const fade = 1 - i / (COMET_POINTS - 1);
    alphas[i] = fade * fade;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

  const material = createCircleMaterial(COMET_COLOR, 0.92, 3.1);
  const points = new THREE.Points(geometry, material);
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
  let field = 1;
  const scratch = new THREE.Vector3();

  const update = (dt: number, active: boolean) => {
    const target = active ? 1 : 0;
    field += (target - field) * (1 - Math.exp(-dt / 0.35));
    dust.material.uniforms.uField.value = field;
    if (field < 0.02) {
      group.visible = false;
      if (comet) comet.points.visible = false;
      return;
    }
    group.visible = true;

    dust.points.rotation.y += DUST_DRIFT;
    dust.points.rotation.x += DUST_DRIFT * 0.12;

    if (!comet) return;

    if (!flying) {
      wait -= dt;
      comet.points.visible = false;
      if (wait > 0 || !active) return;
      flying = true;
      flight = 0;
      wait = randomInRange(COMET_WAIT_MIN, COMET_WAIT_MAX);
    }

    flight += dt;
    const t = Math.min(1, flight / COMET_FLIGHT);
    const fadeIn = smoothstep(0, 0.06, t);
    const fadeOut = 1 - smoothstep(0.84, 1, t);
    comet.material.uniforms.uOpacity.value = 0.92 * fadeIn * fadeOut;
    comet.material.uniforms.uField.value = field;
    comet.points.visible = t > 0 && t < 1;

    for (let i = 0; i < COMET_POINTS; i += 1) {
      const u = THREE.MathUtils.clamp(t - i * 0.008, 0, 1);
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
