import * as THREE from 'three'

let gradientMap = null

/** Shared 3-step gradient for MeshToonMaterial (cel-shaded look). */
export function getCelGradientMap() {
  if (!gradientMap) {
    const data = new Uint8Array([32, 140, 255])
    gradientMap = new THREE.DataTexture(data, 3, 1, THREE.RedFormat)
    gradientMap.minFilter = THREE.NearestFilter
    gradientMap.magFilter = THREE.NearestFilter
    gradientMap.needsUpdate = true
  }
  return gradientMap
}

/**
 * Convert any mesh material to kid-friendly cel/toon shading while keeping albedo maps.
 */
export function makeCelMaterial(sourceMat) {
  if (!sourceMat) {
    return new THREE.MeshToonMaterial({
      color: '#e2e8f0',
      gradientMap: getCelGradientMap(),
    })
  }

  const cached = sourceMat.userData?.__celMat
  if (cached) return cached

  const color = sourceMat.color?.clone?.() ?? new THREE.Color('#e2e8f0')
  const map = sourceMat.map ?? null

  const toon = new THREE.MeshToonMaterial({
    color,
    map,
    gradientMap: getCelGradientMap(),
  })
  if (map) toon.map.colorSpace = THREE.SRGBColorSpace

  sourceMat.userData = { ...sourceMat.userData, __celMat: toon }
  return toon
}

export function applyCelToObject(root) {
  root.traverse((obj) => {
    if (!obj?.isMesh) return
    const original = obj.material
    const mats = Array.isArray(original) ? original : [original]
    const next = mats.map((m) => (m ? makeCelMaterial(m) : m))
    obj.material = Array.isArray(original) ? next : next[0]
    obj.castShadow = true
    obj.receiveShadow = true
  })
}
