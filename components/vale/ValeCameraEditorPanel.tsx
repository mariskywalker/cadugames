'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { evaluateValeCamera } from '@/lib/vale/evaluateValeCamera'
import { formatValeCameraExport, type ValeCameraLayout } from '@/lib/vale/valeCameraLayout'
import { useValeCameraEditorStore } from '@/store/useValeCameraEditorStore'

function num(value: number, digits = 2) {
  return value.toFixed(digits)
}

type CameraField = keyof ValeCameraLayout

const SLIDERS: Array<{
  field: CameraField
  label: string
  min: number
  max: number
  step: number
  group: 'camera' | 'zoom'
}> = [
  { field: 'posX', label: 'Pos X', min: -2, max: 2, step: 0.05, group: 'camera' },
  { field: 'posY', label: 'Pos Y', min: 0.4, max: 2.4, step: 0.05, group: 'camera' },
  { field: 'posZ', label: 'Pos Z (distância)', min: 5.5, max: 14, step: 0.1, group: 'camera' },
  { field: 'targetX', label: 'Alvo X', min: -1, max: 2, step: 0.05, group: 'camera' },
  { field: 'targetY', label: 'Alvo Y', min: 0.2, max: 2, step: 0.05, group: 'camera' },
  { field: 'targetZ', label: 'Alvo Z', min: -8, max: 0, step: 0.1, group: 'camera' },
  { field: 'fov', label: 'FOV', min: 38, max: 68, step: 1, group: 'camera' },
  { field: 'sceneScale', label: 'Zoom cena', min: 1, max: 1.75, step: 0.01, group: 'zoom' },
  { field: 'sceneOriginX', label: 'Origem X (%)', min: 40, max: 70, step: 0.5, group: 'zoom' },
  { field: 'sceneOriginY', label: 'Origem Y (%)', min: 35, max: 62, step: 0.5, group: 'zoom' },
]

export function ValeCameraEditorPanel({
  editorMode,
  message,
  onClose,
}: {
  editorMode: boolean
  message: string | null
  onClose: () => void
}) {
  const layout = useValeCameraEditorStore((s) => s.layout)
  const patch = useValeCameraEditorStore((s) => s.patch)
  const reset = useValeCameraEditorStore((s) => s.reset)
  const [tab, setTab] = useState<'camera' | 'zoom'>('camera')
  const [panelMsg, setPanelMsg] = useState<string | null>(null)
  const [viewport, setViewport] = useState({ w: 1280, h: 720 })
  const [justGotGood, setJustGotGood] = useState(false)
  const wasOkRef = useRef(false)

  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const evaluation = useMemo(
    () => (editorMode ? evaluateValeCamera(layout, viewport.w, viewport.h) : null),
    [editorMode, layout, viewport.w, viewport.h],
  )

  useEffect(() => {
    if (!evaluation?.ok || !editorMode) return
    if (!wasOkRef.current) {
      setJustGotGood(true)
      window.setTimeout(() => setJustGotGood(false), 2400)
    }
    wasOkRef.current = evaluation.ok
  }, [evaluation?.ok, editorMode])

  useEffect(() => {
    if (!editorMode) wasOkRef.current = false
  }, [editorMode])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatValeCameraExport(layout))
      setPanelMsg('Layout copiado!')
      window.setTimeout(() => setPanelMsg(null), 1800)
    } catch {
      setPanelMsg('Não foi possível copiar.')
    }
  }, [layout])

  const handleReset = useCallback(() => {
    reset()
    setPanelMsg('Câmera resetada.')
    window.setTimeout(() => setPanelMsg(null), 1800)
  }, [reset])

  if (!editorMode || !evaluation) return null

  const activeSliders = SLIDERS.filter((s) => s.group === tab)

  return (
    <>
      <div
        className={`vale-camera-status${evaluation.ok ? ' vale-camera-status--ok' : ''}${justGotGood ? ' vale-camera-status--celebrate' : ''}`}
        role="status"
        aria-live="polite"
      >
        {evaluation.ok ? (
          <>
            <span className="vale-camera-status__icon" aria-hidden>
              ✓
            </span>
            <span className="vale-camera-status__text">Composição boa — pode copiar e salvar</span>
          </>
        ) : (
          <>
            <span className="vale-camera-status__icon" aria-hidden>
              ◐
            </span>
            <span className="vale-camera-status__text">
              Ajustando… {evaluation.score}% · ilha {evaluation.islandSize.toFixed(1)}
            </span>
          </>
        )}
      </div>

      <div className="vale-camera-editor-panel" role="dialog" aria-label="Editor de câmera">
        <div className="vale-camera-editor-panel__header">
          <span className="vale-camera-editor-panel__title">Câmera do Vale</span>
          <button
            type="button"
            className="vale-camera-editor-panel__close"
            onClick={onClose}
            aria-label="Fechar editor"
          >
            ✕
          </button>
        </div>

        <p className="vale-camera-editor-panel__hint">
          Ajuste até o aviso verde · <kbd>C</kbd> alterna · score {evaluation.score}%
        </p>
        {message && <p className="vale-camera-editor-panel__msg">{message}</p>}

        <div className="vale-camera-editor-panel__tabs">
          <button
            type="button"
            className={`vale-camera-editor-panel__tab${tab === 'camera' ? ' is-active' : ''}`}
            onClick={() => setTab('camera')}
          >
            Câmera 3D
          </button>
          <button
            type="button"
            className={`vale-camera-editor-panel__tab${tab === 'zoom' ? ' is-active' : ''}`}
            onClick={() => setTab('zoom')}
          >
            Zoom cena
          </button>
        </div>

        <ul className="vale-camera-editor-panel__checks">
          {evaluation.checks.map((check) => (
            <li
              key={check.id}
              className={`vale-camera-editor-panel__check${check.pass ? ' is-pass' : ' is-fail'}`}
              title={check.hint}
            >
              <span aria-hidden>{check.pass ? '✓' : '·'}</span> {check.label}
            </li>
          ))}
        </ul>

        <div className="vale-camera-editor-panel__fields">
          {activeSliders.map(({ field, label, min, max, step }) => (
            <label key={field} className="vale-camera-editor-panel__field">
              <span className="vale-camera-editor-panel__field-head">
                {label}
                <input
                  type="number"
                  step={step}
                  min={min}
                  max={max}
                  value={num(layout[field], field === 'fov' ? 0 : 2)}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value)
                    if (Number.isFinite(value)) patch({ [field]: value })
                  }}
                />
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={layout[field]}
                onChange={(e) => patch({ [field]: parseFloat(e.target.value) })}
              />
            </label>
          ))}
        </div>

        {panelMsg && <p className="vale-camera-editor-panel__msg">{panelMsg}</p>}

        <div className="vale-camera-editor-panel__actions">
          <button
            type="button"
            className={`vale-camera-editor-panel__btn${evaluation.ok ? ' vale-camera-editor-panel__btn--ok' : ''}`}
            onClick={() => void handleCopy()}
          >
            {evaluation.ok ? 'Copiar layout ✓' : 'Copiar layout'}
          </button>
          <button
            type="button"
            className="vale-camera-editor-panel__btn vale-camera-editor-panel__btn--ghost"
            onClick={handleReset}
          >
            Resetar
          </button>
        </div>
      </div>
    </>
  )
}
