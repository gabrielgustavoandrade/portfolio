import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getStarfield } from './earth/getStarfield';

// Constants
const CAMERA_FOV = 75;
const CAMERA_POSITION_Z = 5;
const STARFIELD_ROTATION_SPEED = -0.0002;

export function HeroStarfield() {
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
      0.1,
      1000,
    );
    camera.position.z = CAMERA_POSITION_Z;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(sizes.width, sizes.height);
    renderer.setClearColor(0x000000, 1);
    containerRef.current.appendChild(renderer.domElement);

    const stars = getStarfield();
    scene.add(stars);

    let animationFrame: number;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      stars.rotation.y += STARFIELD_ROTATION_SPEED;
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
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
      (stars.geometry as THREE.BufferGeometry).dispose();
      (stars.material as THREE.PointsMaterial).dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="hero__starfield" aria-hidden="true" />
  );
}
