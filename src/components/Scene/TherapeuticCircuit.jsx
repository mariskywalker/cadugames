import { Suspense } from 'react'
import { THERAPEUTIC_CIRCUIT_STATIONS } from '../../constants/therapeuticCircuit'
import { ModelErrorBoundary } from './ModelErrorBoundary'
import { TherapeuticGlb } from './TherapeuticGlb'

function TherapeuticStation({ station }) {
  return (
    <ModelErrorBoundary>
      <Suspense fallback={null}>
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
      </Suspense>
    </ModelErrorBoundary>
  )
}

export function TherapeuticCircuit() {
  return (
    <group>
      {THERAPEUTIC_CIRCUIT_STATIONS.map((station) => (
        <TherapeuticStation key={station.id} station={station} />
      ))}
    </group>
  )
}
