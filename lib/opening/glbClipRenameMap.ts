import { CADU_V2_CLIP_NAMES } from './animationClipCategories'

export const VERIFIED_FILE_TO_CANONICAL: Record<string, string> = {
  Idle_11: 'Walking',
  Walking: 'Jump_and_Hang_on_Bar',
  Angry_Ground_Stomp: 'Running',
  Angry_Ground_Stomp_2: 'Spiderman',
  Fast_Ladder_Climb: 'Tantrum',
  Jump_and_Hang_on_Bar: 'Dipindura',
  Rope_Hang_Backflip_to_Crouch: 'Subindo',
  Bar_Hang_Idle: 'Slow_Bar_Hang_Right',
  Depressed_Full_Turn_Left: 'Bravo',
  Happy_Sway_Standing: 'Desapontado',
  Running: 'Feliz',
  Slow_Bar_Hang_Right: 'Idle',
}

const CANONICAL_TO_FILE = Object.fromEntries(
  Object.entries(VERIFIED_FILE_TO_CANONICAL).map(([file, canonical]) => [canonical, file]),
)

export function resolveFileClipName(canonicalName: string) {
  const file = CANONICAL_TO_FILE[canonicalName]
  if (!file) {
    if ((CADU_V2_CLIP_NAMES as readonly string[]).includes(canonicalName)) return canonicalName
    return canonicalName
  }
  return file
}

export function getCanonicalClipName(fileName: string) {
  return VERIFIED_FILE_TO_CANONICAL[fileName] ?? fileName
}

export function getEffectiveCanonicalClipNames() {
  return [...CADU_V2_CLIP_NAMES]
}
