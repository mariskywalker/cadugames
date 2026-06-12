const TABS = [
  { id: 'explorar', label: 'Explorar' },
  { id: 'trilhas', label: 'Trilhas' },
  { id: 'emocoes', label: 'Emoções' },
  { id: 'conquistas', label: 'Conquistas' },
]

export function LandingFloatingNav({ activeTab = 'explorar', onTab }) {
  return (
    <header className="cadu-landing-nav" aria-label="Menu principal">
      <div className="cadu-landing-nav__logo cadu-glass-pill">
        <span className="cadu-landing-nav__logo-text">CADU</span>
        <span className="cadu-landing-nav__logo-mark" aria-hidden>
          🐻
        </span>
      </div>

      <nav className="cadu-landing-nav__tabs" aria-label="Seções">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`cadu-landing-nav__tab cadu-glass-pill${activeTab === tab.id ? ' is-active' : ''}`}
            onClick={() => onTab?.(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="cadu-landing-nav__actions">
        <button type="button" className="cadu-landing-nav__chip cadu-glass-pill" title="Perfil adulto">
          <span className="cadu-landing-nav__chip-avatar" aria-hidden />
          <span className="cadu-landing-nav__chip-label">Responsável</span>
        </button>
      </div>
    </header>
  )
}
