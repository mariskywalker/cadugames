'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group, Points } from 'three'
import { useSceneAnimating } from '@/hooks/opening/useSceneAnimating'
import { PALETTE } from '@/lib/opening/palette'

function rand01(i: number, s: number) {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453123
  return x - Math.floor(x)
}

function AmbientCloud({
  position,
  scale = 1,
  phase = 0,
  speed = 0.16,
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
    g.current.position.y = position[1] + Math.sin(t * 0.35) * 0.08
    g.current.position.x = position[0] + Math.cos(t * 0.2) * 0.06
  })

  const mid = tone === '#FFF8F2' ? '#FFF0EB' : '#F5E0DC'
  const edge = tone === '#FFF8F2' ? '#F5D8D4' : '#EDD0CC'

  return (
    <group ref={g} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.55, 10, 8]} />
        <meshBasicMaterial color={tone} transparent opacity={0.72} depthWrite={false} fog />
      </mesh>
      <mesh position={[0.42, 0.08, 0.1]}>
        <sphereGeometry args={[0.38, 10, 8]} />
        <meshBasicMaterial color={mid} transparent opacity={0.66} depthWrite={false} fog />
      </mesh>
      <mesh position={[-0.36, -0.05, 0.05]}>
        <sphereGeometry args={[0.3, 10, 8]} />
        <meshBasicMaterial color={edge} transparent opacity={0.62} depthWrite={false} fog />
      </mesh>
    </group>
  )
}

function AmbientDriftParticles({ count = 36 }: { count?: number }) {
  const points = useRef<Points>(null)
  const animating = useSceneAnimating()

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (rand01(i, 1) * 2 - 1) * 16,
        y: 2.2 + rand01(i, 2) * 9,
        z: -6 + (rand01(i, 3) * 2 - 1) * 12,
        ph: rand01(i, 4) * Math.PI * 2,
        sp: 0.03 + rand01(i, 5) * 0.06,
      })),
    [count],
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
      attr.array[i * 3] = p.x + Math.sin(t * p.sp + p.ph) * 0.12
      attr.array[i * 3 + 1] = p.y + Math.cos(t * p.sp * 0.9 + p.ph) * 0.08
      attr.array[i * 3 + 2] = p.z + Math.sin(t * p.sp * 0.7 + p.ph) * 0.06
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
        size={0.05}
        transparent
        opacity={0.34}
        depthWrite={false}
        sizeAttenuation
        fog
      />
    </points>
  )
}

export function LayerAmbient({ calm = false }: { calm?: boolean }) {
  return (
    <group>
      <AmbientCloud position={[-6.5, 5.4, -8]} scale={1.15} phase={0} speed={0.1} />
      <AmbientCloud position={[6.8, 5.8, -7.5]} scale={1.05} phase={1.4} speed={0.09} />
      <AmbientCloud position={[-2.8, 6.6, -10]} scale={0.9} phase={2.8} speed={0.08} tone="#FFF2EC" />
      <AmbientCloud position={[2.2, 6.1, -11]} scale={1.2} phase={4.1} speed={0.07} tone="#FFF0EB" />
      {!calm && (
        <AmbientCloud position={[-8.5, 4.8, -12]} scale={0.75} phase={5.5} speed={0.06} tone="#F5D8D4" />
      )}
      <AmbientDriftParticles count={calm ? 24 : 36} />
    </group>
  )
}
