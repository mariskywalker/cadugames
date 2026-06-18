'use client'

import dynamic from 'next/dynamic'
import { getMusicIslandSceneMode } from '@/lib/worlds/musicIsland'
import { MusicIslandEmbed } from './MusicIslandEmbed'

const MusicIslandSplineView = dynamic(
  () =>
    import('./MusicIslandSplineView').then((mod) => mod.MusicIslandSplineView),
  {
    ssr: false,
    loading: () => (
      <div className="music-island-scene__loading" aria-busy="true">
        <div className="music-island-scene__spinner" aria-hidden />
        <p>Carregando a Ilha dos Sons…</p>
      </div>
    ),
  },
)

export function MusicIslandScene() {
  const mode = getMusicIslandSceneMode()

  if (mode === 'embed') {
    return <MusicIslandEmbed />
  }

  return <MusicIslandSplineView mode={mode} />
}
