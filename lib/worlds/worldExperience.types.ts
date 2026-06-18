import type { ReactNode } from 'react'

export interface WorldExperienceHotspot {
  id: string
  label: string
  icon: string
  /** Posição em % do container da cena */
  x: number
  y: number
}

export interface WorldExperienceMission {
  title: string
  text: string
  emoji?: string
  ctaLabel?: string
}

export interface WorldExperienceProps {
  title: string
  domain: string
  mission: WorldExperienceMission
  scene: ReactNode
  hotspots?: WorldExperienceHotspot[]
  backHref?: string
  backLabel?: string
  onHotspotClick?: (id: string) => void
  onMissionStart?: () => void
}
