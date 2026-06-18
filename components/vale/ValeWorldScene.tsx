'use client'

import dynamic from 'next/dynamic'
import { ContactShadows, Loader } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Component, Suspense, useEffect, type ReactNode } from 'react'
import * as THREE from 'three'
import { VALE_CAMERA, VALE_FOG, VALE_HERO_MODE, VALE_USE_REFERENCE_BG } from '@/lib/vale/valeWorld'
import { useValeStore } from '@/store/useValeStore'
import { ValeBackdrop } from './ValeBackdrop'
import { ValeCharacter } from './ValeCharacter'
import { ValeClouds } from './ValeClouds'
import { ValeComposition } from './ValeComposition'

const ValeHotspotPathDebug = dynamic(
  () => import('./ValeHotspotPathDebug').then((m) => m.ValeHotspotPathDebug),
  { ssr: false },
)
const ValeHotspotPathProjectionBridge = dynamic(
  () => import('./ValeHotspotPathProjectionBridge').then((m) => m.ValeHotspotPathProjectionBridge),
  { ssr: false },
)
import { ValeEnvironment } from './ValeEnvironment'
import { ValeLights } from './ValeLights'
import { ValeNavFloor } from './ValeNavFloor'
import { ValeParticles } from './ValeParticles'
import { ValeSceneFlowers } from './ValeSceneFlowers'
import { ValeWalkablePath } from './ValeWalkablePath'
import { ValeWalkPathEditor } from './ValeWalkPathEditor'

class ValeErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null }

  static getDerivedStateFromError(error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar a cena 3D'
    return { error: message }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="vale-page__error" role="alert">
          <p>Não foi possível carregar o Vale das Palavras.</p>
          <p className="vale-page__error-detail">{this.state.error}</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default function ValeWorldScene() {
  const clearTarget = useValeStore((s) => s.clearTarget)
  const resetToIdle = useValeStore((s) => s.resetToIdle)

  useEffect(() => {
    clearTarget()
    resetToIdle()
  }, [clearTarget, resetToIdle])

  const showBackdrop = !VALE_USE_REFERENCE_BG
  const showCharacter = true
  const useImportedGlbLighting = VALE_USE_REFERENCE_BG && VALE_HERO_MODE

  return (
    <ValeErrorBoundary>
      <div className="vale-scene__host house-glb-layer">
        <Canvas
          className="vale-scene__canvas"
          frameloop="always"
          dpr={[1, 1.5]}
          shadows={!useImportedGlbLighting}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{
            position: VALE_CAMERA.position,
            fov: VALE_CAMERA.fov,
            near: 0.1,
            far: 180,
          }}
          onContextMenu={(e) => e.preventDefault()}
          onCreated={({ gl, scene }) => {
            gl.setClearColor(0x000000, 0)
            scene.background = null
            scene.fog = new THREE.Fog(VALE_FOG.color, VALE_FOG.near, VALE_FOG.far)
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = useImportedGlbLighting ? 1.28 : VALE_USE_REFERENCE_BG ? 1.05 : 1.08
            gl.outputColorSpace = THREE.SRGBColorSpace
            gl.shadowMap.enabled = !useImportedGlbLighting
            if (!useImportedGlbLighting) {
              gl.shadowMap.type = THREE.PCFSoftShadowMap
            }
          }}
        >
          {showBackdrop && <ValeBackdrop />}
          <ValeLights />
          <Suspense fallback={null}>
            <ValeEnvironment />
            <ValeWalkablePath />
            <ValeWalkPathEditor />
            <ValeSceneFlowers />
            {showCharacter && <ValeCharacter />}
          </Suspense>
          {!VALE_USE_REFERENCE_BG && <ValeClouds />}
          <ValeParticles heroMode={VALE_HERO_MODE} />
          {!VALE_HERO_MODE && <ValeNavFloor />}
          {!useImportedGlbLighting && (
            <ContactShadows
              position={[0.45, -1.6, -0.5]}
              opacity={VALE_USE_REFERENCE_BG ? 0.2 : 0.14}
              scale={12}
              blur={2.6}
              far={5.5}
              color="#3a5028"
            />
          )}
          <ValeComposition />
          <ValeHotspotPathDebug />
          <ValeHotspotPathProjectionBridge />
        </Canvas>
        <Loader
          containerStyles={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            background: 'transparent',
            pointerEvents: 'none',
          }}
          innerStyles={{
            background: 'rgba(255, 255, 255, 0.88)',
            width: 'auto',
            padding: '1rem 1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 8px 24px rgba(45, 49, 66, 0.12)',
          }}
          barStyles={{ background: '#e8a8ac' }}
          dataInterpolation={(p) => `Abrindo o Vale… ${p.toFixed(0)}%`}
        />
      </div>
    </ValeErrorBoundary>
  )
}
