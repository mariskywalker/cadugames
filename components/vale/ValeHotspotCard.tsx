'use client'

import { getValeHotspot } from '@/lib/vale/bearTargetEditorStorage'
import { useValeStore } from '@/store/useValeStore'

/** Card de interação ao clicar em um ponto do cenário */
export function ValeHotspotCard() {
  const activeId = useValeStore((s) => s.activeHotspotCardId)
  const closeHotspotCard = useValeStore((s) => s.closeHotspotCard)
  const startHotspotActivity = useValeStore((s) => s.startHotspotActivity)
  const isTraveling = useValeStore((s) => s.isTraveling)
  const interactionPending = useValeStore((s) => s.interactionPending)
  const narrativeIntroComplete = useValeStore((s) => s.narrativeIntroComplete)

  if (!activeId || !narrativeIntroComplete || isTraveling || interactionPending) return null

  const hotspot = getValeHotspot(activeId)
  if (!hotspot) return null

  return (
    <div className="vale-page__house-card" role="dialog" aria-label={hotspot.interactionTitle}>
      <span className="vale-page__house-card-icon" aria-hidden>
        {hotspot.emoji}
      </span>
      <h2 className="vale-page__house-card-title">{hotspot.interactionTitle}</h2>
      <p className="vale-page__house-card-progress">{hotspot.interactionDescription}</p>
      <button
        type="button"
        className="vale-page__btn vale-page__btn--primary vale-page__house-card-enter"
        onClick={() => startHotspotActivity(activeId)}
      >
        {hotspot.actionLabel}
      </button>
      <button
        type="button"
        className="vale-page__btn vale-page__house-card-dismiss"
        onClick={closeHotspotCard}
      >
        Fechar
      </button>
    </div>
  )
}
