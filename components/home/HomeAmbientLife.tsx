'use client'

import { useEffect, useState } from 'react'
import { getHomeDailyState, type HomeDailyVariant } from '@/lib/worlds/homeDailyState'

export function HomeAmbientLife({ variant }: { variant?: HomeDailyVariant }) {
  const [dailyVariant, setDailyVariant] = useState<HomeDailyVariant>(variant ?? 'flower')

  useEffect(() => {
    if (!variant) setDailyVariant(getHomeDailyState().variant)
  }, [variant])

  return (
    <div className="home-ambient" aria-hidden>
      {dailyVariant === 'flower' && (
        <span className="home-ambient__daily home-ambient__daily--flower">🌸</span>
      )}
      {dailyVariant === 'lantern' && (
        <span className="home-ambient__daily home-ambient__daily--lantern">🏮</span>
      )}
    </div>
  )
}
