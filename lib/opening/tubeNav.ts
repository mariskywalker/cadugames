import { BUBBLE_TUBE_CENTER, BUBBLE_TUBE_RADIUS } from './animations'

const DEFAULT_AVOID_RADIUS = BUBBLE_TUBE_RADIUS + 0.85

export interface TubeCollider {
  center?: [number, number, number]
  radius?: number
}

export function getTubeAvoidRadius(collider: TubeCollider | null) {
  if (collider?.radius && Number.isFinite(collider.radius)) {
    return collider.radius
  }
  return DEFAULT_AVOID_RADIUS
}

export function pushOutOfTubeXZ(
  pos: [number, number, number],
  collider: TubeCollider | null,
  characterPad = 0.42,
): [number, number, number] {
  const [cx, , cz] = collider?.center ?? BUBBLE_TUBE_CENTER
  const minR = getTubeAvoidRadius(collider) + characterPad

  const x = pos[0] - cx
  const z = pos[2] - cz
  const rr = Math.hypot(x, z)
  if (rr >= minR || rr < 1e-5) return [pos[0], 0, pos[2]]

  const k = minR / rr
  return [cx + x * k, 0, cz + z * k]
}
