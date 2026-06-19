'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { useHomeCaduEditorMode } from '@/hooks/home/useHomeCaduEditorMode'
import { homeTabRoute, type HomeTabId } from '@/lib/home/navigation'
import { useHomeCaduEditorStore } from '@/store/useHomeCaduEditorStore'
import { HomeBottomNav } from './HomeBottomNav'
import { HomeCaduEditorPanel } from './HomeCaduEditorPanel'
import { HomeCaduEditorFab } from './HomeCaduEditorTools'
import { HomeScene } from './HomeScene'
import { HomeTopBar } from './HomeTopBar'
import './home.css'

export function HomeLanding() {
  const router = useRouter()
  const pathname = usePathname()
  const { child, setMode } = useApp()
  const [activeTab, setActiveTab] = useState<HomeTabId>('inicio')
  const { editorMode, setEditorMode } = useHomeCaduEditorMode()
  const setEditorActive = useHomeCaduEditorStore((s) => s.setEditorActive)

  useEffect(() => {
    setEditorActive(editorMode)
  }, [editorMode, setEditorActive])

  useEffect(() => {
    if (pathname === '/') setActiveTab('inicio')
  }, [pathname])

  const goToOpening = useCallback(() => {
    setMode('child')
    router.push('/opening')
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
        <HomeScene child={child} onExploreRoom={goToOpening} editorMode={editorMode} />
      </div>
      <HomeBottomNav activeTab={activeTab} onTab={onTab} />
      <HomeCaduEditorFab editorMode={editorMode} onToggle={() => setEditorMode(true)} />
      <HomeCaduEditorPanel editorMode={editorMode} onClose={() => setEditorMode(false)} />
    </div>
  )
}
