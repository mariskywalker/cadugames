'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, type CSSProperties } from 'react'
import * as THREE from 'three'
import { useValeOverlayMovement } from '@/hooks/vale/useValeOverlayMovement'
import { VALE_STATIC_SCENE } from '@/lib/vale/valeStaticScene'
import { useValeBearScreenStore } from '@/store/useValeBearScreenStore'
import { ValeOverlayBearModel } from './ValeOverlayBearModel'

const OVERLAY_CAMERA = {
  position: [0, 1.2, 4] as [number, number, number],
  lookAt: [0, 0.8, 0] as [number, number, number],
  fov: 42,
}

/** Urso animado em camada 2.5D — screenX/screenY = pés do urso */
export function ValeBearOverlay() {
  useValeOverlayMovement()
  const pose = useValeBearScreenStore((s) => s.pose)

  if (!VALE_STATIC_SCENE) return null

  const bearStyle = {
    '--bear-x': pose.screenX,
    '--bear-y': pose.screenY,
    '--bear-scale': pose.scale,
    zIndex: Math.round(pose.screenY * 100),
  } as CSSProperties

  return (
    <div className="vale-bear-overlay vale-bear-overlay--static" aria-hidden>
      <div
        className="vale-bear-overlay__character vale-bear-overlay--static__character"
        style={bearStyle}
      >
        <Canvas
          className="vale-bear-overlay__canvas"
          frameloop="always"
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{
            position: OVERLAY_CAMERA.position,
            fov: OVERLAY_CAMERA.fov,
            near: 0.1,
            far: 30,
          }}
          onCreated={({ gl, camera }) => {
            gl.setClearColor(0x000000, 0)
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.1
            camera.lookAt(...OVERLAY_CAMERA.lookAt)
          }}
        >
          <ambientLight intensity={0.85} />
          <directionalLight position={[2, 4, 3]} intensity={1.1} />
          <Suspense fallback={null}>
            <ValeOverlayBearModel rotationY={pose.rotationY} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
