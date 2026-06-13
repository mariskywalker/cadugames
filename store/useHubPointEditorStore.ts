import { create } from 'zustand'
import {
  loadHubPointOverrides,
  resetHubPointOverrides,
  saveHubPointOverrides,
} from '@/lib/worlds/hubPointEditorStorage'
import {
  getWorldInteractions,
  mergeHubPoints,
  type HubPointOverride,
  type HubPointOverrides,
} from '@/lib/worlds/worldInteractions'
import type { WorldId, WorldInteractionPoint } from '@/lib/worlds/types'

interface HubPointEditorStore {
  editorActive: boolean
  activeWorldId: WorldId | null
  points: WorldInteractionPoint[]
  selectedId: string | null
  hydratedWorldId: WorldId | null
  hydrate: (worldId: WorldId) => void
  setEditorActive: (active: boolean) => void
  select: (id: string | null) => void
  patch: (id: string, patch: HubPointOverride) => void
  reset: () => void
}

function buildOverrides(
  worldId: WorldId,
  points: WorldInteractionPoint[],
  prev: HubPointOverrides,
): HubPointOverrides {
  const next: HubPointOverrides = { ...prev }

  for (const point of points) {
    const base = getWorldInteractions(worldId).find((p) => p.id === point.id)
    if (!base) continue

    const patch: HubPointOverride = {}
    if (point.x !== base.x) patch.x = point.x
    if (point.y !== base.y) patch.y = point.y
    if ((point.size ?? 11) !== (base.size ?? 11)) patch.size = point.size

    if (Object.keys(patch).length > 0) next[point.id] = patch
    else delete next[point.id]
  }

  return next
}

export const useHubPointEditorStore = create<HubPointEditorStore>((set, get) => ({
  editorActive: false,
  activeWorldId: null,
  points: [],
  selectedId: null,
  hydratedWorldId: null,

  hydrate: (worldId) => {
    if (get().hydratedWorldId === worldId) return
    const points = mergeHubPoints(worldId, loadHubPointOverrides(worldId))
    set({
      hydratedWorldId: worldId,
      activeWorldId: worldId,
      points,
      selectedId: get().editorActive ? get().selectedId ?? points[0]?.id ?? null : null,
    })
  },

  setEditorActive: (active) => {
    const { points } = get()
    set({
      editorActive: active,
      selectedId: active ? get().selectedId ?? points[0]?.id ?? null : null,
    })
  },

  select: (id) => set({ selectedId: id }),

  patch: (id, patch) => {
    const worldId = get().activeWorldId
    if (!worldId) return

    const points = get().points.map((point) =>
      point.id === id ? { ...point, ...patch } : point,
    )
    const overrides = buildOverrides(worldId, points, loadHubPointOverrides(worldId))
    saveHubPointOverrides(worldId, overrides)
    set({ points })
  },

  reset: () => {
    const worldId = get().activeWorldId
    if (!worldId) return
    const points = resetHubPointOverrides(worldId)
    set({ points, selectedId: null })
  },
}))
