import {
  DEFAULT_HOME_CADU_LAYOUT,
  mergeHomeCaduLayout,
  type HomeCaduLayout,
  type HomeCaduLayoutOverride,
} from './homeCaduEditorLayout'

export const HOME_CADU_EDITOR_STORAGE_KEY = 'cadu.home.cadu-layout.overrides'

export function loadHomeCaduOverride(): HomeCaduLayoutOverride {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(HOME_CADU_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { version?: number; layout?: HomeCaduLayoutOverride }
    if (data.version !== 1 || !data.layout) return {}
    return data.layout
  } catch {
    return {}
  }
}

export function saveHomeCaduOverride(layout: HomeCaduLayout) {
  try {
    const override: HomeCaduLayoutOverride = {}
    const base = DEFAULT_HOME_CADU_LAYOUT
    for (const key of Object.keys(base) as Array<keyof HomeCaduLayout>) {
      if (layout[key] !== base[key]) override[key] = layout[key] as never
    }
    localStorage.setItem(
      HOME_CADU_EDITOR_STORAGE_KEY,
      JSON.stringify({ version: 1, layout: override, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function loadMergedHomeCaduLayout() {
  return mergeHomeCaduLayout(loadHomeCaduOverride())
}

export function resetHomeCaduOverride() {
  try {
    localStorage.removeItem(HOME_CADU_EDITOR_STORAGE_KEY)
  } catch {
    // ignore
  }
  return mergeHomeCaduLayout({})
}
