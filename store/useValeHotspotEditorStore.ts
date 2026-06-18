import { create } from 'zustand'
import {
  buildHotspotHitAreaOverrides,
  loadHotspotHitAreaOverrides,
  resetHotspotHitAreaOverrides,
  saveHotspotHitAreaOverrides,
  type HotspotHitAreaOverride,
  type HotspotHitAreaOverrides,
} from '@/lib/vale/valeHotspotEditorStorage'
import {
  buildHotspotPathOverrides,
  buildMainPathOverrides,
  loadHotspotPathOverrides,
  loadMainPathOverrides,
  loadMergedMainPath,
  loadMergedValeHotspotsForGameplay,
  resetHotspotPathOverrides,
  resetMainPathOverrides,
  saveHotspotPathOverrides,
  saveMainPathOverrides,
  type HotspotPathOverrides,
  type MainPathOverrides,
} from '@/lib/vale/valeHotspotPathEditorStorage'
import {
  addHotspotPathWaypoint,
  finalizeHotspotPath,
  patchHotspotMainJoinIndex,
  patchHotspotPathStart,
  patchHotspotPathWaypoint,
  removeHotspotPathWaypoint,
  VALE_HOTSPOTS,
  type ValeBearTarget,
  type ValeHotspot,
} from '@/lib/vale/valeHotspots'

export type HotspotEditorPointKind = 'main' | 'start' | 'branch'

export type HotspotEditorPointSelection = {
  kind: HotspotEditorPointKind
  index: number
}

interface ValeHotspotEditorStore {
  editorActive: boolean
  hotspots: ValeHotspot[]
  mainPath: Array<{ x: number; z: number }>
  selectedId: string | null
  selectedPoint: HotspotEditorPointSelection
  hydrated: boolean
  hydrate: () => void
  setEditorActive: (active: boolean) => void
  select: (id: string | null) => void
  selectPoint: (selection: HotspotEditorPointSelection) => void
  patchHitArea: (id: string, patch: HotspotHitAreaOverride) => void
  patchPathStart: (id: string, patch: Partial<ValeBearTarget>) => void
  bumpPathStart: (id: string, field: keyof ValeBearTarget, delta: number) => void
  patchPathWaypoint: (id: string, index: number, patch: Partial<ValeBearTarget>) => void
  bumpPathWaypoint: (id: string, index: number, field: keyof ValeBearTarget, delta: number) => void
  patchMainPathPoint: (index: number, patch: Partial<{ x: number; z: number }>) => void
  bumpMainPathPoint: (index: number, field: 'x' | 'z', delta: number) => void
  addPathWaypoint: (id: string) => void
  removePathWaypoint: (id: string, index: number) => void
  bumpMainJoinIndex: (id: string, delta: number) => void
  snapPathStartToJoin: (id: string) => void
  resetSelected: () => void
  resetAll: () => void
}

function persistHitAreas(hotspots: ValeHotspot[], prev: HotspotHitAreaOverrides) {
  const next = buildHotspotHitAreaOverrides(hotspots, prev)
  saveHotspotHitAreaOverrides(next)
  return next
}

function persistPaths(hotspots: ValeHotspot[], prev: HotspotPathOverrides) {
  const next = buildHotspotPathOverrides(hotspots, prev)
  saveHotspotPathOverrides(next)
  return next
}

function persistMainPath(mainPath: Array<{ x: number; z: number }>, prev: MainPathOverrides) {
  const next = buildMainPathOverrides(mainPath, prev)
  saveMainPathOverrides(next)
  return next
}

function defaultPointSelection(hotspot: ValeHotspot | undefined): HotspotEditorPointSelection {
  return { kind: 'start', index: hotspot?.mainJoinIndex ?? 0 }
}

function clampBranchIndex(hotspot: ValeHotspot, index: number) {
  if (hotspot.path.length === 0) return 0
  return Math.min(Math.max(0, index), hotspot.path.length - 1)
}

export const useValeHotspotEditorStore = create<ValeHotspotEditorStore>((set, get) => ({
  editorActive: false,
  hotspots: VALE_HOTSPOTS,
  mainPath: loadMergedMainPath().slice(0, 1),
  selectedId: null,
  selectedPoint: { kind: 'start', index: 0 },
  hydrated: false,

  hydrate: () => {
    const mainPath = loadMergedMainPath().slice(0, 1)
    const hotspots = loadMergedValeHotspotsForGameplay()
    const selectedId =
      get().selectedId ?? hotspots.find((h) => h.id === 'casa-do-urso')?.id ?? hotspots[0]?.id ?? null
    const selected = hotspots.find((h) => h.id === selectedId)
    set({
      mainPath,
      hotspots,
      hydrated: true,
      selectedId,
      selectedPoint: defaultPointSelection(selected),
    })
  },

  setEditorActive: (active) => set({ editorActive: active }),

  select: (id) => {
    const hotspot = get().hotspots.find((h) => h.id === id)
    set({
      selectedId: id,
      selectedPoint: defaultPointSelection(hotspot),
    })
  },

  selectPoint: (selection) => set({ selectedPoint: selection }),

  patchHitArea: (id, patch) => {
    const prev = loadHotspotHitAreaOverrides()
    const hotspots = get().hotspots.map((hotspot) =>
      hotspot.id === id
        ? { ...hotspot, hitArea: { ...hotspot.hitArea, ...patch } }
        : hotspot,
    )
    persistHitAreas(hotspots, prev)
    set({ hotspots })
  },

  patchPathStart: (id, patch) => {
    const pathPrev = loadHotspotPathOverrides()
    const hotspots = get().hotspots.map((hotspot) => {
      if (hotspot.id !== id) return hotspot
      return patchHotspotPathStart(hotspot, patch)
    })
    persistPaths(hotspots, pathPrev)
    set({ hotspots, selectedPoint: { kind: 'start', index: 0 } })
  },

  bumpPathStart: (id, field, delta) => {
    const hotspot = get().hotspots.find((h) => h.id === id)
    if (!hotspot) return
    get().patchPathStart(id, { [field]: hotspot.pathStart[field] + delta })
  },

  patchPathWaypoint: (id, index, patch) => {
    const pathPrev = loadHotspotPathOverrides()
    let nextIndex = index
    const hotspots = get().hotspots.map((hotspot) => {
      if (hotspot.id !== id) return hotspot
      const next = patchHotspotPathWaypoint(hotspot, index, patch)
      nextIndex = clampBranchIndex(next, index)
      return next
    })
    persistPaths(hotspots, pathPrev)
    set({
      hotspots,
      selectedPoint: { kind: 'branch', index: nextIndex },
    })
  },

  bumpPathWaypoint: (id, index, field, delta) => {
    const hotspot = get().hotspots.find((h) => h.id === id)
    if (!hotspot) return
    const wp = hotspot.path[index]
    if (!wp) return
    get().patchPathWaypoint(id, index, { [field]: wp[field] + delta })
  },

  patchMainPathPoint: (index, patch) => {
    const prev = loadMainPathOverrides()
    const mainPath = get().mainPath.map((point, i) =>
      i === index ? { ...point, ...patch } : { ...point },
    )
    persistMainPath(mainPath, prev)
    set({ mainPath, selectedPoint: { kind: 'main', index } })
  },

  bumpMainPathPoint: (index, field, delta) => {
    const point = get().mainPath[index]
    if (!point) return
    get().patchMainPathPoint(index, { [field]: point[field] + delta })
  },

  addPathWaypoint: (id) => {
    const pathPrev = loadHotspotPathOverrides()
    let insertIndex = 0
    const hotspots = get().hotspots.map((hotspot) => {
      if (hotspot.id !== id) return hotspot
      const next = addHotspotPathWaypoint(hotspot)
      insertIndex = Math.max(0, next.path.length - 2)
      return next
    })
    persistPaths(hotspots, pathPrev)
    set({
      hotspots,
      selectedPoint: { kind: 'branch', index: insertIndex },
    })
  },

  removePathWaypoint: (id, index) => {
    const pathPrev = loadHotspotPathOverrides()
    let nextIndex = 0
    const hotspots = get().hotspots.map((hotspot) => {
      if (hotspot.id !== id) return hotspot
      const next = removeHotspotPathWaypoint(hotspot, index)
      nextIndex = clampBranchIndex(next, index >= next.path.length ? next.path.length - 1 : index)
      return next
    })
    persistPaths(hotspots, pathPrev)
    set({
      hotspots,
      selectedPoint: { kind: 'branch', index: nextIndex },
    })
  },

  bumpMainJoinIndex: (id, delta) => {
    const pathPrev = loadHotspotPathOverrides()
    const mainPath = get().mainPath
    const hotspots = get().hotspots.map((hotspot) => {
      if (hotspot.id !== id) return hotspot
      return patchHotspotMainJoinIndex(hotspot, hotspot.mainJoinIndex + delta, mainPath)
    })
    const updated = hotspots.find((h) => h.id === id)
    persistPaths(hotspots, pathPrev)
    set({
      hotspots,
      selectedPoint: { kind: 'start', index: updated?.mainJoinIndex ?? 0 },
    })
  },

  snapPathStartToJoin: (id) => {
    const hotspot = get().hotspots.find((h) => h.id === id)
    if (!hotspot) return
    const join = get().mainPath[hotspot.mainJoinIndex]
    if (!join) return
    const toward = hotspot.path[0] ?? hotspot.arriveTarget
    get().patchPathStart(id, {
      x: join.x,
      z: join.z,
      rotationY: Math.atan2(toward.x - join.x, toward.z - join.z),
    })
  },

  resetSelected: () => {
    const selectedId = get().selectedId
    if (!selectedId) return
    const base = VALE_HOTSPOTS.find((h) => h.id === selectedId)
    if (!base) return

    const hitPrev = loadHotspotHitAreaOverrides()
    const pathPrev = loadHotspotPathOverrides()
    const hotspots = get().hotspots.map((hotspot) =>
      hotspot.id === selectedId
        ? finalizeHotspotPath({
            ...hotspot,
            hitArea: { ...base.hitArea },
            mainJoinIndex: base.mainJoinIndex,
            pathStart: { ...base.pathStart },
            path: base.path.map((p) => ({ ...p })),
            arriveTarget: { ...base.arriveTarget },
            bearTarget: { ...base.bearTarget },
          })
        : hotspot,
    )
    persistHitAreas(hotspots, hitPrev)
    persistPaths(hotspots, pathPrev)
    const updated = hotspots.find((h) => h.id === selectedId)
    set({
      hotspots,
      selectedPoint: defaultPointSelection(updated),
    })
  },

  resetAll: () => {
    resetHotspotHitAreaOverrides()
    resetHotspotPathOverrides()
    resetMainPathOverrides()
    const mainPath = loadMergedMainPath().slice(0, 1)
    const hotspots = loadMergedValeHotspotsForGameplay()
    const selectedId = hotspots.find((h) => h.id === 'casa-do-urso')?.id ?? hotspots[0]?.id ?? null
    const selected = hotspots.find((h) => h.id === selectedId)
    set({
      mainPath,
      hotspots,
      selectedId,
      selectedPoint: defaultPointSelection(selected),
    })
  },
}))
