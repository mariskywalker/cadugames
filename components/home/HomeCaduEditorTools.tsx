'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useHomeCaduEditorStore } from '@/store/useHomeCaduEditorStore'

export function HomeCaduEditorFab({
  editorMode,
  onToggle,
}: {
  editorMode: boolean
  onToggle: () => void
}) {
  if (editorMode) return null

  return (
    <button
      type="button"
      className="home-cadu-editor-fab"
      onClick={onToggle}
      aria-label="Abrir editor do urso"
    >
      <span aria-hidden>✏️</span>
      <span>Editor urso</span>
    </button>
  )
}

export function useHomeCaduDrag(editorMode: boolean) {
  const patch = useHomeCaduEditorStore((s) => s.patch)
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    baseOffsetX: 0,
    baseOffsetY: 0,
  })

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editorMode) return
      e.preventDefault()
      e.stopPropagation()
      const st = useHomeCaduEditorStore.getState().layout
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        baseOffsetX: st.offsetX,
        baseOffsetY: st.offsetY,
      }
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [editorMode],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!editorMode || !dragRef.current.active) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      patch({
        offsetX: Math.round(dragRef.current.baseOffsetX + dx),
        offsetY: Math.round(dragRef.current.baseOffsetY - dy),
      })
    },
    [editorMode, patch],
  )

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragRef.current.active = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }, [])

  return { onPointerDown, onPointerMove, onPointerUp }
}

export function HomeCaduEditorSelection({ editorMode }: { editorMode: boolean }) {
  if (!editorMode) return null
  return <div className="home-scene__cadu-selection" aria-hidden />
}

export function useHomeCaduEditorHydrate() {
  const hydrate = useHomeCaduEditorStore((s) => s.hydrate)
  useEffect(() => {
    hydrate()
  }, [hydrate])
}

export function useHomeWideLayout() {
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1200px)')
    const update = () => setWide(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return wide
}
