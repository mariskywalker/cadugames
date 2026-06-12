import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useCADUStore } from '../../store/useCADUStore'

/**
 * Câmera fixa — usa posição marcada (código + localStorage ao travar com C).
 */
export function FixedRoomCamera({ enabled = true }) {
  const markedCamera = useCADUStore((s) => s.markedCamera)
  const { camera } = useThree()

  const target = useMemo(
    () => new THREE.Vector3(...markedCamera.target),
    [markedCamera.target],
  )

  useEffect(() => {
    if (!enabled) return
    camera.position.set(...markedCamera.position)
    camera.fov = markedCamera.fov
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
