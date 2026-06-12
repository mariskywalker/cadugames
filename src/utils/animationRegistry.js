import { animationRegistry } from '../constants/animationRegistry'

export function clipExistsInGlb(clipName, availableClips) {
  if (!clipName || !Array.isArray(availableClips)) return false
  return availableClips.includes(clipName)
}

/** Validate registry roles against GLB (uses user overrides when set). */
export function validateAnimationRegistry(availableClips, registryOverrides = {}) {
  return Object.entries(animationRegistry).map(([role, { label, clipName: defaultClipName }]) => {
    const clipName = registryOverrides[role] ?? defaultClipName
    const isOverridden = Boolean(registryOverrides[role] && registryOverrides[role] !== defaultClipName)
    return {
      role,
      label,
      clipName,
      defaultClipName,
      isOverridden,
      exists: clipExistsInGlb(clipName, availableClips),
    }
  })
}

/**
 * Resolve registry role → exact GLB clip.name (override ou default).
 * Throws if missing — sem fallback silencioso.
 */
export function resolveRegistryClipName(role, availableClips, registryOverrides = {}) {
  const entry = animationRegistry[role]
  if (!entry) {
    throw new Error(`[CADU] Registry role "${role}" is not defined.`)
  }
  const clipName = registryOverrides[role] ?? entry.clipName
  if (!clipExistsInGlb(clipName, availableClips)) {
    throw new Error(
      `[CADU] Clip "${clipName}" (role: ${role}, label: "${entry.label}") is missing from GLB. Available: [${(availableClips ?? []).join(', ')}]`,
    )
  }
  return clipName
}

export function assertClipInGlb(clipName, availableClips) {
  if (!clipName) {
    throw new Error('[CADU] No clip name provided.')
  }
  if (!clipExistsInGlb(clipName, availableClips)) {
    throw new Error(
      `[CADU] Clip "${clipName}" is missing from GLB. Available: [${(availableClips ?? []).join(', ')}]`,
    )
  }
  return clipName
}

/** Role cujo clip efetivo === clipName (considera overrides). */
export function getRolesForClipName(clipName, registryOverrides = {}) {
  return Object.entries(animationRegistry)
    .filter(([role, entry]) => (registryOverrides[role] ?? entry.clipName) === clipName)
    .map(([role, entry]) => ({ role, label: entry.label }))
}
