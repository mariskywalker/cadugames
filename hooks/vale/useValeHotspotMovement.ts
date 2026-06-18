'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { RefObject } from 'react'
import type { Group } from 'three'
import { CHARACTER_STATES, type CharacterState } from '@/lib/opening/animations'
import { VALE_HOTSPOT_MOVE_SPEED, VALE_NARRATIVE_MOVE_SPEED } from '@/lib/vale/valeGameplay'
import type { ValeBearTarget, ValeHotspotWaypoint } from '@/lib/vale/valeHotspots'
import { VALE_GAMEPLAY_ENABLED } from '@/lib/vale/valeBearSafe'
import { NARRATIVE_INTRO_JOURNEY_ID } from '@/lib/vale/valeNarrativeIntro'
import { VALE_HERO_MODE } from '@/lib/vale/valeWorld'
import { useValeStore } from '@/store/useValeStore'

function lerpAngle(a: number, b: number, t: number) {
  let delta = b - a
  while (delta > Math.PI) delta -= Math.PI * 2
  while (delta < -Math.PI) delta += Math.PI * 2
  return a + delta * t
}

function lerpWaypoint(a: ValeHotspotWaypoint, b: ValeHotspotWaypoint, t: number) {
  return {
    x: THREE.MathUtils.lerp(a.x, b.x, t),
    z: THREE.MathUtils.lerp(a.z, b.z, t),
    rotationY: lerpAngle(a.rotationY, b.rotationY, t),
  }
}

function snapBearToTarget(group: Group, bearTarget: ValeBearTarget) {
  group.position.x = bearTarget.x
  group.position.z = bearTarget.z
  group.rotation.set(0, bearTarget.rotationY, 0)
}

/** Movimento do urso por caminhos fixos 3D — só gameplay, sem alterar rig */
export function useValeHotspotMovement({
  groupRef,
  setCharacterState,
}: {
  groupRef: RefObject<Group | null>
  setCharacterState: (state: CharacterState) => void
}) {
  const segmentTRef = useRef(0)
  const journeyIdRef = useRef<string | null>(null)

  useFrame((_, delta) => {
    if (!VALE_HERO_MODE || !VALE_GAMEPLAY_ENABLED) return

    const group = groupRef.current
    if (!group) return

    const st = useValeStore.getState()
    const journey = st.hotspotJourney
    if (!journey) {
      journeyIdRef.current = null
      return
    }

    if (journeyIdRef.current !== journey.hotspotId) {
      journeyIdRef.current = journey.hotspotId
      segmentTRef.current = 0
    }

    const { path, bearTarget } = journey

    if (path.length === 0) {
      snapBearToTarget(group, bearTarget)
      st.completeHotspotJourney()
      return
    }

    if (path.length === 1) {
      snapBearToTarget(group, bearTarget)
      st.completeHotspotJourney()
      return
    }

    const seg = journey.segmentIndex
    if (seg >= path.length - 1) {
      snapBearToTarget(group, bearTarget)
      st.completeHotspotJourney()
      return
    }

    const a = path[seg]!
    const b = path[seg + 1]!
    const segLen = Math.hypot(b.x - a.x, b.z - a.z)
    const speed =
      journey.hotspotId === NARRATIVE_INTRO_JOURNEY_ID
        ? VALE_NARRATIVE_MOVE_SPEED
        : VALE_HOTSPOT_MOVE_SPEED
    const step = speed * delta

    if (segLen < 1e-5) {
      segmentTRef.current = 1
    } else {
      segmentTRef.current += step / segLen
    }

    if (segmentTRef.current >= 1) {
      segmentTRef.current = 0
      useValeStore.setState({ hotspotJourney: { ...journey, segmentIndex: seg + 1 } })
      setCharacterState(CHARACTER_STATES.WALK)
      return
    }

    const pos = lerpWaypoint(a, b, segmentTRef.current)
    group.position.x = pos.x
    group.position.z = pos.z
    group.rotation.set(0, pos.rotationY, 0)

    setCharacterState(CHARACTER_STATES.WALK)
  })
}
