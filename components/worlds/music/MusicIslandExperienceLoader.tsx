'use client'

import dynamic from 'next/dynamic'
import '../world-experience.css'
import './music-island.css'

const MusicIslandExperience = dynamic(
  () =>
    import('./MusicIslandExperience').then((mod) => mod.MusicIslandExperience),
  {
    ssr: false,
    loading: () => (
      <div className="world-experience world-experience--loading" aria-busy="true">
        <p className="world-experience__loading-text">Abrindo a Ilha dos Sons…</p>
      </div>
    ),
  },
)

export function MusicIslandExperienceLoader() {
  return <MusicIslandExperience />
}
