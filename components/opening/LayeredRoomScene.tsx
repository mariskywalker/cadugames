'use client'

import { Suspense } from 'react'
import { LayerAmbient } from './LayerAmbient'
import { ForegroundBallPit } from './ForegroundBallPit'
import { LayerMagic } from './LayerMagic'
import { NavMeshFloor } from './NavMeshFloor'
import { OpeningEditorGround } from './OpeningSceneObjectWrap'
import { OpeningSceneBackLayer } from './OpeningSceneBackLayer'
import { PodiumImage } from './PodiumImage'
import { LayerCharacter } from './layers/LayerCharacter'
import { LayerSensoryObjects } from './layers/LayerSensoryObjects'

function SceneModelsFallback() {
  return null
}

function SceneModels() {
  return (
    <Suspense fallback={<SceneModelsFallback />}>
      <LayerSensoryObjects />
      <LayerCharacter />
      <ForegroundBallPit />
    </Suspense>
  )
}

export function LayeredRoomScene({ fixedCamera = true }: { fixedCamera?: boolean }) {
  return (
    <>
      <OpeningSceneBackLayer />
      <Suspense fallback={null}>
        <PodiumImage />
      </Suspense>
      <LayerAmbient calm={fixedCamera} />
      <NavMeshFloor />
      <OpeningEditorGround />
      <SceneModels />
      <LayerMagic calm={fixedCamera} />
    </>
  )
}
