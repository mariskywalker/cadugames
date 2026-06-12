import { create } from 'zustand'
import {
  DEFAULT_ISLAND_LAYOUT,
  loadIslandOverride,
  mergeIslandLayout,
  saveIslandOverride,
  type IslandLayout,
  type IslandOverride,
} from '@/lib/vale/islandEditorStorage'

interface ValeIslandEditorStore {
  layout: IslandLayout
  override: IslandOverride
  hydrated: boolean
  editorActive: boolean
  hydrate: () => void
  setEditorActive: (active: boolean) => void
  patch: (patch: IslandOverride) => void
  reset: () => void
}

export const useValeIslandEditorStore = create<ValeIslandEditorStore>((set, get) => ({
  layout: DEFAULT_ISLAND_LAYOUT,
  override: {},
  hydrated: false,
  editorActive: false,

  hydrate: () => {
    if (get().hydrated) return
    set({ override: {}, layout: DEFAULT_ISLAND_LAYOUT, hydrated: true })
  },

  setEditorActive: (active) => {
    if (active) {
      const override = loadIslandOverride()
      set({ editorActive: true, override, layout: mergeIslandLayout(override) })
      return
    }
    set({ editorActive: false, override: {}, layout: DEFAULT_ISLAND_LAYOUT })
  },

  patch: (patch) => {
    const override = { ...get().override, ...patch }
    const layout = mergeIslandLayout(override)
    saveIslandOverride(override)
    set({ override, layout })
  },

  reset: () => {
    saveIslandOverride({})
    set({ override: {}, layout: DEFAULT_ISLAND_LAYOUT })
  },
}))
