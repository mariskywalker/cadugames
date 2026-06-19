'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  OPENING_BACKDROP_COVER_BASE,
  OPENING_CAMERA_FOV_MAX,
  OPENING_CAMERA_FOV_MIN,
  OPENING_OBJECT_LABELS,
  OPENING_SCENE_OBJECT_IDS,
  type OpeningSceneObjectId,
} from '@/lib/opening/openingSceneEditorLayout'
import { useOpeningSceneEditorStore } from '@/store/useOpeningSceneEditorStore'

type TabId = 'objects' | 'background' | 'camera'

const TAB_LABELS: Record<TabId, string> = {
  objects: 'Objetos',
  background: 'Background',
  camera: 'Câmera',
}

function fmt(value: number, digits = 2) {
  return value.toFixed(digits)
}

export function OpeningSceneEditorPanel({
  editorMode,
  onClose,
}: {
  editorMode: boolean
  onClose: () => void
}) {
  const layout = useOpeningSceneEditorStore((s) => s.layout)
  const selectedId = useOpeningSceneEditorStore((s) => s.selectedId)
  const select = useOpeningSceneEditorStore((s) => s.select)
  const patchObject = useOpeningSceneEditorStore((s) => s.patchObject)
  const patchBackground = useOpeningSceneEditorStore((s) => s.patchBackground)
  const patchCamera = useOpeningSceneEditorStore((s) => s.patchCamera)
  const reset = useOpeningSceneEditorStore((s) => s.reset)
  const exportText = useOpeningSceneEditorStore((s) => s.exportText)
  const [tab, setTab] = useState<TabId>('objects')
  const [panelMsg, setPanelMsg] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const selected = layout.objects[selectedId]
  const isPodium = selectedId === 'podium'

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

  return createPortal(
    <div className="opening-scene-editor" role="dialog" aria-label="Editor da cena opening">
      <div className="opening-scene-editor__header">
        <div>
          <p className="opening-scene-editor__eyebrow">Opening / Sala sensorial</p>
          <h2 className="opening-scene-editor__title">Editor de cena</h2>
        </div>
        <button type="button" className="opening-scene-editor__close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>
      </div>

      <p className="opening-scene-editor__hint">
        Arraste objetos no palco · <kbd>O</kbd> alterna editor · valores salvos no navegador
      </p>
      {panelMsg && <p className="opening-scene-editor__msg">{panelMsg}</p>}

      <div className="opening-scene-editor__tabs">
        {(Object.keys(TAB_LABELS) as TabId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`opening-scene-editor__tab${tab === id ? ' is-active' : ''}`}
            onClick={() => setTab(id)}
          >
            {TAB_LABELS[id]}
          </button>
        ))}
      </div>

      {tab === 'objects' && (
        <>
          <div className="opening-scene-editor__object-tabs">
            {OPENING_SCENE_OBJECT_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className={`opening-scene-editor__object-tab${selectedId === id ? ' is-active' : ''}`}
                onClick={() => select(id)}
              >
                {OPENING_OBJECT_LABELS[id]}
              </button>
            ))}
          </div>
          <div className="opening-scene-editor__fields">
            <Slider label="X" value={selected.x} min={-6} max={6} step={0.05} onChange={(x) => patchObject(selectedId, { x })} />
            <Slider
              label="Y (altura)"
              value={selected.y}
              min={isPodium ? -5 : -0.5}
              max={isPodium ? 3 : 1.5}
              step={0.01}
              onChange={(y) => patchObject(selectedId, { y })}
            />
            <Slider
              label="Z"
              value={selected.z}
              min={isPodium ? -8 : -12}
              max={isPodium ? 2 : 8}
              step={0.05}
              onChange={(z) => patchObject(selectedId, { z })}
              disabled={isPodium}
            />
            {isPodium && (
              <p className="opening-scene-editor__hint opening-scene-editor__hint--inline">
                Z do palco é automático — sempre atrás dos objetos
              </p>
            )}
            <Slider label="Rotação Y" value={selected.rotY} min={-3.14} max={3.14} step={0.02} onChange={(rotY) => patchObject(selectedId, { rotY })} />
            {isPodium && (
              <Slider label="Rotação X" value={selected.rotX} min={-1.2} max={1.2} step={0.02} onChange={(rotX) => patchObject(selectedId, { rotX })} />
            )}
            <Slider
              label="Escala X"
              value={selected.scaleX}
              min={isPodium ? 0.2 : 0.1}
              max={isPodium ? 3 : 2}
              step={0.01}
              onChange={(scaleX) => patchObject(selectedId, { scaleX })}
            />
            <Slider
              label="Escala Y"
              value={selected.scaleY}
              min={isPodium ? 0.2 : 0.1}
              max={isPodium ? 3 : 2}
              step={0.01}
              onChange={(scaleY) => patchObject(selectedId, { scaleY })}
            />
            <Slider
              label="Escala Z"
              value={selected.scaleZ}
              min={isPodium ? 0.2 : 0.1}
              max={isPodium ? 3 : 2}
              step={0.01}
              onChange={(scaleZ) => patchObject(selectedId, { scaleZ })}
            />
          </div>
        </>
      )}

      {tab === 'background' && (
        <div className="opening-scene-editor__fields">
          <Slider label="Distância" value={layout.background.distance} min={2} max={60} step={0.25} onChange={(distance) => patchBackground({ distance })} />
          <Slider
            label="Escala tela"
            value={layout.background.height}
            min={8}
            max={80}
            step={0.5}
            onChange={(height) => patchBackground({ height })}
          />
          <p className="opening-scene-editor__hint opening-scene-editor__hint--inline">
            Escala {OPENING_BACKDROP_COVER_BASE} = tela cheia · imagem fixa atrás do canvas 3D (palco + objetos)
          </p>
          <Slider label="Offset Y" value={layout.background.offsetY} min={-6} max={8} step={0.1} onChange={(offsetY) => patchBackground({ offsetY })} />
          <Slider label="Opacidade" value={layout.background.opacity} min={0.2} max={1} step={0.01} onChange={(opacity) => patchBackground({ opacity })} />
          <Slider label="Céu procedural" value={layout.background.proceduralSkyOpacity} min={0} max={1} step={0.02} onChange={(proceduralSkyOpacity) => patchBackground({ proceduralSkyOpacity })} />
          <label className="opening-scene-editor__toggle">
            <input
              type="checkbox"
              checked={layout.background.showProceduralSky}
              onChange={(e) => patchBackground({ showProceduralSky: e.target.checked })}
            />
            Mostrar gradiente procedural
          </label>
        </div>
      )}

      {tab === 'camera' && (
        <div className="opening-scene-editor__fields">
          <Slider label="Cam X" value={layout.camera.position[0]} min={-6} max={6} step={0.05} onChange={(v) => patchCamera({ position: [v, layout.camera.position[1], layout.camera.position[2]] })} />
          <Slider label="Cam Y" value={layout.camera.position[1]} min={1} max={8} step={0.05} onChange={(v) => patchCamera({ position: [layout.camera.position[0], v, layout.camera.position[2]] })} />
          <Slider label="Cam Z" value={layout.camera.position[2]} min={4} max={16} step={0.05} onChange={(v) => patchCamera({ position: [layout.camera.position[0], layout.camera.position[1], v] })} />
          <Slider label="Olhar Y" value={layout.camera.target[1]} min={0} max={3} step={0.05} onChange={(v) => patchCamera({ target: [layout.camera.target[0], v, layout.camera.target[2]] })} />
          <Slider
            label="FOV"
            value={layout.camera.fov}
            min={OPENING_CAMERA_FOV_MIN}
            max={OPENING_CAMERA_FOV_MAX}
            step={0.05}
            onChange={(fov) => patchCamera({ fov })}
          />
        </div>
      )}

      <div className="opening-scene-editor__actions">
        <button type="button" className="opening-scene-editor__btn" onClick={handleCopy}>
          Copiar export
        </button>
        <button type="button" className="opening-scene-editor__btn opening-scene-editor__btn--ghost" onClick={handleReset}>
          Resetar
        </button>
      </div>

      <pre className="opening-scene-editor__readout">{exportText()}</pre>
    </div>,
    document.body,
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  disabled = false,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  disabled?: boolean
}) {
  return (
    <label className={`opening-scene-editor__field${disabled ? ' is-disabled' : ''}`}>
      <span className="opening-scene-editor__field-label">
        {label}
        <span className="opening-scene-editor__field-value">{fmt(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}
