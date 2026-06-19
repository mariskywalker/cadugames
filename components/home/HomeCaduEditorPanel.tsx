'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { HomeCaduLayout } from '@/lib/home/homeCaduEditorLayout'
import { useHomeCaduEditorStore } from '@/store/useHomeCaduEditorStore'

type TabId = 'position' | 'layout' | 'appearance'

type SliderSpec = {
  field: keyof HomeCaduLayout
  label: string
  min: number
  max: number
  step: number
  unit?: string
}

const SLIDERS: Record<TabId, SliderSpec[]> = {
  position: [
    { field: 'anchorXPercent', label: 'Posição X', min: 20, max: 80, step: 0.5, unit: '%' },
    { field: 'bottomPercent', label: 'Base inferior', min: 0, max: 30, step: 0.5, unit: '%' },
    { field: 'bottomPercentWide', label: 'Base (tela larga)', min: 0, max: 30, step: 0.5, unit: '%' },
    { field: 'offsetX', label: 'Ajuste X', min: -200, max: 200, step: 1, unit: 'px' },
    { field: 'offsetY', label: 'Ajuste Y', min: -200, max: 200, step: 1, unit: 'px' },
    { field: 'caduExtraLiftCm', label: 'Elevação', min: -2, max: 8, step: 0.1, unit: 'cm' },
  ],
  layout: [
    { field: 'caduHeightMin', label: 'Altura mín.', min: 280, max: 600, step: 2, unit: 'px' },
    { field: 'caduHeightVh', label: 'Altura (vh)', min: 36, max: 72, step: 1, unit: 'vh' },
    { field: 'caduHeightMax', label: 'Altura máx.', min: 400, max: 820, step: 2, unit: 'px' },
    { field: 'palcoWidthMin', label: 'Palco mín.', min: 500, max: 1100, step: 4, unit: 'px' },
    { field: 'palcoWidthVw', label: 'Palco (vw)', min: 40, max: 100, step: 1, unit: 'vw' },
    { field: 'palcoWidthMax', label: 'Palco máx.', min: 700, max: 1300, step: 4, unit: 'px' },
    { field: 'caduFeetLiftRatio', label: 'Pés no palco', min: -0.08, max: 0.02, step: 0.001 },
    { field: 'palcoSurfaceRatio', label: 'Superfície palco', min: 0.18, max: 0.32, step: 0.001 },
  ],
  appearance: [
    { field: 'scale', label: 'Escala', min: 0.6, max: 1.4, step: 0.01 },
    { field: 'rotateDeg', label: 'Rotação', min: -25, max: 25, step: 0.5, unit: '°' },
    { field: 'opacity', label: 'Opacidade', min: 0.2, max: 1, step: 0.01 },
    { field: 'shadowBlur', label: 'Sombra blur', min: 0, max: 48, step: 1, unit: 'px' },
    { field: 'shadowY', label: 'Sombra Y', min: 0, max: 32, step: 1, unit: 'px' },
    { field: 'shadowAlpha', label: 'Sombra opac.', min: 0, max: 0.5, step: 0.01 },
  ],
}

const TAB_LABELS: Record<TabId, string> = {
  position: 'Posição',
  layout: 'Layout',
  appearance: 'Aparência',
}

function fmt(value: number, step: number) {
  const digits = step < 0.01 ? 3 : step < 1 ? 2 : step < 10 ? 1 : 0
  return value.toFixed(digits)
}

export function HomeCaduEditorPanel({
  editorMode,
  onClose,
}: {
  editorMode: boolean
  onClose: () => void
}) {
  const layout = useHomeCaduEditorStore((s) => s.layout)
  const patch = useHomeCaduEditorStore((s) => s.patch)
  const reset = useHomeCaduEditorStore((s) => s.reset)
  const exportText = useHomeCaduEditorStore((s) => s.exportText)
  const [tab, setTab] = useState<TabId>('position')
  const [panelMsg, setPanelMsg] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (editorMode) return
    setPanelMsg(null)
  }, [editorMode])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportText())
      setPanelMsg('Layout copiado!')
      window.setTimeout(() => setPanelMsg(null), 1800)
    } catch {
      setPanelMsg('Não foi possível copiar.')
    }
  }, [exportText])

  const handleReset = useCallback(() => {
    reset()
    setPanelMsg('Valores resetados.')
    window.setTimeout(() => setPanelMsg(null), 1800)
  }, [reset])

  if (!editorMode || !mounted) return null

  const panel = (
    <div className="home-cadu-editor" role="dialog" aria-label="Editor do urso">
      <div className="home-cadu-editor__header">
        <div>
          <p className="home-cadu-editor__eyebrow">Editor visual</p>
          <h2 className="home-cadu-editor__title">Urso CADU</h2>
        </div>
        <button type="button" className="home-cadu-editor__close" onClick={onClose} aria-label="Fechar editor">
          ✕
        </button>
      </div>

      <p className="home-cadu-editor__hint">Arraste o urso na cena ou ajuste os controles abaixo. Tecla E alterna o editor.</p>

      <div className="home-cadu-editor__tabs">
        {(Object.keys(TAB_LABELS) as TabId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`home-cadu-editor__tab${tab === id ? ' is-active' : ''}`}
            onClick={() => setTab(id)}
          >
            {TAB_LABELS[id]}
          </button>
        ))}
      </div>

      <div className="home-cadu-editor__fields">
        {SLIDERS[tab].map(({ field, label, min, max, step, unit }) => (
          <label key={field} className="home-cadu-editor__field">
            <span className="home-cadu-editor__field-label">
              {label}
              <span className="home-cadu-editor__field-value">
                {fmt(layout[field] as number, step)}
                {unit ?? ''}
              </span>
            </span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={layout[field] as number}
              onChange={(e) => patch({ [field]: Number(e.target.value) })}
            />
          </label>
        ))}

        {tab === 'appearance' && (
          <label className="home-cadu-editor__toggle">
            <input
              type="checkbox"
              checked={layout.floatEnabled}
              onChange={(e) => patch({ floatEnabled: e.target.checked })}
            />
            <span>Animação flutuante</span>
          </label>
        )}
      </div>

      <div className="home-cadu-editor__actions">
        <button type="button" className="home-cadu-editor__btn" onClick={() => void handleCopy()}>
          Copiar layout
        </button>
        <button type="button" className="home-cadu-editor__btn home-cadu-editor__btn--ghost" onClick={handleReset}>
          Resetar
        </button>
      </div>

      {panelMsg && <p className="home-cadu-editor__msg">{panelMsg}</p>}

      <code className="home-cadu-editor__readout">{exportText()}</code>
    </div>
  )

  return createPortal(panel, document.body)
}
