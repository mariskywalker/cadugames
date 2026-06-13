import { create } from 'zustand'
import {
  buildCameraOverride,
  loadCameraOverride,
  resetCameraOverride,
  saveCameraOverride,
} from '@/lib/vale/cameraEditorStorage'
import {
  DEFAULT_VALE_CAMERA_LAYOUT,
  mergeValeCameraLayout,
  type ValeCameraLayout,
  type ValeCameraOverride,
} from '@/lib/vale/valeCameraLayout'

interface ValeCameraEditorStore {
  editorActive: boolean
  layout: ValeCameraLayout
  hydrated: boolean
  hydrate: () => void
  setEditorActive: (active: boolean) => void
  patch: (patch: ValeCameraOverride) => void
  reset: () => void
}

export const useValeCameraEditorStore = create<ValeCameraEditorStore>((set, get) => ({
  editorActive: false,
  layout: DEFAULT_VALE_CAMERA_LAYOUT,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return
    set({
      hydrated: true,
      layout: mergeValeCameraLayout(loadCameraOverride()),
    })
  },

  setEditorActive: (active) => set({ editorActive: active }),

  patch: (patch) => {
    const layout = { ...get().layout, ...patch }
    saveCameraOverride(buildCameraOverride(layout))
    set({ layout })
  },

  reset: () => {
    const layout = resetCameraOverride()
    set({ layout })
  },
}))
