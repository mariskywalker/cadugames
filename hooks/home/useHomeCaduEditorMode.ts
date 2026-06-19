'use client'

import { useEffect, useState } from 'react'

/** Editor visual do urso na home — ?homeEditor=1 ou tecla E */
export function useHomeCaduEditorMode() {
  const [editorMode, setEditorMode] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('homeEditor') === '1' || params.get('editor') === '1') {
      setEditorMode(true)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'e' || e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      e.preventDefault()
      setEditorMode((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('home-cadu-editor-active', editorMode)
    return () => document.body.classList.remove('home-cadu-editor-active')
  }, [editorMode])

  return { editorMode, setEditorMode }
}
