import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useLayerParallaxOffset } from '../../../hooks/useLayerParallaxOffset'

export function LayerParallax({ depth = 0.03, children }) {
  const group = useRef()
  const offset = useLayerParallaxOffset(depth)

  useFrame(() => {
    const g = group.current
    if (!g) return
    g.position.copy(offset.current)
  })

  return <group ref={group}>{children}</group>
}
