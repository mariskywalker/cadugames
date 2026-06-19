import {
  DEFAULT_OPENING_SCENE_LAYOUT,
  mergeOpeningSceneLayout,
  type OpeningSceneLayout,
  type OpeningSceneLayoutOverride,
  type OpeningSceneObjectId,
} from './openingSceneEditorLayout'

export const OPENING_SCENE_EDITOR_STORAGE_KEY = 'cadu.opening.scene.overrides'
export const OPENING_SCENE_EDITOR_STORAGE_VERSION = 7

export function loadOpeningSceneOverride(): OpeningSceneLayoutOverride {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(OPENING_SCENE_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { version?: number; layout?: OpeningSceneLayoutOverride }
    if (data.version !== OPENING_SCENE_EDITOR_STORAGE_VERSION || !data.layout) return {}
    return data.layout
  } catch {
    return {}
  }
}

export function saveOpeningSceneOverride(layout: OpeningSceneLayout) {
  try {
    const override: OpeningSceneLayoutOverride = {}
    const base = DEFAULT_OPENING_SCENE_LAYOUT

    const bgDiff: OpeningSceneLayoutOverride['background'] = {}
    for (const key of Object.keys(base.background) as Array<keyof typeof base.background>) {
      if (layout.background[key] !== base.background[key]) {
        bgDiff[key] = layout.background[key] as never
      }
    }
    if (Object.keys(bgDiff).length) override.background = bgDiff

    const camDiff: OpeningSceneLayoutOverride['camera'] = {}
    for (const key of Object.keys(base.camera) as Array<keyof typeof base.camera>) {
      const a = layout.camera[key]
      const b = base.camera[key]
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.some((v, i) => v !== b[i])) camDiff[key] = a as never
      } else if (a !== b) {
        camDiff[key] = a as never
      }
    }
    if (Object.keys(camDiff).length) override.camera = camDiff

    const objDiff: OpeningSceneLayoutOverride['objects'] = {}
    for (const id of Object.keys(base.objects) as OpeningSceneObjectId[]) {
      const patch: Partial<(typeof base.objects)[OpeningSceneObjectId]> = {}
      const cur = layout.objects[id]
      const def = base.objects[id]
      for (const key of Object.keys(def) as Array<keyof typeof def>) {
        if (cur[key] !== def[key]) patch[key] = cur[key] as never
      }
      if (Object.keys(patch).length) objDiff[id] = patch
    }
    if (Object.keys(objDiff).length) override.objects = objDiff

    localStorage.setItem(
      OPENING_SCENE_EDITOR_STORAGE_KEY,
      JSON.stringify({ version: OPENING_SCENE_EDITOR_STORAGE_VERSION, layout: override, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function loadMergedOpeningSceneLayout() {
  return mergeOpeningSceneLayout(loadOpeningSceneOverride())
}

export function resetOpeningSceneOverride() {
  try {
    localStorage.removeItem(OPENING_SCENE_EDITOR_STORAGE_KEY)
  } catch {
    // ignore
  }
  return mergeOpeningSceneLayout({})
}
