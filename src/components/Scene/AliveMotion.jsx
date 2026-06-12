import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

// Tiny "breathing / alive" motion, intentionally subtle.
export function AliveMotion({ children, type = 'float', intensity = 1, speed = 1 }) {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    const g = ref.current
    if (!g) return

    if (type === 'float') {
      g.position.y = Math.sin(t) * 0.06 * intensity
      g.rotation.z = Math.sin(t * 0.7) * 0.05 * intensity
    } else if (type === 'sway') {
      g.rotation.z = Math.sin(t) * 0.08 * intensity
      g.rotation.x = Math.sin(t * 0.6) * 0.03 * intensity
    } else if (type === 'breath') {
      const s = 1 + Math.sin(t) * 0.015 * intensity
      g.scale.set(s, s, s)
    }
  })

  return <group ref={ref}>{children}</group>
}

