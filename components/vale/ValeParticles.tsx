'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Points } from 'three'

const COUNT_DEFAULT = 36
const COUNT_HERO = 52

/** Partículas luminosas — fireflies discretas no modo referência */
export function ValeParticles({ heroMode = false }: { heroMode?: boolean }) {
  const count = heroMode ? COUNT_HERO : COUNT_DEFAULT
  const pointsRef = useRef<Points>(null)

  const seeds = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      if (heroMode) {
        positions[i * 3] = (Math.random() - 0.5) * 7
        positions[i * 3 + 1] = -0.5 + Math.random() * 4.5
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1.5
      } else {
        positions[i * 3] = (Math.random() - 0.5) * 14
        positions[i * 3 + 1] = 0.4 + Math.random() * 4.5
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2
      }
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, phases }
  }, [count, heroMode])

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: heroMode ? '#ffe8a0' : '#ffe8c8',
        size: heroMode ? 0.035 : 0.05,
        transparent: true,
        opacity: heroMode ? 0.65 : 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    [heroMode],
  )

  useFrame((state) => {
    const pts = pointsRef.current
    if (!pts) return
    const t = state.clock.elapsedTime
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const p = seeds.phases[i]
      const baseY = seeds.positions[i * 3 + 1]
      const drift = heroMode ? 0.18 : 0.35
      pos.setY(i, baseY + Math.sin(t * 0.28 + p) * drift)
      pos.setX(i, seeds.positions[i * 3] + Math.sin(t * 0.14 + p * 1.3) * (heroMode ? 0.12 : 0.2))
      if (heroMode) {
        pos.setZ(i, seeds.positions[i * 3 + 2] + Math.cos(t * 0.2 + p) * 0.1)
      }
    }
    pos.needsUpdate = true
    material.opacity =
      (heroMode ? 0.42 : 0.38) + Math.sin(t * (heroMode ? 0.35 : 0.5)) * (heroMode ? 0.18 : 0.08)
  })

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seeds.positions, 3]} />
      </bufferGeometry>
    </points>
  )
}
