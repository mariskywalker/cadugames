'use client'

import { useEffect, useState } from 'react'

/** Editor da cena opening — ?openingEditor=1 ou tecla O */
export function useOpeningSceneEditorMode() {
  const [editorMode, setEditorMode] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('openingEditor') === '1' || params.get('sceneEditor') === '1') {
      setEditorMode(true)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'o' || e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      e.preventDefault()
      setEditorMode((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('opening-scene-editor-active', editorMode)
    return () => document.body.classList.remove('opening-scene-editor-active')
  }, [editorMode])

  return { editorMode, setEditorMode }
}
