import * as THREE from 'three'
import { SCENE_OBJECTS, sceneObjectDefaults } from '../constants/sceneComposition'
import { loadSceneEditorOverrides } from './sceneEditorStorage'
import { mergeSceneTransform } from './sceneEditorStorage'

export function getStationTransform(stationId) {
  const def = SCENE_OBJECTS[stationId]
  if (!def) return null
  const overrides = loadSceneEditorOverrides()
  return mergeSceneTransform(sceneObjectDefaults(def), overrides[stationId])
}

/** Converte ponto local da estação → mundo (respeita posição/rotação da barra). */
export function localPointToWorld(local, stationTransform) {
  const [rx, ry, rz] = stationTransform.rotation
  const euler = new THREE.Euler(rx, ry, rz, 'XYZ')
  const v = new THREE.Vector3(local[0], local[1], local[2]).applyEuler(euler)
  return [
    stationTransform.position[0] + v.x,
    stationTransform.position[1] + v.y,
    stationTransform.position[2] + v.z,
  ]
}

export function localRotationYToWorld(localY, stationTransform) {
  return (stationTransform.rotation[1] ?? 0) + localY
}

export function resolveStationAction(stationId, action) {
  const transform = getStationTransform(stationId)
  if (!transform || !action) return null
  return {
    position: localPointToWorld(action.position, transform),
    rotationY: localRotationYToWorld(action.rotationY ?? 0, transform),
  }
}
