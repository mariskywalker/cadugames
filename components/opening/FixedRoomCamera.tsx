'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useOpeningSceneEditorStore } from '@/store/useOpeningSceneEditorStore'

export function FixedRoomCamera({ enabled = true }: { enabled?: boolean }) {
  const cameraLayout = useOpeningSceneEditorStore((s) => s.layout.camera)
  const { camera } = useThree()

  const target = useMemo(
    () => new THREE.Vector3(...cameraLayout.target),
    [cameraLayout.target],
  )

  useEffect(() => {
    if (!enabled) return
    camera.position.set(...cameraLayout.position)
    if ('fov' in camera) {
      ;(camera as THREE.PerspectiveCamera).fov = cameraLayout.fov
    }
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  }, [camera, cameraLayout, enabled, target])

  useFrame(() => {
    if (!enabled) return
    camera.position.set(...cameraLayout.position)
    if ('fov' in camera) {
      const cam = camera as THREE.PerspectiveCamera
      if (cam.fov !== cameraLayout.fov) {
        cam.fov = cameraLayout.fov
        cam.updateProjectionMatrix()
      }
    }
    camera.lookAt(target)
  })

  return null
}
