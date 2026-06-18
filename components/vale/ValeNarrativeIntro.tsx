'use client'

import { useEffect, useRef } from 'react'
import { valeStageReady } from '@/lib/vale/valeWorld'
import { useValeStore } from '@/store/useValeStore'

/** Posiciona o Cadu na cena (parado ou caminhada narrativa) após carregar */
export function ValeNarrativeIntro() {
  const modelStatus = useValeStore((s) => s.modelStatus)
  const narrativeIntroComplete = useValeStore((s) => s.narrativeIntroComplete)
  const startNarrativeIntro = useValeStore((s) => s.startNarrativeIntro)
  const startedRef = useRef(false)

  useEffect(() => {
    if (modelStatus !== 'loaded' || narrativeIntroComplete || startedRef.current) return

    let cancelled = false
    let frame = 0

    const waitForStage = () => {
      if (cancelled) return
      if (!valeStageReady.ready) {
        frame = window.requestAnimationFrame(waitForStage)
        return
      }
      startedRef.current = true
      frame = window.requestAnimationFrame(() => {
        if (!cancelled) startNarrativeIntro()
      })
    }

    waitForStage()
    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
    }
  }, [modelStatus, narrativeIntroComplete, startNarrativeIntro])

  return null
}
