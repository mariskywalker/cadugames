'use client'

import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { BALL_PIT_STATION } from '@/lib/opening/sensoryObjects'
import { SCENE_OBJECTS, sceneObjectDefaults } from '@/lib/opening/sceneComposition'
import { AliveMotion } from './AliveMotion'
import { ModelErrorBoundary } from './ModelErrorBoundary'
import { SceneTransform } from './SceneTransform'
import { TherapeuticGlb } from './TherapeuticGlb'

export function ForegroundBallPit() {
  const station = BALL_PIT_STATION
  const defaults = sceneObjectDefaults(SCENE_OBJECTS.ballPit)
  const [lx, , lz] = defaults.position

  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffe8f0',
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  return (
    <group>
      <pointLight position={[lx + 0.6, 1.8, lz - 0.4]} intensity={1.4} distance={9} decay={2} color="#fff1f5" />
      <mesh position={[lx, 0.04, lz]} rotation-x={-Math.PI / 2} material={glowMat}>
        <circleGeometry args={[2.05, 32]} />
      </mesh>

      <SceneTransform position={defaults.position} rotation={defaults.rotation} scale={defaults.scale}>
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
                sway={null}
              />
            </AliveMotion>
          </Suspense>
        </ModelErrorBoundary>
      </SceneTransform>
    </group>
  )
}
