'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { applyValeCameraToThree, computeValeComposition } from '@/lib/vale/valeComposition'
import { useValeCameraEditorStore } from '@/store/useValeCameraEditorStore'

/** Estado compartilhado — ilha e FOV ajustados ao viewport para establishing shot */
export const valeCompositionState = {
  islandSize: 7,
  fov: 50,
}

/** Recalcula escala da ilha + FOV a cada resize; mantém câmera fixa 3/4 */
export function ValeComposition() {
  const { camera, size } = useThree()
  const layout = useValeCameraEditorStore((s) => s.layout)
  const lastKey = useRef('')

  const apply = () => {
    const { islandSize, fov } = computeValeComposition(size.width, size.height, layout)
    const key = `${islandSize}-${fov}-${size.width}x${size.height}-${JSON.stringify(layout)}`
    if (key === lastKey.current) return
    lastKey.current = key

    valeCompositionState.islandSize = islandSize
    valeCompositionState.fov = fov

    applyValeCameraToThree(camera as THREE.PerspectiveCamera, layout, fov)
  }

  useFrame(() => {
    apply()
  })

  return null
}
