import * as THREE from 'three'
import { CROSSFADE_DURATION } from './animations'
import { resolveFileClipName } from './glbClipRenameMap'

export function stopAllAnimations(mixer: THREE.AnimationMixer | null) {
  if (mixer) mixer.stopAllAction()
}

export function playAnimation(
  actions: Record<string, THREE.AnimationAction | null> | undefined,
  clipName: string,
  {
    loop = true,
    fade = CROSSFADE_DURATION,
    hard = false,
    mixer = null,
  }: {
    loop?: boolean
    fade?: number
    hard?: boolean
    mixer?: THREE.AnimationMixer | null
  } = {},
) {
  const fileClipName = resolveFileClipName(clipName)
  const action = actions?.[fileClipName]
  if (!action) {
    const available = actions ? Object.keys(actions) : []
    const error = `[Opening] Animation not found: "${clipName}" (file: "${fileClipName}"). Available: [${available.join(', ')}]`
    return { ok: false as const, error }
  }

  stopAllAnimations(mixer)
  action.reset()
  action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1)
  action.clampWhenFinished = !loop
  action.setEffectiveWeight(1)
  action.enabled = true
  action.fadeIn(hard ? 0.05 : fade).play()

  return { ok: true as const, action, canonicalClipName: clipName, fileClipName }
}
