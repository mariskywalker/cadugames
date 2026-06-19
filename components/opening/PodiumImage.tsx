'use client'

import { useTexture } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { OPENING_ASSETS } from '@/lib/opening/assets'
import { createPodiumFeatherMaterial } from '@/lib/opening/podiumFeatherMaterial'
import { OPENING_PODIUM_RENDER_ORDER } from '@/lib/opening/openingSceneEditorLayout'
import { PODIUM_RADIUS } from '@/lib/opening/sceneLayout'
import { OpeningSceneObjectWrap } from './OpeningSceneObjectWrap'
import { PodiumGroundMist } from './PodiumGroundMist'

/** Largura base do palco em unidades da cena (diâmetro visual). */
export const PODIUM_IMAGE_BASE_WIDTH = PODIUM_RADIUS * 2.08

export function PodiumImage() {
  const map = useTexture(OPENING_ASSETS.podium)
  map.colorSpace = THREE.SRGBColorSpace

  const planeSize = useMemo(() => {
    const image = map.image as { width?: number; height?: number } | undefined
    const aspect =
      image?.width && image?.height ? image.width / image.height : 20291 / 6024
    return {
      width: PODIUM_IMAGE_BASE_WIDTH,
      height: PODIUM_IMAGE_BASE_WIDTH / aspect,
    }
  }, [map])

  const rimY = planeSize.height * 0.14

  const material = useMemo(() => createPodiumFeatherMaterial(map), [map])

  return (
    <OpeningSceneObjectWrap id="podium">
      <PodiumGroundMist rimY={rimY} radius={PODIUM_RADIUS * 0.98} />
      <mesh
        position={[0, planeSize.height * 0.5, 0]}
        renderOrder={OPENING_PODIUM_RENDER_ORDER}
        frustumCulled={false}
      >
        <planeGeometry args={[planeSize.width, planeSize.height]} />
        <primitive object={material} attach="material" />
      </mesh>
    </OpeningSceneObjectWrap>
  )
}
