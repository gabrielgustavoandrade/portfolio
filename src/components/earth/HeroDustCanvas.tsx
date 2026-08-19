import { type MutableRefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getHeroAtmosphere } from './getHeroAtmosphere';

const CAMERA_FOV = 15;
const CAMERA_Z = 20;

export function HeroDustCanvas({
  paceRef,
  compact = false,
}: {
  paceRef?: MutableRefObject<'full' | 'idle'>;
  compact?: boolean;
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
      sizes.width / Math.max(1, sizes.height),
      0.1,
      400,
    );
    camera.position.set(0, 0, CAMERA_Z);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = true;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    containerRef.current.appendChild(renderer.domElement);

    const atmosphere = getHeroAtmosphere({
      compact,
      includeStreak: true,
    });
    atmosphere.setViewSize(sizes.width, sizes.height, renderer.getPixelRatio());
    scene.add(atmosphere.group);

    let animationFrame = 0;
    let lastNow = performance.now();
    const animate = (now: number) => {
      animationFrame = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      const active = paceBag.current?.current !== 'idle';
      atmosphere.update(dt, active);
      renderer.render(scene, camera);
    };
    animate(lastNow);

    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      camera.aspect = clientWidth / Math.max(1, clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      atmosphere.setViewSize(
        clientWidth,
        clientHeight,
        renderer.getPixelRatio(),
      );
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      atmosphere.dispose();
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [compact]);

  return <div ref={containerRef} className="hero__dust" aria-hidden="true" />;
}
