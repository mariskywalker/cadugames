/**
 * Animation Registry — semantic game actions → exact GLB clip.name.
 * Never guess: clipName must match a name from animations.map(a => a.name).
 */
export const animationRegistry = {
  idle: {
    label: 'Idle',
    clipName: 'Idle_11',
  },
  walk: {
    label: 'Caminhar',
    clipName: 'Walking',
  },
  run: {
    label: 'Correr',
    clipName: 'Running',
  },
  happy: {
    label: 'Feliz',
    clipName: 'Happy_Sway_Standing',
  },
  sad: {
    label: 'Triste',
    clipName: 'Depressed_Full_Turn_Left',
  },
  barClimb: {
    label: 'Subir barra',
    clipName: 'Fast_Ladder_Climb',
  },
  barHang: {
    label: 'Pendurar na barra',
    clipName: 'Slow_Bar_Hang_Right',
  },
  barJumpHang: {
    label: 'Pular e segurar barra',
    clipName: 'Jump_and_Hang_on_Bar',
  },
  barFall: {
    label: 'Cair da barra',
    clipName: 'Fall_from_Bar',
  },
  angry: {
    label: 'Bravo (stomp)',
    clipName: 'Angry_Ground_Stomp',
  },
}

/** characterState → registry role (only roles defined above). */
export const CHARACTER_STATE_TO_REGISTRY_ROLE = {
  idle: 'idle',
  walk: 'walk',
  run: 'run',
  happy: 'happy',
  sad: 'sad',
  angry: 'angry',
}

/** Barras de atividades — ordem da sequência. */
export const BAR_SEQUENCE_ROLES = ['barJumpHang', 'barHang', 'barFall']

/** Comandos do painel / mood — não inclui barras (sequência separada). */
export const GAMEPLAY_COMMAND_ROLES = ['idle', 'walk', 'run', 'happy', 'sad', 'angry']

export function getRegistryEntries() {
  return Object.entries(animationRegistry).map(([role, entry]) => ({
    role,
    label: entry.label,
    clipName: entry.clipName,
  }))
}

/** GLB clip.name → registry role, if assigned. */
export function getRoleForClipName(clipName) {
  const found = Object.entries(animationRegistry).find(([, e]) => e.clipName === clipName)
  return found ? found[0] : null
}

/** GLB clip.name → display label (só se clip está atribuído a uma role). */
export function getDisplayLabelForClipName(clipName, registryOverrides = {}) {
  const found = Object.entries(animationRegistry).find(
    ([role, entry]) => (registryOverrides[role] ?? entry.clipName) === clipName,
  )
  return found ? found[1].label : clipName
}
