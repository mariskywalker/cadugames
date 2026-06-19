'use client'

import { useEffect } from 'react'
import { useOpeningSceneEditorStore } from '@/store/useOpeningSceneEditorStore'
import { OpeningSceneEditorPanel } from './OpeningSceneEditorPanel'

export function OpeningSceneEditorFab({
  editorMode,
  onToggle,
}: {
  editorMode: boolean
  onToggle: () => void
}) {
  if (editorMode) return null
  return (
    <button type="button" className="opening-scene-editor-fab" onClick={onToggle} aria-label="Abrir editor de cena">
      <span aria-hidden>🎬</span>
      <span>Editor cena</span>
    </button>
  )
}

export function useOpeningSceneEditorHydrate() {
  const hydrate = useOpeningSceneEditorStore((s) => s.hydrate)
  const setEditorActive = useOpeningSceneEditorStore((s) => s.setEditorActive)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return { setEditorActive }
}

export function OpeningSceneEditorTools({
  editorMode,
  onClose,
}: {
  editorMode: boolean
  onClose: () => void
}) {
  return <OpeningSceneEditorPanel editorMode={editorMode} onClose={onClose} />
}
