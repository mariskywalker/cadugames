/**
 * AnimationCommandMap — comando semântico → clip.name corrigido (canonical).
 * Valores = exatamente os nomes validados no AnimationClipTester.
 */
export const animationCommands = {
  idle: 'Idle_11',
  walk: 'Walking',
  run: 'Running',
  barClimb: 'Fast_Ladder_Climb',
  barHang: 'Slow_Bar_Hang_Right',
  barJumpHang: 'Jump_and_Hang_on_Bar',
  barFall: 'Fall_from_Bar',
}

/** UI — rótulos amigáveis (nunca usados para tocar clip). */
export const animationCommandLabels = {
  idle: 'Idle',
  walk: 'Caminhar',
  run: 'Correr',
  barClimb: 'Subir barra',
  barHang: 'Pendurar na barra',
  barJumpHang: 'Pular e segurar barra',
  barFall: 'Cair da barra',
}

/** Sequência padrão da Barra de Atividades (fonte: activityBarsInteraction.js). */
export const ACTIVITY_BAR_COMMAND_SEQUENCE = [
  'barJumpHang',
  'barHang',
  'barClimb',
  'barFall',
  'idle',
]

export function getAnimationCommandKeys() {
  return Object.keys(animationCommands)
}

export function getCommandClipName(commandKey) {
  return animationCommands[commandKey] ?? null
}

export function getCommandLabel(commandKey) {
  return animationCommandLabels[commandKey] ?? commandKey
}
