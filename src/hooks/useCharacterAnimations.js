import { useEffect, useRef } from 'react'
import { CHARACTER_STATES } from '../constants/animations'
import { CHARACTER_STATE_TO_REGISTRY_ROLE } from '../constants/animationRegistry'
import { resolveRegistryClipName } from '../utils/animationRegistry'
import { playAnimation } from '../utils/animationActions'
import { playAnimationCommand } from '../utils/animationCommandPlay'
import { useCADUStore } from '../store/useCADUStore'

const LOCOMOTION_COMMANDS = {
  [CHARACTER_STATES.IDLE]: 'idle',
  [CHARACTER_STATES.WALK]: 'walk',
  [CHARACTER_STATES.RUN]: 'run',
}

/**
 * Clips = nomes corrigidos (canonical). playAnimation resolve → file no GLB.
 */
export function useCharacterAnimations({
  actions,
  mixer,
  clipsReady,
  characterState,
  targetPosition,
  manualClipName,
  debugMode,
  debugClip,
  barAnimActive,
}) {
  const animationClips = useCADUStore((s) => s.animationClips)
  const registryOverrides = useCADUStore((s) => s.registryOverrides)
  const setCurrentPlayingClip = useCADUStore((s) => s.setCurrentPlayingClip)
  const setAnimationError = useCADUStore((s) => s.setAnimationError)
  const lastClipRef = useRef(null)
  const bootedRef = useRef(false)

  useEffect(() => {
    if (!clipsReady || !actions || barAnimActive) return
    if (!animationClips?.length) return

    let clipName = null
    let commandKey = null

    try {
      if (manualClipName) {
        if (!animationClips.includes(manualClipName)) {
          throw new Error(
            `[CADU] Clip "${manualClipName}" is missing. Available: [${animationClips.join(', ')}]`,
          )
        }
        clipName = manualClipName
      } else if (debugMode && debugClip) {
        if (!animationClips.includes(debugClip)) {
          throw new Error(
            `[CADU] Clip "${debugClip}" is missing. Available: [${animationClips.join(', ')}]`,
          )
        }
        clipName = debugClip
      } else if (targetPosition || characterState === CHARACTER_STATES.WALK || characterState === CHARACTER_STATES.RUN) {
        const state = characterState === CHARACTER_STATES.RUN ? CHARACTER_STATES.RUN : CHARACTER_STATES.WALK
        commandKey = LOCOMOTION_COMMANDS[state]
      } else if (characterState !== CHARACTER_STATES.IDLE) {
        const role = CHARACTER_STATE_TO_REGISTRY_ROLE[characterState]
        if (!role) {
          throw new Error(
            `[CADU] No registry role for character state "${characterState}". Add it to animationRegistry.js`,
          )
        }
        clipName = resolveRegistryClipName(role, animationClips, registryOverrides)
      } else {
        commandKey = 'idle'
      }
    } catch (err) {
      setAnimationError(err.message)
      return
    }

    if (lastClipRef.current === clipName && bootedRef.current && !commandKey) return
    if (commandKey && lastClipRef.current === commandKey && bootedRef.current) return

    const hard = !bootedRef.current
    const result = commandKey
      ? playAnimationCommand(actions, commandKey, animationClips, { loop: true, hard, mixer })
      : playAnimation(actions, clipName, { loop: true, hard, mixer })

    if (!result.ok) {
      setAnimationError(result.error)
      return
    }

    bootedRef.current = true
    lastClipRef.current = commandKey ?? clipName
    setCurrentPlayingClip(result.clipName ?? clipName)
  }, [
    actions,
    mixer,
    clipsReady,
    characterState,
    targetPosition,
    manualClipName,
    debugMode,
    debugClip,
    barAnimActive,
    animationClips,
    registryOverrides,
    setCurrentPlayingClip,
    setAnimationError,
  ])
}
