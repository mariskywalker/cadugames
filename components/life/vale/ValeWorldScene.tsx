'use client'

import { Suspense, useCallback, useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { Group, PerspectiveCamera } from 'three'
import { VALE_GLB_SRC } from '@/lib/valeScene'
import { centerObjectAtOrigin, fitPerspectiveCameraToBox } from '@/lib/valeCameraFit'

const FIT_MARGIN = 1.14

function CameraFit({ targetRef }: { targetRef: RefObject<Group | null> }) {
  const { camera, size } = useThree()

  const fit = useCallback(() => {
    const target = targetRef.current
    if (!target) return

    const box = new THREE.Box3().setFromObject(target)
    if (box.isEmpty()) return

    const aspect = size.width / Math.max(size.height, 1)
    fitPerspectiveCameraToBox(camera as PerspectiveCamera, box, aspect, FIT_MARGIN)
  }, [targetRef, camera, size])

  useLayoutEffect(() => {
    fit()
  }, [fit])

  return null
}

function ValeWorldModel({ contentRef }: { contentRef: RefObject<Group | null> }) {
  const { scene } = useGLTF(VALE_GLB_SRC)

  const model = useMemo(() => {
    const cloned = scene.clone(true)
    centerObjectAtOrigin(cloned)
    return cloned
  }, [scene])

  return (
    <group ref={contentRef}>
      <primitive object={model} />
    </group>
  )
}

function ValeLights({
  highlighted,
  responding,
}: {
  highlighted: boolean
  responding: boolean
}) {
  return (
    <>
      <ambientLight intensity={responding ? 1.08 : 1} />
      <directionalLight position={[4, 8, 6]} intensity={responding ? 1.55 : 1.4} color="#fff8ee" />
      <directionalLight position={[-4, 2, -2]} intensity={0.55} color="#ffd6e8" />
      <pointLight
        position={[0, 1.2, 2]}
        intensity={responding ? 0.85 : highlighted ? 0.45 : 0.15}
        color="#ffe4b8"
        distance={12}
      />
    </>
  )
}

export function ValeWorldScene({
  highlighted = false,
  responding = false,
}: {
  highlighted?: boolean
  responding?: boolean
}) {
  const contentRef = useRef<Group>(null)

  const sceneClass = [
    'vale-world-scene',
    highlighted && 'vale-world-scene--active',
    responding && 'vale-world-scene--responding',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={sceneClass}>
      <Canvas
        camera={{ fov: 40, near: 0.01, far: 500 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ValeLights highlighted={highlighted} responding={responding} />
        <Suspense fallback={null}>
          <ValeWorldModel contentRef={contentRef} />
          <CameraFit targetRef={contentRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload(VALE_GLB_SRC)
