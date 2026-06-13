'use client'

import { useEffect, useState } from 'react'
import { getHomeDailyState, type HomeDailyVariant } from '@/lib/worlds/homeDailyState'

const BUTTERFLY_SLOTS = [
  { left: '18%', top: '22%', delay: '0s' },
  { left: '74%', top: '18%', delay: '2.4s' },
]

const BIRD_SLOTS = [
  { left: '62%', top: '12%', delay: '1s' },
]

export function HomeAmbientLife({ variant }: { variant?: HomeDailyVariant }) {
  const [dailyVariant, setDailyVariant] = useState<HomeDailyVariant>(variant ?? 'flower')

  useEffect(() => {
    if (!variant) setDailyVariant(getHomeDailyState().variant)
  }, [variant])

  return (
    <div className="home-ambient" aria-hidden>
      {BUTTERFLY_SLOTS.map((slot, i) => (
        <span
          key={`bf-${i}`}
          className="home-ambient__butterfly"
          style={{ left: slot.left, top: slot.top, animationDelay: slot.delay }}
        >
          🦋
        </span>
      ))}

      {BIRD_SLOTS.map((slot, i) => (
        <span
          key={`bird-${i}`}
          className="home-ambient__bird"
          style={{ left: slot.left, top: slot.top, animationDelay: slot.delay }}
        >
          🐦
        </span>
      ))}

      <span className="home-ambient__leaf home-ambient__leaf--1">🍃</span>
      <span className="home-ambient__leaf home-ambient__leaf--2">🍃</span>

      {dailyVariant === 'flower' && (
        <span className="home-ambient__daily home-ambient__daily--flower">🌸</span>
      )}
      {dailyVariant === 'lantern' && (
        <span className="home-ambient__daily home-ambient__daily--lantern">🏮</span>
      )}
      {dailyVariant === 'butterfly' && (
        <span className="home-ambient__daily home-ambient__daily--butterfly">🦋</span>
      )}
      {dailyVariant === 'leaf' && (
        <span className="home-ambient__daily home-ambient__daily--leaf">🍂</span>
      )}
    </div>
  )
}
