'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useOpeningStore } from '@/store/useOpeningStore'

export function FixedRoomCamera({ enabled = true }: { enabled?: boolean }) {
  const markedCamera = useOpeningStore((s) => s.markedCamera)
  const { camera } = useThree()

  const target = useMemo(
    () => new THREE.Vector3(...markedCamera.target),
    [markedCamera.target],
  )

  useEffect(() => {
    if (!enabled) return
    camera.position.set(...markedCamera.position)
    if ('fov' in camera) {
      ;(camera as THREE.PerspectiveCamera).fov = markedCamera.fov
    }
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  }, [camera, enabled, markedCamera, target])

  useFrame(() => {
    if (!enabled) return
    camera.position.set(...markedCamera.position)
    camera.lookAt(target)
  })

  return null
}
