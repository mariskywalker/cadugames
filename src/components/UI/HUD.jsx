import { useEffect, useMemo } from 'react'
import { MOOD_META } from '../../constants/brand'
import { useCADUStore } from '../../store/useCADUStore'
import { CADUTopBar } from './CADUTopBar'
import './cadu-ui.css'

export function HUD() {
  const characterState = useCADUStore((s) => s.characterState)
  const debug = useCADUStore((s) => s.debug)
  const toggleDebug = useCADUStore((s) => s.toggleDebug)
  const targetPosition = useCADUStore((s) => s.targetPosition)
  const fps = useCADUStore((s) => s.fps)
  const modelStatus = useCADUStore((s) => s.modelStatus)
  const modelError = useCADUStore((s) => s.modelError)
  const cameraSaveMessage = useCADUStore((s) => s.cameraSaveMessage)
  const clearCameraSaveMessage = useCADUStore((s) => s.clearCameraSaveMessage)
  const requestSaveCamera = useCADUStore((s) => s.requestSaveCamera)
  const mood = useMemo(() => MOOD_META[characterState] ?? MOOD_META.idle, [characterState])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '`' || (e.shiftKey && e.key === 'D')) {
        e.preventDefault()
        toggleDebug()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleDebug])

  return (
    <div className="cadu-app__ui" aria-live="polite">
      {!debug && (
        <>
          <CADUTopBar variant="room" />

          <aside className="cadu-side" aria-label="Avatares">
            <button type="button" className="cadu-side__avatar is-active" title="CADU" />
            <button type="button" className="cadu-side__avatar is-teal" title="Amiga 1" />
            <button type="button" className="cadu-side__avatar is-pink" title="Amiga 2" />
            <button type="button" className="cadu-side__avatar is-violet" title="Amiga 3" />
            <button type="button" className="cadu-side__plus" title="Adicionar">
              +
            </button>
          </aside>

          <section className="cadu-right" aria-label="Seu progresso">
            <div className="cadu-glass-card cadu-progress">
              <div className="cadu-progress__top">
                <div>
                  <div className="cadu-card-kicker">Seu progresso</div>
                </div>
                <button type="button" className="cadu-chip">
                  Ver tudo
                </button>
              </div>

              <div className="cadu-progress__item">
                <span className="cadu-progress__icon is-yellow" aria-hidden>
                  ★
                </span>
                <div className="cadu-progress__meta">
                  <div className="cadu-progress__label">Conquistas</div>
                  <div className="cadu-progress__bar">
                    <div className="cadu-progress__fill is-yellow" style={{ width: '40%' }} />
                  </div>
                  <div className="cadu-progress__small">12 / 30</div>
                </div>
              </div>

              <div className="cadu-progress__item">
                <span className="cadu-progress__icon is-coral" aria-hidden>
                  ♥
                </span>
                <div className="cadu-progress__meta">
                  <div className="cadu-progress__label">Trilhas completas</div>
                  <div className="cadu-progress__bar">
                    <div className="cadu-progress__fill is-coral" style={{ width: '40%' }} />
                  </div>
                  <div className="cadu-progress__small">4 / 10</div>
                </div>
              </div>

              <div className="cadu-progress__item">
                <span className="cadu-progress__icon is-mint" aria-hidden>
                  ☺
                </span>
                <div className="cadu-progress__meta">
                  <div className="cadu-progress__label">Emoções descobertas</div>
                  <div className="cadu-progress__bar">
                    <div className="cadu-progress__fill is-mint" style={{ width: '66%' }} />
                  </div>
                  <div className="cadu-progress__small">8 / 12</div>
                </div>
              </div>
            </div>

            <div className="cadu-glass-card cadu-cta" aria-label="Nova aventura">
              <div className="cadu-cta__text">
                <div className="cadu-card-kicker">Nova aventura</div>
                <div className="cadu-cta__title">Vamos continuar sua jornada?</div>
              </div>
              <button type="button" className="cadu-cta__go" aria-label="Continuar">
                →
              </button>
            </div>

            <div className="cadu-glass-pill cadu-streak" aria-label="Sequência de dias">
              <span className="cadu-streak__flame" aria-hidden>
                🔥
              </span>
              <span className="cadu-streak__n">7</span>
              <span className="cadu-streak__t">Sequência de dias</span>
            </div>
          </section>

          <section className="cadu-bottom-left" aria-label="Emoção de hoje">
            <div className="cadu-glass-card cadu-today">
              <div className="cadu-card-kicker">Emoção de hoje</div>
              <div className="cadu-today__row">
                <span className="cadu-today__emoji" aria-hidden>
                  {mood.emoji}
                </span>
                <div>
                  <div className="cadu-today__title">{mood.label}</div>
                  <div className="cadu-today__desc">Continue espalhando coisas boas!</div>
                </div>
              </div>
            </div>
          </section>

          <nav className="cadu-dock" aria-label="Atalhos">
            <button type="button" className="cadu-dock__btn is-active" title="Início">
              ⌂
            </button>
            <button type="button" className="cadu-dock__btn" title="Favoritos">
              ★
            </button>
            <button type="button" className="cadu-dock__btn" title="Coração">
              ♥
            </button>
            <button type="button" className="cadu-dock__btn" title="CADU">
              🐻
            </button>
            <button type="button" className="cadu-dock__btn" title="Progresso">
              ▦
            </button>
          </nav>
        </>
      )}

      {cameraSaveMessage && <div className="cadu-toast">{cameraSaveMessage}</div>}

      {debug && (
        <div className="cadu-dev-panel">
          <h3>Modo desenvolvedor</h3>
          <p style={{ margin: '0 0 10px', opacity: 0.85 }}>Shift+D ou ` para fechar</p>
          <div className="cadu-dev-panel__row">
            <strong>Estado:</strong> {characterState}
          </div>
          <div className="cadu-dev-panel__row">
            <strong>Destino:</strong>{' '}
            {targetPosition ? targetPosition.map((n) => n.toFixed(2)).join(', ') : '—'}
          </div>
          <div className="cadu-dev-panel__row">
            <strong>FPS:</strong> {fps ? fps.toFixed(0) : '—'}
          </div>
          <div className="cadu-dev-panel__row">
            <strong>Modelo:</strong>{' '}
            {modelStatus === 'loaded'
              ? 'ok'
              : modelStatus === 'error'
                ? modelError || 'erro'
                : 'carregando'}
          </div>
          {useCADUStore.getState().viewMode === '3d' && (
            <button
              type="button"
              className="cadu-dev-chip"
              style={{ marginTop: 8 }}
              onClick={() => {
                requestSaveCamera()
                setTimeout(clearCameraSaveMessage, 2000)
              }}
            >
              Salvar câmera
            </button>
          )}
        </div>
      )}
    </div>
  )
}
