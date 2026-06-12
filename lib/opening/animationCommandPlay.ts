import { getCommandClipName } from './animationCommandMap'
import { playAnimation } from './animationActions'
import type * as THREE from 'three'

export function validateAnimationCommand(commandKey: string, availableClips: string[]) {
  const clipName = getCommandClipName(commandKey)
  if (!clipName) {
    return { ok: false as const, error: `[Opening] Unknown animation command: "${commandKey}"` }
  }
  if (!availableClips.includes(clipName)) {
    return {
      ok: false as const,
      error: `[Opening] Clip "${clipName}" (command: ${commandKey}) is missing. Available: [${availableClips.join(', ')}]`,
    }
  }
  return { ok: true as const, clipName }
}

export function playAnimationCommand(
  actions: Record<string, THREE.AnimationAction | null> | undefined,
  commandKey: string,
  availableClips: string[],
  options: Parameters<typeof playAnimation>[2] = {},
) {
  const validation = validateAnimationCommand(commandKey, availableClips)
  if (!validation.ok) return validation

  const result = playAnimation(actions, validation.clipName, options)
  if (result.ok) {
    return { ...result, commandKey, clipName: validation.clipName }
  }
  return result
}
