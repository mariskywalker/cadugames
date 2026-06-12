'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { computeValeComposition } from '@/lib/vale/valeComposition'
import { VALE_CAMERA } from '@/lib/vale/valeWorld'

/** Estado compartilhado — ilha e FOV ajustados ao viewport para establishing shot */
export const valeCompositionState = {
  islandSize: 7,
  fov: VALE_CAMERA.fov,
}

const _target = new THREE.Vector3(...VALE_CAMERA.target)

/** Recalcula escala da ilha + FOV a cada resize; mantém câmera fixa 3/4 */
export function ValeComposition() {
  const { camera, size } = useThree()
  const lastKey = useRef('')

  const apply = () => {
    const { islandSize, fov } = computeValeComposition(size.width, size.height)
    const key = `${islandSize}-${fov}-${size.width}x${size.height}`
    if (key === lastKey.current) return
    lastKey.current = key

    valeCompositionState.islandSize = islandSize
    valeCompositionState.fov = fov

    camera.position.set(...VALE_CAMERA.position)
    if ('fov' in camera) {
      ;(camera as THREE.PerspectiveCamera).fov = fov
      camera.updateProjectionMatrix()
    }
    camera.lookAt(_target)
  }

  useFrame(() => {
    apply()
  })

  return null
}
