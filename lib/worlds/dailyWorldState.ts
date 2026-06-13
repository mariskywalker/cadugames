import type { WorldId } from './types'

const STORAGE_PREFIX = 'cadu.daily'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function storageKey(worldId: WorldId, childId = 'lucas') {
  return `${STORAGE_PREFIX}.${childId}.${worldId}.${todayKey()}`
}

export interface DailyWorldSnapshot {
  visitedPointIds: string[]
  responses: Record<string, string>
  savedAt: number
}

export function loadDailyWorldState(worldId: WorldId, childId = 'lucas'): DailyWorldSnapshot {
  if (typeof window === 'undefined') {
    return { visitedPointIds: [], responses: {}, savedAt: 0 }
  }
  try {
    const raw = localStorage.getItem(storageKey(worldId, childId))
    if (!raw) return { visitedPointIds: [], responses: {}, savedAt: 0 }
    return JSON.parse(raw) as DailyWorldSnapshot
  } catch {
    return { visitedPointIds: [], responses: {}, savedAt: 0 }
  }
}

export function saveDailyWorldState(
  worldId: WorldId,
  snapshot: DailyWorldSnapshot,
  childId = 'lucas',
) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(storageKey(worldId, childId), JSON.stringify(snapshot))
  } catch {
    // ignore quota errors
  }
}

export function recordInteractionVisit(
  worldId: WorldId,
  pointId: string,
  response: string,
  childId = 'lucas',
) {
  const current = loadDailyWorldState(worldId, childId)
  const visitedPointIds = current.visitedPointIds.includes(pointId)
    ? current.visitedPointIds
    : [...current.visitedPointIds, pointId]

  saveDailyWorldState(
    worldId,
    {
      visitedPointIds,
      responses: { ...current.responses, [pointId]: response },
      savedAt: Date.now(),
    },
    childId,
  )
}
