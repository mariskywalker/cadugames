'use client'

import { useHubPointEditorMode } from '@/hooks/worlds/useHubPointEditorMode'
import { HubPointEditorPanel } from './HubPointEditorPanel'

export function HubPointEditorTools() {
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
