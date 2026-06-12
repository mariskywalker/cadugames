import { useState } from 'react'
import { useCADUStore } from '../../store/useCADUStore'
import './character-animation-panel.css'

export function CharacterAnimationPanel() {
  const [collapsed, setCollapsed] = useState(false)

  const manualClipName = useCADUStore((s) => s.manualClipName)
  const modelStatus = useCADUStore((s) => s.modelStatus)
  const animationClips = useCADUStore((s) => s.animationClips)
  const currentPlayingClip = useCADUStore((s) => s.currentPlayingClip)
  const animationError = useCADUStore((s) => s.animationError)
  const setManualClip = useCADUStore((s) => s.setManualClip)
  const clearManualClip = useCADUStore((s) => s.clearManualClip)

  return (
    <aside className={`cadu-anim-panel${collapsed ? ' is-collapsed' : ''}`} aria-label="Movimentos do CADU">
      <div className="cadu-anim-panel__head">
        <h2 className="cadu-anim-panel__title">Movimentos</h2>
        <button
          type="button"
          className="cadu-anim-panel__toggle"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? '▸' : '▾'}
        </button>
      </div>

      {!collapsed && (
        <div className="cadu-anim-panel__body">
          <p className="cadu-anim-panel__hint">
            {modelStatus === 'loaded'
              ? `${animationClips.length} clips corrigidos`
              : modelStatus === 'error'
                ? 'Erro ao carregar modelo'
                : 'Carregando personagem…'}
          </p>

          {animationError && (
            <p className="cadu-anim-panel__error" role="alert">
              {animationError}
            </p>
          )}

          <button
            type="button"
            className={`cadu-anim-panel__btn${manualClipName == null ? ' is-active' : ''}`}
            onClick={() => clearManualClip()}
          >
            Automático
          </button>

          <div className="cadu-anim-panel__grid cadu-anim-panel__grid--clips">
            {animationClips.map((clipName) => (
              <button
                key={clipName}
                type="button"
                className={`cadu-anim-panel__btn cadu-anim-panel__btn--clip${manualClipName === clipName ? ' is-active' : ''}`}
                onClick={() => setManualClip(clipName)}
                title={clipName}
              >
                {clipName}
              </button>
            ))}
          </div>

          {currentPlayingClip && (
            <p className="cadu-anim-panel__active">
              Tocando: <strong>{currentPlayingClip}</strong>
            </p>
          )}
        </div>
      )}
    </aside>
  )
}
