import { type MutableRefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CAMERA_FOV, CAMERA_POSITION_Z, EARTH_RADIUS } from './earthGeometry';
import { getFresnelMaterial } from './getFresnelMaterial';
import {
  configureEarthTexture,
  pickEarthTextureTier,
} from './loadEarthTextures';

const EARTH_TILT_DEGREES = -23.4;
const EARTH_GEOMETRY_DETAIL = 12;

const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;

const NORMAL_SCALE = 0.65;
const CLOUDS_OPACITY = 0.72;
const CLOUDS_SCALE = 1.003;
const GLOW_SCALE = 1.01;

const LIGHT_INTENSITY = 2.0;
/** Camera-relative sun, behind-left: mostly night disk with a thin lit limb. */
const LIGHT_OFFSET = new THREE.Vector3(-5, 1.4, -1.6);
const FILL_COLOR = 0x9fb8ff;
const FILL_INTENSITY = 0.12;
/** Cool lift on the city lights so the night side reads. */
const CITY_LIGHTS_TINT = new THREE.Color().setRGB(1.5, 1.65, 1.95);
/** Opening longitude: Americas and the Atlantic face the viewer. */
const INITIAL_LONGITUDE = 2.18;

const DAMPING_FACTOR = 0.05;
const ROTATE_SPEED = 0.5;
const MAX_PIXEL_RATIO_HI = 2;
const MAX_PIXEL_RATIO_LO = 1.5;
/** Matches EXIT_MAX_WIDTH: phones cap at the low ratio whatever the tier. */
const COMPACT_QUERY = '(max-width: 768px)';

/** Radians per second. ~4 minutes per full Earth turn; clouds a little faster. */
const ROTATION_SPEED = {
  earth: (Math.PI * 2) / 240,
  clouds: (Math.PI * 2) / 210,
} as const;

export function EarthCanvas({
  paceRef,
  spin = 1,
  onReady,
  className,
}: {
  paceRef?: MutableRefObject<'full' | 'idle'>;
  /** Rotation multiplier. 0 holds the Earth still (reduced motion). */
  spin?: number;
  /** Fires once every texture is in and that frame has been drawn. */
  onReady?: () => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paceBag = useRef(paceRef);
  paceBag.current = paceRef;
  const spinRef = useRef(spin);
  spinRef.current = spin;
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    if (!containerRef.current) return;

    const sizes = {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      sizes.width / Math.max(1, sizes.height),
      CAMERA_NEAR,
      CAMERA_FAR,
    );
    camera.position.z = CAMERA_POSITION_Z;

    const tier = pickEarthTextureTier();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const anisotropy = Math.min(tier === 'hi' ? 8 : 4, maxAnisotropy);
    const compact = window.matchMedia?.(COMPACT_QUERY).matches ?? false;
    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        tier === 'hi' && !compact ? MAX_PIXEL_RATIO_HI : MAX_PIXEL_RATIO_LO,
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

    // Hold the opening pose until every map is in, so the first lit frame
    // matches the static poster it replaces.
    let texturesLoaded = false;
    let announced = false;
    const manager = new THREE.LoadingManager(() => {
      texturesLoaded = true;
    });
    const loader = new THREE.TextureLoader(manager);
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
      color: CITY_LIGHTS_TINT,
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

    for (const mesh of [earthMesh, lightsMesh, cloudsMesh, glowMesh]) {
      mesh.rotation.y = INITIAL_LONGITUDE;
    }

    const sunLight = new THREE.DirectionalLight(0xffffff, LIGHT_INTENSITY);
    const fillLight = new THREE.AmbientLight(FILL_COLOR, FILL_INTENSITY);
    scene.add(sunLight, fillLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = DAMPING_FACTOR;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.rotateSpeed = ROTATE_SPEED;

    let animationFrame = 0;
    let running = true;
    let frame = 0;
    let lastNow = performance.now();
    const animate = (now: number) => {
      if (!running) return;
      animationFrame = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      const idle = paceBag.current?.current === 'idle';
      controls.enabled = !idle;
      controls.update();

      const turn = texturesLoaded ? spinRef.current * dt : 0;
      earthMesh.rotation.y += ROTATION_SPEED.earth * turn;
      lightsMesh.rotation.y += ROTATION_SPEED.earth * turn;
      cloudsMesh.rotation.y += ROTATION_SPEED.clouds * turn;
      glowMesh.rotation.y += ROTATION_SPEED.earth * turn;

      frame += 1;
      if (idle && frame % 3 !== 0) {
        return;
      }

      const lightOffset = LIGHT_OFFSET.clone();
      lightOffset.applyQuaternion(camera.quaternion);
      sunLight.position.copy(lightOffset);
      renderer.render(scene, camera);

      if (texturesLoaded && !announced) {
        announced = true;
        readyRef.current?.();
      }
    };
    animate(lastNow);

    // Stop drawing once the globe has scrolled fully off-screen.
    const visibility =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            if (!entry) return;
            if (!entry.isIntersecting) {
              running = false;
              cancelAnimationFrame(animationFrame);
            } else if (!running) {
              running = true;
              lastNow = performance.now();
              animationFrame = requestAnimationFrame(animate);
            }
          });
    visibility?.observe(containerRef.current);

    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    // The dock resizes the box itself, so watch the element, not the window.
    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(handleResize);
    if (resizeObserver) {
      resizeObserver.observe(containerRef.current);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      visibility?.disconnect();
      resizeObserver?.disconnect();
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
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`earth__canvas${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    />
  );
}
