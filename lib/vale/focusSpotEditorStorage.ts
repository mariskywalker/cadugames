import {
  DEFAULT_FOCUS_SPOTS,
  mergeFocusSpots,
  type FocusSpotOverrides,
} from './focusSpotLayout'

export const FOCUS_SPOT_EDITOR_STORAGE_KEY = 'cadu.vale.focus-spots.overrides'

export function loadFocusSpotOverrides(): FocusSpotOverrides {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(FOCUS_SPOT_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { spots?: FocusSpotOverrides }
    return data?.spots ?? {}
  } catch {
    return {}
  }
}

export function saveFocusSpotOverrides(spots: FocusSpotOverrides) {
  try {
    localStorage.setItem(
      FOCUS_SPOT_EDITOR_STORAGE_KEY,
      JSON.stringify({ version: 1, spots, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function loadMergedFocusSpots() {
  return mergeFocusSpots(loadFocusSpotOverrides())
}

export function resetFocusSpotOverrides() {
  saveFocusSpotOverrides({})
  return mergeFocusSpots({})
}
