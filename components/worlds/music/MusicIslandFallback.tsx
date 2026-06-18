'use client'

import { MUSIC_ISLAND_WORLD } from '@/lib/worlds/musicIsland'
import { MusicIslandThumbnail } from './MusicIslandThumbnail'

export function MusicIslandFallback({ error }: { error?: string | null }) {
  return (
    <div className="music-island-scene music-island-scene--fallback" role="img" aria-label="Prévia da Ilha dos Sons">
      <MusicIslandThumbnail large />
      <div className="music-island-scene__fallback-msg">
        <p className="music-island-scene__fallback-title">Cena Spline indisponível</p>
        <p className="music-island-scene__fallback-hint">
          Coloque <code>floating_music_island.spline</code> em{' '}
          <code>public/worlds/music/</code>
        </p>
        {error && (
          <p className="music-island-scene__fallback-error" role="alert">
            {error.includes('expired') || error.includes('AccessDenied')
              ? 'O link de download expirou — reenvie o arquivo .spline.'
              : error}
          </p>
        )}
        <p className="music-island-scene__fallback-note">
          Prévia temporária · {MUSIC_ISLAND_WORLD.domain}
        </p>
      </div>
    </div>
  )
}
