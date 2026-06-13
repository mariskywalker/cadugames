import {
  mergeHubPoints,
  type HubPointOverrides,
} from './worldInteractions'
import type { WorldId } from './types'

export const HUB_POINT_EDITOR_STORAGE_KEY = 'cadu.worlds.hub-points.overrides'

type StoredHubOverrides = Partial<Record<WorldId, HubPointOverrides>>

export function loadAllHubPointOverrides(): StoredHubOverrides {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(HUB_POINT_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { version?: number; worlds?: StoredHubOverrides }
    if (data.version !== 1) return {}
    return data.worlds ?? {}
  } catch {
    return {}
  }
}

export function loadHubPointOverrides(worldId: WorldId): HubPointOverrides {
  return loadAllHubPointOverrides()[worldId] ?? {}
}

export function saveHubPointOverrides(worldId: WorldId, overrides: HubPointOverrides) {
  if (typeof window === 'undefined') return
  try {
    const all = loadAllHubPointOverrides()
    if (Object.keys(overrides).length === 0) delete all[worldId]
    else all[worldId] = overrides

    localStorage.setItem(
      HUB_POINT_EDITOR_STORAGE_KEY,
      JSON.stringify({ version: 1, worlds: all, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function loadMergedHubPoints(worldId: WorldId) {
  return mergeHubPoints(worldId, loadHubPointOverrides(worldId))
}

export function resetHubPointOverrides(worldId: WorldId) {
  saveHubPointOverrides(worldId, {})
  return mergeHubPoints(worldId, {})
}
