import { create } from 'zustand'

export type ScreenDebugPointKind = 'main' | 'start' | 'waypoint' | 'arrive' | 'bear' | 'branch'

export type ScreenDebugPoint = {
  x: number
  y: number
  kind: ScreenDebugPointKind
  index?: number
  label?: string
  selected?: boolean
}

export type ScreenDebugSegment = {
  x1: number
  y1: number
  x2: number
  y2: number
}

export type PathScreenProjection = {
  hotspotId: string | null
  segments: ScreenDebugSegment[]
  points: ScreenDebugPoint[]
}

const EMPTY: PathScreenProjection = {
  hotspotId: null,
  segments: [],
  points: [],
}

interface ValeHotspotPathDebugStore {
  projection: PathScreenProjection
  setProjection: (projection: PathScreenProjection) => void
  clearProjection: () => void
}

export const useValeHotspotPathDebugStore = create<ValeHotspotPathDebugStore>((set) => ({
  projection: EMPTY,
  setProjection: (projection) => set({ projection }),
  clearProjection: () => set({ projection: EMPTY }),
}))
