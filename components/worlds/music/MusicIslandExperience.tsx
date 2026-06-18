'use client'

import { WorldExperience } from '@/components/worlds/WorldExperience'
import { MUSIC_ISLAND_WORLD, musicHotspots } from '@/lib/worlds/musicIsland'
import type { WorldExperienceHotspot } from '@/lib/worlds/worldExperience.types'
import { MusicIslandScene } from './MusicIslandScene'

const islandHotspots: WorldExperienceHotspot[] = musicHotspots.map(
  ({ id, label, icon, x, y }) => ({ id, label, icon, x, y }),
)

export function MusicIslandExperience() {
  return (
    <WorldExperience
      title={MUSIC_ISLAND_WORLD.title}
      domain={MUSIC_ISLAND_WORLD.domain}
      mission={{
        title: 'Missão de Hoje',
        text: 'Ouça e repita os sons',
        emoji: MUSIC_ISLAND_WORLD.emoji,
        ctaLabel: 'Começar',
      }}
      hotspots={islandHotspots}
      scene={<MusicIslandScene />}
    />
  )
}
