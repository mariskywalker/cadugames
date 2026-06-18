'use client'

import { useEffect, useRef } from 'react'
import { CHARACTER_STATES } from '@/lib/opening/animations'
import { VALE_HOTSPOT_MOVE_SPEED } from '@/lib/vale/valeGameplay'
import { VALE_STATIC_SCENE } from '@/lib/vale/valeStaticScene'
import {
  clampScreenWaypoint,
  type ValeScreenWaypoint,
} from '@/lib/vale/valeScreenPaths'
import { useValeBearScreenStore } from '@/store/useValeBearScreenStore'
import { useValeStore } from '@/store/useValeStore'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpAngle(a: number, b: number, t: number) {
  let delta = b - a
  while (delta > Math.PI) delta -= Math.PI * 2
  while (delta < -Math.PI) delta += Math.PI * 2
  return a + delta * t
}

function lerpWaypoint(a: ValeScreenWaypoint, b: ValeScreenWaypoint, t: number): ValeScreenWaypoint {
  return clampScreenWaypoint({
    screenX: lerp(a.screenX, b.screenX, t),
    screenY: lerp(a.screenY, b.screenY, t),
    scale: lerp(a.scale, b.scale, t),
    rotationY: lerpAngle(a.rotationY, b.rotationY, t),
  })
}

/** Movimento 2.5D do urso overlay — screenX/Y/scale/rotationY */
export function useValeOverlayMovement() {
  const segmentTRef = useRef(0)
  const journeyIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!VALE_STATIC_SCENE) return

    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000)
      last = now

      const st = useValeStore.getState()
      const journey = st.screenJourney

      if (!journey) {
        journeyIdRef.current = null
        raf = requestAnimationFrame(tick)
        return
      }

      if (journeyIdRef.current !== journey.hotspotId) {
        journeyIdRef.current = journey.hotspotId
        segmentTRef.current = 0
      }

      const { path, arrivePose } = journey
      const setPose = useValeBearScreenStore.getState().setPose
      const setCharacterState = useValeStore.getState().setCharacterState

      if (path.length <= 1) {
        setPose(clampScreenWaypoint({ ...arrivePose }))
        st.completeScreenJourney()
        raf = requestAnimationFrame(tick)
        return
      }

      const seg = journey.segmentIndex
      if (seg >= path.length - 1) {
        setPose(clampScreenWaypoint({ ...arrivePose }))
        st.completeScreenJourney()
        raf = requestAnimationFrame(tick)
        return
      }

      const a = path[seg]!
      const b = path[seg + 1]!
      const segLen = Math.hypot(b.screenX - a.screenX, b.screenY - a.screenY)
      const step = VALE_HOTSPOT_MOVE_SPEED * delta * 0.22

      if (segLen < 1e-5) {
        segmentTRef.current = 1
      } else {
        segmentTRef.current += step / segLen
      }

      if (segmentTRef.current >= 1) {
        segmentTRef.current = 0
        useValeStore.setState({
          screenJourney: { ...journey, segmentIndex: seg + 1 },
        })
        setCharacterState(CHARACTER_STATES.WALK)
      } else {
        setPose(lerpWaypoint(a, b, segmentTRef.current))
        setCharacterState(CHARACTER_STATES.WALK)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
}
