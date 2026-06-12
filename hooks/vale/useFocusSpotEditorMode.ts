'use client'

import { useEffect, useState } from 'react'

/**
 * Editor dos spots de nitidez — ?focus=1 na URL ou tecla F para alternar.
 */
export function useFocusSpotEditorMode() {
  const [editorMode, setEditorMode] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('focus') === '1' || params.get('nitidez') === '1') {
      setEditorMode(true)
      setMessage('Editor de nitidez — arraste os círculos para a posição certa.')
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'f' && e.key !== 'F') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return
      e.preventDefault()
      setEditorMode((on) => {
        const next = !on
        setMessage(
          next ? 'Editor de nitidez — arraste os círculos para a posição certa.' : null,
        )
        return next
      })
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('vale-focus-editor-active', editorMode)
    return () => document.body.classList.remove('vale-focus-editor-active')
  }, [editorMode])

  return { editorMode, setEditorMode, message, setMessage }
}
