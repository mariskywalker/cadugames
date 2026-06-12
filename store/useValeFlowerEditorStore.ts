import { create } from 'zustand'
import {
  loadFlowerOverrides,
  resetFlowerOverrides,
  saveFlowerOverrides,
} from '@/lib/vale/flowerEditorStorage'
import {
  mergeFlowerPlacements,
  VALE_FLOWER_PLACEMENTS,
  type FlowerMoveAxis,
  type FlowerPlacementOverride,
  type FlowerPlacementOverrides,
  type ValeFlowerPlacement,
} from '@/lib/vale/sceneFlowerAssets'

interface ValeFlowerEditorStore {
  editorActive: boolean
  placements: ValeFlowerPlacement[]
  selectedId: string | null
  moveAxis: FlowerMoveAxis
  hydrated: boolean
  hydrate: () => void
  setEditorActive: (active: boolean) => void
  setMoveAxis: (axis: FlowerMoveAxis) => void
  select: (id: string | null) => void
  patch: (id: string, patch: FlowerPlacementOverride) => void
  reset: () => void
}

function buildOverrides(
  placements: ValeFlowerPlacement[],
  prev: FlowerPlacementOverrides,
): FlowerPlacementOverrides {
  const next: FlowerPlacementOverrides = { ...prev }

  for (const flower of placements) {
    const base = VALE_FLOWER_PLACEMENTS.find((f) => f.id === flower.id)
    if (!base) continue

    const patch: FlowerPlacementOverride = {}
    if (flower.position.some((v, i) => Math.abs(v - base.position[i]) > 0.005)) {
      patch.position = flower.position
    }
    if (Math.abs(flower.rotationY - base.rotationY) > 0.005) patch.rotationY = flower.rotationY
    if (Math.abs(flower.targetHeight - base.targetHeight) > 0.005) {
      patch.targetHeight = flower.targetHeight
    }
    if ((flower.scaleMult ?? 1) !== (base.scaleMult ?? 1)) patch.scaleMult = flower.scaleMult
    if (flower.tiltX !== base.tiltX) patch.tiltX = flower.tiltX
    if (flower.tiltZ !== base.tiltZ) patch.tiltZ = flower.tiltZ

    if (Object.keys(patch).length > 0) next[flower.id] = patch
    else delete next[flower.id]
  }

  return next
}

export const useValeFlowerEditorStore = create<ValeFlowerEditorStore>((set, get) => ({
  editorActive: false,
  placements: VALE_FLOWER_PLACEMENTS,
  selectedId: null,
  moveAxis: 'free',
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return
    set({
      hydrated: true,
      placements: mergeFlowerPlacements(loadFlowerOverrides()),
    })
  },

  setEditorActive: (active) => {
    const placements = get().placements
    set({
      editorActive: active,
      selectedId: active ? get().selectedId ?? placements[0]?.id ?? null : null,
      moveAxis: active ? get().moveAxis : 'free',
    })
  },

  setMoveAxis: (axis) => set({ moveAxis: axis }),

  select: (id) => set({ selectedId: id }),

  patch: (id, patch) => {
    const placements = get().placements.map((flower) =>
      flower.id === id ? { ...flower, ...patch } : flower,
    )
    const overrides = buildOverrides(placements, loadFlowerOverrides())
    saveFlowerOverrides(overrides)
    set({ placements })
  },

  reset: () => {
    const placements = resetFlowerOverrides()
    set({ placements, selectedId: null })
  },
}))
