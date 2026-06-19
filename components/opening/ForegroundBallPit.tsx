'use client'

import { Suspense } from 'react'
import { BALL_PIT_STATION } from '@/lib/opening/sensoryObjects'
import { AliveMotion } from './AliveMotion'
import { ModelErrorBoundary } from './ModelErrorBoundary'
import { OPENING_INTERACTIVE_RENDER_ORDER } from '@/lib/opening/openingSceneEditorLayout'
import { OpeningSceneObjectWrap } from './OpeningSceneObjectWrap'
import { TherapeuticGlb } from './TherapeuticGlb'

export function ForegroundBallPit() {
  const station = BALL_PIT_STATION

  return (
    <OpeningSceneObjectWrap id="ballPit">
      <pointLight position={[0.3, 1.2, -0.2]} intensity={0.6} distance={6} decay={2} color="#fff1f5" />
      <ModelErrorBoundary>
        <Suspense fallback={null}>
          <AliveMotion type="breath" intensity={0.16} speed={0.4}>
            <TherapeuticGlb
              url={station.url}
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scaleToCharacter={station.scaleToCharacter}
              characterScaleMode={station.characterScaleMode}
              characterHeightMult={station.characterHeightMult}
              characterWidthMult={station.characterWidthMult}
              scaleMult={station.scaleMult}
              targetHeight={station.targetHeight}
              sway={null}
              renderOrder={OPENING_INTERACTIVE_RENDER_ORDER}
            />
          </AliveMotion>
        </Suspense>
      </ModelErrorBoundary>
    </OpeningSceneObjectWrap>
  )
}
