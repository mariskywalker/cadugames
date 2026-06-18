import { getValeWalkPathPoints } from './valeWalkable'
import type { ValeHotspotWaypoint } from './valeHotspots'

/** ID interno da jornada de abertura — urso caminha uma vez até a casa */
export const NARRATIVE_INTRO_JOURNEY_ID = 'narrative-intro'

/** false = urso parado no spawn, virado à câmera (sem caminhada automática) */
export const VALE_NARRATIVE_WALK_ENABLED = false

const CAMERA_X = 0.25
const CAMERA_Z = 8.5

function rotToward(ax: number, az: number, bx: number, bz: number) {
  return Math.atan2(bx - ax, bz - az)
}

/** Pose estática do Cadu no início do caminho — olhando para a câmera */
export function getBearHeroIdlePose(): { x: number; z: number; rotationY: number } {
  const spawn = getValeWalkPathPoints()[0] ?? { x: -3.15, z: 0.52, id: 'walk-spawn' }
  return {
    x: spawn.x,
    z: spawn.z,
    rotationY: rotToward(spawn.x, spawn.z, CAMERA_X, CAMERA_Z),
  }
}

/** Caminho único: pontos do editor de trajeto → para virado à câmera */
export function buildNarrativeIntroPath(): ValeHotspotWaypoint[] {
  const walkPts = getValeWalkPathPoints()
  const route: ValeHotspotWaypoint[] = walkPts.map((p, i) => {
    const next = walkPts[Math.min(i + 1, walkPts.length - 1)]!
    const prev = walkPts[Math.max(0, i - 1)]!
    const target = i < walkPts.length - 1 ? next : prev
    return {
      x: p.x,
      z: p.z,
      rotationY: rotToward(p.x, p.z, target.x, target.z),
    }
  })

  const last = route[route.length - 1]
  if (last) {
    const faceCamera = rotToward(last.x, last.z, CAMERA_X, CAMERA_Z)
    route[route.length - 1] = { ...last, rotationY: faceCamera }
  }

  return route
}

export function getNarrativeIntroArriveTarget(): ValeHotspotWaypoint {
  const path = buildNarrativeIntroPath()
  return path[path.length - 1] ?? { x: -3.15, z: 0.52, rotationY: 0 }
}
