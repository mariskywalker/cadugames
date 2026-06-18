import { create } from 'zustand'
import { VALE_SCREEN_SPAWN, clampScreenWaypoint, type ValeScreenWaypoint } from '@/lib/vale/valeScreenPaths'

interface ValeBearScreenStore {
  pose: ValeScreenWaypoint
  setPose: (pose: ValeScreenWaypoint) => void
  patchPose: (patch: Partial<ValeScreenWaypoint>) => void
  resetPose: () => void
}

export const useValeBearScreenStore = create<ValeBearScreenStore>((set) => ({
  pose: clampScreenWaypoint({ ...VALE_SCREEN_SPAWN }),
  setPose: (pose) => set({ pose: clampScreenWaypoint(pose) }),
  patchPose: (patch) => set((s) => ({ pose: clampScreenWaypoint({ ...s.pose, ...patch }) })),
  resetPose: () => set({ pose: clampScreenWaypoint({ ...VALE_SCREEN_SPAWN }) }),
}))
