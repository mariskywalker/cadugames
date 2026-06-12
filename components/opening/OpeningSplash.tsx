'use client'

import { ROOM_STUDIO_GRADIENT_CSS } from '@/lib/opening/roomBackdrop'

export function OpeningSplash() {
  return (
    <div className="opening-page" aria-busy="true" aria-label="Carregando sala sensorial">
      <div className="opening-page__bg" style={{ background: ROOM_STUDIO_GRADIENT_CSS }} />
      <div className="opening-page__splash">
        <div className="opening-page__pulse" />
        <p className="opening-page__hint">Preparando a sala sensorial…</p>
      </div>
    </div>
  )
}
