import { animationRegistry } from '../constants/animationRegistry'

export const REGISTRY_OVERRIDE_STORAGE_KEY = 'cadu-animation-registry-overrides-v1'

export function loadRegistryOverrides() {
  try {
    const raw = localStorage.getItem(REGISTRY_OVERRIDE_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

export function saveRegistryOverrides(overrides) {
  try {
    localStorage.setItem(REGISTRY_OVERRIDE_STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // ignore
  }
}

export function getEffectiveClipName(role) {
  const overrides = loadRegistryOverrides()
  const override = overrides[role]
  if (typeof override === 'string' && override.trim()) return override.trim()
  return animationRegistry[role]?.clipName ?? null
}

/** @deprecated all canonical clips are playable */
export function getPlayableAnimationClips(animationClips) {
  if (!Array.isArray(animationClips)) return []
  return animationClips
}

/** @deprecated */
export function isInactiveGlbClip() {
  return false
}
