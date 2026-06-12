import { useState } from 'react'
import { CADU_LOGO_SRC, LUCAS_PROFILE_SRC } from '../../constants/brand'
import { useCADUStore } from '../../store/useCADUStore'

const TABS = [
  { id: 'explorar', label: 'Explorar' },
  { id: 'trilhas', label: 'Trilhas' },
  { id: 'emocoes', label: 'Emoções' },
  { id: 'conquistas', label: 'Conquistas' },
]

/**
 * Barra superior funcional — mesma lógica do HUD, estética glass CADU.
 * @param {'landing' | 'room'} variant
 */
export function CADUTopBar({ variant = 'room' }) {
  const viewMode = useCADUStore((s) => s.viewMode)
  const setViewMode = useCADUStore((s) => s.setViewMode)
  const enterRoom = useCADUStore((s) => s.enterRoom)

  const [landingTab, setLandingTab] = useState('explorar')

  const isLanding = variant === 'landing'
  const activeTab = isLanding
    ? landingTab
    : viewMode === 'map'
      ? 'map'
      : viewMode === '3d'
        ? 'explorar'
        : 'explorar'

  const onTab = (tabId) => {
    if (isLanding) {
      setLandingTab(tabId)
      if (tabId === 'explorar') enterRoom()
      return
    }
    if (tabId === 'explorar') {
      if (viewMode === 'map') enterRoom()
      else setViewMode('3d')
    }
  }

  const onMap = () => {
    if (isLanding) {
      setViewMode('map')
      return
    }
    setViewMode(viewMode === 'map' ? '3d' : 'map')
  }

  return (
    <header
      className={`cadu-topbar${isLanding ? ' cadu-topbar--landing' : ''}`}
      aria-label="Menu principal CADU"
    >
      <div className="cadu-topbar__left">
        <div className="cadu-logo" aria-label="CADU">
          <img className="cadu-logo__img" src={CADU_LOGO_SRC} alt="CADU" draggable={false} decoding="async" />
        </div>
      </div>

      <nav className="cadu-topbar__nav" aria-label="Navegação">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`cadu-tab${activeTab === tab.id ? ' is-active' : ''}`}
            onClick={() => onTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="cadu-topbar__right">
        <button type="button" className="cadu-profile" title="Perfil Lucas">
          <img
            className="cadu-profile__avatar"
            src={LUCAS_PROFILE_SRC}
            alt=""
            width={38}
            height={38}
            draggable={false}
            decoding="async"
          />
          <span className="cadu-profile__name">Lucas</span>
        </button>
        <button
          type="button"
          className="cadu-icon-btn"
          title={viewMode === 'map' && !isLanding ? 'Voltar ao mundo 3D' : 'Ver mapa'}
          onClick={onMap}
        >
          {viewMode === 'map' && !isLanding ? '✦' : '◎'}
        </button>
      </div>
    </header>
  )
}
