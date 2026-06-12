'use client'

import { Suspense } from 'react'
import type { SensoryStationConfig } from '@/lib/opening/sensoryObjects'
import { AliveMotion } from './AliveMotion'
import { ModelErrorBoundary } from './ModelErrorBoundary'
import { TherapeuticGlb } from './TherapeuticGlb'

function StationModel({ station }: { station: SensoryStationConfig }) {
  return (
    <TherapeuticGlb
      url={station.url}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scaleToCharacter={station.scaleToCharacter}
      characterScaleMode={station.characterScaleMode}
      characterHeightMult={station.characterHeightMult}
      characterWidthMult={station.characterWidthMult}
      scaleMult={station.scaleMult}
      sway={station.sway}
    />
  )
}

export function SensoryStation({
  station,
  embedded = false,
}: {
  station: SensoryStationConfig
  embedded?: boolean
}) {
  const grounded = station.grounded === true
  const position = embedded ? ([0, 0, 0] as [number, number, number]) : station.position
  const rotation = embedded ? ([0, 0, 0] as [number, number, number]) : station.rotation

  const model = (
    <StationModel
      station={{
        ...station,
        position,
        rotation,
      }}
    />
  )

  return (
    <ModelErrorBoundary>
      <Suspense fallback={null}>
        {grounded ? (
          model
        ) : (
          <AliveMotion
            type={station.idleMotion === 'breath' ? 'breath' : station.sway ? 'sway' : 'float'}
            intensity={station.idleMotion === 'breath' ? 0.65 : 0.45}
            speed={0.55}
          >
            {model}
          </AliveMotion>
        )}
      </Suspense>
    </ModelErrorBoundary>
  )
}
