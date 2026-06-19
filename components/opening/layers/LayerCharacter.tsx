'use client'

import { Suspense } from 'react'
import { openingObjectToWorld } from '@/lib/opening/openingSceneEditorLayout'
import { useOpeningSceneEditorStore } from '@/store/useOpeningSceneEditorStore'
import { CharacterController } from '../CharacterController'
import { ModelErrorBoundary } from '../ModelErrorBoundary'
import { OpeningSceneObjectWrap } from '../OpeningSceneObjectWrap'

export function LayerCharacter() {
  const editorActive = useOpeningSceneEditorStore((s) => s.editorActive)
  const sceneLayout = useOpeningSceneEditorStore((s) => s.layout)
  const caduLayout = sceneLayout.objects.cadu
  const { position, rotation, scale } = openingObjectToWorld(caduLayout, 'cadu', sceneLayout)

  const character = (
    <ModelErrorBoundary>
      <Suspense fallback={null}>
        <CharacterController
          scale={scale[0]}
          position={editorActive ? [0, 0, 0] : position}
          rotation={rotation}
        />
      </Suspense>
    </ModelErrorBoundary>
  )

  if (editorActive) {
    return <OpeningSceneObjectWrap id="cadu">{character}</OpeningSceneObjectWrap>
  }

  return character
}
