import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getFresnelMaterial } from './getFresnelMaterial';

// Scene configuration
const EARTH_TEXTURE_PATH = '/textures/earth/';
const EARTH_RADIUS = 2.592;
const EARTH_TILT_DEGREES = -23.4;
const EARTH_GEOMETRY_DETAIL = 12;

// Camera configuration
const CAMERA_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;
const CAMERA_POSITION_Z = 5;

// Material configuration
const BUMP_SCALE = 0.04;
const CLOUDS_OPACITY = 0.8;
const CLOUDS_SCALE = 1.003;
const GLOW_SCALE = 1.01;

// Lighting configuration
const LIGHT_INTENSITY = 2.0;
const LIGHT_OFFSET_X = -5;

// Controls configuration
const DAMPING_FACTOR = 0.05;
const ROTATE_SPEED = 0.5;
const MAX_PIXEL_RATIO = 1.75;

// Animation configuration
const ROTATION_SPEED = {
  earth: 0.002,
  clouds: 0.0023,
} as const;

export function EarthCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.setSize(sizes.width, sizes.height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    containerRef.current.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.setPath(EARTH_TEXTURE_PATH);
    const loadTexture = (file: string, useSRGB = true) => {
      const texture = loader.load(file);
      if (useSRGB) {
        texture.colorSpace = THREE.SRGBColorSpace;
      }
      return texture;
    };

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = THREE.MathUtils.degToRad(EARTH_TILT_DEGREES);
    scene.add(earthGroup);

    const geometry = new THREE.IcosahedronGeometry(
      EARTH_RADIUS,
      EARTH_GEOMETRY_DETAIL,
    );
    const material = new THREE.MeshPhongMaterial({
      map: loadTexture('00_earthmap1k.jpg'),
      specularMap: loadTexture('02_earthspec1k.jpg'),
      bumpMap: loadTexture('01_earthbump1k.jpg', false),
      bumpScale: BUMP_SCALE,
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    const lightsMat = new THREE.MeshBasicMaterial({
      map: loadTexture('03_earthlights1k.jpg'),
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const lightsMesh = new THREE.Mesh(geometry, lightsMat);
    earthGroup.add(lightsMesh);

    const cloudsMat = new THREE.MeshStandardMaterial({
      map: loadTexture('04_earthcloudmap.jpg'),
      transparent: true,
      opacity: CLOUDS_OPACITY,
      blending: THREE.AdditiveBlending,
      alphaMap: loadTexture('05_earthcloudmaptrans.jpg', false),
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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = DAMPING_FACTOR;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = ROTATE_SPEED;

    let animationFrame: number;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      controls.update();

      // Update light position to always be to the left of the camera view
      const lightOffset = new THREE.Vector3(LIGHT_OFFSET_X, 0, 0);
      lightOffset.applyQuaternion(camera.quaternion);
      sunLight.position.copy(lightOffset);

      // Rotate Earth layers
      earthMesh.rotation.y += ROTATION_SPEED.earth;
      lightsMesh.rotation.y += ROTATION_SPEED.earth;
      cloudsMesh.rotation.y += ROTATION_SPEED.clouds;
      glowMesh.rotation.y += ROTATION_SPEED.earth;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      camera.aspect = clientWidth / clientHeight;
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
    };
  }, []);

  return <div ref={containerRef} className="hero__canvas" aria-hidden="true" />;
}
