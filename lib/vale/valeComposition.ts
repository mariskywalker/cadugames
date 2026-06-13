import * as THREE from 'three'
import type { ValeCameraLayout } from './valeCameraLayout'
import { DEFAULT_VALE_CAMERA_LAYOUT } from './valeCameraLayout'
import { VALE_CAMERA, VALE_ISLAND_OFFSET, VALE_USE_REFERENCE_BG } from './valeWorld'

const NATIVE_MAX_XZ = 0.20635
const NATIVE_Y = 0.12

const IMMERSIVE_ISLAND_SIZE = 11
const IMMERSIVE_MIN_SIZE = 7

const LEGACY_DESIRED_SIZE = 5
const LEGACY_MIN_SIZE = 2.2
const LEGACY_PADDING = { x: 0.1, y: 0.1 }

const _camera = new THREE.PerspectiveCamera()
const _target = new THREE.Vector3()
const _point = new THREE.Vector3()

function layoutToCamera(layout: ValeCameraLayout) {
  return {
    position: [layout.posX, layout.posY, layout.posZ] as [number, number, number],
    target: [layout.targetX, layout.targetY, layout.targetZ] as [number, number, number],
    fov: layout.fov,
  }
}

function applyCamera(layout: ValeCameraLayout, aspect: number, fov: number) {
  const cam = layoutToCamera(layout)
  _target.set(...cam.target)
  _camera.fov = fov
  _camera.aspect = aspect
  _camera.position.set(...cam.position)
  _camera.lookAt(_target)
  _camera.updateProjectionMatrix()
  _camera.updateMatrixWorld(true)
}

function legacyIslandFits(
  islandSize: number,
  aspect: number,
  fov: number,
  layout: ValeCameraLayout = DEFAULT_VALE_CAMERA_LAYOUT,
  yOffset = 0,
): boolean {
  const scale = islandSize / NATIVE_MAX_XZ
  const height = NATIVE_Y * scale
  const half = islandSize / 2

  applyCamera(layout, aspect, fov)

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

function immersiveIslandOk(
  islandSize: number,
  aspect: number,
  fov: number,
  layout: ValeCameraLayout = DEFAULT_VALE_CAMERA_LAYOUT,
): boolean {
  const [ox, oy] = VALE_ISLAND_OFFSET
  const scale = islandSize / NATIVE_MAX_XZ
  const height = NATIVE_Y * scale

  applyCamera(layout, aspect, fov)

  const houseBase = new THREE.Vector3(ox, oy, -1.35).project(_camera)
  const houseTop = new THREE.Vector3(ox, height + oy, -1.35).project(_camera)
  const houseCenter = new THREE.Vector3(ox, height * 0.55 + oy, -1.35).project(_camera)

  if (houseTop.y > 0.92) return false
  if (houseCenter.y < 0.0 || houseCenter.y > 0.56) return false
  const houseScreenH = (houseTop.y - houseBase.y) / 2
  if (houseScreenH < 0.22) return false

  return true
}

export function computeValeFovForLayout(aspect: number, baseFov = VALE_CAMERA.fov): number {
  if (VALE_USE_REFERENCE_BG) {
    if (aspect >= 1.55) return baseFov
    if (aspect >= 1.05) return Math.min(baseFov + 6, 62)
    return Math.min(baseFov + 8, 64)
  }
  if (aspect >= 1.55) return baseFov
  if (aspect >= 1.05) return 38
  return 40
}

export function computeValeFov(aspect: number): number {
  return computeValeFovForLayout(aspect, VALE_CAMERA.fov)
}

export function computeIslandTargetSize(
  aspect: number,
  fov = computeValeFov(aspect),
  layout: ValeCameraLayout = DEFAULT_VALE_CAMERA_LAYOUT,
): number {
  if (VALE_USE_REFERENCE_BG) {
    if (immersiveIslandOk(IMMERSIVE_ISLAND_SIZE, aspect, fov, layout)) return IMMERSIVE_ISLAND_SIZE

    let lo = IMMERSIVE_MIN_SIZE
    let hi = IMMERSIVE_ISLAND_SIZE
    while (hi - lo > 0.2) {
      const mid = (lo + hi) / 2
      if (immersiveIslandOk(mid, aspect, fov, layout)) lo = mid
      else hi = mid
    }
    return Math.round(lo * 10) / 10
  }

  if (legacyIslandFits(LEGACY_DESIRED_SIZE, aspect, fov, layout)) return LEGACY_DESIRED_SIZE

  let lo = LEGACY_MIN_SIZE
  let hi = LEGACY_DESIRED_SIZE
  while (hi - lo > 0.03) {
    const mid = (lo + hi) / 2
    if (legacyIslandFits(mid, aspect, fov, layout)) lo = mid
    else hi = mid
  }
  return Math.round(lo * 100) / 100
}

export interface ValeComposition {
  islandSize: number
  fov: number
}

export function computeValeComposition(
  width: number,
  height: number,
  layout: ValeCameraLayout = DEFAULT_VALE_CAMERA_LAYOUT,
): ValeComposition {
  const aspect = width / Math.max(height, 1)
  const fov = computeValeFovForLayout(aspect, layout.fov)
  const islandSize = computeIslandTargetSize(aspect, fov, layout)
  return { islandSize, fov }
}

export function getCameraTargetFromLayout(layout: ValeCameraLayout) {
  return new THREE.Vector3(layout.targetX, layout.targetY, layout.targetZ)
}

export function applyValeCameraToThree(
  camera: THREE.PerspectiveCamera,
  layout: ValeCameraLayout,
  fov: number,
) {
  camera.position.set(layout.posX, layout.posY, layout.posZ)
  camera.fov = fov
  camera.updateProjectionMatrix()
  camera.lookAt(layout.targetX, layout.targetY, layout.targetZ)
}
