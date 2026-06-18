import { create } from 'zustand'
import {
  buildBearTargetOverrides,
  loadBearTargetOverrides,
  loadMergedValeHotspots,
  resetBearTargetOverrides,
  saveBearTargetOverrides,
} from '@/lib/vale/bearTargetEditorStorage'
import type { ValeBearTarget, ValeHotspot } from '@/lib/vale/valeHotspots'
import { applyBearTargetToHotspot } from '@/lib/vale/valeHotspots'

export type BearTargetMoveAxis = 'free' | 'depth' | 'lateral' | 'vertical' | 'rotation'

interface ValeBearTargetEditorStore {
  editorActive: boolean
  hotspots: ValeHotspot[]
  selectedId: string | null
  moveAxis: BearTargetMoveAxis
  hydrated: boolean
  hydrate: () => void
  setEditorActive: (active: boolean) => void
  setMoveAxis: (axis: BearTargetMoveAxis) => void
  select: (id: string | null) => void
  patchBearTarget: (id: string, patch: Partial<ValeBearTarget>) => void
  reset: () => void
}

export const useValeBearTargetEditorStore = create<ValeBearTargetEditorStore>((set, get) => ({
  editorActive: false,
  hotspots: [],
  selectedId: null,
  moveAxis: 'free',
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return
    set({
      hydrated: true,
      hotspots: loadMergedValeHotspots(),
    })
  },

  setEditorActive: (active) => {
    const hotspots = get().hotspots.length ? get().hotspots : loadMergedValeHotspots()
    set({
      editorActive: active,
      hotspots: active ? loadMergedValeHotspots() : hotspots,
      selectedId: active ? get().selectedId ?? hotspots[0]?.id ?? null : null,
    })
  },

  setMoveAxis: (axis) => set({ moveAxis: axis }),

  select: (id) => set({ selectedId: id }),

  patchBearTarget: (id, patch) => {
    const hotspots = get().hotspots.map((hotspot) => {
      if (hotspot.id !== id) return hotspot
      const bearTarget = { ...hotspot.bearTarget, ...patch }
      return applyBearTargetToHotspot(hotspot, bearTarget)
    })
    const overrides = buildBearTargetOverrides(hotspots, loadBearTargetOverrides())
    saveBearTargetOverrides(overrides)
    set({ hotspots })
  },

  reset: () => {
    const hotspots = resetBearTargetOverrides()
    set({ hotspots, selectedId: null })
  },
}))
