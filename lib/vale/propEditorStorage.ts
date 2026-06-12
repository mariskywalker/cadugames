import {
  mergeScenePropPlacements,
  type ScenePropOverrides,
} from './scenePropAssets'

export const PROP_EDITOR_STORAGE_KEY = 'cadu.vale.props.overrides'

export function loadPropOverrides(): ScenePropOverrides {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PROP_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { props?: ScenePropOverrides }
    return data?.props ?? {}
  } catch {
    return {}
  }
}

export function savePropOverrides(props: ScenePropOverrides) {
  try {
    localStorage.setItem(
      PROP_EDITOR_STORAGE_KEY,
      JSON.stringify({ version: 1, props, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function loadMergedScenePropPlacements() {
  return mergeScenePropPlacements(loadPropOverrides())
}

export function resetPropOverrides() {
  savePropOverrides({})
  return mergeScenePropPlacements({})
}
