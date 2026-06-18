'use client'

import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatBearTargetExport } from '@/lib/vale/bearTargetEditorStorage'
import type { ValeBearTarget } from '@/lib/vale/valeHotspots'
import { useValeBearTargetEditorStore } from '@/store/useValeBearTargetEditorStore'

function num(value: number, digits = 2) {
  return value.toFixed(digits)
}

export function ValeBearTargetEditorPanel({
  message,
  onClose,
}: {
  message: string | null
  onClose: () => void
}) {
  const editorActive = useValeBearTargetEditorStore((s) => s.editorActive)
  const hotspots = useValeBearTargetEditorStore((s) => s.hotspots)
  const selectedId = useValeBearTargetEditorStore((s) => s.selectedId)
  const select = useValeBearTargetEditorStore((s) => s.select)
  const patchBearTarget = useValeBearTargetEditorStore((s) => s.patchBearTarget)
  const reset = useValeBearTargetEditorStore((s) => s.reset)
  const [panelMsg, setPanelMsg] = useState<string | null>(null)

  const selected = hotspots.find((h) => h.id === selectedId) ?? hotspots[0]

  const patchSelected = useCallback(
    (patch: Partial<ValeBearTarget>) => {
      if (!selected) return
      patchBearTarget(selected.id, patch)
    },
    [patchBearTarget, selected],
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatBearTargetExport(hotspots))
      setPanelMsg('bearTargets copiados!')
      window.setTimeout(() => setPanelMsg(null), 1800)
    } catch {
      setPanelMsg('Não foi possível copiar.')
    }
  }, [hotspots])

  const handleReset = useCallback(() => {
    reset()
    setPanelMsg('Destinos resetados.')
    window.setTimeout(() => setPanelMsg(null), 1800)
  }, [reset])

  if (!editorActive || !selected) return null

  const t = selected.bearTarget

  const panel = (
    <div className="vale-bear-target-editor-panel" role="dialog" aria-label="Calibrar destino do urso">
      <div className="vale-bear-target-editor-panel__header">
        <span className="vale-bear-target-editor-panel__title">Destino 3D (waypoint)</span>
        <button type="button" className="vale-bear-target-editor-panel__close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>
      </div>

      <p className="vale-bear-target-editor-panel__hint">
        Editor pausado — personagem congelado. Ajustes em lib/vale/valeHotspots.ts.
      </p>
      {message && <p className="vale-bear-target-editor-panel__msg">{message}</p>}

      <div className="vale-bear-target-editor-panel__tabs">
        {hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            type="button"
            className={`vale-bear-target-editor-panel__tab${selectedId === hotspot.id ? ' is-active' : ''}`}
            onClick={() => select(hotspot.id)}
          >
            {hotspot.emoji} {hotspot.label}
          </button>
        ))}
      </div>

      <label className="vale-bear-target-editor-panel__slider-field">
        X mundo
        <input type="range" min={-3} max={3} step={0.01} value={t.x} onChange={(e) => patchSelected({ x: parseFloat(e.target.value) })} />
        <span className="vale-bear-target-editor-panel__slider-value">{num(t.x, 3)}</span>
      </label>

      <label className="vale-bear-target-editor-panel__slider-field">
        Z mundo
        <input type="range" min={-8} max={2} step={0.01} value={t.z} onChange={(e) => patchSelected({ z: parseFloat(e.target.value) })} />
        <span className="vale-bear-target-editor-panel__slider-value">{num(t.z, 3)}</span>
      </label>

      <label className="vale-bear-target-editor-panel__slider-field">
        Rotação Y (rad)
        <input type="range" min={0} max={6.28} step={0.01} value={t.rotationY} onChange={(e) => patchSelected({ rotationY: parseFloat(e.target.value) })} />
        <span className="vale-bear-target-editor-panel__slider-value">{num(t.rotationY, 3)}</span>
      </label>

      <code className="vale-bear-target-editor-panel__readout">
        x {num(t.x, 3)} · z {num(t.z, 3)} · rotY {num(t.rotationY, 3)}
      </code>

      {panelMsg && <p className="vale-bear-target-editor-panel__msg">{panelMsg}</p>}

      <div className="vale-bear-target-editor-panel__actions">
        <button type="button" className="vale-bear-target-editor-panel__btn" onClick={() => void handleCopy()}>
          Copiar
        </button>
        <button type="button" className="vale-bear-target-editor-panel__btn vale-bear-target-editor-panel__btn--ghost" onClick={handleReset}>
          Resetar
        </button>
      </div>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(panel, document.body)
}
