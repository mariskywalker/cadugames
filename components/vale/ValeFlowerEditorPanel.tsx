'use client'

import { useCallback, useState } from 'react'
import {
  clampFlowerDepth,
  formatFlowerPlacementsExport,
  VALE_FLOWER_DEPTH_RANGE,
  type FlowerMoveAxis,
} from '@/lib/vale/sceneFlowerAssets'
import { useValeFlowerEditorStore } from '@/store/useValeFlowerEditorStore'

function num(value: number, digits = 2) {
  return value.toFixed(digits)
}

const AXIS_OPTIONS: { id: FlowerMoveAxis; label: string }[] = [
  { id: 'free', label: 'Livre (XZ)' },
  { id: 'depth', label: 'Profundidade' },
  { id: 'lateral', label: 'Lateral (X)' },
  { id: 'vertical', label: 'Altura (Y)' },
]

export function ValeFlowerEditorPanel({
  message,
  onClose,
}: {
  message: string | null
  onClose: () => void
}) {
  const editorActive = useValeFlowerEditorStore((s) => s.editorActive)
  const placements = useValeFlowerEditorStore((s) => s.placements)
  const selectedId = useValeFlowerEditorStore((s) => s.selectedId)
  const moveAxis = useValeFlowerEditorStore((s) => s.moveAxis)
  const select = useValeFlowerEditorStore((s) => s.select)
  const setMoveAxis = useValeFlowerEditorStore((s) => s.setMoveAxis)
  const patch = useValeFlowerEditorStore((s) => s.patch)
  const reset = useValeFlowerEditorStore((s) => s.reset)
  const [panelMsg, setPanelMsg] = useState<string | null>(null)

  const selected = placements.find((f) => f.id === selectedId) ?? placements[0]

  const patchSelected = useCallback(
    (data: Parameters<typeof patch>[1]) => {
      if (!selected) return
      patch(selected.id, data)
    },
    [patch, selected],
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatFlowerPlacementsExport(placements))
      setPanelMsg('Posições copiadas!')
      window.setTimeout(() => setPanelMsg(null), 1800)
    } catch {
      setPanelMsg('Não foi possível copiar.')
    }
  }, [placements])

  const handleReset = useCallback(() => {
    reset()
    setPanelMsg('Plantas resetadas.')
    window.setTimeout(() => setPanelMsg(null), 1800)
  }, [reset])

  if (!editorActive || !selected) return null

  const [x, y, z] = selected.position

  return (
    <div className="vale-flower-editor-panel" role="dialog" aria-label="Editor de plantas">
      <div className="vale-flower-editor-panel__header">
        <span className="vale-flower-editor-panel__title">Cenário do Vale</span>
        <button
          type="button"
          className="vale-flower-editor-panel__close"
          onClick={onClose}
          aria-label="Fechar editor"
        >
          ✕
        </button>
      </div>

      <p className="vale-flower-editor-panel__hint">
        Scroll = profundidade · Shift+scroll = tamanho · Alça azul = eixo Z · <kbd>[</kbd>{' '}
        <kbd>]</kbd> · <kbd>P</kbd> ou <kbd>T</kbd> (toco s-01)
      </p>
      {message && <p className="vale-flower-editor-panel__msg">{message}</p>}

      <div className="vale-flower-editor-panel__axis">
        {AXIS_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`vale-flower-editor-panel__axis-btn${moveAxis === opt.id ? ' is-active' : ''}`}
            onClick={() => setMoveAxis(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="vale-flower-editor-panel__tabs">
        {placements.map((flower, index) => (
          <button
            key={flower.id}
            type="button"
            className={`vale-flower-editor-panel__tab${selectedId === flower.id ? ' is-active' : ''}`}
            onClick={() => select(flower.id)}
          >
            {index + 1}. {flower.id}
            {flower.kind === 'stump' ? ' · toco' : ''}
          </button>
        ))}
      </div>

      <label className="vale-flower-editor-panel__slider-field">
        Profundidade Z ({num(VALE_FLOWER_DEPTH_RANGE.min, 1)}–{num(VALE_FLOWER_DEPTH_RANGE.max, 1)})
        <input
          type="range"
          min={VALE_FLOWER_DEPTH_RANGE.min}
          max={VALE_FLOWER_DEPTH_RANGE.max}
          step={0.05}
          value={z}
          onChange={(e) =>
            patchSelected({
              position: [x, y, clampFlowerDepth(parseFloat(e.target.value))],
            })
          }
        />
        <span className="vale-flower-editor-panel__slider-value">{num(z)}</span>
      </label>

      <div className="vale-flower-editor-panel__fields">
        <label className="vale-flower-editor-panel__field">
          X lateral
          <input
            type="number"
            step="0.05"
            value={num(x)}
            onChange={(e) =>
              patchSelected({ position: [parseFloat(e.target.value) || 0, y, z] })
            }
          />
        </label>
        <label className="vale-flower-editor-panel__field">
          Y altura
          <input
            type="number"
            step="0.05"
            value={num(y)}
            onChange={(e) =>
              patchSelected({ position: [x, parseFloat(e.target.value) || 0, z] })
            }
          />
        </label>
        <label className="vale-flower-editor-panel__field">
          Z prof.
          <input
            type="number"
            step="0.05"
            min={VALE_FLOWER_DEPTH_RANGE.min}
            max={VALE_FLOWER_DEPTH_RANGE.max}
            value={num(z)}
            onChange={(e) =>
              patchSelected({
                position: [x, y, clampFlowerDepth(parseFloat(e.target.value) || z)],
              })
            }
          />
        </label>
        <label className="vale-flower-editor-panel__field">
          Rotação Y
          <input
            type="number"
            step="0.05"
            value={num(selected.rotationY)}
            onChange={(e) => patchSelected({ rotationY: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <label className="vale-flower-editor-panel__field">
          Altura
          <input
            type="number"
            step="0.05"
            min={0.2}
            max={1.2}
            value={num(selected.targetHeight)}
            onChange={(e) => patchSelected({ targetHeight: parseFloat(e.target.value) || 0.2 })}
          />
        </label>
        <label className="vale-flower-editor-panel__field">
          Escala
          <input
            type="number"
            step="0.05"
            min={0.5}
            max={2.5}
            value={num(selected.scaleMult ?? 1)}
            onChange={(e) => patchSelected({ scaleMult: parseFloat(e.target.value) || 1 })}
          />
        </label>
      </div>

      <code className="vale-flower-editor-panel__readout">
        [{num(x)}, {num(y)}, {num(z)}] · eixo {moveAxis} · h {num(selected.targetHeight)}
      </code>

      {panelMsg && <p className="vale-flower-editor-panel__msg">{panelMsg}</p>}

      <div className="vale-flower-editor-panel__actions">
        <button type="button" className="vale-flower-editor-panel__btn" onClick={() => void handleCopy()}>
          Copiar posições
        </button>
        <button
          type="button"
          className="vale-flower-editor-panel__btn vale-flower-editor-panel__btn--ghost"
          onClick={handleReset}
        >
          Resetar
        </button>
      </div>
    </div>
  )
}
