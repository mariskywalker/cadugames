'use client'

import { HOME_TABS, type HomeTabId } from '@/lib/home/navigation'

export function HomeBottomNav({
  activeTab,
  onTab,
}: {
  activeTab: HomeTabId
  onTab: (tab: HomeTabId) => void
}) {
  return (
    <nav className="home-bottom-nav" aria-label="Navegação principal">
      {HOME_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`home-bottom-nav__btn${activeTab === tab.id ? ' is-active' : ''}`}
          onClick={() => onTab(tab.id)}
          aria-current={activeTab === tab.id ? 'page' : undefined}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
