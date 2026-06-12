import { create } from 'zustand'
import {
  loadPropOverrides,
  resetPropOverrides,
  savePropOverrides,
} from '@/lib/vale/propEditorStorage'
import {
  mergeScenePropPlacements,
  VALE_SCENE_PROP_PLACEMENTS,
  type ScenePropLayout,
  type ScenePropOverride,
  type ScenePropOverrides,
} from '@/lib/vale/scenePropAssets'

interface ValePropEditorStore {
  editorActive: boolean
  placements: ScenePropLayout[]
  selectedId: string | null
  hydrated: boolean
  hydrate: () => void
  setEditorActive: (active: boolean) => void
  select: (id: string | null) => void
  patch: (id: string, patch: ScenePropOverride) => void
  reset: () => void
}

function buildOverrides(
  placements: ScenePropLayout[],
  prev: ScenePropOverrides,
): ScenePropOverrides {
  const next: ScenePropOverrides = { ...prev }

  for (const prop of placements) {
    const base = VALE_SCENE_PROP_PLACEMENTS.find((p) => p.id === prop.id)
    if (!base) continue

    const patch: ScenePropOverride = {}
    if (prop.left !== base.left) patch.left = prop.left
    if (prop.bottom !== base.bottom) patch.bottom = prop.bottom
    if (prop.width !== base.width) patch.width = prop.width
    if (prop.rotateDeg !== base.rotateDeg) patch.rotateDeg = prop.rotateDeg
    if (prop.zIndex !== base.zIndex) patch.zIndex = prop.zIndex
    if (prop.opacity !== base.opacity) patch.opacity = prop.opacity
    if (prop.flipX !== base.flipX) patch.flipX = prop.flipX
    if ((prop.blurPx ?? 0) !== (base.blurPx ?? 0)) patch.blurPx = prop.blurPx
    if ((prop.translateXPx ?? 0) !== (base.translateXPx ?? 0)) patch.translateXPx = prop.translateXPx
    if ((prop.translateYPx ?? 0) !== (base.translateYPx ?? 0)) patch.translateYPx = prop.translateYPx
    if ((prop.translateZPx ?? 0) !== (base.translateZPx ?? 0)) patch.translateZPx = prop.translateZPx
    if ((prop.rotateXDeg ?? 0) !== (base.rotateXDeg ?? 0)) patch.rotateXDeg = prop.rotateXDeg
    if ((prop.rotateYDeg ?? 0) !== (base.rotateYDeg ?? 0)) patch.rotateYDeg = prop.rotateYDeg

    if (Object.keys(patch).length > 0) next[prop.id] = patch
    else delete next[prop.id]
  }

  return next
}

export const useValePropEditorStore = create<ValePropEditorStore>((set, get) => ({
  editorActive: false,
  placements: VALE_SCENE_PROP_PLACEMENTS,
  selectedId: null,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return
    set({
      hydrated: true,
      placements: mergeScenePropPlacements(loadPropOverrides()),
    })
  },

  setEditorActive: (active) => {
    const placements = get().placements
    set({
      editorActive: active,
      selectedId: active ? get().selectedId ?? placements[0]?.id ?? null : null,
    })
  },

  select: (id) => set({ selectedId: id }),

  patch: (id, patch) => {
    const placements = get().placements.map((prop) =>
      prop.id === id ? { ...prop, ...patch } : prop,
    )
    const overrides = buildOverrides(placements, loadPropOverrides())
    savePropOverrides(overrides)
    set({ placements })
  },

  reset: () => {
    const placements = resetPropOverrides()
    set({ placements, selectedId: null })
  },
}))
