'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { VALE_WALK_DEBUG, valeWalkDebug } from '@/lib/vale/valeWalkable'
import { valeCharacterWorldPos } from '@/lib/vale/valeWorld'

/** Marcador amarelo do ponto atual do raycast de chão */
export function ValeWalkDebug() {
  const markerRef = useRef<Mesh>(null)

  useFrame(() => {
    if (!VALE_WALK_DEBUG) return
    const marker = markerRef.current
    if (!marker) return

    const sample = valeWalkDebug.sample
    if (sample) {
      marker.position.set(sample.hitX, sample.hitY + 0.06, sample.hitZ)
      marker.visible = true
      return
    }

    marker.position.set(
      valeCharacterWorldPos.x,
      valeCharacterWorldPos.y + 0.06,
      valeCharacterWorldPos.z,
    )
    marker.visible = true
  })

  if (!VALE_WALK_DEBUG) return null

  return (
    <mesh ref={markerRef} renderOrder={50}>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshBasicMaterial color="#ffd84a" transparent opacity={0.92} depthTest={false} />
    </mesh>
  )
}
