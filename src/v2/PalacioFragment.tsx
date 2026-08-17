import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { V2Hover } from './useV2Motion';

const GRANITE = '#5b534b';
const GRANITE_BLOCK = '#6a6158';
const LIMESTONE = '#ddd4c6';
const LIMESTONE_DEEP = '#cfc6b6';
const GLASS = '#2b333c';

interface PalacioFragmentProps {
  intro: number;
  scroll: number;
  hover: V2Hover;
  onHover: (value: boolean) => void;
}

const WINDOW_COLS = 4;
const WINDOW_ROWS = 3;
const WARM_WINDOW = 5;

export function PalacioFragment({
  intro,
  scroll,
  hover,
  onHover,
}: PalacioFragmentProps) {
  const group = useRef<THREE.Group>(null);
  const warmGlass = useRef<THREE.MeshStandardMaterial>(null);

  const rustication = useMemo(() => {
    const cells: Array<[number, number]> = [];
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        cells.push([-0.88 + col * 0.44, -0.72 + row * 0.22]);
      }
    }
    return cells;
  }, []);

  const windows = useMemo(() => {
    const cells: Array<[number, number, number]> = [];
    for (let row = 0; row < WINDOW_ROWS; row += 1) {
      for (let col = 0; col < WINDOW_COLS; col += 1) {
        const index = row * WINDOW_COLS + col;
        if (row === 0 && col === 3) continue;
        cells.push([-0.72 + col * 0.48, 0.18 + row * 0.38, index]);
      }
    }
    return cells;
  }, []);

  const balusters = useMemo(
    () => Array.from({ length: 9 }, (_, index) => -0.96 + index * 0.24),
    [],
  );

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;

    const active = hover === 'palacio';
    const recede = hover === 'work' ? 1 : scroll;
    const rise = THREE.MathUtils.lerp(-0.98, -0.72, intro);
    const targetY = rise + THREE.MathUtils.lerp(0, 0.85, recede);
    const targetZ = THREE.MathUtils.lerp(-0.35, -4.1, recede);
    const targetScale = THREE.MathUtils.lerp(1, 0.58, recede);

    node.position.x = 2.7;
    node.position.y = THREE.MathUtils.damp(node.position.y, targetY, 5, delta);
    node.position.z = THREE.MathUtils.damp(node.position.z, targetZ, 5, delta);
    node.scale.setScalar(
      THREE.MathUtils.damp(node.scale.x, targetScale, 5, delta),
    );

    const tick = active ? THREE.MathUtils.degToRad(0.7) : 0;
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, tick, 7, delta);

    if (warmGlass.current) {
      warmGlass.current.emissiveIntensity = THREE.MathUtils.damp(
        warmGlass.current.emissiveIntensity,
        active ? 0.85 : 0.03,
        8,
        delta,
      );
    }
  });

  return (
    <group
      ref={group}
      position={[2.7, -0.98, -0.35]}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      <mesh position={[0, -0.62, 0]} castShadow>
        <boxGeometry args={[2.36, 0.78, 1.42]} />
        <meshStandardMaterial color={GRANITE} roughness={0.92} metalness={0} />
      </mesh>
      {rustication.map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0.73]}>
          <boxGeometry args={[0.4, 0.18, 0.055]} />
          <meshStandardMaterial
            color={GRANITE_BLOCK}
            roughness={0.94}
            metalness={0}
          />
        </mesh>
      ))}
      <mesh position={[-0.08, 0.42, -0.02]} castShadow>
        <boxGeometry args={[2.2, 1.38, 1.28]} />
        <meshStandardMaterial
          color={LIMESTONE}
          roughness={0.84}
          metalness={0}
        />
      </mesh>
      <mesh position={[0.98, 0.86, 0.02]}>
        <boxGeometry args={[0.42, 0.52, 0.9]} />
        <meshStandardMaterial
          color={LIMESTONE_DEEP}
          roughness={0.86}
          metalness={0}
        />
      </mesh>
      {windows.map(([x, y, index]) => (
        <group key={index} position={[x, y, 0.64]}>
          <mesh>
            <boxGeometry args={[0.3, 0.28, 0.06]} />
            <meshStandardMaterial
              color={LIMESTONE_DEEP}
              roughness={0.8}
              metalness={0}
            />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.22, 0.2, 0.03]} />
            <meshStandardMaterial
              ref={index === WARM_WINDOW ? warmGlass : undefined}
              color={GLASS}
              roughness={0.32}
              metalness={0}
              emissive={index === WARM_WINDOW ? '#e8a050' : '#000000'}
              emissiveIntensity={index === WARM_WINDOW ? 0.03 : 0}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[-0.08, 1.16, 0.02]}>
        <boxGeometry args={[2.28, 0.08, 1.36]} />
        <meshStandardMaterial color={LIMESTONE} roughness={0.8} metalness={0} />
      </mesh>
      <mesh position={[-0.08, 1.38, 0.18]}>
        <boxGeometry args={[2.16, 0.045, 0.08]} />
        <meshStandardMaterial
          color={LIMESTONE}
          roughness={0.78}
          metalness={0}
        />
      </mesh>
      {balusters.map((x) => (
        <mesh key={x} position={[x, 1.3, 0.18]}>
          <boxGeometry args={[0.055, 0.16, 0.055]} />
          <meshStandardMaterial
            color={LIMESTONE}
            roughness={0.8}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}
