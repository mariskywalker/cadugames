import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  CHARACTER_STATES,
  MOVE_SPEED,
  RUN_SPEED,
  ROTATION_SPEED,
} from '../constants/animations'
import { useCADUStore } from '../store/useCADUStore'
import { clampToNavMesh } from '../utils/navMesh'
import { isBarAnimActive } from './useActivityBarsInteraction'
import { resetTapBurst, shouldRunFromTapBurst } from '../utils/locomotionInput'

const KEY_DIRS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
}

/**
 * Setas: caminhar (Walking). Toques rápidos / repetidos → correr (Running).
 */
export function useKeyboardMovement({ groupRef, setCharacterState }) {
  const keysRef = useRef(new Set())
  const tapTimesRef = useRef([])
  const runModeRef = useRef(false)
  const qTargetRef = useRef(new THREE.Quaternion())
  const vForwardRef = useRef(new THREE.Vector3(0, 0, 1))
  const vDirRef = useRef(new THREE.Vector3())
  const wasMovingRef = useRef(false)

  useEffect(() => {
    const onDown = (e) => {
      if (!KEY_DIRS[e.key]) return
      e.preventDefault()
      const st = useCADUStore.getState()
      if (st.playerControlLocked) return
      if (st.barAnimPending) {
        st.cancelBarAnimations()
        return
      }
      keysRef.current.add(e.key)
      if (st.targetPosition) st.clearTarget()

      if (shouldRunFromTapBurst(tapTimesRef.current)) {
        runModeRef.current = true
      }

      useCADUStore.setState({
        manualClipName: null,
        debugRequestedClip: null,
        characterState: runModeRef.current ? CHARACTER_STATES.RUN : CHARACTER_STATES.WALK,
      })
    }

    const onUp = (e) => {
      keysRef.current.delete(e.key)
      if (keysRef.current.size === 0) {
        runModeRef.current = false
        resetTapBurst(tapTimesRef.current)
      }
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  useFrame((_, delta) => {
    const st = useCADUStore.getState()
    if (st.playerControlLocked) return
    if (isBarAnimActive(st.barAnimPending, st.targetPosition, st.activityBarsPhase)) return

    if (keysRef.current.size === 0) {
      if (wasMovingRef.current && !st.targetPosition) {
        wasMovingRef.current = false
        setCharacterState(CHARACTER_STATES.IDLE)
      }
      return
    }

    const group = groupRef.current
    if (!group) return
    if (st.targetPosition) return

    let dx = 0
    let dz = 0
    keysRef.current.forEach((key) => {
      const [kx, kz] = KEY_DIRS[key]
      dx += kx
      dz += kz
    })

    const len = Math.hypot(dx, dz)
    if (len < 0.01) return
    dx /= len
    dz /= len

    const isRun = runModeRef.current
    const step = (isRun ? RUN_SPEED : MOVE_SPEED) * delta
    let nx = group.position.x + dx * step
    let nz = group.position.z + dz * step
    const clamped = clampToNavMesh(nx, nz, st.bubbleTubeCollider, {
      barsInteractionActive: st.barAnimPending,
    })
    nx = clamped[0]
    nz = clamped[1]

    group.position.x = nx
    group.position.z = nz

    vDirRef.current.set(dx, 0, dz)
    qTargetRef.current.setFromUnitVectors(vForwardRef.current, vDirRef.current)
    group.quaternion.slerp(qTargetRef.current, 1 - Math.exp(-ROTATION_SPEED * delta))

    if (!wasMovingRef.current) wasMovingRef.current = true
    setCharacterState(isRun ? CHARACTER_STATES.RUN : CHARACTER_STATES.WALK)
  })
}
