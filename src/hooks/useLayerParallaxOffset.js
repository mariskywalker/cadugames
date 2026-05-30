import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneAnimating } from './useSceneAnimating'

/**
 * Slow pointer parallax offset for a scene layer depth.
 */
export function useLayerParallaxOffset(depth = 0.03) {
  const offset = useRef(new THREE.Vector3())
  const goal = useRef(new THREE.Vector3())
  const animating = useSceneAnimating()

  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useFrame((state, delta) => {
    if (!animating || reduced) {
      offset.current.set(0, 0, 0)
      return
    }
    const { pointer } = state
    goal.current.set(pointer.x * depth * 1.1, pointer.y * depth * 0.45, pointer.y * depth * 0.3)
    offset.current.lerp(goal.current, 1 - Math.exp(-1.8 * delta))
  })

  return offset
}
