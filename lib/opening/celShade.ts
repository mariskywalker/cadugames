import * as THREE from 'three'

let gradientMap: THREE.DataTexture | null = null
let softGradientMap: THREE.DataTexture | null = null

function buildGradientMap(data: [number, number, number]) {
  const texture = new THREE.DataTexture(new Uint8Array(data), 3, 1, THREE.RedFormat)
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  texture.needsUpdate = true
  return texture
}

export function getCelGradientMap() {
  if (!gradientMap) gradientMap = buildGradientMap([18, 118, 255])
  return gradientMap
}

/** Sombras mais marcadas — lilás e samambaias no Vale */
export function getCelGradientMapSoft() {
  if (!softGradientMap) softGradientMap = buildGradientMap([22, 118, 255])
  return softGradientMap
}

export function makeCelMaterial(sourceMat: THREE.Material) {
  if (!sourceMat) {
    return new THREE.MeshToonMaterial({
      color: '#e2e8f0',
      gradientMap: getCelGradientMap(),
    })
  }

  const userData = sourceMat.userData as { __celMat?: THREE.MeshToonMaterial }
  if (userData.__celMat) return userData.__celMat

  const stdMat = sourceMat as THREE.MeshStandardMaterial
  const color = stdMat.color?.clone?.() ?? new THREE.Color('#e2e8f0')
  const map = stdMat.map ?? null

  const toon = new THREE.MeshToonMaterial({
    color,
    map,
    gradientMap: getCelGradientMap(),
  })
  if (map) toon.map!.colorSpace = THREE.SRGBColorSpace

  sourceMat.userData = { ...sourceMat.userData, __celMat: toon }
  return toon
}
