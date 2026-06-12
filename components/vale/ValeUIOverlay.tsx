'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { childProfile } from '@/lib/mockChildProfile'
import { VALE_LANDMARKS } from '@/lib/vale/valeWorld'
import { useValeStore } from '@/store/useValeStore'
import { CasaUrsoHubModal } from './CasaUrsoHubModal'

const SPEECH_DURATION_MS = 8000
const TOAST_DURATION_MS = 2800

export function ValeUIOverlay() {
  const [showAchievements, setShowAchievements] = useState(false)
  const [speechVisible, setSpeechVisible] = useState(true)
  const [toastVisible, setToastVisible] = useState(false)
  const autoModalShownRef = useRef(false)

  const discovered = useValeStore((s) => s.discovered)
  const lastDiscovery = useValeStore((s) => s.lastDiscovery)
  const isNearHouse = useValeStore((s) => s.isNearHouse)
  const houseHubOpen = useValeStore((s) => s.houseHubOpen)
  const openHouseHub = useValeStore((s) => s.openHouseHub)
  const closeHouseHub = useValeStore((s) => s.closeHouseHub)

  const discoveredCount = Object.keys(discovered).length
  const totalLandmarks = VALE_LANDMARKS.length

  // O balão de boas-vindas sai de cena sozinho — o cenário é o conteúdo
  useEffect(() => {
    const id = setTimeout(() => setSpeechVisible(false), SPEECH_DURATION_MS)
    return () => clearTimeout(id)
  }, [])

  // Toast de descoberta a cada novo local
  useEffect(() => {
    if (!lastDiscovery) return
    setToastVisible(true)
    const id = setTimeout(() => setToastVisible(false), TOAST_DURATION_MS)
    return () => clearTimeout(id)
  }, [lastDiscovery])

  // Conquista automática quando o vale inteiro foi descoberto
  useEffect(() => {
    if (discoveredCount < totalLandmarks || autoModalShownRef.current) return
    autoModalShownRef.current = true
    const id = setTimeout(() => setShowAchievements(true), TOAST_DURATION_MS + 200)
    return () => clearTimeout(id)
  }, [discoveredCount, totalLandmarks])

  return (
    <>
      <header className="vale-page__header vale-page__header-glass">
        <h1 className="vale-page__title">Vale das Palavras</h1>
        <p className="vale-page__tagline">A Casa do Urso é o coração deste mundo.</p>
      </header>

      <div className="vale-page__mission-card" aria-label="Missão atual">
        <span className="vale-page__mission-label">Próxima missão</span>
        <p className="vale-page__mission-text">{childProfile.currentMission}</p>
        <p className="vale-page__mission-progress">
          {childProfile.completedActivities} de {childProfile.totalActivities} atividades
        </p>
      </div>

      {speechVisible && (
        <div className="vale-page__speech" aria-label="Fala do Cadu">
          <span className="vale-page__speech-avatar" aria-hidden>
            🐻
          </span>
          <p className="vale-page__speech-text">
            Bem-vindo ao Vale das Palavras, {childProfile.name}! Aqui, cada escolha abre um
            caminho novo.
          </p>
        </div>
      )}

      {toastVisible && lastDiscovery && (
        <div className="vale-page__toast" role="status">
          <span aria-hidden>{lastDiscovery.emoji}</span> Você descobriu a {lastDiscovery.name}!
        </div>
      )}

      {isNearHouse && !houseHubOpen && (
        <div className="vale-page__house-card" role="dialog" aria-label="Casa do Urso">
          <span className="vale-page__house-card-icon" aria-hidden>
            🏡
          </span>
          <h2 className="vale-page__house-card-title">Bem-vindo ao Vale das Palavras</h2>
          <p className="vale-page__house-card-progress">
            Você completou {childProfile.completedActivities} de {childProfile.totalActivities}{' '}
            atividades.
          </p>
          <p className="vale-page__house-card-mission">
            <span>Próxima missão:</span>
            {childProfile.currentMission}
          </p>
          <button
            type="button"
            className="vale-page__btn vale-page__btn--primary vale-page__house-card-enter"
            onClick={openHouseHub}
          >
            Entrar na Casa do Urso
          </button>
        </div>
      )}

      {houseHubOpen && <CasaUrsoHubModal onClose={closeHouseHub} />}

      <footer className="vale-page__footer">
        <p className="vale-page__hint">
          {discoveredCount === 0
            ? 'Caminhe com o Cadu até a Casa do Urso no centro do vale'
            : `✨ ${discoveredCount} de ${totalLandmarks} lugares descobertos`}
        </p>
        <nav className="vale-page__actions" aria-label="Ações do vale">
          <Link href="/child/life" className="vale-page__btn">
            🗺️ Mapa do Vale
          </Link>
          <button
            type="button"
            className="vale-page__btn vale-page__btn--primary"
            onClick={() => setShowAchievements(true)}
          >
            🏅 Conquistas
          </button>
          <Link href="/child/life" className="vale-page__btn">
            ← Voltar
          </Link>
        </nav>
      </footer>

      {showAchievements && (
        <div
          className="vale-page__modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Conquistas do vale"
          onClick={() => setShowAchievements(false)}
        >
          <div className="vale-page__modal" onClick={(e) => e.stopPropagation()}>
            <span className="vale-page__modal-badge" aria-hidden>
              🏅
            </span>
            <h2 className="vale-page__modal-title">Explorador de Palavras</h2>
            <p className="vale-page__modal-text">
              {discoveredCount >= totalLandmarks
                ? `Você descobriu os ${totalLandmarks} cantinhos do vale e encontrou 10 objetos com sons iniciais diferentes.`
                : 'Você encontrou 10 objetos com sons iniciais diferentes.'}
            </p>
            <button
              type="button"
              className="vale-page__btn vale-page__btn--primary"
              onClick={() => setShowAchievements(false)}
            >
              Continuar explorando
            </button>
          </div>
        </div>
      )}
    </>
  )
}
