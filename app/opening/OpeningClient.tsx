'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect } from 'react'
import { OpeningSplash } from '@/components/opening/OpeningSplash'
import { useOpeningSceneEditorMode } from '@/hooks/opening/useOpeningSceneEditorMode'
import { useHubPointEditorMode } from '@/hooks/worlds/useHubPointEditorMode'
import { useOpeningSceneEditorStore } from '@/store/useOpeningSceneEditorStore'
import { ROOM_STUDIO_GRADIENT_CSS } from '@/lib/opening/roomBackdrop'
import { childProfile } from '@/lib/mockChildProfile'
import '@/components/worlds/world-interactions.css'

const OpeningScene = dynamic(() => import('@/components/opening/OpeningScene'), {
  ssr: false,
  loading: () => <OpeningSplash />,
})

const WorldInteractionLayer = dynamic(
  () =>
    import('@/components/worlds/WorldInteractionLayer').then((m) => m.WorldInteractionLayer),
  { ssr: false },
)

const HubPointEditorFab = dynamic(
  () => import('@/components/worlds/HubPointEditorTools').then((m) => m.HubPointEditorFab),
  { ssr: false },
)

const HubPointEditorTools = dynamic(
  () => import('@/components/worlds/HubPointEditorTools').then((m) => m.HubPointEditorTools),
  { ssr: false },
)

const OpeningSceneEditorFab = dynamic(
  () =>
    import('@/components/opening/OpeningSceneEditorTools').then((m) => m.OpeningSceneEditorFab),
  { ssr: false },
)

const OpeningSceneEditorTools = dynamic(
  () =>
    import('@/components/opening/OpeningSceneEditorTools').then((m) => m.OpeningSceneEditorTools),
  { ssr: false },
)

const CHOICES = [
  { href: '/child/life', emoji: '🗺️', label: 'Minha Jornada' },
  { href: '/child/diary', emoji: '💛', label: 'Como estou me sentindo?' },
  { href: '/child/family', emoji: '🏠', label: 'Fazer com a família' },
]

export function OpeningClient() {
  const { editorMode: sceneEditorMode, setEditorMode: setSceneEditorMode } = useOpeningSceneEditorMode()
  const {
    editorMode: hubEditorMode,
    setEditorMode: setHubEditorMode,
    message: hubMessage,
    setMessage: setHubMessage,
  } = useHubPointEditorMode()
  const hydrate = useOpeningSceneEditorStore((s) => s.hydrate)
  const setEditorActive = useOpeningSceneEditorStore((s) => s.setEditorActive)

  const openSceneEditor = useCallback(() => {
    setHubEditorMode(false)
    setHubMessage(null)
    setSceneEditorMode(true)
  }, [setHubEditorMode, setHubMessage, setSceneEditorMode])

  const openHubEditor = useCallback(() => {
    setSceneEditorMode(false)
    setHubEditorMode(true)
    setHubMessage('Editor de hotspots — arraste os emojis ou ajuste no painel.')
  }, [setHubEditorMode, setHubMessage, setSceneEditorMode])

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    setEditorActive(sceneEditorMode)
  }, [sceneEditorMode, setEditorActive])

  useEffect(() => {
    if (hubEditorMode) setSceneEditorMode(false)
  }, [hubEditorMode, setSceneEditorMode])

  useEffect(() => {
    if (sceneEditorMode) {
      setHubEditorMode(false)
      setHubMessage(null)
    }
  }, [sceneEditorMode, setHubEditorMode, setHubMessage])

  return (
    <div className="opening-page">
      <div className="opening-page__bg" style={{ background: ROOM_STUDIO_GRADIENT_CSS }} aria-hidden />
      <OpeningScene />
      <div className="opening-interactions">
        <WorldInteractionLayer worldId="sensory" />
      </div>
      <div className="opening-page__vignette" aria-hidden />

      <header className="opening-page__speech" aria-label="Fala do Cadu">
        <p className="opening-page__speech-text">
          Oi {childProfile.name}! O que vamos fazer hoje?
        </p>
      </header>

      <footer className="opening-page__footer">
        <nav className="opening-page__choices" aria-label="Escolhas do dia">
          {CHOICES.map((choice) => (
            <Link key={choice.href} href={choice.href} className="opening-page__choice">
              <span className="opening-page__choice-emoji" aria-hidden>
                {choice.emoji}
              </span>
              <span className="opening-page__choice-label">{choice.label}</span>
            </Link>
          ))}
        </nav>
        <p className="opening-page__subtitle">Um mundo mágico só seu — escolha por onde começar</p>
        <Link href="/" className="opening-page__cta">
          Voltar ao início
        </Link>
      </footer>

      <OpeningSceneEditorFab editorMode={sceneEditorMode || hubEditorMode} onToggle={openSceneEditor} />
      <HubPointEditorFab editorMode={sceneEditorMode || hubEditorMode} onToggle={openHubEditor} />
      <OpeningSceneEditorTools editorMode={sceneEditorMode} onClose={() => setSceneEditorMode(false)} />
      <HubPointEditorTools
        editorMode={hubEditorMode}
        message={hubMessage}
        onClose={() => {
          setHubEditorMode(false)
          setHubMessage(null)
        }}
      />
    </div>
  )
}
