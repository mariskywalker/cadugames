'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { OpeningSplash } from '@/components/opening/OpeningSplash'
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

const HubPointEditorTools = dynamic(
  () => import('@/components/worlds/HubPointEditorTools').then((m) => m.HubPointEditorTools),
  { ssr: false },
)

const CHOICES = [
  { href: '/child/life', emoji: '🗺️', label: 'Minha Jornada' },
  { href: '/child/diary', emoji: '💛', label: 'Como estou me sentindo?' },
  { href: '/child/family', emoji: '🏠', label: 'Fazer com a família' },
]

export function OpeningClient() {
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
        <p className="opening-page__subtitle">Toque nos objetos da sala ou clique no chão para explorar</p>
        <Link href="/" className="opening-page__cta">
          Voltar ao início
        </Link>
      </footer>
      <HubPointEditorTools />
    </div>
  )
}
