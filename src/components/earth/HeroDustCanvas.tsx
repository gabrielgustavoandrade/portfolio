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
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, compact ? 1.5 : 2),
    );
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
    let running = true;
    let lastNow = performance.now();
    const animate = (now: number) => {
      if (!running) return;
      animationFrame = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      const active = paceBag.current?.current !== 'idle';
      atmosphere.update(dt, active);
      renderer.render(scene, camera);
    };
    animate(lastNow);

    // The dust lives in the hero; nothing to draw once it scrolls away.
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

    // iOS Safari fires resize on every address-bar collapse/expand. The hero
    // is sized in svh so the box doesn't change, but renderer.setSize would
    // still reallocate the drawing buffer and stall the GPU mid-scroll, so
    // only resize when the box really changed.
    const touch = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    if (touch) {
      renderer.domElement.style.height = `${sizes.height}px`;
      containerRef.current.style.overflow = 'hidden';
    }
    let lastW = sizes.width;
    let lastH = sizes.height;
    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;
      // Touch: height-only changes are the toolbar. Keep the buffer at the
      // tallest height seen (the container clips it) and never reallocate.
      if (touch && clientWidth === lastW && clientHeight <= lastH) return;
      if (clientWidth === lastW && clientHeight === lastH) return;
      lastW = clientWidth;
      lastH = touch ? Math.max(lastH, clientHeight) : clientHeight;
      if (touch) {
        camera.aspect = clientWidth / Math.max(1, lastH);
        camera.updateProjectionMatrix();
        renderer.domElement.style.height = `${lastH}px`;
        renderer.setSize(clientWidth, lastH, false);
        atmosphere.setViewSize(clientWidth, lastH, renderer.getPixelRatio());
        return;
      }
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
      running = false;
      cancelAnimationFrame(animationFrame);
      visibility?.disconnect();
      window.removeEventListener('resize', handleResize);
      atmosphere.dispose();
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [compact]);

  return <div ref={containerRef} className="hero__dust" aria-hidden="true" />;
}
