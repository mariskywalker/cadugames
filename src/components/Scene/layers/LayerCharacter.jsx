import { Suspense } from 'react'
import { CharacterController } from '../../Character/CharacterController'
import { ModelErrorBoundary } from '../ModelErrorBoundary'
import { CADU_START_POSITION, CADU_START_ROTATION } from '../../../constants/scene'
import { useCADUStore } from '../../../store/useCADUStore'

/** LAYER 4 — CADU na sala sensorial. */
export function LayerCharacter() {
  const spawnResetTick = useCADUStore((s) => s.spawnResetTick)

  return (
    <ModelErrorBoundary>
      <Suspense fallback={null}>
        <CharacterController
          key={spawnResetTick}
          scale={1}
          position={CADU_START_POSITION}
          rotation={CADU_START_ROTATION}
        />
      </Suspense>
    </ModelErrorBoundary>
  )
}
