import { useMemo, useState } from 'react'
import { LANDING_DOCK_ITEMS } from '../../constants/landingDockMenu'
import { useCADUStore } from '../../store/useCADUStore'
import { LandingDockIcon } from './icons/LandingDockIcons'

export function LandingDockMenu() {
  const enterRoom = useCADUStore((s) => s.enterRoom)
  const setViewMode = useCADUStore((s) => s.setViewMode)

  const defaultId = useMemo(
    () => LANDING_DOCK_ITEMS.find((i) => i.defaultActive)?.id ?? LANDING_DOCK_ITEMS[0]?.id,
    [],
  )
  const [activeId, setActiveId] = useState(defaultId)

  const handleSelect = (item) => {
    setActiveId(item.id)

    if (item.action === 'enterRoom') {
      enterRoom()
      return
    }
    if (item.action === 'map') {
      setViewMode('map')
    }
  }

  return (
    <nav className="cadu-landing-dock-menu" aria-label="Menu principal">
      {LANDING_DOCK_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`cadu-landing-dock-menu__btn${activeId === item.id ? ' is-active' : ''}`}
          onClick={() => handleSelect(item)}
          aria-label={item.label}
          aria-current={activeId === item.id ? 'page' : undefined}
          title={item.label}
        >
          <LandingDockIcon name={item.icon} />
        </button>
      ))}
    </nav>
  )
}
