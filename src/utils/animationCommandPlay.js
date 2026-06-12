import { getCommandClipName } from '../constants/animationCommandMap'
import { playAnimation } from './animationActions'

export function commandClipExists(commandKey, availableClips) {
  const clipName = getCommandClipName(commandKey)
  if (!clipName || !Array.isArray(availableClips)) return false
  return availableClips.includes(clipName)
}

/**
 * Valida comando + clip antes de tocar. Sem fallback silencioso.
 * @returns {{ ok: true, clipName: string } | { ok: false, error: string }}
 */
export function validateAnimationCommand(commandKey, availableClips) {
  const clipName = getCommandClipName(commandKey)
  if (!clipName) {
    const error = `[CADU] Unknown animation command: "${commandKey}"`
    console.error(error)
    return { ok: false, error }
  }
  if (!Array.isArray(availableClips) || !availableClips.includes(clipName)) {
    const error = `[CADU] Clip "${clipName}" (command: ${commandKey}) is missing from GLB. Available: [${(availableClips ?? []).join(', ')}]`
    console.error(error)
    return { ok: false, error }
  }
  return { ok: true, clipName }
}

/**
 * Toca clip de um comando do AnimationCommandMap.
 * @returns {ReturnType<typeof playAnimation> & { commandKey?: string, clipName?: string }}
 */
export function playAnimationCommand(
  actions,
  commandKey,
  availableClips,
  options = {},
) {
  const validation = validateAnimationCommand(commandKey, availableClips)
  if (!validation.ok) return validation

  const { clipName } = validation
  const result = playAnimation(actions, clipName, options)
  if (result.ok) {
    console.log('[CADU] Command:', commandKey, '→ clip:', clipName)
  }
  return { ...result, commandKey, clipName }
}
