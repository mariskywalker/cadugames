'use client'

import { useEffect, useState } from 'react'
import { useValeWalkPathEditorStore } from '@/store/useValeWalkPathEditorStore'
import { useValeStore } from '@/store/useValeStore'

/**
 * Editor do path caminhável — ?walk=1 na URL ou tecla W para alternar.
 */
export function useWalkPathEditorMode() {
  const [editorMode, setEditorMode] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const hydrate = useValeWalkPathEditorStore((s) => s.hydrate)
  const setEditorActive = useValeWalkPathEditorStore((s) => s.setEditorActive)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('walk') === '1' || params.get('caminho') === '1') {
      setEditorMode(true)
      setMessage('Editor do path — arraste os pontos verdes no chão ou ajuste no painel.')
    }
  }, [])

  useEffect(() => {
    setEditorActive(editorMode)
    if (editorMode) useValeStore.getState().clearTarget()
  }, [editorMode, setEditorActive])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const inField =
        tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable

      if ((e.key === 'w' || e.key === 'W') && !e.metaKey && !e.ctrlKey && !e.altKey && !inField) {
        e.preventDefault()
        setEditorMode((on) => {
          const next = !on
          setMessage(
            next ? 'Editor do path — arraste os pontos verdes no chão ou ajuste no painel.' : null,
          )
          return next
        })
        return
      }

      if (!editorMode || inField) return

      const store = useValeWalkPathEditorStore.getState()
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        store.addAfterSelected()
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        store.removeSelected()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editorMode])

  useEffect(() => {
    document.body.classList.toggle('vale-walk-editor-active', editorMode)
    return () => document.body.classList.remove('vale-walk-editor-active')
  }, [editorMode])

  return { editorMode, setEditorMode, message, setMessage }
}
