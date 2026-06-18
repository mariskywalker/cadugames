'use client'

import { useEffect, useState } from 'react'
import { VALE_BEAR_TARGET_EDITOR_ENABLED } from '@/lib/vale/valeCharacterFreeze'
import { useValeBearTargetEditorStore } from '@/store/useValeBearTargetEditorStore'

/** Editor de destinos 3D — desligado enquanto personagem está congelado */
export function useBearTargetEditorMode() {
  const [editorMode, setEditorMode] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const hydrate = useValeBearTargetEditorStore((s) => s.hydrate)
  const setEditorActive = useValeBearTargetEditorStore((s) => s.setEditorActive)

  useEffect(() => {
    if (!VALE_BEAR_TARGET_EDITOR_ENABLED) return
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!VALE_BEAR_TARGET_EDITOR_ENABLED) return
    setEditorActive(editorMode)
  }, [editorMode, setEditorActive])

  useEffect(() => {
    if (!VALE_BEAR_TARGET_EDITOR_ENABLED) return

    const params = new URLSearchParams(window.location.search)
    if (params.get('targets') === '1' || params.get('bear') === '1') {
      setEditorMode(true)
      setMessage('Editor de destino 3D — ajuste waypoints no painel.')
    }
  }, [])

  useEffect(() => {
    if (!VALE_BEAR_TARGET_EDITOR_ENABLED) return

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const inField =
        tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable

      if ((e.key === 't' || e.key === 'T') && !e.metaKey && !e.ctrlKey && !e.altKey && !inField) {
        e.preventDefault()
        setEditorMode((on) => {
          const next = !on
          setMessage(next ? 'Editor de destino 3D — ajuste waypoints no painel.' : null)
          return next
        })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!VALE_BEAR_TARGET_EDITOR_ENABLED) return
    document.body.classList.toggle('vale-bear-target-editor-active', editorMode)
    return () => document.body.classList.remove('vale-bear-target-editor-active')
  }, [editorMode])

  return {
    editorMode: VALE_BEAR_TARGET_EDITOR_ENABLED && editorMode,
    setEditorMode,
    message,
    setMessage,
  }
}
