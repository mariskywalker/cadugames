'use client'

import { ContactShadows, Loader, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Component, useEffect, type ReactNode } from 'react'
import * as THREE from 'three'
import { OPENING_ASSETS } from '@/lib/opening/assets'
import { playTubeVideo } from '@/lib/opening/tubeVideoElement'
import { ROOM_STUDIO_FOG } from '@/lib/opening/roomBackdrop'
import { SCENE_FLOOR_Y } from '@/lib/opening/sceneLayout'
import { useOpeningSceneEditorStore } from '@/store/useOpeningSceneEditorStore'
import { useOpeningStore } from '@/store/useOpeningStore'
import { FixedRoomCamera } from './FixedRoomCamera'
import { LayeredRoomScene } from './LayeredRoomScene'
import { Lights } from './Lights'
import { OpeningSceneBackdropHtml } from './OpeningSceneBackdropHtml'

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { error: string | null }
> {
  state = { error: null as string | null }

  static getDerivedStateFromError(error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar a cena 3D'
    return { error: message }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="opening-page__error" role="alert">
          <p>Não foi possível carregar a sala sensorial.</p>
          <p className="opening-page__error-detail">{this.state.error}</p>
        </div>
      )
    }
    return this.props.children
  }
}

function OpeningSceneInner() {
  const markedCamera = useOpeningStore((s) => s.markedCamera)
  const clearTarget = useOpeningStore((s) => s.clearTarget)
  const resetToIdle = useOpeningStore((s) => s.resetToIdle)
  const hydrateScene = useOpeningSceneEditorStore((s) => s.hydrate)

  useEffect(() => {
    hydrateScene()
  }, [hydrateScene])

  useEffect(() => {
    useGLTF.preload(OPENING_ASSETS.bear)
    useGLTF.preload(OPENING_ASSETS.bubbleTube)
    useGLTF.preload(OPENING_ASSETS.ballPit)
    useGLTF.preload(OPENING_ASSETS.bars)
    useGLTF.preload(OPENING_ASSETS.sensorySwing)

    playTubeVideo()
  }, [])

  useEffect(() => {
    clearTarget()
    resetToIdle()
  }, [clearTarget, resetToIdle])

  return (
    <SceneErrorBoundary>
      <div className="opening-scene__host">
        <OpeningSceneBackdropHtml />
        <Canvas
          className="opening-scene__canvas"
          frameloop="always"
          dpr={[1, 1.5]}
          shadows
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{
            position: markedCamera.position,
            fov: markedCamera.fov,
            near: 0.1,
            far: 120,
          }}
          onContextMenu={(e) => e.preventDefault()}
          onCreated={({ gl, scene }) => {
            gl.setClearColor(0x000000, 0)
            scene.background = null
            scene.fog = new THREE.FogExp2(ROOM_STUDIO_FOG.color, ROOM_STUDIO_FOG.density)
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.05
            gl.outputColorSpace = THREE.SRGBColorSpace
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFSoftShadowMap
          }}
        >
          <Lights />
          <LayeredRoomScene fixedCamera />
          <ContactShadows
            position={[0, SCENE_FLOOR_Y + 0.015, 0]}
            opacity={0.12}
            scale={16}
            blur={2.8}
            far={6}
            color="#D890A8"
          />
          <FixedRoomCamera enabled />
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
          dataInterpolation={(p) => `Carregando modelos 3D… ${p.toFixed(0)}%`}
        />
      </div>
    </SceneErrorBoundary>
  )
}

export default function OpeningScene() {
  return <OpeningSceneInner />
}
