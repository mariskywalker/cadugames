import { create } from 'zustand'
import { BUBBLE_TUBE_CENTER, CHARACTER_STATES, type CharacterState } from '@/lib/opening/animations'
import { clampToNavMesh } from '@/lib/opening/navMesh'
import { CADU_SPAWN, FIXED_CAMERA } from '@/lib/opening/sceneComposition'
import type { TubeCollider } from '@/lib/opening/tubeNav'

export type ModelStatus = 'loading' | 'loaded' | 'error'

interface CharacterSize {
  w: number
  h: number
  d: number
}

interface OpeningStore {
  targetPosition: [number, number, number] | null
  characterState: CharacterState
  markedCamera: typeof FIXED_CAMERA
  bubbleTubeCollider: TubeCollider | null
  animationClips: string[]
  characterSize: CharacterSize | null
  modelStatus: ModelStatus
  setWalkTarget: (x: number, z: number, options?: { run?: boolean }) => void
  clearTarget: () => void
  resetToIdle: () => void
  setCharacterState: (state: CharacterState) => void
  setBubbleTubeCollider: (outerRadiusWorld: number) => void
  setAnimationClips: (clips: string[]) => void
  setCharacterSize: (size: CharacterSize) => void
  setModelStatus: (status: ModelStatus) => void
}

export const useOpeningStore = create<OpeningStore>((set, get) => ({
  targetPosition: null,
  characterState: CHARACTER_STATES.IDLE,
  markedCamera: FIXED_CAMERA,
  bubbleTubeCollider: null,
  animationClips: [],
  characterSize: null,
  modelStatus: 'loading',

  setWalkTarget: (x, z, { run = false } = {}) => {
    const st = get()
    const [sx, sz] = clampToNavMesh(x, z, st.bubbleTubeCollider)
    set({
      targetPosition: [sx, 0, sz],
      characterState: run ? CHARACTER_STATES.RUN : CHARACTER_STATES.WALK,
    })
  },

  clearTarget: () => set({ targetPosition: null }),

  resetToIdle: () =>
    set({
      characterState: CHARACTER_STATES.IDLE,
      targetPosition: null,
    }),

  setCharacterState: (characterState) => set({ characterState }),

  setBubbleTubeCollider: (outerRadiusWorld) =>
    set({
      bubbleTubeCollider: {
        center: BUBBLE_TUBE_CENTER,
        radius: outerRadiusWorld,
      },
    }),

  setAnimationClips: (animationClips) => set({ animationClips }),
  setCharacterSize: (characterSize) => set({ characterSize }),
  setModelStatus: (modelStatus) => set({ modelStatus }),
}))

export { CADU_SPAWN as CADU_START_POSITION }
export { CADU_SPAWN_ROTATION as CADU_START_ROTATION } from '@/lib/opening/sceneComposition'
