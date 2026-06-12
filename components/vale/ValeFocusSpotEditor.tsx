'use client'

import { useCallback, useRef, useState } from 'react'
import {
  DEFAULT_FOCUS_SPOTS,
  formatFocusSpotExport,
  type FocusSpot,
} from '@/lib/vale/focusSpotLayout'
import {
  resetFocusSpotOverrides,
  saveFocusSpotOverrides,
} from '@/lib/vale/focusSpotEditorStorage'

function clampPct(value: number) {
  return Math.min(100, Math.max(0, value))
}

function clampRadius(value: number) {
  return Math.min(22, Math.max(4, value))
}

function FocusSpotHandle({
  spot,
  index,
  selected,
  onSelect,
  onPatch,
}: {
  spot: FocusSpot
  index: number
  selected: boolean
  onSelect: () => void
  onPatch: (patch: Partial<Pick<FocusSpot, 'x' | 'y' | 'r'>>) => void
}) {
  const dragRef = useRef<{ startX: number; startY: number; startSpotX: number; startSpotY: number } | null>(
    null,
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      onSelect()
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startSpotX: spot.x,
        startSpotY: spot.y,
      }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [onSelect, spot.x, spot.y],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!dragRef.current) return
      const dx = ((e.clientX - dragRef.current.startX) / window.innerWidth) * 100
      const dy = ((e.clientY - dragRef.current.startY) / window.innerHeight) * 100
      onPatch({
        x: clampPct(dragRef.current.startSpotX + dx),
        y: clampPct(dragRef.current.startSpotY + dy),
      })
    },
    [onPatch],
  )

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    dragRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLButtonElement>) => {
      if (!selected) return
      e.preventDefault()
      e.stopPropagation()
      const delta = e.deltaY > 0 ? -0.4 : 0.4
      onPatch({ r: clampRadius(spot.r + delta) })
    },
    [onPatch, selected, spot.r],
  )

  const size = spot.r * 2

  return (
    <button
      type="button"
      className={`vale-focus-handle${selected ? ' vale-focus-handle--selected' : ''}`}
      style={{
        left: `${spot.x}%`,
        top: `${spot.y}%`,
        width: `${size}vmin`,
        height: `${size}vmin`,
      }}
      aria-label={`Spot ${index + 1}: ${spot.label}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      <span className="vale-focus-handle__ring" aria-hidden />
      <span className="vale-focus-handle__label">{index + 1}</span>
    </button>
  )
}

export function ValeFocusSpotEditor({
  spots,
  editorMode,
  message,
  onSpotsChange,
  onClose,
}: {
  spots: FocusSpot[]
  editorMode: boolean
  message: string | null
  onSpotsChange: (spots: FocusSpot[]) => void
  onClose: () => void
}) {
  const [selectedId, setSelectedId] = useState(DEFAULT_FOCUS_SPOTS[0].id)
  const [panelMsg, setPanelMsg] = useState<string | null>(null)

  const selected = spots.find((s) => s.id === selectedId) ?? spots[0]

  const persistSpots = useCallback(
    (next: FocusSpot[]) => {
      onSpotsChange(next)
      const overrides = Object.fromEntries(
        next.map((spot) => {
          const base = DEFAULT_FOCUS_SPOTS.find((s) => s.id === spot.id)
          if (!base) return [spot.id, {}]
          const patch: Partial<Pick<FocusSpot, 'x' | 'y' | 'r'>> = {}
          if (Math.abs(spot.x - base.x) > 0.01) patch.x = spot.x
          if (Math.abs(spot.y - base.y) > 0.01) patch.y = spot.y
          if (Math.abs(spot.r - base.r) > 0.01) patch.r = spot.r
          return [spot.id, patch]
        }),
      )
      saveFocusSpotOverrides(overrides)
    },
    [onSpotsChange],
  )

  const patchSpot = useCallback(
    (id: string, patch: Partial<Pick<FocusSpot, 'x' | 'y' | 'r'>>) => {
      const next = spots.map((s) => (s.id === id ? { ...s, ...patch } : s))
      persistSpots(next)
    },
    [spots, persistSpots],
  )

  const handleFieldChange = useCallback(
    (field: 'x' | 'y' | 'r', raw: string) => {
      const num = parseFloat(raw)
      if (!Number.isFinite(num)) return
      const value = field === 'r' ? clampRadius(num) : clampPct(num)
      patchSpot(selected.id, { [field]: value })
    },
    [patchSpot, selected.id],
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatFocusSpotExport(spots))
      setPanelMsg('CSS copiado!')
      window.setTimeout(() => setPanelMsg(null), 1800)
    } catch {
      setPanelMsg('Não foi possível copiar.')
    }
  }, [spots])

  const handleReset = useCallback(() => {
    const next = resetFocusSpotOverrides()
    onSpotsChange(next)
    setPanelMsg('Posições resetadas.')
    window.setTimeout(() => setPanelMsg(null), 1800)
  }, [onSpotsChange])

  if (!editorMode) return null

  return (
    <>
      <div className="vale-focus-handles">
        {spots.map((spot, index) => (
          <FocusSpotHandle
            key={spot.id}
            spot={spot}
            index={index}
            selected={selectedId === spot.id}
            onSelect={() => setSelectedId(spot.id)}
            onPatch={(patch) => patchSpot(spot.id, patch)}
          />
        ))}
      </div>

      <div className="vale-focus-editor-panel" role="dialog" aria-label="Editor de nitidez">
        <div className="vale-focus-editor-panel__header">
          <span className="vale-focus-editor-panel__title">Spots de nitidez</span>
          <button
            type="button"
            className="vale-focus-editor-panel__close"
            onClick={onClose}
            aria-label="Fechar editor"
          >
            ✕
          </button>
        </div>

        <p className="vale-focus-editor-panel__hint">
          Arraste os círculos · scroll no selecionado ajusta o tamanho · <kbd>F</kbd> alterna
        </p>
        {message && <p className="vale-focus-editor-panel__msg">{message}</p>}

        <div className="vale-focus-editor-panel__tabs">
          {spots.map((spot, index) => (
            <button
              key={spot.id}
              type="button"
              className={`vale-focus-editor-panel__tab${selectedId === spot.id ? ' is-active' : ''}`}
              onClick={() => setSelectedId(spot.id)}
            >
              {index + 1}. {spot.label}
            </button>
          ))}
        </div>

        <div className="vale-focus-editor-panel__fields">
          <label className="vale-focus-editor-panel__field">
            X (%)
            <input
              type="number"
              step="0.1"
              min={0}
              max={100}
              value={selected.x.toFixed(1)}
              onChange={(e) => handleFieldChange('x', e.target.value)}
            />
          </label>
          <label className="vale-focus-editor-panel__field">
            Y (%)
            <input
              type="number"
              step="0.1"
              min={0}
              max={100}
              value={selected.y.toFixed(1)}
              onChange={(e) => handleFieldChange('y', e.target.value)}
            />
          </label>
          <label className="vale-focus-editor-panel__field">
            Raio (vmin)
            <input
              type="number"
              step="0.1"
              min={4}
              max={22}
              value={selected.r.toFixed(1)}
              onChange={(e) => handleFieldChange('r', e.target.value)}
            />
          </label>
        </div>

        <code className="vale-focus-editor-panel__readout">
          {selected.x.toFixed(1)}% · {selected.y.toFixed(1)}% · r {selected.r.toFixed(1)}vmin
        </code>

        {panelMsg && <p className="vale-focus-editor-panel__msg">{panelMsg}</p>}

        <div className="vale-focus-editor-panel__actions">
          <button type="button" className="vale-focus-editor-panel__btn" onClick={() => void handleCopy()}>
            Copiar CSS
          </button>
          <button
            type="button"
            className="vale-focus-editor-panel__btn vale-focus-editor-panel__btn--ghost"
            onClick={handleReset}
          >
            Resetar
          </button>
        </div>
      </div>
    </>
  )
}
