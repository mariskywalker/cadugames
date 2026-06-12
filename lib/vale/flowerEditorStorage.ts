import {
  mergeFlowerPlacements,
  VALE_FLOWER_LAYOUT_VERSION,
  type FlowerPlacementOverrides,
} from './sceneFlowerAssets'

export const FLOWER_EDITOR_STORAGE_KEY = 'cadu.vale.flowers.overrides'

export function loadFlowerOverrides(): FlowerPlacementOverrides {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(FLOWER_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { version?: number; flowers?: FlowerPlacementOverrides }
    if (data.version !== VALE_FLOWER_LAYOUT_VERSION) return {}
    return data?.flowers ?? {}
  } catch {
    return {}
  }
}

export function saveFlowerOverrides(flowers: FlowerPlacementOverrides) {
  try {
    localStorage.setItem(
      FLOWER_EDITOR_STORAGE_KEY,
      JSON.stringify({ version: VALE_FLOWER_LAYOUT_VERSION, flowers, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function loadMergedFlowerPlacements() {
  return mergeFlowerPlacements(loadFlowerOverrides())
}

export function resetFlowerOverrides() {
  saveFlowerOverrides({})
  return mergeFlowerPlacements({})
}
