'use client'

import { useCallback, useState } from 'react'
import { formatHubPointsExport } from '@/lib/worlds/worldInteractions'
import { useHubPointEditorStore } from '@/store/useHubPointEditorStore'

function num(value: number, digits = 1) {
  return value.toFixed(digits)
}

export function HubPointEditorPanel({
  message,
  onClose,
}: {
  message: string | null
  onClose: () => void
}) {
  const editorActive = useHubPointEditorStore((s) => s.editorActive)
  const activeWorldId = useHubPointEditorStore((s) => s.activeWorldId)
  const points = useHubPointEditorStore((s) => s.points)
  const selectedId = useHubPointEditorStore((s) => s.selectedId)
  const select = useHubPointEditorStore((s) => s.select)
  const patch = useHubPointEditorStore((s) => s.patch)
  const reset = useHubPointEditorStore((s) => s.reset)
  const [panelMsg, setPanelMsg] = useState<string | null>(null)

  const selected = points.find((p) => p.id === selectedId) ?? points[0]

  const handleCopy = useCallback(async () => {
    if (!activeWorldId) return
    try {
      await navigator.clipboard.writeText(formatHubPointsExport(activeWorldId, points))
      setPanelMsg('Posições copiadas!')
      window.setTimeout(() => setPanelMsg(null), 1800)
    } catch {
      setPanelMsg('Não foi possível copiar.')
    }
  }, [activeWorldId, points])

  const handleReset = useCallback(() => {
    reset()
    setPanelMsg('Posições resetadas.')
    window.setTimeout(() => setPanelMsg(null), 1800)
  }, [reset])

  if (!editorActive || !selected || !activeWorldId) return null

  return (
    <div className="hub-point-editor-panel" role="dialog" aria-label="Editor de pontos do hub">
      <div className="hub-point-editor-panel__header">
        <span className="hub-point-editor-panel__title">
          {selected.emoji} {selected.label}
        </span>
        <button
          type="button"
          className="hub-point-editor-panel__close"
          onClick={onClose}
          aria-label="Fechar editor"
        >
          ✕
        </button>
      </div>

      <p className="hub-point-editor-panel__hint">
        Arraste o emoji · <kbd>H</kbd> alterna · Hotspots: {activeWorldId}
      </p>
      {(message || panelMsg) && (
        <p className="hub-point-editor-panel__msg">{panelMsg ?? message}</p>
      )}

      <div className="hub-point-editor-panel__tabs">
        {points.map((point) => (
          <button
            key={point.id}
            type="button"
            className={`hub-point-editor-panel__tab${selectedId === point.id ? ' is-active' : ''}`}
            onClick={() => select(point.id)}
          >
            {point.emoji}
          </button>
        ))}
      </div>

      <div className="hub-point-editor-panel__fields">
        <label className="hub-point-editor-panel__field">
          X ({num(selected.x)}%)
          <input
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={selected.x}
            onChange={(e) => patch(selected.id, { x: Number(e.target.value) })}
          />
        </label>
        <label className="hub-point-editor-panel__field">
          Y ({num(selected.y)}%)
          <input
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={selected.y}
            onChange={(e) => patch(selected.id, { y: Number(e.target.value) })}
          />
        </label>
        <label className="hub-point-editor-panel__field">
          Tamanho ({num(selected.size ?? 11)}%)
          <input
            type="range"
            min={6}
            max={20}
            step={0.5}
            value={selected.size ?? 11}
            onChange={(e) => patch(selected.id, { size: Number(e.target.value) })}
          />
        </label>
      </div>

      <p className="hub-point-editor-panel__readout">
        {selected.id} · x: {num(selected.x)}, y: {num(selected.y)}, size: {num(selected.size ?? 11)}
      </p>

      <div className="hub-point-editor-panel__actions">
        <button type="button" className="hub-point-editor-panel__btn" onClick={handleCopy}>
          Copiar export
        </button>
        <button
          type="button"
          className="hub-point-editor-panel__btn hub-point-editor-panel__btn--ghost"
          onClick={handleReset}
        >
          Resetar hub
        </button>
      </div>
    </div>
  )
}
