import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useCADUStore } from '../store/useCADUStore'
import { BUBBLE_TUBE_CENTER, CHARACTER_STATES } from '../constants/animations'

export function useCalmCirclingBehavior(enabled = true) {
  const setTargetPosition = useCADUStore((s) => s.setTargetPosition)
  // We drive state via store to force calm walk/idle.
  const setCharacterState = useCADUStore((s) => s.setCharacterState)

  const center = useMemo(
    () => new THREE.Vector3(BUBBLE_TUBE_CENTER[0], BUBBLE_TUBE_CENTER[1], BUBBLE_TUBE_CENTER[2]),
    [],
  )

  const stateRef = useRef({
    angle: 0,
    mode: 'walk', // 'walk' | 'pause'
    timer: 0,
  })

  useFrame((state, delta) => {
    if (!enabled) return
    const sref = stateRef.current
    sref.timer -= delta

    if (sref.timer <= 0) {
      // alternate: longer walks, short pauses
      if (sref.mode === 'walk') {
        sref.mode = 'pause'
        sref.timer = 1.4
      } else {
        sref.mode = 'walk'
        sref.timer = 5.6
      }
    }

    // gentle angular drift (clockwise)
    const walkSpeed = 0.08 // radians/sec
    const pauseSpeed = 0.018
    sref.angle += (sref.mode === 'walk' ? walkSpeed : pauseSpeed) * delta

    // Circle around the tube with gentle radius breathing (free, not locked to a small ring).
    const t = state.clock.elapsedTime
    const orbitR = 2.4 + 0.35 * Math.sin(t * 0.12)
    const x = center.x + Math.cos(sref.angle) * orbitR
    const z = center.z + Math.sin(sref.angle) * orbitR

    if (sref.mode === 'pause') {
      // during pause, stay almost still and look at the tube
      setTargetPosition([x, 0, z])
      setCharacterState(CHARACTER_STATES.IDLE)
    } else {
      setTargetPosition([x, 0, z])
      setCharacterState(CHARACTER_STATES.WALK)
    }
  })
}

