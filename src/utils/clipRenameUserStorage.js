import { VERIFIED_FILE_TO_CANONICAL } from '../constants/glbClipRenameMap'

export const CLIP_RENAME_USER_STORAGE_KEY = 'cadu-clip-rename-user-v1'

function sanitizeMap(parsed) {
  const clean = {}
  if (!parsed || typeof parsed !== 'object') return clean
  for (const [file, canon] of Object.entries(parsed)) {
    if (typeof file === 'string' && typeof canon === 'string' && canon.trim()) {
      clean[file] = canon.trim()
    }
  }
  return clean
}

/** Overrides do usuário no localStorage (vazio = usa só o mapa verificado). */
export function loadUserClipRenameOverrides() {
  try {
    const raw = localStorage.getItem(CLIP_RENAME_USER_STORAGE_KEY)
    if (!raw) return {}
    return sanitizeMap(JSON.parse(raw))
  } catch {
    return {}
  }
}

/** Mapa efetivo: verificado + overrides do editor. */
export function loadEffectiveClipRenameMap() {
  return { ...VERIFIED_FILE_TO_CANONICAL, ...loadUserClipRenameOverrides() }
}

/** @deprecated use loadEffectiveClipRenameMap */
export function loadUserClipRenameMap() {
  return loadEffectiveClipRenameMap()
}

/** Salva overrides parciais (merge com verificado). */
export function saveUserClipRenameOverrides(overrides) {
  saveUserClipRenameMap(overrides)
}

/** @param {Record<string, string>} fileToCanonical overrides only */
export function saveUserClipRenameMap(fileToCanonical) {
  try {
    localStorage.setItem(CLIP_RENAME_USER_STORAGE_KEY, JSON.stringify(sanitizeMap(fileToCanonical)))
  } catch {
    // ignore
  }
}

export function clearUserClipRenameMap() {
  try {
    localStorage.removeItem(CLIP_RENAME_USER_STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function resetToVerifiedClipRenameMap() {
  clearUserClipRenameMap()
  return { ...VERIFIED_FILE_TO_CANONICAL }
}

/**
 * @param {Record<string, string>} fileToCanonical
 * @returns {{ canonicalToFile: Record<string, string>, canonicalNames: string[], conflicts: string[] }}
 */
export function buildCanonicalToFileFromUserMap(fileToCanonical) {
  const canonicalToFile = {}
  const conflicts = []

  for (const [fileName, canonical] of Object.entries(fileToCanonical)) {
    if (canonicalToFile[canonical] && canonicalToFile[canonical] !== fileName) {
      conflicts.push(canonical)
      continue
    }
    canonicalToFile[canonical] = fileName
  }

  return {
    canonicalToFile,
    canonicalNames: Object.keys(canonicalToFile).sort(),
    conflicts,
  }
}

export function resolveFileClipNameFromUserMap(canonicalName, fileToCanonical) {
  for (const [fileName, canonical] of Object.entries(fileToCanonical)) {
    if (canonical === canonicalName) return fileName
  }
  return null
}
