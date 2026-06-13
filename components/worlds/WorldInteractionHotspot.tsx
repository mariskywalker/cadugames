'use client'

import { useCallback, useRef, type RefObject } from 'react'
import type { WorldInteractionPoint } from '@/lib/worlds/types'

function clampPct(n: number) {
  return Math.min(100, Math.max(0, n))
}

export function WorldInteractionHotspot({
  point,
  visited,
  editorMode = false,
  selected = false,
  containerRef,
  onClick,
  onSelect,
  onMove,
}: {
  point: WorldInteractionPoint
  visited: boolean
  editorMode?: boolean
  selected?: boolean
  containerRef: RefObject<HTMLElement | null>
  onClick: () => void
  onSelect?: () => void
  onMove?: (x: number, y: number) => void
}) {
  const size = point.size ?? 11
  const onMoveRef = useRef(onMove)
  onMoveRef.current = onMove

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!editorMode) return
      e.preventDefault()
      e.stopPropagation()
      onSelect?.()

      const onPointerMove = (ev: PointerEvent) => {
        if (!containerRef.current || !onMoveRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = clampPct(((ev.clientX - rect.left) / rect.width) * 100)
        const y = clampPct(((ev.clientY - rect.top) / rect.height) * 100)
        onMoveRef.current(x, y)
      }

      const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
      }

      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [containerRef, editorMode, onSelect],
  )

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (editorMode) {
      onSelect?.()
      return
    }
    onClick()
  }

  return (
    <button
      type="button"
      className={[
        'world-interaction-hotspot',
        visited && !editorMode ? 'world-interaction-hotspot--visited' : '',
        editorMode ? 'world-interaction-hotspot--editor' : '',
        selected ? 'world-interaction-hotspot--selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
        width: `${size}%`,
        height: `${size}%`,
      }}
      aria-label={point.label}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {editorMode && <span className="world-interaction-hotspot__ring" aria-hidden />}
      {!editorMode && <span className="world-interaction-hotspot__pulse" aria-hidden />}
      <span className="world-interaction-hotspot__emoji" aria-hidden>
        {point.emoji}
      </span>
      <span className="world-interaction-hotspot__label">{point.label}</span>
      {editorMode && (
        <span className="world-interaction-hotspot__coords" aria-hidden>
          {point.x.toFixed(0)}%, {point.y.toFixed(0)}%
        </span>
      )}
    </button>
  )
}
