import * as THREE from 'three';

export const DUST_HI = 200;
export const DUST_LO = 110;
export const DUST_COLOR = 0xffffff;
export const DUST_SPREAD = 10;
export const DUST_BASE_SIZE = 100;
export const DUST_SPEED = 0.1;

export const COMET_WAIT_FIRST = 0.6;
export const COMET_WAIT_MIN = 22;
export const COMET_WAIT_MAX = 38;
export const COMET_FLIGHT = 4.2;
export const COMET_FROM = new THREE.Vector3(-3.1, 1.85, -6);
export const COMET_TO = new THREE.Vector3(2.4, -1.15, -18);

const COMET_COLOR = 0xffffff;

export type HeroAtmosphere = {
  group: THREE.Group;
  update: (dt: number, active: boolean) => void;
  setViewSize: (width: number, height: number, pixelRatio?: number) => void;
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
  const randoms = new Float32Array(count * 4);

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
    positions[i * 3] = x * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = z * radius;
    randoms[i * 4] = Math.random();
    randoms[i * 4 + 1] = Math.random();
    randoms[i * 4 + 2] = Math.random();
    randoms[i * 4 + 3] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 4));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(DUST_COLOR) },
      uTime: { value: 0 },
      uSpread: { value: DUST_SPREAD },
      uBaseSize: { value: DUST_BASE_SIZE },
      uField: { value: 1 },
    },
    vertexShader: `
      attribute vec4 aRandom;
      uniform float uTime;
      uniform float uSpread;
      uniform float uBaseSize;
      varying float vAlpha;
      void main() {
        vec3 pos = position * uSpread;
        pos.z = -abs(pos.z) * 10.0 - 4.0;
        vec4 world = modelMatrix * vec4(pos, 1.0);
        float t = uTime;
        world.x += sin(t * aRandom.z + 6.28 * aRandom.w) * mix(0.02, 0.07, aRandom.x);
        world.y += sin(t * aRandom.y + 6.28 * aRandom.x) * mix(0.02, 0.07, aRandom.w);
        vec4 mvPosition = viewMatrix * world;
        float sized =
          (uBaseSize * (1.0 + 0.35 * (aRandom.x - 0.5))) /
          max(length(mvPosition.xyz), 8.0);
        gl_PointSize = clamp(sized, 2.4, 7.5);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = 0.55 + 0.45 * aRandom.y;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uField;
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord.xy;
        float d = length(uv - vec2(0.5));
        float circle = smoothstep(0.5, 0.4, d) * 0.8;
        if (circle < 0.01) discard;
        gl_FragColor = vec4(uColor, uField * vAlpha * circle);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return { points, geometry, material };
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

  const linePositions = new Float32Array([
    COMET_FROM.x,
    COMET_FROM.y,
    COMET_FROM.z,
    COMET_TO.x,
    COMET_TO.y,
    COMET_TO.z,
  ]);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(linePositions, 3),
  );
  const lineMaterial = new THREE.LineBasicMaterial({
    color: COMET_COLOR,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  line.visible = false;
  line.frustumCulled = false;
  if (includeStreak) {
    group.add(line);
  }

  let wait = COMET_WAIT_FIRST;
  let flight = 0;
  let flying = false;
  let field = 1;
  let elapsed = 0;
  const head = new THREE.Vector3();
  const tail = new THREE.Vector3();

  const update = (dt: number, active: boolean) => {
    const target = active ? 1 : 0;
    field += (target - field) * (1 - Math.exp(-dt / 0.35));
    dust.material.uniforms.uField.value = field;
    if (field < 0.02) {
      group.visible = false;
      line.visible = false;
      return;
    }
    group.visible = true;

    if (active) {
      elapsed += dt * 1000 * DUST_SPEED;
      dust.material.uniforms.uTime.value = elapsed * 0.001;
    }
    dust.points.rotation.set(0, 0, 0);
    group.rotation.set(0, 0, 0);

    if (!includeStreak) return;

    if (!flying) {
      wait -= dt;
      line.visible = false;
      if (wait > 0 || !active) return;
      flying = true;
      flight = COMET_FLIGHT * 0.2;
      wait = randomInRange(COMET_WAIT_MIN, COMET_WAIT_MAX);
    }

    flight += dt;
    const t = Math.min(1, flight / COMET_FLIGHT);
    const fadeIn = smoothstep(0, 0.08, t);
    const fadeOut = 1 - smoothstep(0.78, 1, t);
    head.lerpVectors(COMET_FROM, COMET_TO, t);
    tail.lerpVectors(COMET_FROM, COMET_TO, Math.max(0, t - 0.22));
    linePositions[0] = tail.x;
    linePositions[1] = tail.y;
    linePositions[2] = tail.z;
    linePositions[3] = head.x;
    linePositions[4] = head.y;
    linePositions[5] = head.z;
    lineGeometry.attributes.position.needsUpdate = true;
    lineMaterial.opacity = 0.4 * fadeIn * fadeOut * field;
    line.visible = t > 0 && t < 1;

    if (flight >= COMET_FLIGHT) {
      flying = false;
      line.visible = false;
    }
  };

  const setViewSize = (_width: number, _height: number, pixelRatio = 1) => {
    dust.material.uniforms.uBaseSize.value = DUST_BASE_SIZE * pixelRatio;
  };

  const dispose = () => {
    dust.geometry.dispose();
    dust.material.dispose();
    lineGeometry.dispose();
    lineMaterial.dispose();
  };

  return { group, update, setViewSize, dispose };
}
