import { create } from 'zustand'
import { CHARACTER_STATES } from '../constants/animations'
import { CAMERA_STORAGE_KEY } from '../constants/scene'
import { BUBBLE_TUBE_CENTER } from '../constants/animations'
import { CADU_START_POSITION } from '../constants/scene'
import { clampToNavMesh } from '../utils/navMesh'
import { FIXED_CAMERA } from '../constants/sceneComposition'
import { getFixedCamera } from '../utils/fixedCameraMark'
import {
  formatTransformForExport,
  loadSceneEditorOverrides,
  mergeSceneTransform,
  normalizeEditorTransform,
  saveSceneEditorOverrides,
} from '../utils/sceneEditorStorage'
import { SCENE_EDITOR_OBJECT_MAP, SCENE_EDITOR_OBJECTS } from '../constants/sceneEditorRegistry'
import { DEFAULT_ACTIVITY_BARS_CONFIG, copyActivityBarsPoint, copyAnimationAnchor } from '../constants/activityBarsDefaults'
import {
  formatActivityBarsConfigJson,
  loadActivityBarsConfig,
  mergeActivityBarsConfig,
  saveActivityBarsConfig,
} from '../utils/activityBarsConfigStorage'
import { ACTIVITY_BARS_POSITION_KEYS, ACTIVITY_BARS_POINT_KEYS } from '../utils/activityBarsEditorRefs'
import {
  assertActivityBarsConfig,
  assertConfigPointUsed,
  logBarsWalkTo,
} from '../utils/activityBarsDebug'
import { anchorFromGroup } from '../utils/activityBarsNav'
import { getEditorRef } from '../utils/editorRefRegistry'
import { loadRegistryOverrides, saveRegistryOverrides } from '../utils/registryOverridesStorage'
import { resolveRegistryClipName } from '../utils/animationRegistry'

const INITIAL_MARKED_CAMERA = getFixedCamera()
const INITIAL_EDITOR_OVERRIDES = loadSceneEditorOverrides()
const INITIAL_ACTIVITY_BARS_CONFIG = loadActivityBarsConfig()

export const useCADUStore = create((set, get) => ({
  targetPosition: null,
  characterState: CHARACTER_STATES.IDLE,
  emotion: null,
  debug: false,

  /** Barras — interação coreografada (approach → sequência). */
  barAnimPending: false,
  activityBarsPhase: null,
  playerControlLocked: false,
  activityBarsRewardVisible: false,
  activityBarsInteractionPoint: null,

  /** Config runtime das barras (localStorage JSON + defaults). */
  activityBarsConfig: INITIAL_ACTIVITY_BARS_CONFIG,

  /** Editor visual — hotspot / interaction / faceTarget (?bars=1 ou B). */
  activityBarsEditMode: false,
  activityBarsEditSelection: 'hotspotPosition',
  activityBarsEditDragging: false,
  activityBarsEditMessage: null,
  activityBarsAnchorGizmoMode: 'translate',
  activityBarsAnchorPreview: false,
  activityBarsAnchorPreviewTick: 0,

  /** Modo marcação — clique na cena para copiar coordenadas (tecla L ou ?pick=1). */
  scenePickMode: false,
  lastScenePick: null,
  scenePickMessage: null,

  /** Editor de layout 3D — gizmo move/rotate/scale (tecla G ou ?edit=1). */
  sceneEditorMode: false,
  sceneEditorTransformMode: 'translate',
  selectedEditorObjectId: SCENE_EDITOR_OBJECTS[2]?.id ?? 'activityBars',
  sceneEditorOverrides: INITIAL_EDITOR_OVERRIDES,
  sceneEditorDragging: false,
  sceneEditorMessage: null,

  /** Câmera livre — girar e zoom (tecla C para alternar). */
  freeCameraMode: false,

  /** Posição marcada da câmera fixa. */
  markedCamera: INITIAL_MARKED_CAMERA,

  setMarkedCamera: (markedCamera) => set({ markedCamera }),

  setFreeCameraMode: (freeCameraMode) => set({ freeCameraMode }),

  toggleFreeCameraMode: () => set({ freeCameraMode: !get().freeCameraMode }),

  setScenePickMode: (scenePickMode) =>
    set({
      scenePickMode,
      scenePickMessage: scenePickMode ? 'Clique na cena para marcar um ponto.' : null,
      ...(scenePickMode
        ? { sceneEditorMode: false, activityBarsEditMode: false }
        : { lastScenePick: null }),
    }),

  toggleScenePickMode: () => {
    const next = !get().scenePickMode
    get().setScenePickMode(next)
    if (next) {
      get().clearTarget()
      get().setSceneEditorMode(false)
    }
  },

  setSceneEditorMode: (sceneEditorMode) =>
    set({
      sceneEditorMode,
      sceneEditorMessage: sceneEditorMode ? 'Editor ativo — selecione um objeto.' : null,
      ...(sceneEditorMode
        ? {
            scenePickMode: false,
            activityBarsEditMode: false,
            freeCameraMode: true,
          }
        : {
            sceneEditorDragging: false,
          }),
    }),

  toggleSceneEditorMode: () => get().setSceneEditorMode(!get().sceneEditorMode),

  setActivityBarsEditMode: (activityBarsEditMode) =>
    set({
      activityBarsEditMode,
      activityBarsEditMessage: activityBarsEditMode ? 'Editor das barras ativo.' : null,
      ...(activityBarsEditMode
        ? {
            scenePickMode: false,
            sceneEditorMode: false,
            freeCameraMode: true,
          }
        : {
            activityBarsEditDragging: false,
            activityBarsAnchorPreview: false,
          }),
    }),

  toggleActivityBarsEditMode: () =>
    get().setActivityBarsEditMode(!get().activityBarsEditMode),

  setActivityBarsEditSelection: (activityBarsEditSelection) =>
    set({ activityBarsEditSelection, activityBarsEditMessage: null }),

  setActivityBarsEditDragging: (activityBarsEditDragging) => set({ activityBarsEditDragging }),

  setActivityBarsAnchorGizmoMode: (activityBarsAnchorGizmoMode) =>
    set({ activityBarsAnchorGizmoMode }),

  updateActivityBarsConfigPoint: (key, position) => {
    if (!ACTIVITY_BARS_POSITION_KEYS.includes(key) || !Array.isArray(position)) return
    const rounded = position.map((n) => +Number(n).toFixed(4))
    const config = { ...get().activityBarsConfig, [key]: rounded }
    saveActivityBarsConfig(config)
    set({ activityBarsConfig: config, activityBarsEditMessage: 'Salvo no navegador.' })
  },

  updateActivityBarsAnimationAnchor: (anchor) => {
    const next = copyAnimationAnchor(anchor)
    if (!next) return
    const config = { ...get().activityBarsConfig, animationAnchor: next }
    saveActivityBarsConfig(config)
    set({ activityBarsConfig: config, activityBarsEditMessage: 'Animation anchor salvo.' })
  },

  startActivityBarsAnchorPreview: () => {
    if (!get().activityBarsEditMode) return
    set((s) => ({
      activityBarsAnchorPreview: true,
      activityBarsAnchorPreviewTick: s.activityBarsAnchorPreviewTick + 1,
      playerControlLocked: true,
      targetPosition: null,
      barAnimPending: false,
      activityBarsPhase: null,
      activityBarsEditMessage: 'Posicione o CADU e salve como animation anchor.',
    }))
  },

  stopActivityBarsAnchorPreview: () =>
    set({
      activityBarsAnchorPreview: false,
      playerControlLocked: false,
      activityBarsEditMessage: null,
    }),

  saveCharacterAsAnimationAnchor: () => {
    const group = getEditorRef('character')?.current
    const anchor = anchorFromGroup(group)
    if (!anchor) {
      set({ activityBarsEditMessage: 'CADU não encontrado na cena.' })
      return
    }
    get().updateActivityBarsAnimationAnchor(anchor)
    get().stopActivityBarsAnchorPreview()
    set({
      activityBarsEditSelection: 'animationAnchor',
      activityBarsEditMessage: 'Animation anchor salvo a partir do CADU.',
    })
  },

  resetActivityBarsConfig: () => {
    const config = mergeActivityBarsConfig(null)
    saveActivityBarsConfig(config)
    set({ activityBarsConfig: config, activityBarsEditMessage: 'Valores padrão restaurados.' })
  },

  copyActivityBarsConfigExport: () => {
    const text = formatActivityBarsConfigJson(get().activityBarsConfig)
    try {
      navigator.clipboard.writeText(text)
      set({ activityBarsEditMessage: 'JSON copiado — cole no chat ou no config.' })
    } catch {
      set({ activityBarsEditMessage: text })
    }
  },

  setSceneEditorTransformMode: (sceneEditorTransformMode) => set({ sceneEditorTransformMode }),

  setSelectedEditorObject: (selectedEditorObjectId) =>
    set({ selectedEditorObjectId, sceneEditorMessage: null }),

  setSceneEditorDragging: (sceneEditorDragging) => set({ sceneEditorDragging }),

  updateEditorTransform: (objectId, partial) => {
    const normalized = normalizeEditorTransform(partial)
    if (!objectId || !normalized) return
    const prev = get().sceneEditorOverrides[objectId] ?? {}
    const objects = {
      ...get().sceneEditorOverrides,
      [objectId]: { ...prev, ...normalized },
    }
    saveSceneEditorOverrides(objects)
    set({ sceneEditorOverrides: objects })
  },

  resetEditorObject: (objectId) => {
    if (!objectId) return
    const objects = { ...get().sceneEditorOverrides }
    delete objects[objectId]
    saveSceneEditorOverrides(objects)
    set({ sceneEditorOverrides: objects, sceneEditorMessage: 'Objeto resetado.' })
  },

  resetAllEditorOverrides: () => {
    saveSceneEditorOverrides({})
    set({ sceneEditorOverrides: {}, sceneEditorMessage: 'Todos os overrides resetados.' })
  },

  copyEditorExport: () => {
    const overrides = get().sceneEditorOverrides
    const ids = Object.keys(overrides)
    if (!ids.length) {
      set({ sceneEditorMessage: 'Nenhum override para copiar.' })
      return
    }
    const blocks = ids.map((id) => {
      const defaults = SCENE_EDITOR_OBJECT_MAP[id]?.defaults
      const merged = mergeSceneTransform(defaults ?? {}, overrides[id])
      return formatTransformForExport(id, merged)
    })
    const text = blocks.join('\n\n')
    try {
      navigator.clipboard.writeText(text)
      set({ sceneEditorMessage: 'Valores copiados — cole em sceneComposition.js' })
    } catch {
      set({ sceneEditorMessage: text })
    }
  },

  recordScenePick: (position, hitName = 'scene') => {
    const text = `position: [${position[0].toFixed(2)}, ${position[1].toFixed(2)}, ${position[2].toFixed(2)}]`
    const payload = { position, hitName, at: Date.now() }
    set({ lastScenePick: payload, scenePickMessage: 'Coordenadas copiadas — cole no chat.' })
    try {
      navigator.clipboard.writeText(text)
    } catch {
      set({ scenePickMessage: `Copie manualmente: ${text}` })
    }
  },

  fps: null,
  modelStatus: 'loading',
  modelError: null,
  /** Exact clip.name list from loaded GLB — single source of truth. */
  animationClips: [],
  availableClips: [],

  debugRequestedClip: null,

  /** Clip selecionado no painel (exact GLB name). */
  selectedClipName: null,
  /** Clip em reprodução (exact GLB name). */
  currentPlayingClip: null,
  /** Último erro de animação (clip ausente etc.). */
  animationError: null,

  /** Overrides: role → clip.name escolhido pelo usuário (localStorage). */
  registryOverrides: loadRegistryOverrides(),

  /** Clip manual override (exact GLB name). */
  manualClipName: null,

  characterSize: null,
  characterWorldPosition: [...CADU_START_POSITION],
  bubbleTubeCollider: null,

  setCharacterWorldPosition: (position) => set({ characterWorldPosition: position }),

  setBubbleTubeCollider: (outerRadiusWorld) =>
    set({
      bubbleTubeCollider: {
        center: BUBBLE_TUBE_CENTER,
        radius: outerRadiusWorld,
      },
    }),

  setWalkTarget: (x, z, { run = false } = {}) => {
    const st = get()
    if (st.playerControlLocked || st.activityBarsEditMode || st.activityBarsAnchorPreview) return
    if (st.barAnimPending && !st.targetPosition) return
    const [sx, sz] = clampToNavMesh(x, z, st.bubbleTubeCollider, {
      barsInteractionActive: st.barAnimPending,
    })
    set({
      targetPosition: [sx, 0, sz],
      barAnimPending: false,
      activityBarsPhase: null,
      playerControlLocked: false,
      manualClipName: null,
      debugRequestedClip: null,
      emotion: null,
      characterState: run ? CHARACTER_STATES.RUN : CHARACTER_STATES.WALK,
    })
  },

  clearTarget: () => set({ targetPosition: null }),

  startActivityBarsInteraction: () => {
    if (get().activityBarsEditMode) return
    const st = get()
    const config = assertActivityBarsConfig(st.activityBarsConfig)
    const point = copyActivityBarsPoint(config.interactionPoint)
    if (!point) {
      throw new Error('[CADU Bars] interactionPoint inválido em activityBarsConfig')
    }

    logBarsWalkTo(config.interactionPoint)

    set({
      playerControlLocked: true,
      barAnimPending: true,
      activityBarsPhase: 'approach',
      activityBarsRewardVisible: false,
      activityBarsInteractionPoint: point,
      targetPosition: [point[0], point[1] ?? 0, point[2]],
      emotion: null,
      characterState: CHARACTER_STATES.WALK,
      debugRequestedClip: null,
      manualClipName: null,
      animationError: null,
    })

    const after = get()
    assertConfigPointUsed('walk targetPosition', after.targetPosition, config.interactionPoint)
    assertConfigPointUsed('walk activityBarsInteractionPoint', after.activityBarsInteractionPoint, config.interactionPoint)

    console.log('[CADU Bars] approach started — walk handled by useActivityBarsInteraction', {
      from: get().characterWorldPosition,
      to: point,
    })
  },

  /** @deprecated use startActivityBarsInteraction */
  goToActivityBars: () => get().startActivityBarsInteraction(),

  finishActivityBarsInteraction: ({ showReward = false, failed = false } = {}) =>
    set({
      barAnimPending: false,
      activityBarsPhase: null,
      playerControlLocked: false,
      activityBarsRewardVisible: showReward && !failed,
      activityBarsInteractionPoint: null,
      targetPosition: null,
      ...(failed ? { characterState: CHARACTER_STATES.IDLE } : {}),
    }),

  dismissActivityBarsReward: () => set({ activityBarsRewardVisible: false }),

  finishBarAnimations: () => get().finishActivityBarsInteraction(),

  cancelBarAnimations: () =>
    set({
      barAnimPending: false,
      activityBarsPhase: null,
      playerControlLocked: false,
      activityBarsRewardVisible: false,
      targetPosition: null,
      characterState: CHARACTER_STATES.IDLE,
    }),

  /** @deprecated use startActivityBarsInteraction */
  startStationSequence: (stationId) => {
    if (stationId === 'activityBars') get().startActivityBarsInteraction()
  },

  setCharacterState: (state) => set({ characterState: state }),

  triggerEmotion: (state) => {
    const next = state ?? CHARACTER_STATES.IDLE
    set({
      emotion: next,
      characterState: next,
      manualClipName: null,
      selectedClipName: null,
      debugRequestedClip: null,
    })
  },

  /** Toca o clip configurado para uma role do registry (teste in-place). */
  triggerRegistryCommand: (role) => {
    const { animationClips, registryOverrides } = get()
    try {
      const clipName = resolveRegistryClipName(role, animationClips, registryOverrides)
      const stateByRole = {
        idle: CHARACTER_STATES.IDLE,
        walk: CHARACTER_STATES.WALK,
        run: CHARACTER_STATES.RUN,
        happy: CHARACTER_STATES.HAPPY,
        sad: CHARACTER_STATES.SAD,
        angry: CHARACTER_STATES.ANGRY,
      }
      set({
        manualClipName: clipName,
        selectedClipName: clipName,
        targetPosition: null,
        barAnimPending: false,
        debugRequestedClip: null,
        animationError: null,
        emotion: ['happy', 'sad', 'angry'].includes(role) ? stateByRole[role] : null,
        characterState: stateByRole[role] ?? CHARACTER_STATES.IDLE,
      })
    } catch (err) {
      set({ animationError: err.message })
    }
  },

  resetToIdle: () =>
    set({
      emotion: null,
      characterState: CHARACTER_STATES.IDLE,
      targetPosition: null,
      barAnimPending: false,
      activityBarsPhase: null,
      playerControlLocked: false,
      activityBarsRewardVisible: false,
      debugRequestedClip: null,
      manualClipName: null,
    }),

  toggleDebug: () => {
    const next = !get().debug
    set({
      debug: next,
      ...(next ? {} : { debugRequestedClip: null }),
    })
  },
  setDebug: (debug) => set({ debug }),
  setFps: (fps) => set({ fps }),
  setModelStatus: (modelStatus, modelError = null) => set({ modelStatus, modelError }),

  setAnimationClips: (animationClips) =>
    set({
      animationClips,
      availableClips: animationClips,
    }),

  /** @deprecated alias */
  setAvailableClips: (clips) => get().setAnimationClips(clips),

  setSelectedClipName: (selectedClipName) => {
    console.log('[CADU] Selected clip:', selectedClipName)
    set({ selectedClipName })
  },

  setCurrentPlayingClip: (currentPlayingClip) => {
    console.log('[CADU] Current playing clip:', currentPlayingClip)
    set({ currentPlayingClip, animationError: null })
  },

  setAnimationError: (animationError) => {
    if (animationError) console.error('[CADU]', animationError)
    set({ animationError, currentPlayingClip: null })
  },

  clearAnimationError: () => set({ animationError: null }),

  setRegistryClipOverride: (role, clipName) => {
    const next = { ...get().registryOverrides, [role]: clipName }
    saveRegistryOverrides(next)
    console.log('[CADU] Registry override:', role, '→', clipName)
    set({ registryOverrides: next })
  },

  clearRegistryClipOverride: (role) => {
    const next = { ...get().registryOverrides }
    delete next[role]
    saveRegistryOverrides(next)
    set({ registryOverrides: next })
  },

  resetRegistryOverrides: () => {
    saveRegistryOverrides({})
    set({ registryOverrides: {} })
  },
  setCharacterSize: (characterSize) => set({ characterSize }),
  requestDebugClip: (name) => set({ debugRequestedClip: name }),
  clearDebugClip: () => set({ debugRequestedClip: null }),

  setManualClip: (manualClipName) => {
    console.log('[CADU] Selected clip:', manualClipName)
    set({
      manualClipName,
      selectedClipName: manualClipName,
      targetPosition: null,
      barAnimPending: false,
      emotion: null,
      characterState: CHARACTER_STATES.IDLE,
      debugRequestedClip: null,
    })
  },

  clearManualClip: () =>
    set({
      manualClipName: null,
      selectedClipName: null,
      characterState: CHARACTER_STATES.IDLE,
    }),

  cinematicMode: false,
  setCinematicMode: (cinematicMode) => set({ cinematicMode }),

  spawnResetTick: 0,

  /** 'landing' = Figma template entry, '3d' = sensory room, 'map' = illustrated map */
  viewMode: 'landing',
  showMapGrid: false,
  setViewMode: (viewMode) => set({ viewMode }),
  enterRoom: () =>
    set((s) => ({
      viewMode: '3d',
      targetPosition: null,
      emotion: null,
      characterState: CHARACTER_STATES.IDLE,
      debugRequestedClip: null,
      barAnimPending: false,
      activityBarsPhase: null,
      playerControlLocked: false,
      activityBarsRewardVisible: false,
      manualClipName: null,
      freeCameraMode: false,
      spawnResetTick: s.spawnResetTick + 1,
      characterWorldPosition: [...CADU_START_POSITION],
    })),
  toggleMapGrid: () => set((s) => ({ showMapGrid: !s.showMapGrid })),

  cameraSaveTick: 0,
  cameraSaveMessage: null,

  persistCameraView: (pos, target) => {
    try {
      localStorage.setItem(CAMERA_STORAGE_KEY, JSON.stringify({ pos, target }))
    } catch {
      // ignore
    }
  },

  requestSaveCamera: () =>
    set((s) => ({
      cameraSaveTick: s.cameraSaveTick + 1,
      cameraSaveMessage: 'Vista salva',
    })),

  clearCameraSaveMessage: () => set({ cameraSaveMessage: null }),
}))
