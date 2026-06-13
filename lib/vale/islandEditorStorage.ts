import {
  VALE_ISLAND_OFFSET,
  VALE_ISLAND_ROTATION_X,
  VALE_ISLAND_ROTATION_Y,
  VALE_ISLAND_ROTATION_Z,
} from './valeWorld'

export const ISLAND_EDITOR_ID = 'casa-island'
export const ISLAND_EDITOR_STORAGE_KEY = 'cadu.vale.island.overrides'

export interface IslandLayout {
  offsetX: number
  offsetY: number
  offsetZ: number
  rotationXDeg: number
  rotationYDeg: number
  rotationZDeg: number
}

export type IslandOverride = Partial<IslandLayout>

const radToDeg = (rad: number) => (rad * 180) / Math.PI

export const DEFAULT_ISLAND_LAYOUT: IslandLayout = {
  offsetX: VALE_ISLAND_OFFSET[0],
  offsetY: VALE_ISLAND_OFFSET[1],
  offsetZ: VALE_ISLAND_OFFSET[2],
  rotationXDeg: radToDeg(VALE_ISLAND_ROTATION_X),
  rotationYDeg: radToDeg(VALE_ISLAND_ROTATION_Y),
  rotationZDeg: radToDeg(VALE_ISLAND_ROTATION_Z),
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
  const rotX = ((layout.rotationXDeg * Math.PI) / 180).toFixed(4)
  const rotY = ((layout.rotationYDeg * Math.PI) / 180).toFixed(4)
  const rotZ = ((layout.rotationZDeg * Math.PI) / 180).toFixed(4)
  return `// Cole em lib/vale/valeWorld.ts
export const VALE_ISLAND_OFFSET: [number, number, number] = [${layout.offsetX}, ${layout.offsetY}, ${layout.offsetZ}]
export const VALE_ISLAND_ROTATION_X = ${rotX}
export const VALE_ISLAND_ROTATION_Y = ${rotY}
export const VALE_ISLAND_ROTATION_Z = ${rotZ}`
}
