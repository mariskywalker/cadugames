'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { ROOM_STUDIO_GRADIENT_CSS } from '@/lib/opening/roomBackdrop'

export default function OpeningError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[opening]', error)
  }, [error])

  return (
    <div className="opening-page">
      <div className="opening-page__bg" style={{ background: ROOM_STUDIO_GRADIENT_CSS }} aria-hidden />
      <div className="opening-page__error" role="alert">
        <p>Erro ao abrir a sala sensorial.</p>
        <p className="opening-page__error-detail">{error.message}</p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="button" className="opening-page__cta" onClick={reset}>
            Tentar novamente
          </button>
          <Link href="/" className="opening-page__cta">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
