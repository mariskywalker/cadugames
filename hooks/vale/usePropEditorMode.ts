'use client'

import { useEffect, useState } from 'react'
import { useValePropEditorStore } from '@/store/useValePropEditorStore'

/**
 * Editor de props 2D da cena — ?poste=1 na URL ou tecla O para alternar.
 */
export function usePropEditorMode() {
  const [editorMode, setEditorMode] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const hydrate = useValePropEditorStore((s) => s.hydrate)
  const setEditorActive = useValePropEditorStore((s) => s.setEditorActive)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('poste') === '1' || params.get('props') === '1') {
      setEditorMode(true)
      setMessage('Editor de poste — arraste na cena ou ajuste no painel.')
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

      if ((e.key === 'o' || e.key === 'O') && !e.metaKey && !e.ctrlKey && !e.altKey && !inField) {
        e.preventDefault()
        setEditorMode((on) => {
          const next = !on
          setMessage(next ? 'Editor de poste — arraste na cena ou ajuste no painel.' : null)
          return next
        })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('vale-prop-editor-active', editorMode)
    return () => document.body.classList.remove('vale-prop-editor-active')
  }, [editorMode])

  return { editorMode, setEditorMode, message, setMessage }
}
