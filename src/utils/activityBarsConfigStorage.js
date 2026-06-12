import { DEFAULT_ACTIVITY_BARS_CONFIG } from '../constants/activityBarsDefaults'
import { copyAnimationAnchor } from '../constants/activityBarsDefaults'

export const ACTIVITY_BARS_CONFIG_STORAGE_KEY = 'cadu.activityBars.config'
export const ACTIVITY_BARS_CONFIG_VERSION = 2

const POINT_KEYS = ['hotspotPosition', 'interactionPoint', 'faceTarget']

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

function normalizePoint(raw) {
  return isVec3(raw) ? roundVec3(raw) : null
}

function normalizeAnchor(raw) {
  if (!raw || typeof raw !== 'object') return null
  const position = normalizePoint(raw.position)
  if (!position) return null
  const rotation = normalizePoint(raw.rotation) ?? [0, 0, 0]
  return { position, rotation }
}

export function normalizeActivityBarsConfig(raw) {
  if (!raw || typeof raw !== 'object') return null
  const next = {}
  for (const key of POINT_KEYS) {
    const point = normalizePoint(raw[key])
    if (point) next[key] = point
  }
  const anchor = normalizeAnchor(raw.animationAnchor)
  if (anchor) next.animationAnchor = anchor
  if (Array.isArray(raw.animationSequence) && raw.animationSequence.every((s) => typeof s === 'string')) {
    next.animationSequence = [...raw.animationSequence]
  }
  return Object.keys(next).length ? next : null
}

export function mergeActivityBarsConfig(override) {
  const base = {
    ...DEFAULT_ACTIVITY_BARS_CONFIG,
    animationAnchor: copyAnimationAnchor(DEFAULT_ACTIVITY_BARS_CONFIG.animationAnchor),
  }
  if (!override) return base
  for (const key of POINT_KEYS) {
    if (override[key]) base[key] = override[key]
  }
  const anchor = copyAnimationAnchor(override.animationAnchor)
  if (anchor) base.animationAnchor = anchor
  if (override.animationSequence) base.animationSequence = override.animationSequence
  return base
}

export function loadActivityBarsConfig() {
  try {
    const raw = localStorage.getItem(ACTIVITY_BARS_CONFIG_STORAGE_KEY)
    if (!raw) return mergeActivityBarsConfig(null)
    const data = JSON.parse(raw)
    if (data?.version !== ACTIVITY_BARS_CONFIG_VERSION) {
      return mergeActivityBarsConfig(normalizeActivityBarsConfig(data.config))
    }
    return mergeActivityBarsConfig(normalizeActivityBarsConfig(data.config))
  } catch {
    return mergeActivityBarsConfig(null)
  }
}

export function saveActivityBarsConfig(config) {
  try {
    localStorage.setItem(
      ACTIVITY_BARS_CONFIG_STORAGE_KEY,
      JSON.stringify({
        version: ACTIVITY_BARS_CONFIG_VERSION,
        config: {
          hotspotPosition: config.hotspotPosition,
          interactionPoint: config.interactionPoint,
          faceTarget: config.faceTarget,
          animationAnchor: copyAnimationAnchor(config.animationAnchor),
          animationSequence: config.animationSequence,
        },
        savedAt: Date.now(),
      }),
    )
  } catch {
    // ignore
  }
}

export function formatActivityBarsConfigJson(config) {
  return JSON.stringify(
    {
      hotspotPosition: config.hotspotPosition,
      interactionPoint: config.interactionPoint,
      faceTarget: config.faceTarget,
      animationAnchor: copyAnimationAnchor(config.animationAnchor),
      animationSequence: config.animationSequence,
    },
    null,
    2,
  )
}
