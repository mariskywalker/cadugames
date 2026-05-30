export function rotationYToFacePoint(fromX, fromZ, targetX, targetZ) {
  return Math.atan2(targetX - fromX, targetZ - fromZ)
}

/** Distância para considerar “chegou” ao interactionPoint das barras (snap exato ao marcador). */
export const BARS_ARRIVAL_THRESHOLD = 1.35

export function isActivityBarsLockedPhase(phase) {
  return phase === 'orient' || phase === 'snap' || phase === 'sequence'
}

/** Locomoção bloqueada após chegar ao interactionPoint (orient → snap → sequence). */
export function isActivityBarsSequenceActive(barAnimPending, targetPosition, activityBarsPhase) {
  if (!barAnimPending) return false
  if (targetPosition) return false
  return isActivityBarsLockedPhase(activityBarsPhase)
}
