'use client'

import { Suspense } from 'react'
import { CADU_START_POSITION, CADU_START_ROTATION } from '@/store/useOpeningStore'
import { CharacterController } from '../CharacterController'
import { ModelErrorBoundary } from '../ModelErrorBoundary'

export function LayerCharacter() {
  return (
    <ModelErrorBoundary>
      <Suspense fallback={null}>
        <CharacterController
          scale={1}
          position={CADU_START_POSITION}
          rotation={CADU_START_ROTATION}
        />
      </Suspense>
    </ModelErrorBoundary>
  )
}
