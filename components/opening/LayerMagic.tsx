'use client'

import { DustParticles } from './DustParticles'
import { useSceneAnimating } from '@/hooks/opening/useSceneAnimating'
import { PALETTE } from '@/lib/opening/palette'
import { SCENE_FLOOR_Y, SCENE_HUB } from '@/lib/opening/sceneLayout'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { InstancedMesh } from 'three'

function rand01(i: number, s: number) {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453123
  return x - Math.floor(x)
}

function MagicSparkles({ count = 14 }: { count?: number }) {
  const inst = useRef<InstancedMesh>(null)
  const animating = useSceneAnimating()
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (rand01(i, 1) * 2 - 1) * 6,
        y: 0.8 + rand01(i, 2) * 3.2,
        z: (rand01(i, 3) * 2 - 1) * 4,
        s: 0.025 + rand01(i, 4) * 0.04,
        sp: 0.12 + rand01(i, 5) * 0.28,
        ph: rand01(i, 6) * Math.PI * 2,
      })),
    [count],
  )

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const run = animating && !reduced

  useFrame((state) => {
    if (!run) return
    const m = inst.current
    if (!m) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const p = seeds[i]
      dummy.position.set(
        p.x + Math.sin(t * p.sp + p.ph) * 0.1,
        p.y + Math.cos(t * p.sp * 0.85 + p.ph) * 0.06,
        p.z,
      )
      const sc = p.s * (0.9 + 0.1 * Math.sin(t * 1.2 + p.ph))
      dummy.scale.set(sc, sc, sc)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={inst} args={[undefined, undefined, count]} frustumCulled renderOrder={8}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#fff5f8" transparent opacity={0.42} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  )
}

function HubSoftGlow() {
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: PALETTE.ledGlow,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  return (
    <mesh position={[SCENE_HUB[0], SCENE_FLOOR_Y + 0.05, SCENE_HUB[2]]} rotation-x={-Math.PI / 2} material={mat} renderOrder={1}>
      <circleGeometry args={[4.8, 48]} />
    </mesh>
  )
}

export function LayerMagic({ calm = false }: { calm?: boolean }) {
  return (
    <group>
      <DustParticles count={calm ? 80 : 140} />
      <MagicSparkles count={calm ? 10 : 14} />
      {!calm && <HubSoftGlow />}
    </group>
  )
}
