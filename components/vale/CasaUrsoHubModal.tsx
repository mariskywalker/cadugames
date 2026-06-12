'use client'

import {
  casaUrsoAchievements,
  casaUrsoCaduTip,
  casaUrsoNextActivities,
  casaUrsoProgramProgress,
} from '@/lib/vale/casaUrsoHub'
import { VALE_LANDMARKS } from '@/lib/vale/valeWorld'
import { useValeStore } from '@/store/useValeStore'

export function CasaUrsoHubModal({ onClose }: { onClose: () => void }) {
  const discovered = useValeStore((s) => s.discovered)
  const discoveredCount = Object.keys(discovered).length

  const progress = casaUrsoProgramProgress

  return (
    <div
      className="vale-page__modal-backdrop vale-page__modal-backdrop--house"
      role="dialog"
      aria-modal="true"
      aria-label="Hub da Casa do Urso"
      onClick={onClose}
    >
      <div className="vale-page__hub" onClick={(e) => e.stopPropagation()}>
        <header className="vale-page__hub-header">
          <span className="vale-page__hub-icon" aria-hidden>
            🏡
          </span>
          <div>
            <h2 className="vale-page__hub-title">Casa do Urso</h2>
            <p className="vale-page__hub-subtitle">Seu lar no Vale das Palavras</p>
          </div>
          <button
            type="button"
            className="vale-page__hub-close"
            aria-label="Fechar hub"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <section className="vale-page__hub-section">
          <h3 className="vale-page__hub-section-title">Missão atual</h3>
          <p className="vale-page__hub-mission">{progress.mission}</p>
        </section>

        <section className="vale-page__hub-section">
          <h3 className="vale-page__hub-section-title">Progresso do programa</h3>
          <p className="vale-page__hub-meta">
            {progress.program} · Semana {progress.week} de {progress.totalWeeks}
          </p>
          <div className="vale-page__hub-progress-bar" aria-hidden>
            <div
              className="vale-page__hub-progress-fill"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <p className="vale-page__hub-progress-label">
            {progress.completed} de {progress.total} atividades ({progress.percent}%)
          </p>
        </section>

        <section className="vale-page__hub-section">
          <h3 className="vale-page__hub-section-title">Conquistas desbloqueadas</h3>
          <ul className="vale-page__hub-list">
            {casaUrsoAchievements.map((c) => (
              <li key={c.id} className="vale-page__hub-list-item">
                <span aria-hidden>{c.emoji}</span>
                <span>{c.title}</span>
              </li>
            ))}
            {discoveredCount > 0 && (
              <li className="vale-page__hub-list-item">
                <span aria-hidden>🗺️</span>
                <span>
                  Explorador do vale — {discoveredCount} de {VALE_LANDMARKS.length} lugares
                </span>
              </li>
            )}
          </ul>
        </section>

        <section className="vale-page__hub-section">
          <h3 className="vale-page__hub-section-title">Próximas atividades</h3>
          <ul className="vale-page__hub-list">
            {casaUrsoNextActivities.map((a) => (
              <li key={a.id} className="vale-page__hub-list-item">
                <span aria-hidden>{a.emoji}</span>
                <span>{a.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="vale-page__hub-tip">
          <span className="vale-page__hub-tip-avatar" aria-hidden>
            🐻
          </span>
          <div>
            <h3 className="vale-page__hub-tip-title">Recomendação do Cadu</h3>
            <p className="vale-page__hub-tip-text">{casaUrsoCaduTip}</p>
          </div>
        </section>

        <button type="button" className="vale-page__btn vale-page__btn--primary vale-page__hub-cta" onClick={onClose}>
          Continuar explorando o vale
        </button>
      </div>
    </div>
  )
}
