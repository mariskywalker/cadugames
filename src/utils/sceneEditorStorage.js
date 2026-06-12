export const SCENE_EDITOR_STORAGE_KEY = 'cadu.scene.editor.overrides'
export const SCENE_EDITOR_VERSION = 2

function isVec3(v) {
  return (
    Array.isArray(v) &&
    v.length === 3 &&
    v.every((n) => typeof n === 'number' && Number.isFinite(n))
  )
}

function roundVec3(v) {
  return v.map((n) => +n.toFixed(4))
}

export function normalizeEditorTransform(raw) {
  if (!raw || typeof raw !== 'object') return null
  const next = {}
  if (isVec3(raw.position)) next.position = roundVec3(raw.position)
  if (isVec3(raw.rotation)) next.rotation = roundVec3(raw.rotation)
  if (isVec3(raw.scale)) next.scale = roundVec3(raw.scale)
  return Object.keys(next).length ? next : null
}

export function loadSceneEditorOverrides() {
  try {
    const raw = localStorage.getItem(SCENE_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw)
    if (data?.version !== SCENE_EDITOR_VERSION || typeof data.objects !== 'object') return {}
    const objects = {}
    for (const [id, transform] of Object.entries(data.objects)) {
      const normalized = normalizeEditorTransform(transform)
      if (normalized) objects[id] = normalized
    }
    return objects
  } catch {
    return {}
  }
}

export function saveSceneEditorOverrides(objects) {
  try {
    localStorage.setItem(
      SCENE_EDITOR_STORAGE_KEY,
      JSON.stringify({ version: SCENE_EDITOR_VERSION, objects, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function mergeSceneTransform(defaults, override) {
  return {
    position: override?.position ?? defaults.position,
    rotation: override?.rotation ?? defaults.rotation ?? [0, 0, 0],
    scale: override?.scale ?? defaults.scale ?? [1, 1, 1],
  }
}

export function formatTransformForExport(id, transform) {
  const lines = [`// ${id}`, `position: [${transform.position.map((n) => n.toFixed(2)).join(', ')}],`]
  const rot = transform.rotation
  if (rot.some((n) => Math.abs(n) > 0.0001)) {
    lines.push(`rotation: [${rot.map((n) => n.toFixed(3)).join(', ')}],`)
  }
  const scale = transform.scale
  if (scale.some((n) => Math.abs(n - 1) > 0.0001)) {
    lines.push(`scale: [${scale.map((n) => n.toFixed(3)).join(', ')}],`)
  }
  return lines.join('\n')
}
