'use client'

import { useEffect, useState } from 'react'
import { VALE_HOTSPOT_EDITOR_ENABLED } from '@/lib/vale/valeGameplay'
import { useValeHotspotEditorStore } from '@/store/useValeHotspotEditorStore'

/** Editor de hitArea 2D + arriveTarget/path 3D */
export function useValeHotspotEditorMode() {
  const [editorMode, setEditorMode] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const hydrate = useValeHotspotEditorStore((s) => s.hydrate)
  const setEditorActive = useValeHotspotEditorStore((s) => s.setEditorActive)

  useEffect(() => {
    if (!VALE_HOTSPOT_EDITOR_ENABLED) return
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!VALE_HOTSPOT_EDITOR_ENABLED) return
    setEditorActive(editorMode)
  }, [editorMode, setEditorActive])

  useEffect(() => {
    if (!VALE_HOTSPOT_EDITOR_ENABLED) return

    const params = new URLSearchParams(window.location.search)
    if (params.get('hotspots') === '1') {
      setEditorMode(true)
      setMessage('Arraste os círculos verdes sobre os objetos da cena.')
    }
  }, [])

  useEffect(() => {
    if (!VALE_HOTSPOT_EDITOR_ENABLED) return
    document.body.classList.toggle('vale-hotspot-editor-active', editorMode)
    return () => document.body.classList.remove('vale-hotspot-editor-active')
  }, [editorMode])

  return {
    editorMode: VALE_HOTSPOT_EDITOR_ENABLED && editorMode,
    setEditorMode,
    message,
    setMessage,
  }
}
