import { create } from 'zustand'
import { formatHomeCaduExport, type HomeCaduLayout } from '@/lib/home/homeCaduEditorLayout'
import {
  loadMergedHomeCaduLayout,
  resetHomeCaduOverride,
  saveHomeCaduOverride,
} from '@/lib/home/homeCaduEditorStorage'

interface HomeCaduEditorStore {
  editorActive: boolean
  layout: HomeCaduLayout
  hydrated: boolean
  hydrate: () => void
  setEditorActive: (active: boolean) => void
  patch: (patch: Partial<HomeCaduLayout>) => void
  reset: () => void
  exportText: () => string
}

function persist(layout: HomeCaduLayout) {
  saveHomeCaduOverride(layout)
}

export const useHomeCaduEditorStore = create<HomeCaduEditorStore>((set, get) => ({
  editorActive: false,
  layout: loadMergedHomeCaduLayout(),
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return
    const layout = loadMergedHomeCaduLayout()
    set({ hydrated: true, layout })
  },

  setEditorActive: (editorActive) => set({ editorActive }),

  patch: (patch) => {
    const layout = { ...get().layout, ...patch }
    persist(layout)
    set({ layout })
  },

  reset: () => {
    const layout = resetHomeCaduOverride()
    set({ layout })
  },

  exportText: () => formatHomeCaduExport(get().layout),
}))
