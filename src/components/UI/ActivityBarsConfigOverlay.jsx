import { useCADUStore } from '../../store/useCADUStore'
import {
  ACTIVITY_BARS_POINT_KEYS,
  ACTIVITY_BARS_POINT_LABELS,
} from '../../utils/activityBarsEditorRefs'

const POINT_SWATCH = {
  hotspotPosition: '#fbbf24',
  interactionPoint: '#4ade80',
  faceTarget: '#38bdf8',
  animationAnchor: '#ef4444',
}

function formatVec3(v) {
  if (!v) return '—'
  return `[${v.map((n) => n.toFixed(2)).join(', ')}]`
}

function formatAnchor(anchor) {
  if (!anchor?.position) return '—'
  return `pos ${formatVec3(anchor.position)} · rot ${formatVec3(anchor.rotation)}`
}

export function ActivityBarsConfigOverlay() {
  const editMode = useCADUStore((s) => s.activityBarsEditMode)
  const config = useCADUStore((s) => s.activityBarsConfig)
  const selection = useCADUStore((s) => s.activityBarsEditSelection)
  const message = useCADUStore((s) => s.activityBarsEditMessage)
  const anchorPreview = useCADUStore((s) => s.activityBarsAnchorPreview)
  const anchorGizmoMode = useCADUStore((s) => s.activityBarsAnchorGizmoMode)
  const setActivityBarsEditMode = useCADUStore((s) => s.setActivityBarsEditMode)
  const setActivityBarsEditSelection = useCADUStore((s) => s.setActivityBarsEditSelection)
  const setActivityBarsAnchorGizmoMode = useCADUStore((s) => s.setActivityBarsAnchorGizmoMode)
  const resetActivityBarsConfig = useCADUStore((s) => s.resetActivityBarsConfig)
  const copyActivityBarsConfigExport = useCADUStore((s) => s.copyActivityBarsConfigExport)
  const startActivityBarsAnchorPreview = useCADUStore((s) => s.startActivityBarsAnchorPreview)
  const stopActivityBarsAnchorPreview = useCADUStore((s) => s.stopActivityBarsAnchorPreview)
  const saveCharacterAsAnimationAnchor = useCADUStore((s) => s.saveCharacterAsAnimationAnchor)

  if (!editMode) return null

  return (
    <div className="activity-bars-editor-overlay" role="dialog" aria-label="Editor da barra de atividades">
      <div className="activity-bars-editor-panel">
        <header className="activity-bars-editor-panel__head">
          <h2 className="activity-bars-editor-panel__title">Barras — ajuste visual</h2>
          <button
            type="button"
            className="activity-bars-editor-panel__close"
            onClick={() => setActivityBarsEditMode(false)}
          >
            Fechar
          </button>
        </header>

        <p className="activity-bars-editor-panel__hint">
          Verde = caminhada · Azul = olhar · Vermelho = snap de animação (Jump_and_Hang_on_Bar).
        </p>

        <ul className="activity-bars-editor-panel__points">
          {ACTIVITY_BARS_POINT_KEYS.map((key) => (
            <li key={key}>
              <button
                type="button"
                className={`activity-bars-editor-panel__point${selection === key ? ' is-active' : ''}`}
                onClick={() => setActivityBarsEditSelection(key)}
              >
                <span
                  className="activity-bars-editor-panel__swatch"
                  style={{ background: POINT_SWATCH[key] }}
                  aria-hidden
                />
                <span className="activity-bars-editor-panel__point-label">{ACTIVITY_BARS_POINT_LABELS[key]}</span>
                <code className="activity-bars-editor-panel__coords">
                  {key === 'animationAnchor'
                    ? formatAnchor(config.animationAnchor)
                    : formatVec3(config[key])}
                </code>
              </button>
            </li>
          ))}
        </ul>

        <div className="activity-bars-editor-panel__anchor-tools">
          <p className="activity-bars-editor-panel__subhead">Calibrar animation anchor com o CADU</p>
          {!anchorPreview ? (
            <button type="button" onClick={() => startActivityBarsAnchorPreview()}>
              Posicionar CADU no interactionPoint
            </button>
          ) : (
            <>
              <div className="activity-bars-editor-panel__mode-row">
                <button
                  type="button"
                  className={anchorGizmoMode === 'translate' ? 'is-active' : ''}
                  onClick={() => setActivityBarsAnchorGizmoMode('translate')}
                >
                  Mover
                </button>
                <button
                  type="button"
                  className={anchorGizmoMode === 'rotate' ? 'is-active' : ''}
                  onClick={() => setActivityBarsAnchorGizmoMode('rotate')}
                >
                  Rotacionar
                </button>
              </div>
              <button type="button" onClick={() => saveCharacterAsAnimationAnchor()}>
                Salvar posição atual como Animation Anchor
              </button>
              <button type="button" className="is-muted" onClick={() => stopActivityBarsAnchorPreview()}>
                Cancelar
              </button>
            </>
          )}
        </div>

        <div className="activity-bars-editor-panel__actions">
          <button type="button" onClick={() => copyActivityBarsConfigExport()}>
            Copiar JSON
          </button>
          <button type="button" className="is-muted" onClick={() => resetActivityBarsConfig()}>
            Resetar padrão
          </button>
        </div>

        {message && <p className="activity-bars-editor-panel__msg">{message}</p>}

        <p className="activity-bars-editor-panel__shortcut">
          Atalho: <kbd>B</kbd> · URL: <code>?bars=1</code>
        </p>
      </div>
    </div>
  )
}
