import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { SCENE_OBJECTS, sceneObjectDefaults } from '../../../constants/sceneComposition'
import { BALL_PIT_STATION } from '../../../constants/sensoryObjects'
import { useSceneObjectTransform } from '../../../hooks/useSceneObjectTransform'
import { ModelErrorBoundary } from '../ModelErrorBoundary'
import { AliveMotion } from '../AliveMotion'
import { TherapeuticGlb } from '../TherapeuticGlb'
import { EditableTransform } from '../EditableTransform'

/**
 * Piscina em foreground — maior, mais perto da câmera, renderizada por cima do palco.
 */
export function ForegroundBallPit() {
  const station = BALL_PIT_STATION
  const defaults = sceneObjectDefaults(SCENE_OBJECTS.ballPit)
  const transform = useSceneObjectTransform('ballPit', defaults)
  const [lx, , lz] = transform.position

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
    <group renderOrder={32}>
      <pointLight position={[lx + 0.6, 1.8, lz - 0.4]} intensity={1.4} distance={9} decay={2} color="#fff1f5" />
      <mesh position={[lx, 0.04, lz]} rotation-x={-Math.PI / 2} renderOrder={31} material={glowMat}>
        <circleGeometry args={[2.05, 32]} />
      </mesh>

      <EditableTransform objectId="ballPit" defaults={defaults}>
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
                renderOrder={32}
                sway={null}
              />
            </AliveMotion>
          </Suspense>
        </ModelErrorBoundary>
      </EditableTransform>
    </group>
  )
}
