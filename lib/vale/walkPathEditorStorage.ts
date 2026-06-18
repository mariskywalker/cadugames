import type { ValeWalkPathPoint } from './valeWalkable'
import { DEFAULT_VALE_WALK_PATH_POINTS } from './valeWalkable'

export const WALK_PATH_EDITOR_STORAGE_KEY = 'cadu.vale.walk-path.overrides'
export const WALK_PATH_LAYOUT_VERSION = 3

export function cloneWalkPathPoints(points: ValeWalkPathPoint[]): ValeWalkPathPoint[] {
  return points.map((p) => ({ ...p }))
}

export function loadWalkPathOverrides(): ValeWalkPathPoint[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(WALK_PATH_EDITOR_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as { version?: number; points?: ValeWalkPathPoint[] }
    if (data.version !== WALK_PATH_LAYOUT_VERSION || !Array.isArray(data.points)) return null
    if (data.points.length < 2) return null
    return data.points.map((p) => ({
      id: p.id,
      x: Number(p.x),
      z: Number(p.z),
      ...(p.halfWidth != null ? { halfWidth: Number(p.halfWidth) } : {}),
    }))
  } catch {
    return null
  }
}

export function saveWalkPathOverrides(points: ValeWalkPathPoint[]) {
  try {
    localStorage.setItem(
      WALK_PATH_EDITOR_STORAGE_KEY,
      JSON.stringify({ version: WALK_PATH_LAYOUT_VERSION, points, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function mergeWalkPathPoints(overrides: ValeWalkPathPoint[] | null): ValeWalkPathPoint[] {
  if (!overrides?.length) return cloneWalkPathPoints(DEFAULT_VALE_WALK_PATH_POINTS)
  return cloneWalkPathPoints(overrides)
}

export function resetWalkPathOverrides() {
  saveWalkPathOverrides([])
  try {
    localStorage.removeItem(WALK_PATH_EDITOR_STORAGE_KEY)
  } catch {
    // ignore
  }
  return cloneWalkPathPoints(DEFAULT_VALE_WALK_PATH_POINTS)
}

export function formatWalkPathExport(points: ValeWalkPathPoint[]): string {
  const lines = points.map((p) => {
    const hw =
      p.halfWidth != null && Number.isFinite(p.halfWidth)
        ? `, halfWidth: ${p.halfWidth.toFixed(2)}`
        : ''
    return `  { id: '${p.id}', x: ${p.x.toFixed(2)}, z: ${p.z.toFixed(2)}${hw} },`
  })
  return `// Cole em lib/vale/valeWalkable.ts (DEFAULT_VALE_WALK_PATH_POINTS)\nexport const DEFAULT_VALE_WALK_PATH_POINTS: ValeWalkPathPoint[] = [\n${lines.join('\n')}\n]`
}

export function nextWalkPathPointId(points: ValeWalkPathPoint[]): string {
  let max = 0
  for (const p of points) {
    const n = parseInt(p.id.replace(/\D/g, ''), 10)
    if (Number.isFinite(n)) max = Math.max(max, n)
  }
  return `walk-${max + 1}`
}
