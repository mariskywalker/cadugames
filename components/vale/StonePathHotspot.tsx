'use client'

import type { StoneNodeLayout, StoneNodeState } from '@/lib/vale/stoneNodes'

export function StonePathHotspot({
  node,
  state,
  editorMode = false,
  selected = false,
  onSelect,
  onClick,
}: {
  node: StoneNodeLayout
  state: StoneNodeState
  editorMode?: boolean
  selected?: boolean
  onSelect?: () => void
  onClick: () => void
}) {
  const isLocked = state === 'locked' && !editorMode

  return (
    <button
      type="button"
      className={`stone-path-hit stone-path-hit--${state}${editorMode ? ' stone-path-hit--editor' : ''}${selected ? ' stone-path-hit--selected' : ''}`}
      style={{
        left: `${node.hitU}%`,
        top: `${node.hitV}%`,
        width: `${node.hitSize}%`,
        height: `${node.hitSize}%`,
        zIndex: editorMode && selected ? 12 : node.zIndex,
      }}
      aria-label={`${node.label}${isLocked ? ' — bloqueado' : ''}`}
      aria-disabled={isLocked}
      onClick={(e) => {
        if (editorMode) {
          e.preventDefault()
          e.stopPropagation()
          onSelect?.()
          return
        }
        if (!isLocked) onClick()
      }}
    >
      {editorMode && <span className="stone-path-hit__ring" aria-hidden />}
      {!editorMode && state === 'completed' && (
        <span className="stone-path-hit__check" aria-hidden>
          ✓
        </span>
      )}
      {!editorMode && state === 'current' && <span className="stone-path-hit__pulse" aria-hidden />}
      {!editorMode && (
        <span className="stone-path-hit__emoji" aria-hidden>
          {node.emoji}
        </span>
      )}
    </button>
  )
}
