'use client'

import { useHubPointEditorMode } from '@/hooks/worlds/useHubPointEditorMode'
import { HubPointEditorPanel } from './HubPointEditorPanel'

export function HubPointEditorFab({
  editorMode,
  onToggle,
}: {
  editorMode: boolean
  onToggle: () => void
}) {
  if (editorMode) return null
  return (
    <button
      type="button"
      className="hub-point-editor-fab"
      onClick={onToggle}
      aria-label="Abrir editor de hotspots"
    >
      <span aria-hidden>📍</span>
      <span>Hotspots</span>
    </button>
  )
}

function HubPointEditorToolsStandalone() {
  const { editorMode, setEditorMode, message, setMessage } = useHubPointEditorMode()
  if (!editorMode) return null
  return (
    <HubPointEditorPanel
      message={message}
      onClose={() => {
        setEditorMode(false)
        setMessage(null)
      }}
    />
  )
}

/** Modo controlado (Vale) ou autônomo (opening / diorama) */
export function HubPointEditorTools({
  editorMode,
  message,
  onClose,
}: {
  editorMode?: boolean
  message?: string | null
  onClose?: () => void
} = {}) {
  if (editorMode === undefined) {
    return <HubPointEditorToolsStandalone />
  }

  if (!editorMode) return null
  return <HubPointEditorPanel message={message ?? null} onClose={onClose ?? (() => {})} />
}
