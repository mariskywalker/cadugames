'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { homeTabRoute, type HomeTabId } from '@/lib/home/navigation'
import { HomeBottomNav } from './HomeBottomNav'
import { HomeScene } from './HomeScene'
import { HomeTopBar } from './HomeTopBar'
import './home.css'

export function HomeLanding() {
  const router = useRouter()
  const pathname = usePathname()
  const { child, setMode } = useApp()
  const [activeTab, setActiveTab] = useState<HomeTabId>('inicio')

  useEffect(() => {
    if (pathname === '/') setActiveTab('inicio')
  }, [pathname])

  const goToOpening = useCallback(() => {
    setMode('child')
    router.push('/opening')
  }, [router, setMode])

  const goToJourney = useCallback(() => {
    setMode('child')
    router.push('/child/life')
  }, [router, setMode])

  const onTab = useCallback(
    (tab: HomeTabId) => {
      setActiveTab(tab)
      if (tab === 'inicio') return
      const route = homeTabRoute(tab)
      if (route) {
        setMode('child')
        router.push(route)
      }
    },
    [router, setMode],
  )

  return (
    <div className="home-landing">
      <HomeTopBar child={child} />
      <div className="home-landing__scene">
        <HomeScene child={child} onContinueJourney={goToJourney} onExploreRoom={goToOpening} />
      </div>
      <HomeBottomNav activeTab={activeTab} onTab={onTab} />
    </div>
  )
}
