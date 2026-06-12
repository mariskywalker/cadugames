'use client'

import { useEffect, useState } from 'react'
import { useValeFlowerEditorStore } from '@/store/useValeFlowerEditorStore'
import { clampFlowerDepth } from '@/lib/vale/sceneFlowerAssets'

/**
 * Editor de posição das plantas — ?flowers=1 na URL ou tecla P para alternar.
 */
export function useFlowerEditorMode() {
  const [editorMode, setEditorMode] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const hydrate = useValeFlowerEditorStore((s) => s.hydrate)
  const setEditorActive = useValeFlowerEditorStore((s) => s.setEditorActive)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (
      params.get('flowers') === '1' ||
      params.get('plantas') === '1' ||
      params.get('stump') === '1' ||
      params.get('toco') === '1'
    ) {
      setEditorMode(true)
      setMessage('Editor de cenário — arraste no chão ou ajuste no painel (s-01 = toco).')
    }
  }, [])

  useEffect(() => {
    setEditorActive(editorMode)
  }, [editorMode, setEditorActive])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const inField =
        tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable

      if (
        (e.key === 'p' ||
          e.key === 'P' ||
          e.key === 't' ||
          e.key === 'T') &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !inField
      ) {
        e.preventDefault()
        setEditorMode((on) => {
          const next = !on
          setMessage(
            next ? 'Editor de cenário — arraste no chão ou ajuste no painel (s-01 = toco).' : null,
          )
          return next
        })
        return
      }

      if (!editorMode || inField) return

      const store = useValeFlowerEditorStore.getState()
      const selected = store.placements.find((f) => f.id === store.selectedId)
      if (!selected) return

        if (e.key === '[' || e.key === ']') {
        e.preventDefault()
        const delta = e.key === ']' ? 0.12 : -0.12
        const [px, py, pz] = selected.position
        store.patch(selected.id, {
          position: [px, py, clampFlowerDepth(pz + delta)],
        })
        store.setMoveAxis('depth')
      }

      if (e.key === '1') store.setMoveAxis('free')
      if (e.key === '2') store.setMoveAxis('depth')
      if (e.key === '3') store.setMoveAxis('lateral')
      if (e.key === '4') store.setMoveAxis('vertical')
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editorMode])

  useEffect(() => {
    document.body.classList.toggle('vale-flower-editor-active', editorMode)
    return () => document.body.classList.remove('vale-flower-editor-active')
  }, [editorMode])

  return { editorMode, setEditorMode, message, setMessage }
}
