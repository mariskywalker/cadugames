'use client'

import { useCallback, useState } from 'react'
import {
  formatScenePropExport,
  VALE_SCENE_PROP_ASSETS,
} from '@/lib/vale/scenePropAssets'
import { parsePercent, parseVw } from '@/lib/vale/stoneNodeEditorStorage'
import { useValePropEditorStore } from '@/store/useValePropEditorStore'

function num(value: number, digits = 1) {
  return value.toFixed(digits)
}

export function ValePropEditorPanel({
  message,
  onClose,
}: {
  message: string | null
  onClose: () => void
}) {
  const editorActive = useValePropEditorStore((s) => s.editorActive)
  const placements = useValePropEditorStore((s) => s.placements)
  const selectedId = useValePropEditorStore((s) => s.selectedId)
  const select = useValePropEditorStore((s) => s.select)
  const patch = useValePropEditorStore((s) => s.patch)
  const reset = useValePropEditorStore((s) => s.reset)
  const [panelMsg, setPanelMsg] = useState<string | null>(null)

  const selected = placements.find((p) => p.id === selectedId) ?? placements[0]

  const patchSelected = useCallback(
    (data: Parameters<typeof patch>[1]) => {
      if (!selected) return
      patch(selected.id, data)
    },
    [patch, selected],
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatScenePropExport(placements))
      setPanelMsg('Layout copiado!')
      window.setTimeout(() => setPanelMsg(null), 1800)
    } catch {
      setPanelMsg('Não foi possível copiar.')
    }
  }, [placements])

  const handleReset = useCallback(() => {
    reset()
    setPanelMsg('Poste resetado.')
    window.setTimeout(() => setPanelMsg(null), 1800)
  }, [reset])

  if (!editorActive || !selected) return null

  const asset = VALE_SCENE_PROP_ASSETS[selected.id]

  return (
    <div className="vale-prop-editor-panel" role="dialog" aria-label="Editor de poste">
      <div className="vale-prop-editor-panel__header">
        <span className="vale-prop-editor-panel__title">{asset.label}</span>
        <button
          type="button"
          className="vale-prop-editor-panel__close"
          onClick={onClose}
          aria-label="Fechar editor"
        >
          ✕
        </button>
      </div>

      <p className="vale-prop-editor-panel__hint">
        Arraste = posição · <kbd>Shift</kbd>+arraste = offset · <kbd>Alt</kbd>+arraste ou scroll = Z ·{' '}
        <kbd>O</kbd> alterna
      </p>
      {message && <p className="vale-prop-editor-panel__msg">{message}</p>}

      <div className="vale-prop-editor-panel__tabs">
        {placements.map((prop) => (
          <button
            key={prop.id}
            type="button"
            className={`vale-prop-editor-panel__tab${selectedId === prop.id ? ' is-active' : ''}`}
            onClick={() => select(prop.id)}
          >
            {VALE_SCENE_PROP_ASSETS[prop.id].label}
          </button>
        ))}
      </div>

      <div className="vale-prop-editor-panel__fields">
        <label className="vale-prop-editor-panel__field">
          Esquerda (%)
          <input
            type="number"
            step="0.5"
            min={0}
            max={100}
            value={num(parsePercent(selected.left))}
            onChange={(e) => patchSelected({ left: `${parseFloat(e.target.value) || 0}%` })}
          />
        </label>
        <label className="vale-prop-editor-panel__field">
          Base (%)
          <input
            type="number"
            step="0.5"
            min={0}
            max={90}
            value={num(parsePercent(selected.bottom))}
            onChange={(e) => patchSelected({ bottom: `${parseFloat(e.target.value) || 0}%` })}
          />
        </label>
        <label className="vale-prop-editor-panel__field">
          Offset X (px)
          <input
            type="number"
            step="1"
            min={-400}
            max={400}
            value={num(selected.translateXPx ?? 0, 0)}
            onChange={(e) => patchSelected({ translateXPx: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <label className="vale-prop-editor-panel__field">
          Offset Y (px)
          <input
            type="number"
            step="1"
            min={-400}
            max={400}
            value={num(selected.translateYPx ?? 0, 0)}
            onChange={(e) => patchSelected({ translateYPx: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <label className="vale-prop-editor-panel__field">
          Profundidade Z (px)
          <input
            type="number"
            step="1"
            min={-500}
            max={500}
            value={num(selected.translateZPx ?? 0, 0)}
            onChange={(e) => patchSelected({ translateZPx: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <label className="vale-prop-editor-panel__field">
          Largura (vw)
          <input
            type="number"
            step="0.5"
            min={2}
            max={40}
            value={num(parseVw(selected.width))}
            onChange={(e) => patchSelected({ width: `${parseFloat(e.target.value) || 2}vw` })}
          />
        </label>
        <label className="vale-prop-editor-panel__field">
          Rotate X (°)
          <input
            type="number"
            step="1"
            min={-180}
            max={180}
            value={num(selected.rotateXDeg ?? 0, 0)}
            onChange={(e) => patchSelected({ rotateXDeg: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <label className="vale-prop-editor-panel__field">
          Rotate Y (°)
          <input
            type="number"
            step="1"
            min={-180}
            max={180}
            value={num(selected.rotateYDeg ?? 0, 0)}
            onChange={(e) => patchSelected({ rotateYDeg: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <label className="vale-prop-editor-panel__field">
          Rotate Z (°)
          <input
            type="number"
            step="1"
            min={-180}
            max={180}
            value={num(selected.rotateDeg, 0)}
            onChange={(e) => patchSelected({ rotateDeg: parseFloat(e.target.value) || 0 })}
          />
        </label>
        <label className="vale-prop-editor-panel__field">
          z-index
          <input
            type="number"
            step="1"
            min={0}
            max={20}
            value={selected.zIndex}
            onChange={(e) => patchSelected({ zIndex: parseInt(e.target.value, 10) || 0 })}
          />
        </label>
        <label className="vale-prop-editor-panel__field">
          Opacidade
          <input
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={num(selected.opacity, 2)}
            onChange={(e) =>
              patchSelected({ opacity: Math.min(1, Math.max(0, parseFloat(e.target.value) || 0)) })
            }
          />
        </label>
        <label className="vale-prop-editor-panel__field">
          Blur (px)
          <input
            type="number"
            step="0.5"
            min={0}
            max={12}
            value={num(selected.blurPx ?? 0, 1)}
            onChange={(e) =>
              patchSelected({
                blurPx: Math.min(12, Math.max(0, parseFloat(e.target.value) || 0)),
              })
            }
          />
        </label>
      </div>

      <label className="vale-prop-editor-panel__check">
        <input
          type="checkbox"
          checked={!!selected.flipX}
          onChange={(e) => patchSelected({ flipX: e.target.checked })}
        />
        Espelhar horizontalmente
      </label>

      <code className="vale-prop-editor-panel__readout">
        {selected.left} · {selected.bottom} · {selected.width} · off{' '}
        {num(selected.translateXPx ?? 0, 0)}/{num(selected.translateYPx ?? 0, 0)}/
        {num(selected.translateZPx ?? 0, 0)}px · rot {num(selected.rotateXDeg ?? 0, 0)}°/
        {num(selected.rotateYDeg ?? 0, 0)}°/{num(selected.rotateDeg, 0)}°
      </code>

      {panelMsg && <p className="vale-prop-editor-panel__msg">{panelMsg}</p>}

      <div className="vale-prop-editor-panel__actions">
        <button type="button" className="vale-prop-editor-panel__btn" onClick={() => void handleCopy()}>
          Copiar layout
        </button>
        <button
          type="button"
          className="vale-prop-editor-panel__btn vale-prop-editor-panel__btn--ghost"
          onClick={handleReset}
        >
          Resetar
        </button>
      </div>
    </div>
  )
}
