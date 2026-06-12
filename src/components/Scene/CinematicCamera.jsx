import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo } from 'react'
import { BUBBLE_TUBE_CENTER } from '../../constants/animations'
import { useCADUStore } from '../../store/useCADUStore'

export function CinematicCamera() {
  const cinematicMode = useCADUStore((s) => s.cinematicMode)
  const { camera } = useThree()
  const vPos = useMemo(() => new THREE.Vector3(), [])

  const target = useMemo(
    () => new THREE.Vector3(BUBBLE_TUBE_CENTER[0], 2.05, BUBBLE_TUBE_CENTER[2]),
    [],
  )

  useFrame((state, delta) => {
    if (!cinematicMode) return

    const t = state.clock.elapsedTime
    // Low, intimate "child perspective" slow drift.
    const radius = 8.1
    const height = 2.45
    const x = Math.cos(t * 0.035) * radius - 1.35
    const z = Math.sin(t * 0.035) * radius + 4.1

    vPos.set(x, height, z)
    camera.position.lerp(vPos, 1 - Math.exp(-2.2 * delta))
    camera.lookAt(target)
  })

  return null
}

