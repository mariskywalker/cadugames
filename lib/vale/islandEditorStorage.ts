import { VALE_ISLAND_OFFSET, VALE_ISLAND_ROTATION_Y } from './valeWorld'

export const ISLAND_EDITOR_ID = 'casa-island'
export const ISLAND_EDITOR_STORAGE_KEY = 'cadu.vale.island.overrides'

export interface IslandLayout {
  offsetX: number
  offsetY: number
  offsetZ: number
  rotationYDeg: number
}

export type IslandOverride = Partial<IslandLayout>

export const DEFAULT_ISLAND_LAYOUT: IslandLayout = {
  offsetX: VALE_ISLAND_OFFSET[0],
  offsetY: VALE_ISLAND_OFFSET[1],
  offsetZ: VALE_ISLAND_OFFSET[2],
  rotationYDeg: (VALE_ISLAND_ROTATION_Y * 180) / Math.PI,
}

export function loadIslandOverride(): IslandOverride {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(ISLAND_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as IslandOverride
  } catch {
    return {}
  }
}

export function saveIslandOverride(override: IslandOverride) {
  try {
    localStorage.setItem(ISLAND_EDITOR_STORAGE_KEY, JSON.stringify(override))
  } catch {
    // ignore
  }
}

export function mergeIslandLayout(override: IslandOverride): IslandLayout {
  return { ...DEFAULT_ISLAND_LAYOUT, ...override }
}

export function formatIslandExport(layout: IslandLayout): string {
  const rotRad = ((layout.rotationYDeg * Math.PI) / 180).toFixed(4)
  return `// Cole em lib/vale/valeWorld.ts
export const VALE_ISLAND_OFFSET: [number, number, number] = [${layout.offsetX}, ${layout.offsetY}, ${layout.offsetZ}]
export const VALE_ISLAND_ROTATION_Y = ${rotRad}`
}
