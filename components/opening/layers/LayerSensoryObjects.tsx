'use client'

import { Suspense } from 'react'
import { SENSORY_OBJECT_STATIONS } from '@/lib/opening/sensoryObjects'
import { BubbleTube } from '../BubbleTube'
import { ModelErrorBoundary } from '../ModelErrorBoundary'
import { SceneTransform } from '../SceneTransform'
import { SensoryStation } from '../SensoryStation'

export function LayerSensoryObjects() {
  return (
    <group>
      <ModelErrorBoundary>
        <Suspense fallback={null}>
          <BubbleTube />
        </Suspense>
      </ModelErrorBoundary>

      {SENSORY_OBJECT_STATIONS.filter((s) => !s.foreground).map((station) => (
        <SceneTransform
          key={station.id}
          position={station.position}
          rotation={station.rotation}
          scale={station.scale}
        >
          <SensoryStation station={station} embedded />
        </SceneTransform>
      ))}
    </group>
  )
}
