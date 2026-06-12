import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useCADUStore } from '../../store/useCADUStore'
import { saveMarkedCamera } from '../../utils/fixedCameraMark'

/**
 * Ao travar a câmera (C), grava posição / alvo / fov atuais.
 */
export function CaptureCameraOnLock() {
  const freeCameraMode = useCADUStore((s) => s.freeCameraMode)
  const setMarkedCamera = useCADUStore((s) => s.setMarkedCamera)
  const wasFree = useRef(freeCameraMode)
  const { camera } = useThree()
  const controls = useThree((s) => s.controls)

  useEffect(() => {
    if (wasFree.current && !freeCameraMode) {
      const target = controls?.target
        ? [controls.target.x, controls.target.y, controls.target.z]
        : [0, 1.22, 1.15]
      const marked = saveMarkedCamera({
        position: [camera.position.x, camera.position.y, camera.position.z],
        target,
        fov: camera.fov,
      })
      if (marked) setMarkedCamera(marked)
    }
    wasFree.current = freeCameraMode
  }, [freeCameraMode, camera, controls, setMarkedCamera])

  return null
}
