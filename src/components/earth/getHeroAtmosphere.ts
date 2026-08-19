import * as THREE from 'three';

export const DUST_HI = 3600;
export const DUST_LO = 1400;
export const DUST_COLOR = 0xe8eef6;
export const DUST_OPACITY = 0.78;
export const DUST_SIZE = 2.6;

export const COMET_WAIT_FIRST = 0.4;
export const COMET_WAIT_MIN = 22;
export const COMET_WAIT_MAX = 38;
export const COMET_FLIGHT = 3.6;
export const COMET_FROM = new THREE.Vector3(-3.2, 3.28, -2.5);
export const COMET_TO = new THREE.Vector3(3.25, 2.92, -3.6);

const EARTH_RADIUS = 2.592;
const DUST_DRIFT = 0.00016;
const COMET_POINTS = 56;
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

function createSoftMaterial(
  color: number,
  opacity: number,
  size: number,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uSize: { value: size },
      uResolution: { value: new THREE.Vector2(1280, 720) },
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
      uniform vec2 uResolution;
      varying float vAlpha;
      void main() {
        vec2 center = uResolution * 0.5;
        float halfMin = 0.5 * min(uResolution.x, uResolution.y);
        float field = distance(gl_FragCoord.xy, center) / max(halfMin, 1.0);
        float edge = 1.0 - smoothstep(0.54, 0.86, field);
        if (edge < 0.02) discard;
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float d = length(p);
        if (d > 1.0) discard;
        float soft = 1.0 - smoothstep(0.08, 1.0, d);
        gl_FragColor = vec4(uColor, uOpacity * vAlpha * edge * soft);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
  });
}

function createDust(count: number) {
  const positions = new Float32Array(count * 3);
  const alphas = new Float32Array(count);
  let written = 0;

  while (written < count) {
    const radius = 3.2 + Math.random() * 2.35;
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
    if (inEarth || onFace || xy > 5.05) continue;

    positions[written * 3] = x;
    positions[written * 3 + 1] = y;
    positions[written * 3 + 2] = z;
    alphas[written] = 0.32 + 0.68 * smoothstep(4.85, 3.15, xy);
    written += 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

  const material = createSoftMaterial(DUST_COLOR, DUST_OPACITY, DUST_SIZE);
  const points = new THREE.Points(geometry, material);
  points.renderOrder = -1;
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

  const material = createSoftMaterial(COMET_COLOR, 0.95, 3.6);
  material.depthTest = false;
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
    const t = Math.min(1, flight / COMET_FLIGHT);
    const fadeIn = smoothstep(0, 0.05, t);
    const fadeOut = 1 - smoothstep(0.86, 1, t);
    comet.material.uniforms.uOpacity.value = 0.95 * fadeIn * fadeOut;
    comet.points.visible = t > 0 && t < 1;

    for (let i = 0; i < COMET_POINTS; i += 1) {
      const trail = t - i * 0.0048;
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

  const setViewSize = (width: number, height: number) => {
    const next = new THREE.Vector2(Math.max(1, width), Math.max(1, height));
    dust.material.uniforms.uResolution.value.copy(next);
    comet?.material.uniforms.uResolution.value.copy(next);
  };

  const dispose = () => {
    dust.geometry.dispose();
    dust.material.dispose();
    comet?.geometry.dispose();
    comet?.material.dispose();
  };

  return { group, update, setViewSize, dispose };
}
