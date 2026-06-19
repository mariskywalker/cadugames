import { ACTIVITY_BARS_APPROACH_ZONE, NAV_ZONE } from './sceneComposition'
import type { OpeningSceneLayout } from './openingSceneEditorLayout'
import { getOpeningNavObstacles } from './openingNavMesh'
import { pushOutOfTubeXZ, type TubeCollider } from './tubeNav'

function pushOutOfCircleXZ(
  x: number,
  z: number,
  center: [number, number, number],
  radius: number,
  pad = 0.42,
) {
  const cx = center[0]
  const cz = center[2]
  const dx = x - cx
  const dz = z - cz
  const minR = radius + pad
  const rr = Math.hypot(dx, dz)
  if (rr >= minR || rr < 1e-5) return [x, z] as [number, number]
  const k = minR / rr
  return [cx + dx * k, cz + dz * k] as [number, number]
}

function clampToEllipse(x: number, z: number) {
  const [cx, cz] = NAV_ZONE.center
  const dx = (x - cx) / NAV_ZONE.radiusX
  const dz = (z - cz) / NAV_ZONE.radiusZ
  const d2 = dx * dx + dz * dz
  if (d2 <= 1) return [x, z] as [number, number]
  const k = 1 / Math.sqrt(d2)
  return [cx + (x - cx) * k, cz + (z - cz) * k] as [number, number]
}

export function isInsideActivityBarsApproachZone(x: number, z: number) {
  const [cx, cz] = ACTIVITY_BARS_APPROACH_ZONE.center
  const dx = x - cx
  const dz = z - cz
  return dx * dx + dz * dz <= ACTIVITY_BARS_APPROACH_ZONE.radius ** 2
}

export function clampToNavMesh(
  x: number,
  z: number,
  bubbleTubeCollider: TubeCollider | null,
  layout?: OpeningSceneLayout,
) {
  let px = x
  let pz = z
  ;[px, pz] = clampToEllipse(px, pz)

  const barsApproachOpen = isInsideActivityBarsApproachZone(px, pz)
  const obstacles = layout ? getOpeningNavObstacles(layout) : []

  for (const obstacle of obstacles) {
    if (obstacle.id === 'activityBars' && barsApproachOpen) continue
    ;[px, pz] = pushOutOfCircleXZ(px, pz, obstacle.center, obstacle.radius, obstacle.pad ?? 0.42)
  }

  const pushed = pushOutOfTubeXZ([px, 0, pz], bubbleTubeCollider, 0.42)
  return [pushed[0], pushed[2]] as [number, number]
}

export function isInsideNavMesh(x: number, z: number) {
  const [cx, cz] = NAV_ZONE.center
  const dx = (x - cx) / NAV_ZONE.radiusX
  const dz = (z - cz) / NAV_ZONE.radiusZ
  if (dx * dx + dz * dz <= 1.02) return true
  return isInsideActivityBarsApproachZone(x, z)
}
