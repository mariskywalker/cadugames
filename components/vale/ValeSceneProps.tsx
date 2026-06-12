'use client'

import { useCallback, useRef } from 'react'
import {
  buildLayerTransform,
  layerMoveFromPointer,
  pickLayerMoveAxis,
} from '@/lib/vale/layerTransform'
import { parsePercent } from '@/lib/vale/stoneNodeEditorStorage'
import {
  VALE_SCENE_PROP_ASSETS,
  type ScenePropLayout,
} from '@/lib/vale/scenePropAssets'
import { useValePropEditorStore } from '@/store/useValePropEditorStore'

type PropMovePatch = Partial<
  Pick<ScenePropLayout, 'left' | 'bottom' | 'translateXPx' | 'translateYPx' | 'translateZPx'>
>

function ScenePropSprite({
  layout,
  editorActive,
  selected,
  onSelect,
  onMove,
}: {
  layout: ScenePropLayout
  editorActive: boolean
  selected: boolean
  onSelect: () => void
  onMove: (patch: PropMovePatch) => void
}) {
  const asset = VALE_SCENE_PROP_ASSETS[layout.id]
  const dragRef = useRef<{
    startX: number
    startY: number
    leftPct: number
    bottomPct: number
    translateXPx: number
    translateYPx: number
    translateZPx: number
    axis: ReturnType<typeof pickLayerMoveAxis>
  } | null>(null)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!editorActive || !selected) return
      e.preventDefault()
      e.stopPropagation()
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        leftPct: parsePercent(layout.left),
        bottomPct: parsePercent(layout.bottom),
        translateXPx: layout.translateXPx ?? 0,
        translateYPx: layout.translateYPx ?? 0,
        translateZPx: layout.translateZPx ?? 0,
        axis: pickLayerMoveAxis(e.shiftKey, e.altKey),
      }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [editorActive, selected, layout],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      onMove(layerMoveFromPointer(dragRef.current.axis, dx, dy, dragRef.current) as PropMovePatch)
    },
    [onMove],
  )

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (!editorActive || !selected) return
      e.preventDefault()
      e.stopPropagation()
      onMove({ translateZPx: (layout.translateZPx ?? 0) - e.deltaY * 0.2 })
    },
    [editorActive, selected, onMove, layout.translateZPx],
  )

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!editorActive) return
      e.preventDefault()
      e.stopPropagation()
      onSelect()
    },
    [editorActive, onSelect],
  )

  const blurPx = editorActive && selected ? 0 : layout.blurPx ?? 0
  const imgFilter =
    editorActive && selected
      ? 'drop-shadow(0 0 14px rgba(255, 200, 100, 0.65))'
      : blurPx > 0
        ? `blur(${blurPx}px)`
        : undefined

  return (
    <div
      className={`vale-scene-prop${editorActive ? ' vale-scene-prop--editor' : ''}${selected ? ' vale-scene-prop--selected' : ''}`}
      style={{
        left: layout.left,
        bottom: layout.bottom,
        width: layout.width,
        zIndex: editorActive && selected ? 19 : layout.zIndex,
        opacity: layout.opacity,
        transform: buildLayerTransform(layout),
      }}
      role={editorActive ? 'button' : undefined}
      tabIndex={editorActive ? 0 : undefined}
      aria-label={editorActive ? asset.label : undefined}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.src}
        alt=""
        width={asset.width}
        height={asset.height}
        draggable={false}
        className="vale-scene-prop__img"
        style={imgFilter ? { filter: imgFilter } : undefined}
      />
      {editorActive && selected && <span className="vale-scene-prop__ring" aria-hidden />}
    </div>
  )
}

export function ValeSceneProps() {
  const editorActive = useValePropEditorStore((s) => s.editorActive)
  const placements = useValePropEditorStore((s) => s.placements)
  const selectedId = useValePropEditorStore((s) => s.selectedId)
  const select = useValePropEditorStore((s) => s.select)
  const patch = useValePropEditorStore((s) => s.patch)

  return (
    <div className="vale-scene-props" aria-hidden>
      {placements.map((layout) => (
        <ScenePropSprite
          key={layout.id}
          layout={layout}
          editorActive={editorActive}
          selected={selectedId === layout.id}
          onSelect={() => select(layout.id)}
          onMove={(movePatch) => patch(layout.id, movePatch)}
        />
      ))}
    </div>
  )
}
