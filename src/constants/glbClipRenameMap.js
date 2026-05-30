/**
 * Mapa verificado manualmente no AnimationClipTester (2026-05-29).
 *
 * Chave   = nome no arquivo GLB (raw / errado)
 * Valor   = nome corrigido (comportamento real)
 */
export const VERIFIED_FILE_TO_CANONICAL = {
  Angry_Ground_Stomp: 'Fall_from_Bar',
  Angry_Ground_Stomp_2: 'Angry_Ground_Stomp_2',
  Depressed_Full_Turn_Left: 'Fast_Ladder_Climb',
  Fall_from_Bar: 'Happy_Sway_Standing',
  Fast_Ladder_Climb: 'Jump_and_Hang_on_Bar',
  Happy_Sway_Standing: 'Slow_Bar_Hang_Right',
  Idle_11: 'Walking',
  Jump_and_Hang_on_Bar: 'Angry_Ground_Stomp',
  Running: 'Depressed_Full_Turn_Left',
  Slow_Bar_Hang_Right: 'Idle_11',
  Walking: 'Running',
}

export const FILE_TO_CANONICAL = VERIFIED_FILE_TO_CANONICAL

export const CANONICAL_TO_FILE = Object.fromEntries(
  Object.entries(FILE_TO_CANONICAL).map(([file, canonical]) => [canonical, file]),
)

export const CANONICAL_CLIP_NAMES = Object.keys(CANONICAL_TO_FILE).sort()

export function resolveFileClipName(canonicalName) {
  const file = CANONICAL_TO_FILE[canonicalName]
  if (!file) {
    console.warn(`[glbClipRenameMap] no file mapping for canonical "${canonicalName}"`)
    return canonicalName
  }
  return file
}

export function getCanonicalClipName(fileName) {
  return FILE_TO_CANONICAL[fileName] ?? null
}
