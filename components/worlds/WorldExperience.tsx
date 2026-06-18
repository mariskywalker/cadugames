'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { WorldExperienceProps } from '@/lib/worlds/worldExperience.types'
import { WorldExperienceHotspots } from './WorldExperienceHotspots'
import './world-experience.css'

export function WorldExperience({
  title,
  domain,
  mission,
  scene,
  hotspots = [],
  backHref = '/child/life',
  backLabel = '← Jornada',
  onHotspotClick,
  onMissionStart,
}: WorldExperienceProps) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className={`world-experience${entered ? ' world-experience--entered' : ''}`}>
      <div className="world-experience__sky" aria-hidden />

      <div ref={sceneRef} className="world-scene" aria-label="Mundo explorável">
        {scene}
        <WorldExperienceHotspots hotspots={hotspots} onHotspotClick={onHotspotClick} />
      </div>

      <header className="world-experience__hud world-experience__hud--top-left">
        <Link href={backHref} className="world-experience__back">
          {backLabel}
        </Link>
        <div className="world-experience__identity">
          <p className="world-experience__domain">{domain}</p>
          <h1 className="world-experience__title">{title}</h1>
        </div>
      </header>

      <aside className="world-experience__hud world-experience__hud--mission" aria-label="Missão">
        <p className="world-experience__mission-kicker">
          {mission.emoji && <span aria-hidden>{mission.emoji} </span>}
          {mission.title}
        </p>
        <p className="world-experience__mission-text">{mission.text}</p>
        <button type="button" className="world-experience__cta" onClick={onMissionStart}>
          {mission.ctaLabel ?? 'Começar'}
        </button>
      </aside>
    </div>
  )
}
