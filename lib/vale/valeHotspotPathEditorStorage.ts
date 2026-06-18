import { VALE_HOTSPOT_EDITOR_ENABLED } from './valeGameplay'
import type { ValeHotspot } from './valeHotspots'
import {
  VALE_HOTSPOTS,
  VALE_MAIN_PATH,
  applyArriveTargetToHotspot,
  finalizeHotspotPath,
  pathStartFromJoin,
  type ValeBearTarget,
  type ValeHotspotWaypoint,
} from './valeHotspots'
import { loadHotspotHitAreaOverrides, mergeHotspotHitAreas } from './valeHotspotEditorStorage'

export const HOTSPOT_PATH_STORAGE_KEY = 'cadu.vale.hotspots.path.overrides'
export const MAIN_PATH_STORAGE_KEY = 'cadu.vale.hotspots.mainPath.overrides'
export const HOTSPOT_PATH_LAYOUT_VERSION = 2

export type HotspotPathOverride = {
  mainJoinIndex?: number
  pathStart?: Partial<ValeBearTarget>
  path?: ValeHotspotWaypoint[]
  arriveTarget?: Partial<ValeBearTarget>
}

export type HotspotPathOverrides = Record<string, HotspotPathOverride>

export type MainPathPointOverride = { x?: number; z?: number }
export type MainPathOverrides = Record<number, MainPathPointOverride>

export function ensureHotspotPathStart(hotspot: ValeHotspot): ValeHotspot {
  if (hotspot.pathStart) return hotspot
  const toward = hotspot.path[0] ?? hotspot.arriveTarget
  return {
    ...hotspot,
    pathStart: pathStartFromJoin(hotspot.mainJoinIndex, toward.x, toward.z),
  }
}

export function loadHotspotPathOverrides(): HotspotPathOverrides {
  if (!VALE_HOTSPOT_EDITOR_ENABLED || typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(HOTSPOT_PATH_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { version?: number; paths?: HotspotPathOverrides }
    if (data.version !== HOTSPOT_PATH_LAYOUT_VERSION && data.version !== 1) return {}
    return data?.paths ?? {}
  } catch {
    return {}
  }
}

export function saveHotspotPathOverrides(paths: HotspotPathOverrides) {
  if (!VALE_HOTSPOT_EDITOR_ENABLED || typeof window === 'undefined') return
  try {
    localStorage.setItem(
      HOTSPOT_PATH_STORAGE_KEY,
      JSON.stringify({ version: HOTSPOT_PATH_LAYOUT_VERSION, paths, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function loadMainPathOverrides(): MainPathOverrides {
  if (!VALE_HOTSPOT_EDITOR_ENABLED || typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(MAIN_PATH_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { version?: number; points?: MainPathOverrides }
    if (data.version !== HOTSPOT_PATH_LAYOUT_VERSION) return {}
    return data?.points ?? {}
  } catch {
    return {}
  }
}

export function saveMainPathOverrides(points: MainPathOverrides) {
  if (!VALE_HOTSPOT_EDITOR_ENABLED || typeof window === 'undefined') return
  try {
    localStorage.setItem(
      MAIN_PATH_STORAGE_KEY,
      JSON.stringify({ version: HOTSPOT_PATH_LAYOUT_VERSION, points, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function loadMergedMainPath(
  overrides: MainPathOverrides = loadMainPathOverrides(),
): Array<{ x: number; z: number }> {
  return VALE_MAIN_PATH.map((point, index) => {
    const patch = overrides[index]
    if (!patch) return { ...point }
    return {
      x: patch.x ?? point.x,
      z: patch.z ?? point.z,
    }
  })
}

export function buildMainPathOverrides(
  mainPath: Array<{ x: number; z: number }>,
  prev: MainPathOverrides,
): MainPathOverrides {
  const next: MainPathOverrides = { ...prev }
  mainPath.forEach((point, index) => {
    const base = VALE_MAIN_PATH[index]
    if (!base) return
    const patch: MainPathPointOverride = {}
    if (Math.abs(point.x - base.x) > 0.02) patch.x = point.x
    if (Math.abs(point.z - base.z) > 0.02) patch.z = point.z
    if (Object.keys(patch).length > 0) next[index] = patch
    else delete next[index]
  })
  return next
}

export function resetMainPathOverrides() {
  saveMainPathOverrides({})
  return loadMergedMainPath({})
}

export function mergeHotspotPaths(
  hotspots: ValeHotspot[],
  overrides: HotspotPathOverrides = loadHotspotPathOverrides(),
): ValeHotspot[] {
  return hotspots.map((hotspot) => {
    const patch = overrides[hotspot.id]
    let next = ensureHotspotPathStart(hotspot)
    if (!patch) return finalizeHotspotPath(next)

    if (patch.mainJoinIndex !== undefined) {
      next = { ...next, mainJoinIndex: patch.mainJoinIndex }
    }
    if (patch.pathStart) {
      next = { ...next, pathStart: { ...next.pathStart, ...patch.pathStart } }
    }
    if (patch.path) {
      next = { ...next, path: patch.path.map((p) => ({ ...p })) }
    }
    if (patch.arriveTarget) {
      next = applyArriveTargetToHotspot(next, { ...next.arriveTarget, ...patch.arriveTarget })
    }
    return finalizeHotspotPath(next)
  })
}

/** Hotspots com hitArea + path + arriveTarget (gameplay e editor) */
export function loadMergedValeHotspotsForGameplay(): ValeHotspot[] {
  const withHit = VALE_HOTSPOT_EDITOR_ENABLED
    ? mergeHotspotHitAreas(loadHotspotHitAreaOverrides())
    : VALE_HOTSPOTS.map((h) =>
        ensureHotspotPathStart({
          ...h,
          hitArea: { ...h.hitArea },
          pathStart: { ...h.pathStart },
          path: h.path.map((p) => ({ ...p })),
          arriveTarget: { ...h.arriveTarget },
          bearTarget: { ...h.bearTarget },
        }),
      )

  return VALE_HOTSPOT_EDITOR_ENABLED
    ? mergeHotspotPaths(withHit, loadHotspotPathOverrides())
    : withHit.map(finalizeHotspotPath)
}

export function getGameplayValeHotspot(id: string): ValeHotspot | undefined {
  return loadMergedValeHotspotsForGameplay().find((h) => h.id === id)
}

/** Contexto usado pelo gameplay ao montar a rota — caminho principal completo (M0 pode ter override do editor). */
export function getBuildHotspotPathContext() {
  return { mainPath: loadMergedMainPath() }
}

function pathDiff(base: ValeHotspot, edited: ValeHotspot): HotspotPathOverride | null {
  const patch: HotspotPathOverride = {}
  const baseReady = ensureHotspotPathStart(base)
  const editedReady = finalizeHotspotPath(ensureHotspotPathStart(edited))

  if (baseReady.mainJoinIndex !== editedReady.mainJoinIndex) patch.mainJoinIndex = editedReady.mainJoinIndex

  const startPatch: Partial<ValeBearTarget> = {}
  const bs = baseReady.pathStart
  const es = editedReady.pathStart
  if (Math.abs(bs.x - es.x) > 0.02) startPatch.x = es.x
  if (Math.abs(bs.z - es.z) > 0.02) startPatch.z = es.z
  if (Math.abs(bs.rotationY - es.rotationY) > 0.02) startPatch.rotationY = es.rotationY
  if (Object.keys(startPatch).length > 0) patch.pathStart = startPatch

  const pathChanged =
    baseReady.path.length !== editedReady.path.length ||
    editedReady.path.some((p, i) => {
      const b = baseReady.path[i]
      if (!b) return true
      return (
        Math.abs(p.x - b.x) > 0.02 ||
        Math.abs(p.z - b.z) > 0.02 ||
        Math.abs(p.rotationY - b.rotationY) > 0.02
      )
    })
  if (pathChanged) patch.path = editedReady.path.map((p) => ({ ...p }))

  const t = editedReady.arriveTarget
  const bt = baseReady.arriveTarget
  const targetPatch: Partial<ValeBearTarget> = {}
  if (Math.abs(t.x - bt.x) > 0.02) targetPatch.x = t.x
  if (Math.abs(t.z - bt.z) > 0.02) targetPatch.z = t.z
  if (Math.abs(t.rotationY - bt.rotationY) > 0.02) targetPatch.rotationY = t.rotationY
  if (Object.keys(targetPatch).length > 0) patch.arriveTarget = targetPatch

  return Object.keys(patch).length > 0 ? patch : null
}

export function buildHotspotPathOverrides(
  hotspots: ValeHotspot[],
  prev: HotspotPathOverrides,
): HotspotPathOverrides {
  const next: HotspotPathOverrides = { ...prev }

  for (const hotspot of hotspots) {
    const base = VALE_HOTSPOTS.find((h) => h.id === hotspot.id)
    if (!base) continue
    const diff = pathDiff(base, finalizeHotspotPath(hotspot))
    if (diff) next[hotspot.id] = diff
    else delete next[hotspot.id]
  }

  return next
}

export function resetHotspotPathOverrides() {
  saveHotspotPathOverrides({})
  return loadMergedValeHotspotsForGameplay()
}
