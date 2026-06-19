'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { OPENING_PODIUM_RENDER_ORDER } from '@/lib/opening/openingSceneEditorLayout'
import { getPodiumMistMap, getPodiumShadowMap } from '@/lib/opening/podiumMistTexture'

export function PodiumGroundMist({
  rimY,
  radius,
}: {
  /** Altura local do anel (perto da borda inferior do palco). */
  rimY: number
  radius: number
}) {
  const mistMat = useMemo(() => {
    const map = getPodiumMistMap()
    return new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      depthTest: true,
      fog: false,
      toneMapped: false,
    })
  }, [])

  const shadowMat = useMemo(() => {
    const map = getPodiumShadowMap()
    return new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      depthTest: true,
      fog: false,
      toneMapped: false,
    })
  }, [])

  const mistOrder = OPENING_PODIUM_RENDER_ORDER - 2
  const shadowOrder = OPENING_PODIUM_RENDER_ORDER - 1

  return (
    <group>
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, rimY - 0.04, 0.12]}
        renderOrder={shadowOrder}
        material={shadowMat}
        frustumCulled={false}
      >
        <circleGeometry args={[radius * 1.02, 72]} />
      </mesh>
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, rimY, 0.1]}
        renderOrder={mistOrder}
        material={mistMat}
        frustumCulled={false}
      >
        <circleGeometry args={[radius * 1.08, 80]} />
      </mesh>
    </group>
  )
}
