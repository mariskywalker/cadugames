'use client'

import type { WorldExperienceHotspot } from '@/lib/worlds/worldExperience.types'

export function WorldExperienceHotspots({
  hotspots,
  onHotspotClick,
}: {
  hotspots: WorldExperienceHotspot[]
  onHotspotClick?: (id: string) => void
}) {
  if (hotspots.length === 0) return null

  return (
    <div className="world-experience-hotspots" aria-label="Pontos de exploração">
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          type="button"
          className="world-experience-hotspot"
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          aria-label={hotspot.label}
          onClick={() => onHotspotClick?.(hotspot.id)}
        >
          <span className="world-experience-hotspot__pulse" aria-hidden />
          <span className="world-experience-hotspot__icon" aria-hidden>
            {hotspot.icon}
          </span>
          <span className="world-experience-hotspot__label">{hotspot.label}</span>
        </button>
      ))}
    </div>
  )
}
