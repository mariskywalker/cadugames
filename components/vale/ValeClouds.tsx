'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group } from 'three'

type CloudDef = {
  position: [number, number, number]
  scale: number
  speed: number
  phase: number
  opacity: number
}

const NEAR_CLOUDS: CloudDef[] = [
  { position: [-4.5, 4.6, -5.5], scale: 1.3, speed: 0.22, phase: 0, opacity: 0.82 },
  { position: [4.8, 5, -6], scale: 1.5, speed: 0.18, phase: 1.4, opacity: 0.78 },
  { position: [0.5, 5.4, -7], scale: 1.1, speed: 0.25, phase: 2.8, opacity: 0.72 },
]

const FAR_CLOUDS: CloudDef[] = [
  { position: [-10, 6.5, -14], scale: 3.6, speed: 0.1, phase: 0.5, opacity: 0.42 },
  { position: [11, 7, -16], scale: 4.2, speed: 0.08, phase: 2.1, opacity: 0.38 },
  { position: [0, 8, -18], scale: 5, speed: 0.06, phase: 4.2, opacity: 0.32 },
  { position: [-5, 7.5, -20], scale: 3.2, speed: 0.07, phase: 1.8, opacity: 0.28 },
]

function VolumetricCloud({
  position,
  scale,
  speed,
  phase,
  opacity,
  fog,
}: CloudDef & { fog: boolean }) {
  const ref = useRef<Group>(null)
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#fff8f2',
        transparent: true,
        opacity,
        depthWrite: false,
        fog,
      }),
    [opacity, fog],
  )

  useFrame((state) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime
    g.position.y = position[1] + Math.sin(t * speed + phase) * 0.25
    g.position.x = position[0] + Math.sin(t * speed * 0.35 + phase) * 0.35
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh material={material}>
        <sphereGeometry args={[0.55, 16, 14]} />
      </mesh>
      <mesh position={[0.5, -0.06, 0.08]} material={material}>
        <sphereGeometry args={[0.38, 16, 14]} />
      </mesh>
      <mesh position={[-0.48, -0.1, -0.05]} material={material}>
        <sphereGeometry args={[0.34, 16, 14]} />
      </mesh>
      <mesh position={[0.1, 0.2, -0.2]} material={material}>
        <sphereGeometry args={[0.28, 14, 12]} />
      </mesh>
    </group>
  )
}

export function ValeClouds() {
  return (
    <>
      {FAR_CLOUDS.map((c, i) => (
        <VolumetricCloud key={`far-${i}`} {...c} fog />
      ))}
      {NEAR_CLOUDS.map((c, i) => (
        <VolumetricCloud key={`near-${i}`} {...c} fog={false} />
      ))}
    </>
  )
}
