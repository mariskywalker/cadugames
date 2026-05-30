/** Hub carpet (StylizedRoom) — center of the sensory area. */
export const SCENE_HUB = [0, 0, 1.15]
export const SCENE_HUB_RADIUS = 4.35

/** Perimeter ring for therapeutic equipment (outside the hub carpet). */
export const THERAPEUTIC_CIRCUIT_RADIUS = SCENE_HUB_RADIUS + 1.35

export function circuitPosition(angleRad, distance = THERAPEUTIC_CIRCUIT_RADIUS) {
  return [
    Math.sin(angleRad) * distance,
    0,
    SCENE_HUB[2] + Math.cos(angleRad) * distance,
  ]
}

/** Face the hub center from a circuit station. */
export function circuitRotationTowardHub(position) {
  return [0, Math.atan2(SCENE_HUB[0] - position[0], SCENE_HUB[2] - position[2]), 0]
}
