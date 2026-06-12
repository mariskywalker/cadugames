import * as THREE from 'three'
import { copyAnimationAnchor } from '../constants/activityBarsDefaults'

export function applyAnimationAnchor(group, anchor) {
  const copy = copyAnimationAnchor(anchor)
  if (!group || !copy) return false
  const [px, py, pz] = copy.position
  const [rx, ry, rz] = copy.rotation
  group.position.set(px, py ?? 0, pz)
  group.rotation.set(rx, ry, rz)
  group.quaternion.setFromEuler(new THREE.Euler(rx, ry, rz))
  group.updateMatrixWorld(true)
  return true
}

/** Aplica somente activityBarsConfig.animationAnchor — nunca interactionPoint. */
export function lockGroupToConfigAnimationAnchor(group, config) {
  if (!config?.animationAnchor) return false
  return applyAnimationAnchor(group, config.animationAnchor)
}

export function resetModelRoot(model) {
  if (!model) return
  model.position.set(0, 0, 0)
  model.rotation.set(0, 0, 0)
}

export function pinGroupToPoint(group, point) {
  if (!group || !point) return
  group.position.set(point[0], point[1] ?? 0, point[2])
}

export function anchorFromGroup(group) {
  if (!group) return null
  return {
    position: [
      +group.position.x.toFixed(4),
      +group.position.y.toFixed(4),
      +group.position.z.toFixed(4),
    ],
    rotation: [
      +group.rotation.x.toFixed(4),
      +group.rotation.y.toFixed(4),
      +group.rotation.z.toFixed(4),
    ],
  }
}

export function formatWorldPos(pos) {
  if (!pos) return null
  return {
    x: +pos[0]?.toFixed(3),
    y: +pos[1]?.toFixed(3),
    z: +pos[2]?.toFixed(3),
  }
}

export function logBarsPosition(label, pos) {
  console.log(`[CADU Bars] ${label}:`, formatWorldPos(pos))
}

export function logBarsGroupPosition(label, group) {
  if (!group) return
  logBarsPosition(label, [group.position.x, group.position.y, group.position.z])
}
