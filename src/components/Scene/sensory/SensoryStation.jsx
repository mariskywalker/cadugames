import { Suspense } from 'react'
import { ModelErrorBoundary } from '../ModelErrorBoundary'
import { TherapeuticGlb } from '../TherapeuticGlb'
import { AliveMotion } from '../AliveMotion'

function StationModel({ station }) {
  return (
    <TherapeuticGlb
      url={station.url}
      position={station.position}
      rotation={station.rotation}
      scaleToCharacter={station.scaleToCharacter}
      characterScaleMode={station.characterScaleMode}
      characterHeightMult={station.characterHeightMult}
      characterWidthMult={station.characterWidthMult}
      sway={station.sway}
    />
  )
}

export function SensoryStation({ station, embedded = false }) {
  const grounded = station.grounded === true

  const model = (
    <StationModel
      station={{
        ...station,
        position: embedded ? [0, 0, 0] : station.position,
        rotation: embedded ? [0, 0, 0] : station.rotation,
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
