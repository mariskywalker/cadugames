import * as THREE from 'three'
import type { Object3D, PerspectiveCamera } from 'three'

/** Move object so the center of its world bounding box sits at the origin. */
export function centerObjectAtOrigin(object: Object3D): THREE.Box3 {
  const box = new THREE.Box3().setFromObject(object)
  const center = box.getCenter(new THREE.Vector3())
  object.position.sub(center)
  object.updateMatrixWorld(true)
  return new THREE.Box3().setFromObject(object)
}

/** Fit a perspective camera to show the full bounding box (no clipping). */
export function fitPerspectiveCameraToBox(
  camera: PerspectiveCamera,
  box: THREE.Box3,
  aspect: number,
  margin = 1.12,
) {
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  const fovRad = (camera.fov * Math.PI) / 180
  const halfFov = fovRad / 2

  const fitHeightDistance = size.y / (2 * Math.tan(halfFov))
  const fitWidthDistance = size.x / (2 * Math.tan(halfFov) * aspect)
  const distance = margin * Math.max(fitHeightDistance, fitWidthDistance)

  camera.position.set(center.x, center.y, center.z + distance)
  camera.near = Math.max(0.01, distance / 500)
  camera.far = distance * 500
  camera.lookAt(center.x, center.y, center.z)
  camera.updateProjectionMatrix()

  return distance
}
