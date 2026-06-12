import * as THREE from 'three'
import { VALE_CAMERA, VALE_ISLAND_OFFSET, VALE_USE_REFERENCE_BG } from './valeWorld'

const NATIVE_MAX_XZ = 0.20635
const NATIVE_Y = 0.12

const IMMERSIVE_ISLAND_SIZE = 11
const IMMERSIVE_MIN_SIZE = 7

const LEGACY_DESIRED_SIZE = 5
const LEGACY_MIN_SIZE = 2.2
const LEGACY_PADDING = { x: 0.1, y: 0.1 }

const _camera = new THREE.PerspectiveCamera()
const _target = new THREE.Vector3(...VALE_CAMERA.target)
const _point = new THREE.Vector3()

function legacyIslandFits(islandSize: number, aspect: number, fov: number, yOffset = 0): boolean {
  const scale = islandSize / NATIVE_MAX_XZ
  const height = NATIVE_Y * scale
  const half = islandSize / 2

  _camera.fov = fov
  _camera.aspect = aspect
  _camera.position.set(...VALE_CAMERA.position)
  _camera.lookAt(_target)
  _camera.updateProjectionMatrix()
  _camera.updateMatrixWorld(true)

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (const x of [-half, half]) {
    for (const z of [-half, half]) {
      for (const y of [yOffset, height + yOffset]) {
        _point.set(x, y, z).project(_camera)
        minX = Math.min(minX, _point.x)
        maxX = Math.max(maxX, _point.x)
        minY = Math.min(minY, _point.y)
        maxY = Math.max(maxY, _point.y)
      }
    }
  }

  return (
    minX >= -1 + LEGACY_PADDING.x &&
    maxX <= 1 - LEGACY_PADDING.x &&
    minY >= -1 + LEGACY_PADDING.y &&
    maxY <= 1 - LEGACY_PADDING.y
  )
}

function immersiveIslandOk(islandSize: number, aspect: number, fov: number): boolean {
  const [ox, oy] = VALE_ISLAND_OFFSET
  const scale = islandSize / NATIVE_MAX_XZ
  const height = NATIVE_Y * scale

  _camera.fov = fov
  _camera.aspect = aspect
  _camera.position.set(...VALE_CAMERA.position)
  _camera.lookAt(_target)
  _camera.updateProjectionMatrix()
  _camera.updateMatrixWorld(true)

  const houseBase = new THREE.Vector3(ox, oy, -1.35).project(_camera)
  const houseTop = new THREE.Vector3(ox, height + oy, -1.35).project(_camera)
  const houseCenter = new THREE.Vector3(ox, height * 0.55 + oy, -1.35).project(_camera)

  if (houseTop.y > 0.86) return false
  if (houseCenter.y < 0.0 || houseCenter.y > 0.52) return false
  const houseScreenH = (houseTop.y - houseBase.y) / 2
  if (houseScreenH < 0.22) return false

  return true
}

export function computeValeFov(aspect: number): number {
  if (VALE_USE_REFERENCE_BG) {
    if (aspect >= 1.55) return VALE_CAMERA.fov
    if (aspect >= 1.05) return 63
    return 65
  }
  if (aspect >= 1.55) return VALE_CAMERA.fov
  if (aspect >= 1.05) return 38
  return 40
}

export function computeIslandTargetSize(
  aspect: number,
  fov = computeValeFov(aspect),
): number {
  if (VALE_USE_REFERENCE_BG) {
    if (immersiveIslandOk(IMMERSIVE_ISLAND_SIZE, aspect, fov)) return IMMERSIVE_ISLAND_SIZE

    let lo = IMMERSIVE_MIN_SIZE
    let hi = IMMERSIVE_ISLAND_SIZE
    while (hi - lo > 0.2) {
      const mid = (lo + hi) / 2
      if (immersiveIslandOk(mid, aspect, fov)) lo = mid
      else hi = mid
    }
    return Math.round(lo * 10) / 10
  }

  if (legacyIslandFits(LEGACY_DESIRED_SIZE, aspect, fov)) return LEGACY_DESIRED_SIZE

  let lo = LEGACY_MIN_SIZE
  let hi = LEGACY_DESIRED_SIZE
  while (hi - lo > 0.03) {
    const mid = (lo + hi) / 2
    if (legacyIslandFits(mid, aspect, fov)) lo = mid
    else hi = mid
  }
  return Math.round(lo * 100) / 100
}

export interface ValeComposition {
  islandSize: number
  fov: number
}

export function computeValeComposition(width: number, height: number): ValeComposition {
  const aspect = width / Math.max(height, 1)
  const fov = computeValeFov(aspect)
  const islandSize = computeIslandTargetSize(aspect, fov)
  return { islandSize, fov }
}
