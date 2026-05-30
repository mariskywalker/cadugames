import * as THREE from 'three'
import { CROSSFADE_DURATION } from '../constants/animations'
import { resolveFileClipName } from '../constants/glbClipRenameMap'

/** Resolve nome corrigido → action no GLB (actions keyed by raw file names). */
export function findAnimationAction(actions, canonicalClipName) {
  if (!actions || !canonicalClipName) return null
  const fileClipName = resolveFileClipName(canonicalClipName)
  return actions[fileClipName] ?? null
}

export function listAnimationActionNames(actions) {
  return actions ? Object.keys(actions) : []
}

export function stopAllAnimations(mixer) {
  if (mixer) mixer.stopAllAction()
}

/**
 * @param {string} clipName — nome corrigido (canonical)
 * @returns {{ ok: true, action, canonicalClipName, fileClipName } | { ok: false, error: string }}
 */
export function playAnimation(
  actions,
  clipName,
  {
    loop = true,
    fade = CROSSFADE_DURATION,
    hard = false,
    mixer = null,
    onFinished = null,
  } = {},
) {
  const fileClipName = resolveFileClipName(clipName)
  const action = actions?.[fileClipName]
  if (!action) {
    const available = listAnimationActionNames(actions)
    const error = `[CADU] Animation not found: "${clipName}" (file: "${fileClipName}"). Raw GLB: [${available.join(', ')}]`
    console.error(error)
    return { ok: false, error }
  }

  stopAllAnimations(mixer)

  action.reset()
  action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1)
  action.clampWhenFinished = !loop
  action.setEffectiveWeight(1)
  action.enabled = true
  action.fadeIn(hard ? 0.05 : fade).play()

  if (!loop && onFinished) {
    const handler = (event) => {
      if (event?.action && event.action !== action) return
      action.removeEventListener('finished', handler)
      onFinished()
    }
    action.addEventListener('finished', handler)
  }

  console.log('[CADU] Playing clip:', clipName, '→ file:', fileClipName)
  return { ok: true, action, canonicalClipName: clipName, fileClipName }
}

/** @deprecated use playAnimation */
export const playAnimationClip = playAnimation
