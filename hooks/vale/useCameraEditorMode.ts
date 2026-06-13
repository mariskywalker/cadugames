'use client'

import { useEffect, useState } from 'react'
import { useValeCameraEditorStore } from '@/store/useValeCameraEditorStore'

/**
 * Editor de câmera do Vale — ?camera=1 na URL ou tecla C.
 */
export function useCameraEditorMode() {
  const [editorMode, setEditorMode] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const hydrate = useValeCameraEditorStore((s) => s.hydrate)
  const setEditorActive = useValeCameraEditorStore((s) => s.setEditorActive)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('camera') === '1' || params.get('cam') === '1') {
      setEditorMode(true)
      setMessage('Editor de câmera — ajuste até aparecer “Composição boa”.')
    }
  }, [])

  useEffect(() => {
    setEditorActive(editorMode)
  }, [editorMode, setEditorActive])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'c' && e.key !== 'C') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) {
        return
      }
      e.preventDefault()
      setEditorMode((on) => {
        const next = !on
        setMessage(
          next ? 'Editor de câmera — ajuste até aparecer “Composição boa”.' : null,
        )
        return next
      })
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('vale-camera-editor-active', editorMode)
    return () => document.body.classList.remove('vale-camera-editor-active')
  }, [editorMode])

  return { editorMode, setEditorMode, message, setMessage }
}
