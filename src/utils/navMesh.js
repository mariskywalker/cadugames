import { ACTIVITY_BARS_APPROACH_ZONE, NAV_OBSTACLES, NAV_ZONE } from '../constants/sceneComposition'
import { pushOutOfTubeXZ } from './tubeNav'

function pushOutOfCircleXZ(x, z, center, radius, pad = 0.42) {
  const cx = center[0]
  const cz = center[2]
  const dx = x - cx
  const dz = z - cz
  const minR = radius + pad
  const rr = Math.hypot(dx, dz)
  if (rr >= minR || rr < 1e-5) return [x, z]
  const k = minR / rr
  return [cx + dx * k, cz + dz * k]
}

function clampToEllipse(x, z) {
  const [cx, cz] = NAV_ZONE.center
  const dx = (x - cx) / NAV_ZONE.radiusX
  const dz = (z - cz) / NAV_ZONE.radiusZ
  const d2 = dx * dx + dz * dz
  if (d2 <= 1) return [x, z]
  const k = 1 / Math.sqrt(d2)
  return [cx + (x - cx) * k, cz + (z - cz) * k]
}

export function isInsideActivityBarsApproachZone(x, z) {
  const [cx, cz] = ACTIVITY_BARS_APPROACH_ZONE.center
  const dx = x - cx
  const dz = z - cz
  const r = ACTIVITY_BARS_APPROACH_ZONE.radius
  return dx * dx + dz * dz <= r * r
}

/** Mantém o personagem na área navegável e fora dos objetos. */
export function clampToNavMesh(x, z, bubbleTubeCollider, options = {}) {
  const { barsInteractionActive = false } = options
  let px = x
  let pz = z
  ;[px, pz] = clampToEllipse(px, pz)

  const barsApproachOpen =
    barsInteractionActive || isInsideActivityBarsApproachZone(px, pz)

  for (const obstacle of NAV_OBSTACLES) {
    if (obstacle.id === 'activityBars' && barsApproachOpen) continue
    ;[px, pz] = pushOutOfCircleXZ(px, pz, obstacle.center, obstacle.radius, obstacle.pad ?? 0.42)
  }

  const pushed = pushOutOfTubeXZ([px, 0, pz], bubbleTubeCollider, 0.42)
  return [pushed[0], pushed[2]]
}

export function isInsideNavMesh(x, z) {
  const [cx, cz] = NAV_ZONE.center
  const dx = (x - cx) / NAV_ZONE.radiusX
  const dz = (z - cz) / NAV_ZONE.radiusZ
  if (dx * dx + dz * dz <= 1.02) return true
  return isInsideActivityBarsApproachZone(x, z)
}

/** Caminhada das barras — sem clamp; usa config exato. */
export function resolveBarsWalkPosition(x, z) {
  return [x, z]
}
