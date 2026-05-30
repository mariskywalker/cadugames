import { BUBBLE_TUBE_CENTER, BUBBLE_TUBE_RADIUS } from '../constants/animations'

const DEFAULT_AVOID_RADIUS = BUBBLE_TUBE_RADIUS + 0.85

export function getTubeAvoidRadius(collider) {
  if (collider?.radius && Number.isFinite(collider.radius)) {
    return collider.radius
  }
  return DEFAULT_AVOID_RADIUS
}

/** Keep character outside the tube column (XZ). */
export function pushOutOfTubeXZ(pos, collider, characterPad = 0.42) {
  const [cx, , cz] = collider?.center ?? BUBBLE_TUBE_CENTER
  const minR = getTubeAvoidRadius(collider) + characterPad

  const x = pos[0] - cx
  const z = pos[2] - cz
  const rr = Math.hypot(x, z)
  if (rr >= minR || rr < 1e-5) return [pos[0], 0, pos[2]]

  const k = minR / rr
  return [cx + x * k, 0, cz + z * k]
}

export function isInsideTubeXZ(x, z, collider, pad = 0.2) {
  const [cx, , cz] = collider?.center ?? BUBBLE_TUBE_CENTER
  const minR = getTubeAvoidRadius(collider) + pad
  return Math.hypot(x - cx, z - cz) < minR
}

export function clampWalkTargetOutsideTube(pos, collider) {
  return pushOutOfTubeXZ(pos, collider, 0.42)
}
