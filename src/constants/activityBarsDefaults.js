import activityBarsJson from '../config/activityBars.json'

/** Defaults do JSON — runtime usa activityBarsConfig (localStorage). */
export const DEFAULT_ACTIVITY_BARS_CONFIG = {
  hotspotPosition: [...activityBarsJson.hotspotPosition],
  interactionPoint: [...activityBarsJson.interactionPoint],
  faceTarget: [...activityBarsJson.faceTarget],
  animationAnchor: {
    position: [...activityBarsJson.animationAnchor.position],
    rotation: [...activityBarsJson.animationAnchor.rotation],
  },
  animationSequence: [...activityBarsJson.animationSequence],
}

export function copyActivityBarsPoint(point) {
  if (!Array.isArray(point) || point.length < 3) return null
  return [point[0], point[1], point[2]]
}

export function copyAnimationAnchor(anchor) {
  if (!anchor?.position) return null
  const position = copyActivityBarsPoint(anchor.position)
  if (!position) return null
  const rotation = Array.isArray(anchor.rotation) && anchor.rotation.length === 3
    ? [...anchor.rotation]
    : [0, 0, 0]
  return { position, rotation }
}
