'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  formatHotspotFullExport,
  formatHotspotPathExport,
  formatMainPathExport,
} from '@/lib/vale/valeHotspots'
import { VALE_HOTSPOT_PATH_STEP, VALE_HOTSPOT_ROT_STEP } from '@/lib/vale/valeGameplay'
import {
  useValeHotspotEditorStore,
  type HotspotEditorPointSelection,
} from '@/store/useValeHotspotEditorStore'
import { useValeStore } from '@/store/useValeStore'

const PATH_HOTSPOT_IDS = [
  'casa-do-urso',
  'diario-mochila',
  'arvore-palavras',
  'jardim-flores',
  'portal-comunicacao',
] as const

function num(value: number, digits = 3) {
  return value.toFixed(digits)
}

function radToDeg(rad: number) {
  return ((rad * 180) / Math.PI).toFixed(1)
}

function NudgeGrid({
  onBump,
  showRot = true,
}: {
  onBump: (field: 'x' | 'z' | 'rotationY', delta: number) => void
  showRot?: boolean
}) {
  return (
    <div className="vale-hotspot-editor-panel__nudge-grid">
      <span className="vale-hotspot-editor-panel__nudge-label">x</span>
      <button type="button" className="vale-hotspot-editor-panel__nudge" onClick={() => onBump('x', -VALE_HOTSPOT_PATH_STEP)}>
        −
      </button>
      <button type="button" className="vale-hotspot-editor-panel__nudge" onClick={() => onBump('x', VALE_HOTSPOT_PATH_STEP)}>
        +
      </button>

      <span className="vale-hotspot-editor-panel__nudge-label">z</span>
      <button type="button" className="vale-hotspot-editor-panel__nudge" onClick={() => onBump('z', -VALE_HOTSPOT_PATH_STEP)}>
        −
      </button>
      <button type="button" className="vale-hotspot-editor-panel__nudge" onClick={() => onBump('z', VALE_HOTSPOT_PATH_STEP)}>
        +
      </button>

      {showRot && (
        <>
          <span className="vale-hotspot-editor-panel__nudge-label">rotY</span>
          <button
            type="button"
            className="vale-hotspot-editor-panel__nudge"
            onClick={() => onBump('rotationY', -VALE_HOTSPOT_ROT_STEP)}
          >
            −
          </button>
          <button
            type="button"
            className="vale-hotspot-editor-panel__nudge"
            onClick={() => onBump('rotationY', VALE_HOTSPOT_ROT_STEP)}
          >
            +
          </button>
        </>
      )}
    </div>
  )
}

function isPointActive(selection: HotspotEditorPointSelection, kind: HotspotEditorPointSelection['kind'], index: number | string) {
  return selection.kind === kind && selection.index === index
}

export function ValeHotspotEditorPanel({
  message,
  onClose,
}: {
  message: string | null
  onClose: () => void
}) {
  const editorActive = useValeHotspotEditorStore((s) => s.editorActive)
  const hotspots = useValeHotspotEditorStore((s) => s.hotspots)
  const mainPath = useValeHotspotEditorStore((s) => s.mainPath)
  const selectedId = useValeHotspotEditorStore((s) => s.selectedId)
  const selectedPoint = useValeHotspotEditorStore((s) => s.selectedPoint)
  const select = useValeHotspotEditorStore((s) => s.select)
  const selectPoint = useValeHotspotEditorStore((s) => s.selectPoint)
  const patchHitArea = useValeHotspotEditorStore((s) => s.patchHitArea)
  const bumpPathStart = useValeHotspotEditorStore((s) => s.bumpPathStart)
  const bumpPathWaypoint = useValeHotspotEditorStore((s) => s.bumpPathWaypoint)
  const bumpMainPathPoint = useValeHotspotEditorStore((s) => s.bumpMainPathPoint)
  const addPathWaypoint = useValeHotspotEditorStore((s) => s.addPathWaypoint)
  const removePathWaypoint = useValeHotspotEditorStore((s) => s.removePathWaypoint)
  const snapPathStartToJoin = useValeHotspotEditorStore((s) => s.snapPathStartToJoin)
  const resetSelected = useValeHotspotEditorStore((s) => s.resetSelected)
  const resetAll = useValeHotspotEditorStore((s) => s.resetAll)
  const moveBearAlongPath = useValeStore((s) => s.moveBearAlongPath)
  const [panelMsg, setPanelMsg] = useState<string | null>(null)

  const selected = hotspots.find((h) => h.id === selectedId) ?? hotspots[0]
  const pathEditable = selected ? PATH_HOTSPOT_IDS.includes(selected.id as (typeof PATH_HOTSPOT_IDS)[number]) : false

  const activeCoords = useMemo(() => {
    if (selectedPoint.kind === 'main') {
      const p = mainPath[selectedPoint.index]
      return p ? { x: p.x, z: p.z, rotationY: null as number | null, label: `pedra ${selectedPoint.index}` } : null
    }
    if (!selected) return null
    if (selectedPoint.kind === 'start') {
      const p = selected.pathStart
      return { x: p.x, z: p.z, rotationY: p.rotationY, label: 'partida P' }
    }
    const p = selected.path[selectedPoint.index]
    if (!p) return null
    const isLast = selectedPoint.index === selected.path.length - 1
    return {
      x: p.x,
      z: p.z,
      rotationY: p.rotationY,
      label: isLast ? 'chegada ★' : `ramo ${selectedPoint.index}`,
    }
  }, [mainPath, selected, selectedPoint])

  const flash = useCallback((text: string) => {
    setPanelMsg(text)
    window.setTimeout(() => setPanelMsg(null), 1800)
  }, [])

  const handleCopy = useCallback(async () => {
    if (!selected) return
    try {
      await navigator.clipboard.writeText(
        `${formatMainPathExport(mainPath)}\n\n${formatHotspotFullExport(selected)}`,
      )
      flash('Configuração copiada!')
    } catch {
      flash('Não foi possível copiar.')
    }
  }, [flash, mainPath, selected])

  const handleReset = useCallback(() => {
    resetSelected()
    flash('Hotspot resetado.')
  }, [flash, resetSelected])

  const handleTestPath = useCallback(() => {
    if (!selected) return
    moveBearAlongPath(selected.id)
    flash(`Testando caminho até ${selected.label}…`)
  }, [flash, moveBearAlongPath, selected])

  const handleCopyPath = useCallback(async () => {
    if (!selected) return
    try {
      await navigator.clipboard.writeText(formatHotspotPathExport(selected))
      flash('Path 3D copiado!')
    } catch {
      flash('Não foi possível copiar.')
    }
  }, [flash, selected])

  const handleBump = useCallback(
    (field: 'x' | 'z' | 'rotationY', delta: number) => {
      if (!selected) return
      if (selectedPoint.kind === 'main') {
        if (field === 'rotationY') return
        bumpMainPathPoint(selectedPoint.index, field, delta)
        return
      }
      if (selectedPoint.kind === 'start') {
        bumpPathStart(selected.id, field, delta)
        return
      }
      bumpPathWaypoint(selected.id, selectedPoint.index, field, delta)
    },
    [bumpMainPathPoint, bumpPathStart, bumpPathWaypoint, selected, selectedPoint],
  )

  if (!editorActive || !selected || !activeCoords) return null

  const { screenX, screenY, radius } = selected.hitArea

  return (
    <div className="vale-hotspot-editor-panel" role="dialog" aria-label="Editor de hotspots">
      <div className="vale-hotspot-editor-panel__header">
        <span className="vale-hotspot-editor-panel__title">
          {selected.emoji} {selected.label}
        </span>
        <button type="button" className="vale-hotspot-editor-panel__close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>
      </div>

      <p className="vale-hotspot-editor-panel__hint">
        M0 = início · P = partida da ramificação · ★ = chegada
      </p>
      {(message || panelMsg) && (
        <p className="vale-hotspot-editor-panel__msg">{panelMsg ?? message}</p>
      )}

      <div className="vale-hotspot-editor-panel__tabs">
        {hotspots
          .filter((h) => h.id !== 'caminho-pedras')
          .map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              className={`vale-hotspot-editor-panel__tab${selectedId === hotspot.id ? ' is-active' : ''}`}
              onClick={() => select(hotspot.id)}
              title={hotspot.label}
            >
              {hotspot.emoji}
            </button>
          ))}
      </div>

      <p className="vale-hotspot-editor-panel__section">Início (M0)</p>
      <div className="vale-hotspot-editor-panel__waypoint-tabs">
        {mainPath.slice(0, 1).map((_, i) => (
          <button
            key={`main-${i}`}
            type="button"
            className={`vale-hotspot-editor-panel__waypoint-tab vale-hotspot-editor-panel__waypoint-tab--main${
              isPointActive(selectedPoint, 'main', i) ? ' is-active' : ''
            }`}
            onClick={() => selectPoint({ kind: 'main', index: i })}
            title="Início (M0)"
          >
            M0
          </button>
        ))}
      </div>

      {pathEditable && (
        <>
          <p className="vale-hotspot-editor-panel__section">Ramificação deste hotspot</p>
          <div className="vale-hotspot-editor-panel__join-row">
            <span className="vale-hotspot-editor-panel__nudge-label">entra em</span>
            <span className="vale-hotspot-editor-panel__join-value">
              M0
            </span>
          </div>

          <div className="vale-hotspot-editor-panel__waypoint-tabs">
            <button
              type="button"
              className={`vale-hotspot-editor-panel__waypoint-tab vale-hotspot-editor-panel__waypoint-tab--start${
                selectedPoint.kind === 'start' ? ' is-active' : ''
              }`}
              onClick={() => selectPoint({ kind: 'start', index: 0 })}
              title="Ponto de partida"
            >
              P
            </button>
            {selected.path.map((_, i) => {
              const isLast = i === selected.path.length - 1
              return (
                <button
                  key={`wp-${i}`}
                  type="button"
                  className={`vale-hotspot-editor-panel__waypoint-tab${
                    isPointActive(selectedPoint, 'branch', i) ? ' is-active' : ''
                  }${isLast ? ' is-arrive' : ''}`}
                  onClick={() => selectPoint({ kind: 'branch', index: i })}
                >
                  {isLast ? '★' : i}
                </button>
              )
            })}
          </div>

          <div className="vale-hotspot-editor-panel__waypoint-actions">
            <button
              type="button"
              className="vale-hotspot-editor-panel__btn vale-hotspot-editor-panel__btn--ghost"
              onClick={() => addPathWaypoint(selected.id)}
            >
              + ponto
            </button>
            <button
              type="button"
              className="vale-hotspot-editor-panel__btn vale-hotspot-editor-panel__btn--ghost"
              disabled={selected.path.length <= 1 || selectedPoint.kind !== 'branch'}
              onClick={() => removePathWaypoint(selected.id, selectedPoint.index)}
            >
              − ponto
            </button>
            <button
              type="button"
              className="vale-hotspot-editor-panel__btn vale-hotspot-editor-panel__btn--ghost"
              onClick={() => snapPathStartToJoin(selected.id)}
            >
              P → pedra
            </button>
          </div>
        </>
      )}

      <p className="vale-hotspot-editor-panel__readout">
        {activeCoords.label} · x {num(activeCoords.x)} · z {num(activeCoords.z)}
        {activeCoords.rotationY !== null ? ` · rot ${radToDeg(activeCoords.rotationY)}°` : ''}
      </p>

      <NudgeGrid onBump={handleBump} showRot={selectedPoint.kind !== 'main'} />

      <p className="vale-hotspot-editor-panel__section">Clique 2D (hitArea)</p>
      <div className="vale-hotspot-editor-panel__fields">
        <label className="vale-hotspot-editor-panel__field">
          screenX ({num(screenX)})
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={screenX}
            onChange={(e) => patchHitArea(selected.id, { screenX: Number(e.target.value) })}
          />
        </label>
        <label className="vale-hotspot-editor-panel__field">
          screenY ({num(screenY)})
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={screenY}
            onChange={(e) => patchHitArea(selected.id, { screenY: Number(e.target.value) })}
          />
        </label>
        <label className="vale-hotspot-editor-panel__field">
          radius ({Math.round(radius)}px)
          <input
            type="range"
            min={40}
            max={120}
            step={1}
            value={radius}
            onChange={(e) => patchHitArea(selected.id, { radius: Number(e.target.value) })}
          />
        </label>
      </div>

      <div className="vale-hotspot-editor-panel__actions">
        <button type="button" className="vale-hotspot-editor-panel__btn" onClick={handleCopy}>
          Copiar configuração
        </button>
        <button type="button" className="vale-hotspot-editor-panel__btn vale-hotspot-editor-panel__btn--ghost" onClick={handleReset}>
          Resetar
        </button>
        <button type="button" className="vale-hotspot-editor-panel__btn vale-hotspot-editor-panel__btn--test" onClick={handleTestPath}>
          Testar caminho
        </button>
        <button type="button" className="vale-hotspot-editor-panel__btn vale-hotspot-editor-panel__btn--ghost" onClick={handleCopyPath}>
          Copiar path 3D
        </button>
      </div>

      <button
        type="button"
        className="vale-hotspot-editor-panel__reset-all"
        onClick={() => {
          resetAll()
          flash('Todos os hotspots resetados.')
        }}
      >
        Resetar todos
      </button>
    </div>
  )
}
