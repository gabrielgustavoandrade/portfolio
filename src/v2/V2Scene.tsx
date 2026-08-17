import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { PalacioFragment } from './PalacioFragment';
import { TeatroMass } from './TeatroMass';
import type { V2Hover, V2Look } from './useV2Motion';

interface V2SceneProps {
  intro: number;
  scroll: number;
  look: V2Look;
  hover: V2Hover;
  workOpen: boolean;
  reducedMotion: boolean;
  onHover: (target: 'teatro' | 'palacio' | null) => void;
}

function CameraRig({
  scroll,
  look,
  workOpen,
}: {
  scroll: number;
  look: V2Look;
  workOpen: boolean;
}) {
  const lookTarget = useRef(new THREE.Vector3(0, 0.12, 0));
  const { camera } = useThree();

  useFrame((_, delta) => {
    const recede = workOpen ? 1 : scroll;
    const targetX = 0;
    const targetY = THREE.MathUtils.lerp(0.95, 2.35, recede);
    const targetZ = THREE.MathUtils.lerp(7.6, 14.2, recede);

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetX,
      4,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetY,
      4,
      delta,
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetZ,
      4,
      delta,
    );

    lookTarget.current.set(look.x * 0.48, look.y * 0.22 - 0.35, 0);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.26} color="#6d8290" />
      <hemisphereLight args={['#f0c27a', '#13232c', 0.42]} />
      <directionalLight
        position={[-6.2, 3.4, 4.2]}
        intensity={2.15}
        color="#ffb067"
      />
      <directionalLight
        position={[4.8, 1.4, 2.2]}
        intensity={0.32}
        color="#8aa4b8"
      />
    </>
  );
}

export function V2Scene({
  intro,
  scroll,
  look,
  hover,
  workOpen,
  reducedMotion,
  onHover,
}: V2SceneProps) {
  const recede = workOpen || hover === 'work' ? 1 : scroll;
  const dim = workOpen ? 0.72 : hover === 'work' ? 0.45 : 1;

  return (
    <Canvas
      className="v2-scene"
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      camera={{ fov: 28, position: [0, 0.95, 7.6], near: 0.1, far: 40 }}
      style={{ opacity: dim }}
      onPointerMissed={() => onHover(null)}
    >
      <CameraRig scroll={recede} look={look} workOpen={workOpen} />
      <SceneLights />
      <TeatroMass
        intro={intro}
        scroll={recede}
        hover={hover}
        reducedMotion={reducedMotion}
        onHover={(active) => onHover(active ? 'teatro' : null)}
      />
      <PalacioFragment
        intro={intro}
        scroll={recede}
        hover={hover}
        onHover={(active) => onHover(active ? 'palacio' : null)}
      />
    </Canvas>
  );
}
