import { getGameplayValeHotspot } from './valeHotspotPathEditorStorage'
import type { ValeBearTarget, ValeHotspot } from './valeHotspots'
import { VALE_HOTSPOTS, applyBearTargetToHotspot } from './valeHotspots'
import { VALE_BEAR_TARGET_EDITOR_ENABLED } from './valeCharacterFreeze'

export const BEAR_TARGET_EDITOR_STORAGE_KEY = 'cadu.vale.bearTargets.overrides'
export const BEAR_TARGET_LAYOUT_VERSION = 6

export type BearTargetOverride = Partial<ValeBearTarget>
export type BearTargetOverrides = Record<string, BearTargetOverride>

export function loadBearTargetOverrides(): BearTargetOverrides {
  if (!VALE_BEAR_TARGET_EDITOR_ENABLED || typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(BEAR_TARGET_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { version?: number; targets?: BearTargetOverrides }
    if (data.version !== BEAR_TARGET_LAYOUT_VERSION) return {}
    return data?.targets ?? {}
  } catch {
    return {}
  }
}

export function saveBearTargetOverrides(targets: BearTargetOverrides) {
  if (!VALE_BEAR_TARGET_EDITOR_ENABLED) return
  try {
    localStorage.setItem(
      BEAR_TARGET_EDITOR_STORAGE_KEY,
      JSON.stringify({ version: BEAR_TARGET_LAYOUT_VERSION, targets, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function mergeHotspotBearTargets(overrides: BearTargetOverrides = loadBearTargetOverrides()): ValeHotspot[] {
  return VALE_HOTSPOTS.map((hotspot) => {
    const patch = overrides[hotspot.id]
    if (!patch) {
      return {
        ...hotspot,
        pathStart: { ...hotspot.pathStart },
        bearTarget: { ...hotspot.bearTarget },
        path: hotspot.path.map((p) => ({ ...p })),
      }
    }
    return applyBearTargetToHotspot(hotspot, { ...hotspot.bearTarget, ...patch })
  })
}

export function loadMergedValeHotspots(): ValeHotspot[] {
  return mergeHotspotBearTargets(loadBearTargetOverrides())
}

export function resetBearTargetOverrides() {
  saveBearTargetOverrides({})
  return mergeHotspotBearTargets({})
}

function poseDiff(a: ValeBearTarget, b: ValeBearTarget): BearTargetOverride {
  const patch: BearTargetOverride = {}
  if (Math.abs(a.x - b.x) > 0.02) patch.x = a.x
  if (Math.abs(a.z - b.z) > 0.02) patch.z = b.z
  if (Math.abs(a.rotationY - b.rotationY) > 0.02) patch.rotationY = a.rotationY
  return patch
}

export function buildBearTargetOverrides(
  hotspots: ValeHotspot[],
  prev: BearTargetOverrides,
): BearTargetOverrides {
  const next: BearTargetOverrides = { ...prev }

  for (const hotspot of hotspots) {
    const base = VALE_HOTSPOTS.find((h) => h.id === hotspot.id)
    if (!base) continue

    const patch = poseDiff(hotspot.bearTarget, base.bearTarget)
    if (Object.keys(patch).length > 0) next[hotspot.id] = patch
    else delete next[hotspot.id]
  }

  return next
}

export function formatBearTargetExport(hotspots: ValeHotspot[]) {
  const blocks = hotspots.map((h) => {
    const t = h.bearTarget
    return [
      `  // ${h.label}`,
      `  '${h.id}': {`,
      `    x: ${t.x.toFixed(3)},`,
      `    z: ${t.z.toFixed(3)},`,
      `    rotationY: ${t.rotationY.toFixed(3)},`,
      `  },`,
    ].join('\n')
  })
  return `// bearTarget 3D\n{\n${blocks.join('\n')}\n}`
}

export function getValeHotspot(id: string): ValeHotspot | undefined {
  if (VALE_BEAR_TARGET_EDITOR_ENABLED) {
    return loadMergedValeHotspots().find((h) => h.id === id)
  }
  return getGameplayValeHotspot(id)
}
