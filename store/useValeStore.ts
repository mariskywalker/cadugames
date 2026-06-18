import { create } from 'zustand'
import { CHARACTER_STATES, type CharacterState } from '@/lib/opening/animations'
import { childProfile } from '@/lib/mockChildProfile'
import { getWorldInteraction } from '@/lib/worlds/worldInteractions'
import { saveLastBearHotspot, loadLastBearHotspot } from '@/lib/vale/valeHotspotStorage'
import { getValeHotspot } from '@/lib/vale/bearTargetEditorStorage'
import { getBuildHotspotPathContext } from '@/lib/vale/valeHotspotPathEditorStorage'
import { VALE_GAMEPLAY_ENABLED, VALE_STATIC_SCENE } from '@/lib/vale/valeBearSafe'
import {
  isBearAtTarget,
  prepareHotspotPath,
  VALE_DEFAULT_HOTSPOT_ID,
  VALE_HOTSPOTS,
  type ValeBearTarget,
  type ValeHotspotWaypoint,
} from '@/lib/vale/valeHotspots'
import { VALE_HOTSPOT_ARRIVE_DELAY_MS } from '@/lib/vale/valeGameplay'
import {
  buildNarrativeIntroPath,
  getNarrativeIntroArriveTarget,
  NARRATIVE_INTRO_JOURNEY_ID,
  VALE_NARRATIVE_WALK_ENABLED,
} from '@/lib/vale/valeNarrativeIntro'
import { syncCaduLifeEvent } from '@/lib/vale/syncCaduLifeEvent'
import {
  buildScreenPath,
  getScreenRoute,
  isBearAtScreenPose,
  type ValeScreenWaypoint,
} from '@/lib/vale/valeScreenPaths'
import { useValeBearScreenStore } from '@/store/useValeBearScreenStore'
import { clampToValeNav, VALE_HERO_MODE, valeCharacterWorldPos } from '@/lib/vale/valeWorld'

export type ValeModelStatus = 'loading' | 'loaded' | 'error'

export interface ValeDiscovery {
  id: string
  name: string
  emoji: string
  at: number
}

export interface HotspotJourney {
  hotspotId: string
  path: ValeHotspotWaypoint[]
  segmentIndex: number
  bearTarget: ValeBearTarget
}

export interface ScreenHotspotJourney {
  hotspotId: string
  path: ValeScreenWaypoint[]
  segmentIndex: number
  arrivePose: ValeScreenWaypoint
}

interface ValeStore {
  targetPosition: [number, number, number] | null
  characterState: CharacterState
  animationClips: string[]
  modelStatus: ValeModelStatus
  discovered: Record<string, boolean>
  lastDiscovery: ValeDiscovery | null
  isNearHouse: boolean
  houseHubOpen: boolean
  /** Caminho 3D em andamento */
  hotspotJourney: HotspotJourney | null
  /** Caminho 2.5D em andamento (modo estático) */
  screenJourney: ScreenHotspotJourney | null
  /** Hotspot onde o urso está parado */
  currentHotspotId: string | null
  /** Card genérico ao chegar */
  activeHotspotCardId: string | null
  /** Sheet de worldInteractions ao chegar */
  activeHotspotSheetId: string | null
  isTraveling: boolean
  /** Hotspot escolhido no clique — usado ao chegar */
  activeHotspotId: string | null
  /** Aguardando delay walk → idle antes de abrir UI */
  interactionPending: boolean
  /** Abertura narrativa — urso já chegou à casa */
  narrativeIntroComplete: boolean
  moveBearAlongPath: (id: string) => void
  startNarrativeIntro: () => void
  parkBearAtScene: () => void
  replayNarrativeIntro: () => void
  openSceneHotspot: (id: string) => void
  startHotspotActivity: (id: string) => void
  completeHotspotJourney: () => void
  completeScreenJourney: () => void
  closeHotspotCard: () => void
  closeHotspotSheet: () => void
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

function handleHotspotArrive(id: string) {
  const hotspot = getValeHotspot(id)
  if (!hotspot) return

  saveLastBearHotspot(id)
  useValeStore.getState().discover(id, hotspot.label, hotspot.emoji)

  if (hotspot.onArrive === 'open-hub') {
    useValeStore.setState({ isNearHouse: true, activeHotspotCardId: null })
    return
  }

  if (hotspot.onArrive === 'open-sheet' && hotspot.sheetId) {
    useValeStore.setState({
      activeHotspotSheetId: hotspot.sheetId,
      activeHotspotCardId: null,
      isNearHouse: false,
    })
    return
  }

  useValeStore.setState({
    activeHotspotCardId: id,
    activeHotspotSheetId: null,
    isNearHouse: false,
  })
}

export const useValeStore = create<ValeStore>((set, get) => ({
  targetPosition: null,
  characterState: CHARACTER_STATES.IDLE,
  animationClips: [],
  modelStatus: 'loading',
  discovered: {},
  lastDiscovery: null,
  isNearHouse: false,
  houseHubOpen: false,
  hotspotJourney: null,
  screenJourney: null,
  currentHotspotId: null,
  activeHotspotCardId: null,
  activeHotspotSheetId: null,
  isTraveling: false,
  activeHotspotId: null,
  interactionPending: false,
  narrativeIntroComplete: false,

  parkBearAtScene: () => {
    if (!VALE_GAMEPLAY_ENABLED) return
    set({
      narrativeIntroComplete: true,
      hotspotJourney: null,
      screenJourney: null,
      isTraveling: false,
      interactionPending: false,
      characterState: CHARACTER_STATES.IDLE,
      targetPosition: null,
      activeHotspotCardId: null,
      activeHotspotSheetId: null,
      isNearHouse: false,
      houseHubOpen: false,
      currentHotspotId: null,
    })
  },

  startNarrativeIntro: () => {
    if (!VALE_GAMEPLAY_ENABLED || get().narrativeIntroComplete || get().isTraveling) return

    if (!VALE_NARRATIVE_WALK_ENABLED) {
      get().parkBearAtScene()
      return
    }

    const path = buildNarrativeIntroPath()
    const arriveTarget = getNarrativeIntroArriveTarget()

    set({
      hotspotJourney: {
        hotspotId: NARRATIVE_INTRO_JOURNEY_ID,
        path,
        segmentIndex: 0,
        bearTarget: { ...arriveTarget },
      },
      screenJourney: null,
      isTraveling: true,
      interactionPending: false,
      activeHotspotCardId: null,
      activeHotspotSheetId: null,
      isNearHouse: false,
      houseHubOpen: false,
      characterState: CHARACTER_STATES.WALK,
      targetPosition: null,
    })
  },

  replayNarrativeIntro: () => {
    if (!VALE_GAMEPLAY_ENABLED) return
    if (!VALE_NARRATIVE_WALK_ENABLED) {
      get().parkBearAtScene()
      return
    }
    set({
      narrativeIntroComplete: false,
      hotspotJourney: null,
      screenJourney: null,
      isTraveling: false,
      interactionPending: false,
      activeHotspotCardId: null,
      activeHotspotSheetId: null,
      isNearHouse: false,
      houseHubOpen: false,
      characterState: CHARACTER_STATES.IDLE,
      targetPosition: null,
    })
    window.requestAnimationFrame(() => {
      useValeStore.getState().startNarrativeIntro()
    })
  },

  openSceneHotspot: (id) => {
    if (!VALE_GAMEPLAY_ENABLED) return
    const state = get()
    if (!state.narrativeIntroComplete || state.isTraveling || state.interactionPending) return

    const hotspot = getValeHotspot(id)
    if (!hotspot) return

    set({
      activeHotspotId: id,
      activeHotspotCardId: id,
      activeHotspotSheetId: null,
      isNearHouse: false,
      houseHubOpen: false,
    })
    get().discover(id, hotspot.label, hotspot.emoji)
  },

  startHotspotActivity: (id) => {
    const hotspot = getValeHotspot(id)
    if (!hotspot) return

    syncCaduLifeEvent({
      childId: childProfile.id,
      world: 'vale-das-palavras',
      hotspot: id,
      activity: hotspot.activityId,
      status: 'started',
      timestamp: Date.now(),
    })

    set({ activeHotspotCardId: null })
  },

  moveBearAlongPath: (id) => {
    if (!VALE_GAMEPLAY_ENABLED) return
    const hotspot = getValeHotspot(id)
    if (!hotspot) return

    const state = get()
    if (state.isTraveling || state.interactionPending) return

    if (VALE_STATIC_SCENE) {
      const pose = useValeBearScreenStore.getState().pose
      const route = getScreenRoute(id)
      if (!route) return

      const alreadyThere =
        state.currentHotspotId === id &&
        !state.screenJourney &&
        isBearAtScreenPose(route.arrivePose, pose)

      if (alreadyThere) {
        set({ activeHotspotId: id })
        handleHotspotArrive(id)
        return
      }

      const path = buildScreenPath(pose, id)

      set({
        activeHotspotId: id,
        screenJourney: {
          hotspotId: id,
          path,
          segmentIndex: 0,
          arrivePose: { ...route.arrivePose },
        },
        hotspotJourney: null,
        isTraveling: true,
        interactionPending: false,
        activeHotspotCardId: null,
        activeHotspotSheetId: null,
        isNearHouse: false,
        houseHubOpen: false,
        characterState: CHARACTER_STATES.WALK,
        targetPosition: null,
      })
      return
    }

    const { x, z } = valeCharacterWorldPos

    const alreadyThere =
      state.currentHotspotId === id &&
      !state.hotspotJourney &&
      isBearAtTarget(hotspot.bearTarget, x, z)

    if (alreadyThere) {
      set({ activeHotspotId: id })
      handleHotspotArrive(id)
      return
    }

    const path = prepareHotspotPath(hotspot, x, z, getBuildHotspotPathContext())

    set({
      activeHotspotId: id,
      hotspotJourney: {
        hotspotId: id,
        path,
        segmentIndex: 0,
        bearTarget: { ...hotspot.bearTarget },
      },
      screenJourney: null,
      isTraveling: true,
      interactionPending: false,
      activeHotspotCardId: null,
      activeHotspotSheetId: null,
      isNearHouse: false,
      houseHubOpen: false,
      characterState: CHARACTER_STATES.WALK,
      targetPosition: null,
    })
  },

  completeHotspotJourney: () => {
    const journey = get().hotspotJourney
    if (!journey) return

    if (journey.hotspotId === NARRATIVE_INTRO_JOURNEY_ID) {
      set({
        hotspotJourney: null,
        isTraveling: false,
        interactionPending: false,
        narrativeIntroComplete: true,
        currentHotspotId: 'casa-do-urso',
        characterState: CHARACTER_STATES.IDLE,
        activeHotspotCardId: null,
        activeHotspotSheetId: null,
        isNearHouse: false,
        houseHubOpen: false,
      })
      saveLastBearHotspot('casa-do-urso')
      return
    }

    const id = journey.hotspotId
    saveLastBearHotspot(id)

    set({
      hotspotJourney: null,
      isTraveling: false,
      interactionPending: true,
      currentHotspotId: id,
      characterState: CHARACTER_STATES.IDLE,
      activeHotspotCardId: null,
      activeHotspotSheetId: null,
      isNearHouse: false,
      houseHubOpen: false,
    })

    window.setTimeout(() => {
      const st = useValeStore.getState()
      if (st.currentHotspotId !== id || st.isTraveling) return
      useValeStore.setState({ interactionPending: false })
      handleHotspotArrive(id)
    }, VALE_HOTSPOT_ARRIVE_DELAY_MS)
  },

  completeScreenJourney: () => {
    const journey = get().screenJourney
    if (!journey) return

    const id = journey.hotspotId
    saveLastBearHotspot(id)
    useValeBearScreenStore.getState().setPose({ ...journey.arrivePose })

    set({
      screenJourney: null,
      isTraveling: false,
      interactionPending: true,
      currentHotspotId: id,
      characterState: CHARACTER_STATES.IDLE,
      activeHotspotCardId: null,
      activeHotspotSheetId: null,
      isNearHouse: false,
      houseHubOpen: false,
    })

    window.setTimeout(() => {
      const st = useValeStore.getState()
      if (st.currentHotspotId !== id || st.isTraveling) return
      useValeStore.setState({ interactionPending: false })
      handleHotspotArrive(id)
    }, VALE_HOTSPOT_ARRIVE_DELAY_MS)
  },

  closeHotspotCard: () => set({ activeHotspotCardId: null }),
  closeHotspotSheet: () => set({ activeHotspotSheetId: null }),

  setWalkTarget: (x, z, { run = false } = {}) => {
    if (VALE_HERO_MODE) return
    const [sx, sz] = clampToValeNav(x, z)
    set({
      targetPosition: [sx, 0, sz],
      characterState: run ? CHARACTER_STATES.RUN : CHARACTER_STATES.WALK,
    })
  },

  clearTarget: () => set({ targetPosition: null }),

  resetToIdle: () =>
    set((state) => {
      const traveling = state.isTraveling || state.hotspotJourney != null || state.screenJourney != null
      return {
        characterState: traveling ? CHARACTER_STATES.WALK : CHARACTER_STATES.IDLE,
        targetPosition: null,
        hotspotJourney: state.narrativeIntroComplete ? null : state.hotspotJourney,
        screenJourney: null,
        isTraveling: state.narrativeIntroComplete ? false : state.isTraveling,
        interactionPending: false,
      }
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

  setNearHouse: (isNearHouse) => set({ isNearHouse, ...(isNearHouse ? {} : { houseHubOpen: false }) }),

  openHouseHub: () => set({ houseHubOpen: true }),

  closeHouseHub: () => set({ houseHubOpen: false }),
}))

/** Restaura último hotspot visitado (UI + persistência) — não usado no fluxo narrativo */
export function hydrateLastBearHotspot() {
  const last = loadLastBearHotspot()
  const id =
    last && VALE_HOTSPOTS.some((h) => h.id === last) ? last : VALE_DEFAULT_HOTSPOT_ID
  useValeStore.setState({ currentHotspotId: id })
}

export function getHotspotSheetPoint(sheetId: string | null) {
  if (!sheetId) return null
  return getWorldInteraction(sheetId) ?? null
}
