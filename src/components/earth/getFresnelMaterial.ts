import * as THREE from 'three';

type FresnelOptions = {
  rimColor?: string | number;
  facingColor?: string | number;
  bias?: number;
  scale?: number;
  power?: number;
};

export function getFresnelMaterial({
  rimColor = 0x0088ff,
  facingColor = 0x000000,
  bias = 0.1,
  scale = 1.0,
  power = 4.0,
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
      float f = clamp(vReflectionFactor, 0.0, 1.0);
      gl_FragColor = vec4(mix(color2, color1, vec3(f)), f * 0.3);
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
