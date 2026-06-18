import { VALE_HOTSPOT_EDITOR_ENABLED } from './valeGameplay'
import {
  VALE_HOTSPOTS,
  applyHitAreaToHotspot,
  type ValeHotspot,
  type ValeHotspotHitArea,
} from './valeHotspots'

export const HOTSPOT_HIT_AREA_STORAGE_KEY = 'cadu.vale.hotspots.hitArea.overrides'
export const HOTSPOT_HIT_AREA_LAYOUT_VERSION = 1

export type HotspotHitAreaOverride = Partial<ValeHotspotHitArea>
export type HotspotHitAreaOverrides = Record<string, HotspotHitAreaOverride>

export function loadHotspotHitAreaOverrides(): HotspotHitAreaOverrides {
  if (!VALE_HOTSPOT_EDITOR_ENABLED || typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(HOTSPOT_HIT_AREA_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { version?: number; hitAreas?: HotspotHitAreaOverrides }
    if (data.version !== HOTSPOT_HIT_AREA_LAYOUT_VERSION) return {}
    return data?.hitAreas ?? {}
  } catch {
    return {}
  }
}

export function saveHotspotHitAreaOverrides(hitAreas: HotspotHitAreaOverrides) {
  if (!VALE_HOTSPOT_EDITOR_ENABLED || typeof window === 'undefined') return
  try {
    localStorage.setItem(
      HOTSPOT_HIT_AREA_STORAGE_KEY,
      JSON.stringify({ version: HOTSPOT_HIT_AREA_LAYOUT_VERSION, hitAreas, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function mergeHotspotHitAreas(
  overrides: HotspotHitAreaOverrides = loadHotspotHitAreaOverrides(),
): ValeHotspot[] {
  return VALE_HOTSPOTS.map((hotspot) => {
    const patch = overrides[hotspot.id]
    if (!patch) {
      return {
        ...hotspot,
        hitArea: { ...hotspot.hitArea },
        pathStart: { ...hotspot.pathStart },
        bearTarget: { ...hotspot.bearTarget },
        path: hotspot.path.map((p) => ({ ...p })),
      }
    }
    return applyHitAreaToHotspot(hotspot, { ...hotspot.hitArea, ...patch })
  })
}

export function loadMergedValeHotspotHitAreas(): ValeHotspot[] {
  if (!VALE_HOTSPOT_EDITOR_ENABLED) {
    return VALE_HOTSPOTS.map((hotspot) => ({
      ...hotspot,
      hitArea: { ...hotspot.hitArea },
      pathStart: { ...hotspot.pathStart },
      bearTarget: { ...hotspot.bearTarget },
      path: hotspot.path.map((p) => ({ ...p })),
    }))
  }
  return mergeHotspotHitAreas(loadHotspotHitAreaOverrides())
}

export function resetHotspotHitAreaOverrides() {
  saveHotspotHitAreaOverrides({})
  return mergeHotspotHitAreas({})
}

function hitAreaDiff(a: ValeHotspotHitArea, b: ValeHotspotHitArea): HotspotHitAreaOverride {
  const patch: HotspotHitAreaOverride = {}
  if (Math.abs(a.screenX - b.screenX) > 0.001) patch.screenX = a.screenX
  if (Math.abs(a.screenY - b.screenY) > 0.001) patch.screenY = a.screenY
  if (Math.abs(a.radius - b.radius) > 0.5) patch.radius = a.radius
  return patch
}

export function buildHotspotHitAreaOverrides(
  hotspots: ValeHotspot[],
  prev: HotspotHitAreaOverrides,
): HotspotHitAreaOverrides {
  const next: HotspotHitAreaOverrides = { ...prev }

  for (const hotspot of hotspots) {
    const base = VALE_HOTSPOTS.find((h) => h.id === hotspot.id)
    if (!base) continue

    const patch = hitAreaDiff(hotspot.hitArea, base.hitArea)
    if (Object.keys(patch).length > 0) next[hotspot.id] = patch
    else delete next[hotspot.id]
  }

  return next
}
