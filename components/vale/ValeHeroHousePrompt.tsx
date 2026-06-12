'use client'

import { useEffect } from 'react'
import { childProfile } from '@/lib/mockChildProfile'
import { useValeStore } from '@/store/useValeStore'
import { CasaUrsoHubModal } from './CasaUrsoHubModal'

/** Card de entrada quando o Cadu chega à porta da Casa do Urso (modo hero) */
export function ValeHeroHousePrompt() {
  const isNearHouse = useValeStore((s) => s.isNearHouse)
  const houseHubOpen = useValeStore((s) => s.houseHubOpen)
  const openHouseHub = useValeStore((s) => s.openHouseHub)
  const closeHouseHub = useValeStore((s) => s.closeHouseHub)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== 'e' && e.key !== 'E') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) {
        return
      }
      if (!useValeStore.getState().isNearHouse) return
      e.preventDefault()
      openHouseHub()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openHouseHub])

  return (
    <>
      {isNearHouse && !houseHubOpen && (
        <div className="vale-page__house-card" role="dialog" aria-label="Casa do Urso">
          <span className="vale-page__house-card-icon" aria-hidden>
            🏡
          </span>
          <h2 className="vale-page__house-card-title">Casa do Urso</h2>
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
          <p className="vale-page__house-card-hint">ou pressione Enter</p>
        </div>
      )}

      {houseHubOpen && <CasaUrsoHubModal onClose={closeHouseHub} />}
    </>
  )
}
