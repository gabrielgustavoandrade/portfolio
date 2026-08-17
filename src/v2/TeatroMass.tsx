import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { makeRoundedBox } from './geometry';
import type { V2Hover } from './useV2Motion';

const PLASTER = '#e7d8c3';
const PLASTER_BAND = '#d9c8b0';
const GLASS = '#24303a';

interface TeatroMassProps {
  intro: number;
  scroll: number;
  hover: V2Hover;
  reducedMotion: boolean;
  onHover: (value: boolean) => void;
}

export function TeatroMass({
  intro,
  scroll,
  hover,
  reducedMotion,
  onHover,
}: TeatroMassProps) {
  const group = useRef<THREE.Group>(null);
  const glassMaterials = useRef<THREE.MeshStandardMaterial[]>([]);

  const hull = useMemo(() => makeRoundedBox(3.7, 1.12, 1.38, 0.46), []);
  const deck = useMemo(() => makeRoundedBox(2.55, 0.42, 1.05, 0.22), []);
  const tower = useMemo(() => makeRoundedBox(0.92, 1.05, 1.12, 0.2), []);
  const cap = useMemo(() => makeRoundedBox(0.78, 0.28, 0.92, 0.14), []);

  useEffect(() => {
    return () => {
      hull.dispose();
      deck.dispose();
      tower.dispose();
      cap.dispose();
    };
  }, [hull, deck, tower, cap]);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;

    const active = hover === 'teatro';
    const recede = hover === 'work' ? 1 : scroll;
    const rise = THREE.MathUtils.lerp(-0.14, 0, intro);
    const targetY = rise + THREE.MathUtils.lerp(0, 0.55, recede);
    const targetZ = THREE.MathUtils.lerp(0.15, -3.6, recede);
    const targetScale = THREE.MathUtils.lerp(1, 0.62, recede);

    node.position.x = -2.05;
    node.position.y = THREE.MathUtils.damp(node.position.y, targetY, 5, delta);
    node.position.z = THREE.MathUtils.damp(node.position.z, targetZ, 5, delta);
    node.scale.setScalar(
      THREE.MathUtils.damp(node.scale.x, targetScale, 5, delta),
    );

    const idleYaw = reducedMotion
      ? 0
      : Math.sin(state.clock.elapsedTime * 0.28) * THREE.MathUtils.degToRad(1);
    const lean = active ? THREE.MathUtils.degToRad(-2) : 0;
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, idleYaw, 3, delta);
    node.rotation.z = THREE.MathUtils.damp(node.rotation.z, lean, 6, delta);

    const catchLight = active ? 0.7 : 0.04;
    for (const material of glassMaterials.current) {
      material.emissiveIntensity = THREE.MathUtils.damp(
        material.emissiveIntensity,
        catchLight,
        8,
        delta,
      );
    }
  });

  return (
    <group
      ref={group}
      position={[-2.05, -0.14, 0.15]}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      <mesh geometry={hull} castShadow>
        <meshStandardMaterial color={PLASTER} roughness={0.94} metalness={0} />
      </mesh>
      <mesh geometry={deck} position={[0.12, 0.68, -0.04]} castShadow>
        <meshStandardMaterial color={PLASTER} roughness={0.93} metalness={0} />
      </mesh>
      <mesh geometry={tower} position={[-1.18, 0.82, 0]} castShadow>
        <meshStandardMaterial color={PLASTER} roughness={0.94} metalness={0} />
      </mesh>
      <mesh geometry={cap} position={[-1.18, 1.42, 0]}>
        <meshStandardMaterial
          color={PLASTER_BAND}
          roughness={0.92}
          metalness={0}
        />
      </mesh>
      {[-0.28, 0.08].map((y) => (
        <mesh key={y} position={[0.28, y, 0.7]}>
          <boxGeometry args={[2.55, 0.035, 0.03]} />
          <meshStandardMaterial
            color={PLASTER_BAND}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      ))}
      {Array.from({ length: 8 }, (_, index) => {
        const x = -1.28 + index * 0.38;
        return (
          <group key={x} position={[x, 0.06, 0.71]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.095, 0.095, 0.05, 16]} />
              <meshStandardMaterial
                color={PLASTER_BAND}
                roughness={0.9}
                metalness={0}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.012]}>
              <cylinderGeometry args={[0.07, 0.07, 0.03, 16]} />
              <meshStandardMaterial
                ref={(material) => {
                  if (material) {
                    glassMaterials.current[index] = material;
                  }
                }}
                color={GLASS}
                roughness={0.28}
                metalness={0}
                emissive="#f0c27a"
                emissiveIntensity={0.04}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
