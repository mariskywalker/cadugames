'use client'

import { Suspense } from 'react'
import { SENSORY_OBJECT_STATIONS } from '@/lib/opening/sensoryObjects'
import type { OpeningSceneObjectId } from '@/lib/opening/openingSceneEditorLayout'
import { OPENING_INTERACTIVE_RENDER_ORDER } from '@/lib/opening/openingSceneEditorLayout'
import { BubbleTube } from '../BubbleTube'
import { ModelErrorBoundary } from '../ModelErrorBoundary'
import { OpeningSceneObjectWrap } from '../OpeningSceneObjectWrap'
import { SensoryStation } from '../SensoryStation'

const STATION_IDS: Record<string, OpeningSceneObjectId> = {
  activityBars: 'activityBars',
  sensoryCocoon: 'sensoryCocoon',
}

export function LayerSensoryObjects() {
  return (
    <group>
      <ModelErrorBoundary>
        <Suspense fallback={null}>
          <BubbleTube />
        </Suspense>
      </ModelErrorBoundary>

      {SENSORY_OBJECT_STATIONS.filter((s) => !s.foreground).map((station) => {
        const objectId = STATION_IDS[station.id]
        if (!objectId) return null
        return (
          <OpeningSceneObjectWrap key={station.id} id={objectId}>
            <SensoryStation station={station} embedded renderOrder={OPENING_INTERACTIVE_RENDER_ORDER} />
          </OpeningSceneObjectWrap>
        )
      })}
    </group>
  )
}
