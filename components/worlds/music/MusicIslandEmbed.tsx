'use client'

import { MUSIC_ISLAND_WORLD } from '@/lib/worlds/musicIsland'

export function MusicIslandEmbed() {
  return (
    <div className="music-island-scene">
      <iframe
        src={MUSIC_ISLAND_WORLD.sceneEmbedUrl}
        title="Ilha dos Sons — Floating Music Island"
        className="music-island-scene__embed"
        allow="fullscreen; autoplay; xr-spatial-tracking"
      />
    </div>
  )
}
