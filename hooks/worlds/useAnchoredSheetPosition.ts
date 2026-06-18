'use client'

import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react'

export type SheetTailSide = 'top' | 'bottom' | 'left' | 'right'

const SAFE = { top: 12, side: 12, bottom: 96 }

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Posiciona o balão ao lado do hotspot (% do viewport), com cauda apontando para o emoji. */
export function useAnchoredSheetPosition(
  balloonRef: RefObject<HTMLDivElement | null>,
  anchorX: number,
  anchorY: number,
  active: boolean,
  contentKey = '',
) {
  const [style, setStyle] = useState<CSSProperties>({})
  const [tailSide, setTailSide] = useState<SheetTailSide>('top')

  useLayoutEffect(() => {
    if (!active) return

    const measure = () => {
      const el = balloonRef.current
      if (!el) return

      const vw = window.innerWidth
      const vh = window.innerHeight
      const cardW = el.offsetWidth || Math.min(vw - 28, 320)
      const cardH = el.offsetHeight || 180
      const gap = 16

      const ax = (anchorX / 100) * vw
      const ay = (anchorY / 100) * vh

      type Candidate = { left: number; top: number; tail: SheetTailSide; score: number }
      const candidates: Candidate[] = []

      const pushSide = (tail: 'left' | 'right') => {
        const left =
          tail === 'left'
            ? ax + gap
            : ax - cardW - gap
        const top = ay - cardH / 2
        const score = tail === 'right' && ax > vw * 0.5 ? 0 : tail === 'left' && ax <= vw * 0.5 ? 0 : 1
        candidates.push({ left, top, tail, score })
      }

      const pushVertical = (tail: 'top' | 'bottom') => {
        const top =
          tail === 'top'
            ? ay + gap
            : ay - cardH - gap
        const left = ax - cardW / 2
        const score = tail === 'bottom' && ay > vh * 0.52 ? 0 : tail === 'top' && ay <= vh * 0.48 ? 0 : 1
        candidates.push({ left, top, tail, score })
      }

      pushSide(ax > vw * 0.52 ? 'right' : 'left')
      pushSide(ax > vw * 0.52 ? 'left' : 'right')
      pushVertical(ay > vh * 0.5 ? 'bottom' : 'top')
      pushVertical(ay > vh * 0.5 ? 'top' : 'bottom')

      candidates.sort((a, b) => a.score - b.score)

      let chosen = candidates[0]
      for (const c of candidates) {
        const fitsX =
          c.left >= SAFE.side && c.left + cardW <= vw - SAFE.side
        const fitsY =
          c.top >= SAFE.top && c.top + cardH <= vh - SAFE.bottom
        if (fitsX && fitsY) {
          chosen = c
          break
        }
      }

      const left = clamp(chosen.left, SAFE.side, vw - cardW - SAFE.side)
      const top = clamp(chosen.top, SAFE.top, vh - cardH - SAFE.bottom)

      setTailSide(chosen.tail)
      setStyle({
        position: 'fixed',
        left,
        top,
        bottom: 'auto',
        right: 'auto',
        transform: 'none',
        width: Math.min(cardW, vw - SAFE.side * 2),
      })
    }

    measure()
    const el = balloonRef.current
    const ro = el ? new ResizeObserver(measure) : null
    ro?.observe(el!)
    window.addEventListener('resize', measure)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [active, anchorX, anchorY, balloonRef, contentKey])

  return { style, tailSide }
}
