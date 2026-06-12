'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { RefObject } from 'react'
import type { Group } from 'three'
import {
  ARRIVAL_THRESHOLD,
  CHARACTER_STATES,
  MOVE_SPEED,
  RUN_SPEED,
  ROTATION_SPEED,
  type CharacterState,
} from '@/lib/opening/animations'
import { clampToNavMesh } from '@/lib/opening/navMesh'
import { useOpeningStore } from '@/store/useOpeningStore'

export function useCharacterMovement({
  groupRef,
  setCharacterState,
}: {
  groupRef: RefObject<Group | null>
  setCharacterState: (state: CharacterState) => void
}) {
  const clearTarget = useOpeningStore((s) => s.clearTarget)
  const vTargetRef = useRef(new THREE.Vector3())
  const vToTargetRef = useRef(new THREE.Vector3())
  const vDirRef = useRef(new THREE.Vector3())
  const qTargetRef = useRef(new THREE.Quaternion())
  const vForwardRef = useRef(new THREE.Vector3(0, 0, 1))
  const wasMovingRef = useRef(false)

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const st = useOpeningStore.getState()
    const targetPosition = st.targetPosition

    const resolvePos = (x: number, z: number) =>
      clampToNavMesh(x, z, st.bubbleTubeCollider)

    if (!targetPosition) {
      const fixed = resolvePos(group.position.x, group.position.z)
      group.position.x = fixed[0]
      group.position.z = fixed[1]
      group.position.y = 0
      if (wasMovingRef.current) {
        wasMovingRef.current = false
        setCharacterState(CHARACTER_STATES.IDLE)
      }
      return
    }

    const characterState = st.characterState
    const isRun = characterState === CHARACTER_STATES.RUN
    const speed = isRun ? RUN_SPEED : MOVE_SPEED

    const [tx, tz] = resolvePos(targetPosition[0], targetPosition[2])
    const ty = 0

    const vTarget = vTargetRef.current
    const vToTarget = vToTargetRef.current
    const vDir = vDirRef.current
    const qTarget = qTargetRef.current

    vTarget.set(tx, ty, tz)
    vToTarget.copy(vTarget).sub(group.position)
    vToTarget.y = 0

    const dist = vToTarget.length()
    if (dist < ARRIVAL_THRESHOLD) {
      group.position.x = tx
      group.position.z = tz
      group.position.y = ty
      wasMovingRef.current = false
      setCharacterState(CHARACTER_STATES.IDLE)
      clearTarget()
      return
    }

    vDir.copy(vToTarget).normalize()
    const step = Math.min(dist, speed * delta)
    let nx = group.position.x + vDir.x * step
    const ny = 0
    let nz = group.position.z + vDir.z * step

    ;[nx, nz] = resolvePos(nx, nz)

    group.position.x = nx
    group.position.y = ny
    group.position.z = nz

    qTarget.setFromUnitVectors(vForwardRef.current, vDir)
    group.quaternion.slerp(qTarget, 1 - Math.exp(-ROTATION_SPEED * delta))

    if (!wasMovingRef.current) wasMovingRef.current = true
    setCharacterState(isRun ? CHARACTER_STATES.RUN : CHARACTER_STATES.WALK)
  })
}
