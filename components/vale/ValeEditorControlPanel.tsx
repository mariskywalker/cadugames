'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export type ValeEditorId =
  | 'bearTarget'
  | 'bearPath'
  | 'flowers'
  | 'props'
  | 'camera'
  | 'focus'
  | 'stones'
  | 'hub'
  | 'hotspots'

export interface ValeEditorControl {
  id: ValeEditorId
  label: string
  emoji: string
  hint: string
  active: boolean
}

interface ValeEditorControlPanelProps {
  editors: ValeEditorControl[]
  onToggle: (id: ValeEditorId, next: boolean) => void
  onCloseAll: () => void
}

const EDITOR_ORDER: ValeEditorId[] = [
  'bearPath',
  'bearTarget',
  'flowers',
  'props',
  'camera',
  'focus',
  'stones',
  'hub',
  'hotspots',
]

export function ValeEditorControlPanel({ editors, onToggle, onCloseAll }: ValeEditorControlPanelProps) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const activeCount = editors.filter((e) => e.active).length
  const activeEditor = editors.find((e) => e.active)

  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    if (params.get('painel') === '1' || params.get('dev') === '1') {
      setOpen(true)
    }
  }, [])

  const handleToggle = useCallback(
    (id: ValeEditorId, active: boolean) => {
      onToggle(id, !active)
      if (!active) setOpen(true)
    },
    [onToggle],
  )

  const panel = (
    <div className={`vale-editor-hub${open ? ' vale-editor-hub--open' : ''}`}>
      <button
        type="button"
        className="vale-editor-hub__fab"
        aria-expanded={open}
        aria-controls="vale-editor-hub-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="vale-editor-hub__fab-icon" aria-hidden>
          🛠
        </span>
        <span className="vale-editor-hub__fab-label">Ferramentas</span>
        {activeCount > 0 && (
          <span className="vale-editor-hub__fab-badge" aria-label={`${activeCount} editor ativo`}>
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div id="vale-editor-hub-panel" className="vale-editor-hub__panel" role="dialog" aria-label="Painel de edição">
          <div className="vale-editor-hub__header">
            <div>
              <h2 className="vale-editor-hub__title">Painel de edição</h2>
              <p className="vale-editor-hub__subtitle">Toque para abrir cada ferramenta — sem atalhos de teclado</p>
            </div>
            <button
              type="button"
              className="vale-editor-hub__close"
              onClick={() => setOpen(false)}
              aria-label="Recolher painel"
            >
              ✕
            </button>
          </div>

          {activeEditor && (
            <p className="vale-editor-hub__active">
              Ativo: <strong>{activeEditor.emoji} {activeEditor.label}</strong>
            </p>
          )}

          <ul className="vale-editor-hub__list">
            {EDITOR_ORDER.map((id) => {
              const editor = editors.find((e) => e.id === id)
              if (!editor) return null
              return (
                <li key={id} className={`vale-editor-hub__item${editor.active ? ' is-active' : ''}`}>
                  <div className="vale-editor-hub__item-main">
                    <span className="vale-editor-hub__item-emoji" aria-hidden>
                      {editor.emoji}
                    </span>
                    <div>
                      <span className="vale-editor-hub__item-label">{editor.label}</span>
                      <span className="vale-editor-hub__item-hint">{editor.hint}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`vale-editor-hub__toggle${editor.active ? ' is-on' : ''}`}
                    onClick={() => handleToggle(id, editor.active)}
                  >
                    {editor.active ? 'Fechar' : 'Abrir'}
                  </button>
                </li>
              )
            })}
          </ul>

          {activeCount > 0 && (
            <button type="button" className="vale-editor-hub__close-all" onClick={onCloseAll}>
              Fechar todas as ferramentas
            </button>
          )}
        </div>
      )}
    </div>
  )

  if (!mounted) return null
  return createPortal(panel, document.body)
}
