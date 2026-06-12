import { create } from 'zustand'
import { CHARACTER_STATES, type CharacterState } from '@/lib/opening/animations'
import { clampToValeNav } from '@/lib/vale/valeWorld'

export type ValeModelStatus = 'loading' | 'loaded' | 'error'

export interface ValeDiscovery {
  id: string
  name: string
  emoji: string
  at: number
}

interface ValeStore {
  targetPosition: [number, number, number] | null
  characterState: CharacterState
  animationClips: string[]
  modelStatus: ValeModelStatus
  /** Locais descobertos ao se aproximar — persistem durante a sessão */
  discovered: Record<string, boolean>
  lastDiscovery: ValeDiscovery | null
  /** Cadu está perto da Casa do Urso — hub de progressão */
  isNearHouse: boolean
  houseHubOpen: boolean
  setWalkTarget: (x: number, z: number, options?: { run?: boolean }) => void
  clearTarget: () => void
  resetToIdle: () => void
  setCharacterState: (state: CharacterState) => void
  setAnimationClips: (clips: string[]) => void
  setModelStatus: (status: ValeModelStatus) => void
  discover: (id: string, name: string, emoji: string) => void
  setNearHouse: (near: boolean) => void
  openHouseHub: () => void
  closeHouseHub: () => void
}

export const useValeStore = create<ValeStore>((set) => ({
  targetPosition: null,
  characterState: CHARACTER_STATES.IDLE,
  animationClips: [],
  modelStatus: 'loading',
  discovered: {},
  lastDiscovery: null,
  isNearHouse: false,
  houseHubOpen: false,

  setWalkTarget: (x, z, { run = false } = {}) => {
    const [sx, sz] = clampToValeNav(x, z)
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
  setAnimationClips: (animationClips) => set({ animationClips }),
  setModelStatus: (modelStatus) => set({ modelStatus }),

  discover: (id, name, emoji) =>
    set((state) => {
      if (state.discovered[id]) return state
      return {
        discovered: { ...state.discovered, [id]: true },
        lastDiscovery: { id, name, emoji, at: Date.now() },
      }
    }),

  setNearHouse: (isNearHouse) => set({ isNearHouse }),

  openHouseHub: () => set({ houseHubOpen: true }),

  closeHouseHub: () => set({ houseHubOpen: false }),
}))
