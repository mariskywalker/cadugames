import {
  mergeFlowerPlacements,
  type FlowerPlacementOverrides,
} from './sceneFlowerAssets'

export const FLOWER_EDITOR_STORAGE_KEY = 'cadu.vale.flowers.overrides'

export function loadFlowerOverrides(): FlowerPlacementOverrides {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(FLOWER_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { flowers?: FlowerPlacementOverrides }
    return data?.flowers ?? {}
  } catch {
    return {}
  }
}

export function saveFlowerOverrides(flowers: FlowerPlacementOverrides) {
  try {
    localStorage.setItem(
      FLOWER_EDITOR_STORAGE_KEY,
      JSON.stringify({ version: 1, flowers, savedAt: Date.now() }),
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
