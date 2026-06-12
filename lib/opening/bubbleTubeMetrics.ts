import * as THREE from 'three'
import type { Object3D } from 'three'

const _v = new THREE.Vector3()

export function measureBubbleTubeGeometry(root: Object3D) {
  const box = new THREE.Box3().setFromObject(root)
  const size = new THREE.Vector3()
  box.getSize(size)

  if (!Number.isFinite(size.y) || size.y < 0.001) {
    return {
      localMinY: 0,
      localMaxY: 4,
      localCenterY: 2,
      localShellHeight: 3.4,
      localInnerRadius: 0.55,
      localOuterRadius: 0.72,
      localBaseTopY: 0.88,
    }
  }

  const yPad = size.y * 0.12
  const yLo = box.min.y + yPad
  const yHi = box.max.y - yPad
  const radii: number[] = []

  root.updateMatrixWorld(true)
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return
    const pos = mesh.geometry?.attributes?.position
    if (!pos) return
    for (let i = 0; i < pos.count; i++) {
      _v.fromBufferAttribute(pos, i)
      _v.applyMatrix4(mesh.matrixWorld)
      if (_v.y < yLo || _v.y > yHi) continue
      const r = Math.hypot(_v.x, _v.z)
      if (r > 0.02) radii.push(r)
    }
  })

  radii.sort((a, b) => a - b)

  const outerFromBbox = Math.min(size.x, size.z) * 0.5
  let innerRadius = outerFromBbox * 0.78

  if (radii.length > 24) {
    const p20 = radii[Math.floor(radii.length * 0.2)]
    const p55 = radii[Math.floor(radii.length * 0.55)]
    innerRadius = THREE.MathUtils.lerp(p20, p55, 0.35)
  }

  innerRadius = THREE.MathUtils.clamp(innerRadius, outerFromBbox * 0.52, outerFromBbox * 0.9)

  const totalH = size.y
  const baseSolidH = totalH * 0.22
  const topTrim = totalH * 0.08
  const shellMinY = box.min.y + baseSolidH
  const shellMaxY = box.max.y - topTrim
  const shellHeight = Math.max(shellMaxY - shellMinY, totalH * 0.5)
  const shellCenterY = (shellMinY + shellMaxY) * 0.5

  return {
    localMinY: box.min.y,
    localMaxY: box.max.y,
    localCenterY: shellCenterY,
    localShellHeight: shellHeight,
    localInnerRadius: innerRadius * 0.96,
    localOuterRadius: outerFromBbox,
    localBaseTopY: box.min.y + baseSolidH,
  }
}
