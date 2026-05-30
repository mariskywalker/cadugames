import * as THREE from 'three'
import {
  buildCanonicalToFileFromUserMap,
  resolveFileClipNameFromUserMap,
} from './clipRenameUserStorage'
import { resolveFileClipName as resolveFileClipNameFromMap } from '../constants/glbClipRenameMap'

const LOG_PREFIX = '[AnimationClipTester]'

export function listRawGlbClipNames(animations) {
  return animations?.map((clip) => clip.name) ?? []
}

export function buildClipTesterCatalog(rawFileNames, fileToCanonical = {}) {
  const { canonicalNames, conflicts } = buildCanonicalToFileFromUserMap(fileToCanonical)
  return {
    canonicalNames,
    rawFileNames: [...rawFileNames].sort(),
    conflicts,
    assignedCount: Object.keys(fileToCanonical).length,
  }
}

export function resolveFileClipNameForPlay(canonicalName, fileToCanonical) {
  const fromUser = resolveFileClipNameFromUserMap(canonicalName, fileToCanonical)
  if (fromUser) return fromUser
  return resolveFileClipNameFromMap(canonicalName)
}

export function playClipFromActions(actions, mixer, fileClipName, { loop = true } = {}) {
  if (!actions || !mixer || !fileClipName) return false

  const action = actions[fileClipName]
  if (!action) return false

  mixer.stopAllAction()
  action.reset()
  action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1)
  action.clampWhenFinished = !loop
  action.setEffectiveWeight(1)
  action.enabled = true
  action.play()
  return true
}

export function logClipTesterAvailable(rawFileNames, fileToCanonical) {
  const catalog = buildClipTesterCatalog(rawFileNames, fileToCanonical)
  console.log(`${LOG_PREFIX} available clips (raw GLB file names):`, catalog.rawFileNames)
  console.log(`${LOG_PREFIX} user file → canonical:`, fileToCanonical)
  console.log(`${LOG_PREFIX} canonical clip names (user):`, catalog.canonicalNames)
  if (catalog.conflicts.length) {
    console.warn(`${LOG_PREFIX} duplicate canonical names:`, catalog.conflicts)
  }
}

export function logClipTesterClick(clipName, { isRawFile = false, fileToCanonical = {} } = {}) {
  console.log(`${LOG_PREFIX} clicked clip.name:`, clipName)
  if (!isRawFile) {
    console.log(`${LOG_PREFIX} GLB file clip.name:`, resolveFileClipNameForPlay(clipName, fileToCanonical))
  }
}

export function logClipTesterPlaying(clipName) {
  console.log(`${LOG_PREFIX} currently playing clip.name:`, clipName)
}

export { LOG_PREFIX }
