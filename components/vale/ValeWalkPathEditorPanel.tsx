'use client'

import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { getValePathHalfWidth } from '@/lib/vale/valeWalkable'
import { useValeWalkPathEditorStore } from '@/store/useValeWalkPathEditorStore'

function num(value: number, digits = 2) {
  return value.toFixed(digits)
}

export function ValeWalkPathEditorPanel({
  message,
  onClose,
}: {
  message: string | null
  onClose: () => void
}) {
  const editorActive = useValeWalkPathEditorStore((s) => s.editorActive)
  const points = useValeWalkPathEditorStore((s) => s.points)
  const selectedId = useValeWalkPathEditorStore((s) => s.selectedId)
  const select = useValeWalkPathEditorStore((s) => s.select)
  const patch = useValeWalkPathEditorStore((s) => s.patch)
  const addAfterSelected = useValeWalkPathEditorStore((s) => s.addAfterSelected)
  const removeSelected = useValeWalkPathEditorStore((s) => s.removeSelected)
  const reset = useValeWalkPathEditorStore((s) => s.reset)
  const exportText = useValeWalkPathEditorStore((s) => s.exportText)
  const [panelMsg, setPanelMsg] = useState<string | null>(null)

  const selected = points.find((p) => p.id === selectedId) ?? points[0]
  const selectedIndex = points.findIndex((p) => p.id === selected?.id)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportText())
      setPanelMsg('Path copiado!')
      window.setTimeout(() => setPanelMsg(null), 1800)
    } catch {
      setPanelMsg('Não foi possível copiar.')
    }
  }, [exportText])

  const handleReset = useCallback(() => {
    reset()
    setPanelMsg('Path resetado.')
    window.setTimeout(() => setPanelMsg(null), 1800)
  }, [reset])

  if (!editorActive || !selected) return null

  const defaultHalfWidth = getValePathHalfWidth(
    selectedIndex / Math.max(1, points.length - 1),
  )

  const panel = (
    <div className="vale-walk-editor-panel" role="dialog" aria-label="Editor do path caminhável">
      <div className="vale-walk-editor-panel__header">
        <span className="vale-walk-editor-panel__title">Path caminhável</span>
        <button
          type="button"
          className="vale-walk-editor-panel__close"
          onClick={onClose}
          aria-label="Fechar editor"
        >
          ✕
        </button>
      </div>

      <p className="vale-walk-editor-panel__hint">
        Arraste os pontos verdes · <kbd>W</kbd> alternar · <kbd>A</kbd> novo ponto ·{' '}
        <kbd>Del</kbd> remover
      </p>
      {message && <p className="vale-walk-editor-panel__msg">{message}</p>}

      <div className="vale-walk-editor-panel__tabs">
        {points.map((point, index) => (
          <button
            key={point.id}
            type="button"
            className={`vale-walk-editor-panel__tab${selectedId === point.id ? ' is-active' : ''}`}
            onClick={() => select(point.id)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="vale-walk-editor-panel__fields">
        <label className="vale-walk-editor-panel__field">
          X
          <input
            type="number"
            step={0.01}
            value={num(selected.x)}
            onChange={(e) => patch(selected.id, { x: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <label className="vale-walk-editor-panel__field">
          Z
          <input
            type="number"
            step={0.01}
            value={num(selected.z)}
            onChange={(e) => patch(selected.id, { z: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <label className="vale-walk-editor-panel__slider-field">
          Largura da faixa (padrão {num(defaultHalfWidth)})
          <input
            type="range"
            min={0.35}
            max={2.2}
            step={0.02}
            value={selected.halfWidth ?? defaultHalfWidth}
            onChange={(e) =>
              patch(selected.id, { halfWidth: parseFloat(e.target.value) })
            }
          />
          <span className="vale-walk-editor-panel__slider-value">
            {num(selected.halfWidth ?? defaultHalfWidth)}
          </span>
        </label>
      </div>

      <div className="vale-walk-editor-panel__actions">
        <button type="button" className="vale-walk-editor-panel__btn" onClick={addAfterSelected}>
          + Ponto depois
        </button>
        <button
          type="button"
          className="vale-walk-editor-panel__btn vale-walk-editor-panel__btn--ghost"
          onClick={removeSelected}
          disabled={points.length <= 2}
        >
          Remover ponto
        </button>
      </div>

      <code className="vale-walk-editor-panel__readout">{exportText()}</code>

      <div className="vale-walk-editor-panel__actions">
        <button type="button" className="vale-walk-editor-panel__btn" onClick={() => void handleCopy()}>
          Copiar posições
        </button>
        <button
          type="button"
          className="vale-walk-editor-panel__btn vale-walk-editor-panel__btn--ghost"
          onClick={handleReset}
        >
          Resetar
        </button>
      </div>

      {panelMsg && <p className="vale-walk-editor-panel__msg">{panelMsg}</p>}
    </div>
  )

  return createPortal(panel, document.body)
}
