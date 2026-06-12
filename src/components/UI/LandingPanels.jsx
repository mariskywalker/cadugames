import { MOOD_META } from '../../constants/brand'

export function LandingPanels({ onExplore }) {
  const mood = MOOD_META.idle

  return (
    <>
      <aside className="cadu-landing-rail" aria-label="Amigos">
        <button type="button" className="cadu-landing-rail__avatar is-active" title="Lucas" />
        <button type="button" className="cadu-landing-rail__avatar is-teal" title="Amiga" />
        <button type="button" className="cadu-landing-rail__avatar is-pink" title="Amiga" />
        <button type="button" className="cadu-landing-rail__plus" title="Adicionar">
          +
        </button>
      </aside>

      <section className="cadu-landing-side" aria-label="Progresso">
        <div className="cadu-glass-card cadu-landing-card">
          <div className="cadu-landing-card__head">
            <h2 className="cadu-landing-card__kicker">Seu progresso</h2>
            <button type="button" className="cadu-landing-chip">
              Ver tudo
            </button>
          </div>
          <ul className="cadu-landing-progress">
            <li>
              <span className="cadu-landing-progress__icon is-yellow" aria-hidden>
                ★
              </span>
              <div>
                <span className="cadu-landing-progress__label">Conquistas</span>
                <div className="cadu-landing-progress__bar">
                  <span className="cadu-landing-progress__fill is-yellow" style={{ width: '40%' }} />
                </div>
                <span className="cadu-landing-progress__meta">12 / 30</span>
              </div>
            </li>
            <li>
              <span className="cadu-landing-progress__icon is-coral" aria-hidden>
                ♥
              </span>
              <div>
                <span className="cadu-landing-progress__label">Trilhas completas</span>
                <div className="cadu-landing-progress__bar">
                  <span className="cadu-landing-progress__fill is-coral" style={{ width: '40%' }} />
                </div>
                <span className="cadu-landing-progress__meta">4 / 10</span>
              </div>
            </li>
            <li>
              <span className="cadu-landing-progress__icon is-mint" aria-hidden>
                ☺
              </span>
              <div>
                <span className="cadu-landing-progress__label">Emoções descobertas</span>
                <div className="cadu-landing-progress__bar">
                  <span className="cadu-landing-progress__fill is-mint" style={{ width: '66%' }} />
                </div>
                <span className="cadu-landing-progress__meta">8 / 12</span>
              </div>
            </li>
          </ul>
        </div>

        <button type="button" className="cadu-glass-card cadu-landing-card cadu-landing-cta" onClick={onExplore}>
          <div>
            <span className="cadu-landing-card__kicker">Nova aventura</span>
            <span className="cadu-landing-cta__title">Vamos continuar sua jornada?</span>
          </div>
          <span className="cadu-landing-cta__go" aria-hidden>
            →
          </span>
        </button>

        <div className="cadu-glass-pill cadu-landing-streak">
          <span aria-hidden>🔥</span>
          <span className="cadu-landing-streak__n">7</span>
          <span className="cadu-landing-streak__t">Sequência de dias</span>
        </div>
      </section>

      <section className="cadu-landing-mood cadu-glass-card" aria-label="Emoção de hoje">
        <h2 className="cadu-landing-card__kicker">Emoção de hoje</h2>
        <div className="cadu-landing-mood__row">
          <span className="cadu-landing-mood__emoji" aria-hidden>
            {mood.emoji}
          </span>
          <div>
            <p className="cadu-landing-mood__title">{mood.label}</p>
            <p className="cadu-landing-mood__desc">Continue espalhando coisas boas!</p>
          </div>
        </div>
      </section>

      <nav className="cadu-landing-dock cadu-glass-pill" aria-label="Atalhos">
        {[
          { icon: '⌂', label: 'Início', active: true },
          { icon: '★', label: 'Favoritos' },
          { icon: '♥', label: 'Corações' },
          { icon: '🐻', label: 'CADU' },
          { icon: '▦', label: 'Progresso' },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className={`cadu-landing-dock__btn${item.active ? ' is-active' : ''}`}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </nav>
    </>
  )
}
