import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { DEFAULT_CAMERA_TARGET } from '../../constants/scene'

/**
 * Subtle parallax via OrbitControls target (does not fight camera orbit).
 */
export function SoftCameraParallax({ enabled = true }) {
  const controls = useThree((s) => s.controls)
  const base = useRef(new THREE.Vector3(...DEFAULT_CAMERA_TARGET))
  const goal = useRef(new THREE.Vector3())

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useFrame((state, delta) => {
    if (!enabled || reducedMotion || !controls) return
    const { pointer } = state

    goal.current.set(
      base.current.x + pointer.x * 0.22,
      base.current.y + pointer.y * 0.1,
      base.current.z + pointer.y * 0.08,
    )
    controls.target.lerp(goal.current, 1 - Math.exp(-2.5 * delta))
  })

  return null
}
