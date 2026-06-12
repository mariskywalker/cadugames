'use client'

import { useEffect, useRef } from 'react'
import type { AnimationAction, AnimationMixer } from 'three'
import { CHARACTER_STATES } from '@/lib/opening/animations'
import { playAnimation } from '@/lib/opening/animationActions'
import { playAnimationCommand } from '@/lib/opening/animationCommandPlay'

const LOCOMOTION_COMMANDS: Record<string, string> = {
  [CHARACTER_STATES.IDLE]: 'idle',
  [CHARACTER_STATES.WALK]: 'walk',
  [CHARACTER_STATES.RUN]: 'run',
}

export function useCharacterAnimations({
  actions,
  mixer,
  clipsReady,
  characterState,
  targetPosition,
  animationClips,
}: {
  actions: Record<string, AnimationAction | null> | undefined
  mixer: AnimationMixer | null
  clipsReady: boolean
  characterState: string
  targetPosition: [number, number, number] | null
  /** Lista canônica de clipes disponíveis (vinda do store da cena) */
  animationClips: string[]
}) {
  const lastClipRef = useRef<string | null>(null)
  const bootedRef = useRef(false)

  useEffect(() => {
    if (!clipsReady || !actions) return
    if (!animationClips?.length) return

    let clipName: string | null = null
    let commandKey: string | null = null

    if (
      targetPosition ||
      characterState === CHARACTER_STATES.WALK ||
      characterState === CHARACTER_STATES.RUN
    ) {
      const state =
        characterState === CHARACTER_STATES.RUN ? CHARACTER_STATES.RUN : CHARACTER_STATES.WALK
      commandKey = LOCOMOTION_COMMANDS[state]
    } else {
      commandKey = 'idle'
    }

    if (lastClipRef.current === clipName && bootedRef.current && !commandKey) return
    if (commandKey && lastClipRef.current === commandKey && bootedRef.current) return

    const hard = !bootedRef.current
    const result = commandKey
      ? playAnimationCommand(actions, commandKey, animationClips, { loop: true, hard, mixer })
      : playAnimation(actions, clipName!, { loop: true, hard, mixer })

    if (!result.ok) return

    bootedRef.current = true
    lastClipRef.current = commandKey ?? clipName
  }, [actions, mixer, clipsReady, characterState, targetPosition, animationClips])
}
