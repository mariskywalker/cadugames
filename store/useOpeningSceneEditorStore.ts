import { create } from 'zustand'
import {
  clampOpeningCameraFov,
  DEFAULT_OPENING_SCENE_LAYOUT,
  formatOpeningSceneExport,
  type OpeningObjectLayout,
  type OpeningSceneLayout,
  type OpeningSceneObjectId,
} from '@/lib/opening/openingSceneEditorLayout'
import {
  loadMergedOpeningSceneLayout,
  resetOpeningSceneOverride,
  saveOpeningSceneOverride,
} from '@/lib/opening/openingSceneEditorStorage'

interface OpeningSceneEditorStore {
  editorActive: boolean
  layout: OpeningSceneLayout
  selectedId: OpeningSceneObjectId
  hydrated: boolean
  hydrate: () => void
  setEditorActive: (active: boolean) => void
  select: (id: OpeningSceneObjectId) => void
  patchObject: (id: OpeningSceneObjectId, patch: Partial<OpeningObjectLayout>) => void
  patchBackground: (patch: Partial<OpeningSceneLayout['background']>) => void
  patchCamera: (patch: Partial<OpeningSceneLayout['camera']>) => void
  reset: () => void
  exportText: () => string
}

function persist(layout: OpeningSceneLayout) {
  saveOpeningSceneOverride(layout)
}

export const useOpeningSceneEditorStore = create<OpeningSceneEditorStore>((set, get) => ({
  editorActive: false,
  layout: DEFAULT_OPENING_SCENE_LAYOUT,
  selectedId: 'bubbleColumn',
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return
    set({ hydrated: true, layout: loadMergedOpeningSceneLayout() })
  },

  setEditorActive: (editorActive) => set({ editorActive }),

  select: (selectedId) => set({ selectedId }),

  patchObject: (id, patch) => {
    const layout = {
      ...get().layout,
      objects: {
        ...get().layout.objects,
        [id]: { ...get().layout.objects[id], ...patch },
      },
    }
    persist(layout)
    set({ layout, selectedId: id })
  },

  patchBackground: (patch) => {
    const layout = {
      ...get().layout,
      background: { ...get().layout.background, ...patch },
    }
    persist(layout)
    set({ layout })
  },

  patchCamera: (patch) => {
    const next = { ...get().layout.camera, ...patch }
    if (typeof next.fov === 'number') next.fov = clampOpeningCameraFov(next.fov)
    const layout = {
      ...get().layout,
      camera: next,
    }
    persist(layout)
    set({ layout })
  },

  reset: () => {
    const layout = resetOpeningSceneOverride()
    set({ layout })
  },

  exportText: () => formatOpeningSceneExport(get().layout),
}))
