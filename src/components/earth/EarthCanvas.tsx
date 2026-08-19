import { type MutableRefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getFresnelMaterial } from './getFresnelMaterial';
import { getHeroAtmosphere } from './getHeroAtmosphere';
import {
  configureEarthTexture,
  pickEarthTextureTier,
} from './loadEarthTextures';

// Scene configuration
const EARTH_RADIUS = 2.592;
const EARTH_TILT_DEGREES = -23.4;
const EARTH_GEOMETRY_DETAIL = 12;

// Camera configuration
const CAMERA_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;
const CAMERA_POSITION_Z = 5;

// Material configuration
const NORMAL_SCALE = 0.65;
const CLOUDS_OPACITY = 0.72;
const CLOUDS_SCALE = 1.003;
const GLOW_SCALE = 1.01;

// Lighting configuration
const LIGHT_INTENSITY = 2.0;
const LIGHT_OFFSET_X = -5;

// Controls configuration
const DAMPING_FACTOR = 0.05;
const ROTATE_SPEED = 0.5;
const MAX_PIXEL_RATIO_HI = 2;
const MAX_PIXEL_RATIO_LO = 1.5;

// Animation configuration
const ROTATION_SPEED = {
  earth: 0.002,
  clouds: 0.0023,
} as const;

export function EarthCanvas({
  paceRef,
  reducedMotion = false,
}: {
  paceRef?: MutableRefObject<'full' | 'idle'>;
  reducedMotion?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paceBag = useRef(paceRef);
  paceBag.current = paceRef;

  useEffect(() => {
    if (!containerRef.current) return;

    const sizes = {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      sizes.width / sizes.height,
      CAMERA_NEAR,
      CAMERA_FAR,
    );
    camera.position.z = CAMERA_POSITION_Z;

    const tier = pickEarthTextureTier();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const anisotropy = Math.min(tier === 'hi' ? 8 : 4, maxAnisotropy);
    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        tier === 'hi' ? MAX_PIXEL_RATIO_HI : MAX_PIXEL_RATIO_LO,
      ),
    );
    renderer.setSize(sizes.width, sizes.height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    containerRef.current.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.setPath(`/textures/earth/${tier}/`);
    const loadMap = (file: string, color: boolean) => {
      const texture = loader.load(file);
      return configureEarthTexture(texture, { color, anisotropy });
    };

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = THREE.MathUtils.degToRad(EARTH_TILT_DEGREES);
    scene.add(earthGroup);

    const geometry = new THREE.IcosahedronGeometry(
      EARTH_RADIUS,
      EARTH_GEOMETRY_DETAIL,
    );
    const dayMap = loadMap('earthmap.jpg', true);
    const specMap = loadMap('earthspec.jpg', false);
    const normalMap = loadMap('earthnormal.jpg', false);
    const nightMap = loadMap('earthlights.jpg', true);
    const cloudMap = loadMap('earthclouds.jpg', true);

    const material = new THREE.MeshPhongMaterial({
      map: dayMap,
      specularMap: specMap,
      normalMap,
      normalScale: new THREE.Vector2(NORMAL_SCALE, NORMAL_SCALE),
      specular: new THREE.Color(0x1a1a1a),
      shininess: 14,
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    const lightsMat = new THREE.MeshBasicMaterial({
      map: nightMap,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    const lightsMesh = new THREE.Mesh(geometry, lightsMat);
    earthGroup.add(lightsMesh);

    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudMap,
      alphaMap: cloudMap,
      transparent: true,
      opacity: CLOUDS_OPACITY,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
    cloudsMesh.scale.setScalar(CLOUDS_SCALE);
    earthGroup.add(cloudsMesh);

    const fresnelMat = getFresnelMaterial();
    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(GLOW_SCALE);
    earthGroup.add(glowMesh);

    const sunLight = new THREE.DirectionalLight(0xffffff, LIGHT_INTENSITY);
    scene.add(sunLight);

    const compact = tier === 'lo';
    const atmosphere = reducedMotion
      ? null
      : getHeroAtmosphere({
          compact,
          includeStreak: true,
        });
    if (atmosphere) {
      atmosphere.setViewSize(sizes.width, sizes.height);
      scene.add(atmosphere.group);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = DAMPING_FACTOR;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = ROTATE_SPEED;

    let animationFrame: number;
    let frame = 0;
    let lastNow = performance.now();
    const animate = (now: number) => {
      animationFrame = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      const idle = paceBag.current?.current === 'idle';
      controls.enabled = !idle;
      controls.update();

      earthMesh.rotation.y += ROTATION_SPEED.earth;
      lightsMesh.rotation.y += ROTATION_SPEED.earth;
      cloudsMesh.rotation.y += ROTATION_SPEED.clouds;
      glowMesh.rotation.y += ROTATION_SPEED.earth;
      atmosphere?.update(dt, !idle);

      frame += 1;
      if (idle && frame % 3 !== 0) {
        return;
      }

      const lightOffset = new THREE.Vector3(LIGHT_OFFSET_X, 0, 0);
      lightOffset.applyQuaternion(camera.quaternion);
      sunLight.position.copy(lightOffset);
      renderer.render(scene, camera);
    };
    animate(lastNow);

    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      atmosphere?.setViewSize(clientWidth, clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      lightsMat.dispose();
      cloudsMat.dispose();
      fresnelMat.dispose();
      dayMap.dispose();
      specMap.dispose();
      normalMap.dispose();
      nightMap.dispose();
      cloudMap.dispose();
      atmosphere?.dispose();
    };
  }, [reducedMotion]);

  return <div ref={containerRef} className="hero__canvas" aria-hidden="true" />;
}
