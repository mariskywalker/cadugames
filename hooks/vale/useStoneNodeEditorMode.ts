'use client'

import { useEffect, useState } from 'react'

/**
 * Editor de layout das pedras — igual sala sensorial:
 * ?edit=1 ou ?layout=1 na URL, tecla G para alternar.
 */
export function useStoneNodeEditorMode() {
  const [editorMode, setEditorMode] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('edit') === '1' || params.get('layout') === '1' || params.get('editor') === '1') {
      setEditorMode(true)
      setMessage('Editor ativo — selecione Casa, Caminho ou um hotspot.')
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'g' && e.key !== 'G') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return
      e.preventDefault()
      setEditorMode((on) => {
        const next = !on
        setMessage(next ? 'Editor ativo — selecione Casa, Caminho ou um hotspot.' : null)
        return next
      })
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('vale-stone-editor-active', editorMode)
    return () => document.body.classList.remove('vale-stone-editor-active')
  }, [editorMode])

  return { editorMode, setEditorMode, message, setMessage }
}
