import { createRef } from 'react'

export const ACTIVITY_BARS_POSITION_KEYS = ['hotspotPosition', 'interactionPoint', 'faceTarget']

export const ACTIVITY_BARS_POINT_KEYS = [
  ...ACTIVITY_BARS_POSITION_KEYS,
  'animationAnchor',
]

export const ACTIVITY_BARS_POINT_LABELS = {
  hotspotPosition: 'Hotspot (amarelo)',
  interactionPoint: 'Ponto de interação (verde)',
  faceTarget: 'Alvo de olhar (azul)',
  animationAnchor: 'Animation anchor (vermelho)',
}

export const activityBarsPointRefs = {
  hotspotPosition: createRef(),
  interactionPoint: createRef(),
  faceTarget: createRef(),
  animationAnchor: createRef(),
}

export function getActivityBarsPointRef(key) {
  return activityBarsPointRefs[key] ?? null
}

export function isAnimationAnchorKey(key) {
  return key === 'animationAnchor'
}
