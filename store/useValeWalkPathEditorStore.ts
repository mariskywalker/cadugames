import { create } from 'zustand'
import {
  formatWalkPathExport,
  loadWalkPathOverrides,
  mergeWalkPathPoints,
  nextWalkPathPointId,
  resetWalkPathOverrides,
  saveWalkPathOverrides,
} from '@/lib/vale/walkPathEditorStorage'
import {
  DEFAULT_VALE_WALK_PATH_POINTS,
  setValeWalkPathPoints,
  type ValeWalkPathPoint,
} from '@/lib/vale/valeWalkable'

interface ValeWalkPathEditorStore {
  editorActive: boolean
  points: ValeWalkPathPoint[]
  selectedId: string | null
  hydrated: boolean
  hydrate: () => void
  setEditorActive: (active: boolean) => void
  select: (id: string | null) => void
  patch: (id: string, patch: Partial<Pick<ValeWalkPathPoint, 'x' | 'z' | 'halfWidth'>>) => void
  addAfterSelected: () => void
  removeSelected: () => void
  reset: () => void
  exportText: () => string
}

function syncRuntime(points: ValeWalkPathPoint[]) {
  setValeWalkPathPoints(points)
  saveWalkPathOverrides(points)
}

export const useValeWalkPathEditorStore = create<ValeWalkPathEditorStore>((set, get) => ({
  editorActive: false,
  points: DEFAULT_VALE_WALK_PATH_POINTS.map((p) => ({ ...p })),
  selectedId: null,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return
    const points = mergeWalkPathPoints(loadWalkPathOverrides())
    setValeWalkPathPoints(points)
    set({ hydrated: true, points })
  },

  setEditorActive: (active) => {
    const points = get().points
    set({
      editorActive: active,
      selectedId: active ? get().selectedId ?? points[0]?.id ?? null : null,
    })
  },

  select: (id) => set({ selectedId: id }),

  patch: (id, patch) => {
    const points = get().points.map((pt) => (pt.id === id ? { ...pt, ...patch } : pt))
    syncRuntime(points)
    set({ points })
  },

  addAfterSelected: () => {
    const { points, selectedId } = get()
    const idx = points.findIndex((p) => p.id === selectedId)
    const insertAt = idx >= 0 ? idx + 1 : points.length
    const prev = points[Math.max(0, insertAt - 1)]
    const next = points[insertAt]
    const x = next ? (prev.x + next.x) * 0.5 : prev.x + 0.05
    const z = next ? (prev.z + next.z) * 0.5 : prev.z - 0.4
    const newPoint: ValeWalkPathPoint = {
      id: nextWalkPathPointId(points),
      x,
      z,
    }
    const merged = [...points.slice(0, insertAt), newPoint, ...points.slice(insertAt)]
    syncRuntime(merged)
    set({ points: merged, selectedId: newPoint.id })
  },

  removeSelected: () => {
    const { points, selectedId } = get()
    if (points.length <= 2 || !selectedId) return
    const merged = points.filter((p) => p.id !== selectedId)
    syncRuntime(merged)
    set({ points: merged, selectedId: merged[0]?.id ?? null })
  },

  reset: () => {
    const points = resetWalkPathOverrides()
    setValeWalkPathPoints(points)
    set({ points, selectedId: points[0]?.id ?? null })
  },

  exportText: () => formatWalkPathExport(get().points),
}))
