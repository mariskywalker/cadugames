'use client'

import { Suspense } from 'react'
import { HorizonGroundMist } from './HorizonGroundMist'
import { LayerSky } from './LayerSky'
import { useOpeningSceneEditorStore } from '@/store/useOpeningSceneEditorStore'

/**
 * Camada 3D atrás dos objetos: céu procedural + neblina.
 * O PNG de fundo fica em HTML (OpeningSceneBackdropHtml), atrás do canvas.
 */
export function OpeningSceneBackLayer() {
  const showSky = useOpeningSceneEditorStore((s) => s.layout.background.showProceduralSky)
  const skyOpacity = useOpeningSceneEditorStore((s) => s.layout.background.proceduralSkyOpacity)

  return (
    <group name="opening-back-layer">
      {showSky && <LayerSky opacity={skyOpacity} />}
      <HorizonGroundMist />
    </group>
  )
}
