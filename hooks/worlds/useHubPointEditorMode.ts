'use client'

import { useEffect, useState } from 'react'
import { useHubPointEditorStore } from '@/store/useHubPointEditorStore'

/**
 * Editor de pontos de interação nos hubs — ?hubs=1 na URL ou tecla H.
 */
export function useHubPointEditorMode() {
  const [editorMode, setEditorMode] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const setEditorActive = useHubPointEditorStore((s) => s.setEditorActive)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (
      params.get('hubs') === '1' ||
      params.get('pontos') === '1' ||
      params.get('hotspots') === '1'
    ) {
      setEditorMode(true)
      setMessage('Editor de hotspots — arraste os emojis ou ajuste no painel.')
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

      if ((e.key === 'h' || e.key === 'H') && !e.metaKey && !e.ctrlKey && !e.altKey && !inField) {
        e.preventDefault()
        setEditorMode((on) => {
          const next = !on
          setMessage(next ? 'Editor de hotspots — arraste os emojis ou ajuste no painel.' : null)
          return next
        })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('hub-point-editor-active', editorMode)
    return () => document.body.classList.remove('hub-point-editor-active')
  }, [editorMode])

  return { editorMode, setEditorMode, message, setMessage }
}
