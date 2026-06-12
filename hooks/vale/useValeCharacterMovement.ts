'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { RefObject } from 'react'
import type { Group } from 'three'
import {
  ARRIVAL_THRESHOLD,
  CHARACTER_STATES,
  ROTATION_SPEED,
  type CharacterState,
} from '@/lib/opening/animations'
import { VALE_MOVE_SPEED, VALE_RUN_SPEED } from '@/lib/vale/valeMotion'
import { clampToValeNav } from '@/lib/vale/valeWorld'
import { useValeStore } from '@/store/useValeStore'

/** Mesma locomoção da sala sensorial, mas com nav circular do Vale. */
export function useValeCharacterMovement({
  groupRef,
  setCharacterState,
}: {
  groupRef: RefObject<Group | null>
  setCharacterState: (state: CharacterState) => void
}) {
  const clearTarget = useValeStore((s) => s.clearTarget)
  const vTargetRef = useRef(new THREE.Vector3())
  const vToTargetRef = useRef(new THREE.Vector3())
  const vDirRef = useRef(new THREE.Vector3())
  const qTargetRef = useRef(new THREE.Quaternion())
  const vForwardRef = useRef(new THREE.Vector3(0, 0, 1))
  const wasMovingRef = useRef(false)

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const st = useValeStore.getState()
    const targetPosition = st.targetPosition

    if (!targetPosition) {
      const [fx, fz] = clampToValeNav(group.position.x, group.position.z)
      group.position.x = fx
      group.position.z = fz
      if (wasMovingRef.current) {
        wasMovingRef.current = false
        setCharacterState(CHARACTER_STATES.IDLE)
      }
      return
    }

    const isRun = st.characterState === CHARACTER_STATES.RUN
    const speed = isRun ? VALE_RUN_SPEED : VALE_MOVE_SPEED

    const [tx, tz] = clampToValeNav(targetPosition[0], targetPosition[2])

    const vTarget = vTargetRef.current
    const vToTarget = vToTargetRef.current
    const vDir = vDirRef.current
    const qTarget = qTargetRef.current

    vTarget.set(tx, group.position.y, tz)
    vToTarget.copy(vTarget).sub(group.position)
    vToTarget.y = 0

    const dist = vToTarget.length()
    if (dist < ARRIVAL_THRESHOLD) {
      group.position.x = tx
      group.position.z = tz
      wasMovingRef.current = false
      setCharacterState(CHARACTER_STATES.IDLE)
      clearTarget()
      return
    }

    vDir.copy(vToTarget).normalize()
    const step = Math.min(dist, speed * delta)
    let nx = group.position.x + vDir.x * step
    let nz = group.position.z + vDir.z * step
    ;[nx, nz] = clampToValeNav(nx, nz)

    group.position.x = nx
    group.position.z = nz

    qTarget.setFromUnitVectors(vForwardRef.current, vDir)
    group.quaternion.slerp(qTarget, 1 - Math.exp(-ROTATION_SPEED * delta))

    if (!wasMovingRef.current) wasMovingRef.current = true
    setCharacterState(isRun ? CHARACTER_STATES.RUN : CHARACTER_STATES.WALK)
  })
}
