'use client'

import { useCallback, useRef, type ReactNode } from 'react'
import {
  buildLayerTransform,
  layerMoveFromPointer,
  pickLayerMoveAxis,
} from '@/lib/vale/layerTransform'
import { PATH_LAYER_ASSET } from '@/lib/vale/pathLayerEditorStorage'
import { parsePercent } from '@/lib/vale/stoneNodeEditorStorage'
import type { PathLayerLayout } from '@/lib/vale/pathLayer'

type LayerMovePatch = Partial<
  Pick<PathLayerLayout, 'left' | 'bottom' | 'translateXPx' | 'translateYPx' | 'translateZPx'>
>

export function ValePathLayer({
  layer,
  assetSrc,
  assetWidth,
  assetHeight,
  assetVersion = 0,
  editorMode = false,
  selected = false,
  onSelect,
  onMove,
  children,
}: {
  layer: PathLayerLayout
  assetSrc?: string
  assetWidth?: number
  assetHeight?: number
  assetVersion?: number
  editorMode?: boolean
  selected?: boolean
  onSelect?: () => void
  onMove?: (patch: LayerMovePatch) => void
  children?: ReactNode
}) {
  const src = assetSrc ?? PATH_LAYER_ASSET.src
  const imgSrc = assetVersion ? `${src}?v=${assetVersion}` : src
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
      if (!editorMode || !selected || !onMove) return
      e.preventDefault()
      e.stopPropagation()
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        leftPct: parsePercent(layer.left),
        bottomPct: parsePercent(layer.bottom),
        translateXPx: layer.translateXPx ?? 0,
        translateYPx: layer.translateYPx ?? 0,
        translateZPx: layer.translateZPx ?? 0,
        axis: pickLayerMoveAxis(e.shiftKey, e.altKey),
      }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [editorMode, selected, onMove, layer],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current || !onMove) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      onMove(
        layerMoveFromPointer(dragRef.current.axis, dx, dy, dragRef.current) as LayerMovePatch,
      )
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
      if (!editorMode || !selected || !onMove) return
      e.preventDefault()
      e.stopPropagation()
      onMove({ translateZPx: (layer.translateZPx ?? 0) - e.deltaY * 0.2 })
    },
    [editorMode, selected, onMove, layer.translateZPx],
  )

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!editorMode) return
      e.preventDefault()
      e.stopPropagation()
      onSelect?.()
    },
    [editorMode, onSelect],
  )

  return (
    <div
      className={`vale-path-layer${editorMode ? ' vale-path-layer--editor' : ''}${selected ? ' vale-path-layer--selected' : ''}`}
      style={{
        left: layer.left,
        bottom: layer.bottom,
        width: layer.width,
        zIndex: editorMode && selected ? 19 : layer.zIndex,
        opacity: layer.opacity,
        transform: buildLayerTransform(layer),
      }}
      role={editorMode ? 'button' : undefined}
      tabIndex={editorMode ? 0 : undefined}
      aria-label={editorMode ? 'Imagem do caminho de pedras' : undefined}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt=""
        width={assetWidth ?? PATH_LAYER_ASSET.width}
        height={assetHeight ?? PATH_LAYER_ASSET.height}
        draggable={false}
        className="vale-path-layer__img"
      />
      <div className="vale-path-layer__hits">{children}</div>
      {editorMode && selected && <span className="vale-path-layer__ring" aria-hidden />}
    </div>
  )
}
