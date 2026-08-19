import {
  type MutableRefObject,
  type RefObject,
  useEffect,
  useRef,
} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getFresnelMaterial } from './getFresnelMaterial';
import {
  configureEarthTexture,
  pickEarthTextureTier,
} from './loadEarthTextures';

const EARTH_RADIUS = 2.592;
const EARTH_TILT_DEGREES = -23.4;
const EARTH_GEOMETRY_DETAIL = 12;
const EARTH_FILL = 0.73;

const CAMERA_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;
const CAMERA_POSITION_Z = 5;

const NORMAL_SCALE = 0.65;
const CLOUDS_OPACITY = 0.72;
const CLOUDS_SCALE = 1.003;
const GLOW_SCALE = 1.01;

const LIGHT_INTENSITY = 2.0;
const LIGHT_OFFSET_X = -5;

const DAMPING_FACTOR = 0.05;
const ROTATE_SPEED = 0.5;
const MAX_PIXEL_RATIO_HI = 2;
const MAX_PIXEL_RATIO_LO = 1.5;

const ROTATION_SPEED = {
  earth: 0.002,
  clouds: 0.0023,
} as const;

function fitEarthToHit(pose: THREE.Group, host: DOMRect, hit: DOMRect) {
  if (host.width < 2 || host.height < 2 || hit.width < 2) return;

  const ndcX = ((hit.left + hit.width / 2 - host.left) / host.width) * 2 - 1;
  const ndcY = -(((hit.top + hit.height / 2 - host.top) / host.height) * 2 - 1);
  const viewHalfH =
    CAMERA_POSITION_Z * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV * 0.5));
  const halfW = viewHalfH * (host.width / host.height);

  pose.position.set(ndcX * halfW, ndcY * viewHalfH, 0);

  const targetPx = hit.width * EARTH_FILL;
  const currentPx = (EARTH_RADIUS / viewHalfH) * (host.height / 2);
  pose.scale.setScalar(targetPx / Math.max(currentPx, 0.0001));
}

export function EarthCanvas({
  paceRef,
  globeRef,
}: {
  paceRef?: MutableRefObject<'full' | 'idle'>;
  globeRef?: RefObject<HTMLDivElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paceBag = useRef(paceRef);
  const globeBag = useRef(globeRef);
  paceBag.current = paceRef;
  globeBag.current = globeRef;

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
    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        tier === 'hi' ? MAX_PIXEL_RATIO_HI : MAX_PIXEL_RATIO_LO,
      ),
    );
    renderer.setSize(sizes.width, sizes.height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
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

    const pose = new THREE.Group();
    scene.add(pose);

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = THREE.MathUtils.degToRad(EARTH_TILT_DEGREES);
    pose.add(earthGroup);

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

    const hit = globeBag.current?.current ?? renderer.domElement;
    const controls = new OrbitControls(camera, hit);
    controls.enableDamping = true;
    controls.dampingFactor = DAMPING_FACTOR;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = ROTATE_SPEED;

    const cameraOffset = new THREE.Vector3();

    let animationFrame: number;
    let frame = 0;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      const idle = paceBag.current?.current === 'idle';
      const host = containerRef.current?.getBoundingClientRect();
      const globe = globeBag.current?.current?.getBoundingClientRect();
      if (host && globe) {
        cameraOffset.copy(camera.position).sub(controls.target);
        fitEarthToHit(pose, host, globe);
        controls.target.copy(pose.position);
        camera.position.copy(pose.position).add(cameraOffset);
      }
      controls.enabled = !idle;
      controls.update();

      earthMesh.rotation.y += ROTATION_SPEED.earth;
      lightsMesh.rotation.y += ROTATION_SPEED.earth;
      cloudsMesh.rotation.y += ROTATION_SPEED.clouds;
      glowMesh.rotation.y += ROTATION_SPEED.earth;

      frame += 1;
      if (idle && frame % 3 !== 0) {
        return;
      }

      const lightOffset = new THREE.Vector3(LIGHT_OFFSET_X, 0, 0);
      lightOffset.applyQuaternion(camera.quaternion);
      sunLight.position.copy(lightOffset);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      camera.aspect = clientWidth / Math.max(1, clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
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
    };
  }, []);

  return <div ref={containerRef} className="hero__earth" aria-hidden="true" />;
}
