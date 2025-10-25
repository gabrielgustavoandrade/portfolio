import * as THREE from 'three';

type FresnelOptions = {
  rimColor?: string | number;
  facingColor?: string | number;
  bias?: number;
  scale?: number;
  power?: number;
};

// Fresnel effect configuration
const DEFAULT_RIM_COLOR = 0x0088ff; // Blue atmospheric glow
const DEFAULT_FACING_COLOR = 0x000000; // Black (transparent)
const DEFAULT_BIAS = 0.1;
const DEFAULT_SCALE = 1.0;
const DEFAULT_POWER = 4.0;
const GLOW_OPACITY_MULTIPLIER = 0.3; // Controls overall glow transparency

export function getFresnelMaterial({
  rimColor = DEFAULT_RIM_COLOR,
  facingColor = DEFAULT_FACING_COLOR,
  bias = DEFAULT_BIAS,
  scale = DEFAULT_SCALE,
  power = DEFAULT_POWER,
}: FresnelOptions = {}) {
  const uniforms = {
    color1: { value: new THREE.Color(rimColor) },
    color2: { value: new THREE.Color(facingColor) },
    fresnelBias: { value: bias },
    fresnelScale: { value: scale },
    fresnelPower: { value: power },
  } satisfies Record<string, { value: THREE.Color | number }>;

  const vertexShader = /* glsl */ `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;

    varying float vReflectionFactor;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);

      vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);

      vec3 I = worldPosition.xyz - cameraPosition;

      vReflectionFactor = fresnelBias + fresnelScale * pow(1.0 + dot(normalize(I), worldNormal), fresnelPower);

      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform vec3 color1;
    uniform vec3 color2;
    varying float vReflectionFactor;

    void main() {
      // Clamp the reflection factor between 0 and 1
      float f = clamp(vReflectionFactor, 0.0, 1.0);

      // Mix colors and apply opacity multiplier for subtle glow effect
      gl_FragColor = vec4(mix(color2, color1, vec3(f)), f * ${GLOW_OPACITY_MULTIPLIER.toFixed(1)});
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
}
