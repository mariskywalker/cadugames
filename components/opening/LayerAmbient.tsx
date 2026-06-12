'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group, Points } from 'three'
import { useSceneAnimating } from '@/hooks/opening/useSceneAnimating'
import { PALETTE } from '@/lib/opening/palette'
import { SCENE_HUB } from '@/lib/opening/sceneLayout'

function rand01(i: number, s: number) {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453123
  return x - Math.floor(x)
}

function AmbientCloud({
  position,
  scale = 1,
  phase = 0,
  speed = 0.22,
  tone = '#FFF8F2',
}: {
  position: [number, number, number]
  scale?: number
  phase?: number
  speed?: number
  tone?: string
}) {
  const g = useRef<Group>(null)
  const animating = useSceneAnimating()

  useFrame((state) => {
    if (!animating || !g.current) return
    const t = state.clock.elapsedTime * speed + phase
    g.current.position.y = position[1] + Math.sin(t * 0.35) * 0.12
    g.current.position.x = position[0] + Math.cos(t * 0.2) * 0.09
  })

  const mid = tone === '#FFF8F2' ? '#FFF0EB' : '#F5E0DC'
  const edge = tone === '#FFF8F2' ? '#F5D8D4' : '#EDD0CC'

  return (
    <group ref={g} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.55, 10, 8]} />
        <meshBasicMaterial color={tone} transparent opacity={0.78} depthWrite={false} fog />
      </mesh>
      <mesh position={[0.42, 0.08, 0.1]}>
        <sphereGeometry args={[0.38, 10, 8]} />
        <meshBasicMaterial color={mid} transparent opacity={0.72} depthWrite={false} fog />
      </mesh>
      <mesh position={[-0.36, -0.05, 0.05]}>
        <sphereGeometry args={[0.3, 10, 8]} />
        <meshBasicMaterial color={edge} transparent opacity={0.68} depthWrite={false} fog />
      </mesh>
    </group>
  )
}

function AmbientDriftParticles({ count = 28 }: { count?: number }) {
  const points = useRef<Points>(null)
  const animating = useSceneAnimating()
  const hubZ = SCENE_HUB[2]

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (rand01(i, 1) * 2 - 1) * 14,
        y: 2.5 + rand01(i, 2) * 10,
        z: hubZ + (rand01(i, 3) * 2 - 1) * 10,
        ph: rand01(i, 4) * Math.PI * 2,
        sp: 0.04 + rand01(i, 5) * 0.08,
      })),
    [count, hubZ],
  )

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    seeds.forEach((p, i) => {
      arr[i * 3] = p.x
      arr[i * 3 + 1] = p.y
      arr[i * 3 + 2] = p.z
    })
    return arr
  }, [count, seeds])

  useFrame((state) => {
    if (!animating || !points.current) return
    const t = state.clock.elapsedTime
    const attr = points.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      const p = seeds[i]
      attr.array[i * 3] = p.x + Math.sin(t * p.sp + p.ph) * 0.15
      attr.array[i * 3 + 1] = p.y + Math.cos(t * p.sp * 0.9 + p.ph) * 0.1
      attr.array[i * 3 + 2] = p.z + Math.sin(t * p.sp * 0.7 + p.ph) * 0.08
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={points} frustumCulled={false} renderOrder={-15}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={PALETTE.cream}
        size={0.06}
        transparent
        opacity={0.28}
        depthWrite={false}
        sizeAttenuation
        fog
      />
    </points>
  )
}

export function LayerAmbient({ calm = false }: { calm?: boolean }) {
  const hubZ = SCENE_HUB[2]
  return (
    <group>
      <AmbientCloud position={[-5.2, 5.8, hubZ - 6]} scale={1.05} phase={0} speed={0.14} />
      <AmbientCloud position={[5.4, 6.0, hubZ - 5.8]} scale={0.95} phase={1.4} speed={0.13} />
      <AmbientCloud position={[-2.5, 7.1, hubZ - 8]} scale={0.8} phase={2.8} speed={0.12} tone="#FFF2EC" />
      <AmbientCloud position={[1.8, 6.4, hubZ - 9.5]} scale={1.15} phase={4.1} speed={0.11} tone="#FFF0EB" />
      {!calm && (
        <AmbientCloud position={[-7.2, 5.2, hubZ - 10]} scale={0.72} phase={5.5} speed={0.1} tone="#F5D8D4" />
      )}
      <AmbientDriftParticles count={calm ? 16 : 28} />
    </group>
  )
}
