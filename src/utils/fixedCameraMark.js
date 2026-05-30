import { FIXED_CAMERA as DEFAULT_FIXED_CAMERA } from '../constants/sceneComposition'

export const MARKED_CAMERA_KEY = 'cadu.fixed.camera.marked'
/** Incrementar quando FIXED_CAMERA mudar no código — invalida cache antigo. */
export const CAMERA_MARK_VERSION = 8

function isValidVec3(v) {
  return (
    Array.isArray(v) &&
    v.length === 3 &&
    v.every((n) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) < 200)
  )
}

export function saveMarkedCamera({ position, target, fov }) {
  if (!isValidVec3(position) || !isValidVec3(target)) return
  const payload = {
    version: CAMERA_MARK_VERSION,
    position: position.map((n) => +n.toFixed(3)),
    target: target.map((n) => +n.toFixed(3)),
    fov: typeof fov === 'number' && Number.isFinite(fov) ? +fov.toFixed(2) : DEFAULT_FIXED_CAMERA.fov,
    savedAt: Date.now(),
  }
  try {
    localStorage.setItem(MARKED_CAMERA_KEY, JSON.stringify(payload))
  } catch {
    // ignore
  }
  return payload
}

export function loadMarkedCamera(fallback = DEFAULT_FIXED_CAMERA) {
  try {
    const raw = localStorage.getItem(MARKED_CAMERA_KEY)
    if (!raw) return fallback
    const data = JSON.parse(raw)
    if (data?.version !== CAMERA_MARK_VERSION) return fallback
    if (!isValidVec3(data?.position) || !isValidVec3(data?.target)) return fallback
    return {
      position: data.position,
      target: data.target,
      fov: data.fov ?? fallback.fov,
    }
  } catch {
    return fallback
  }
}

export function getFixedCamera() {
  return loadMarkedCamera(DEFAULT_FIXED_CAMERA)
}
