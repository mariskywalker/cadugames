import * as THREE from 'three'
import { getCelGradientMapSoft, makeCelMaterial } from '@/lib/opening/celShade'

const _fernWarmGreen = new THREE.Color('#bdd8a4')
const _fernSunTint = new THREE.Color('#ffd8b8')
const _lilacLightBloom = new THREE.Color('#dcc8f0')
const _lilacSunTint = new THREE.Color('#ffe4d8')
const _stumpWood = new THREE.Color('#9a6b42')
const _stumpSunTint = new THREE.Color('#ffd0a0')

function applyCelMesh(
  mesh: THREE.Mesh,
  tuneToon: (toon: THREE.MeshToonMaterial) => void,
) {
  mesh.castShadow = false
  mesh.receiveShadow = false
  mesh.fog = false
  mesh.renderOrder = 12

  const original = mesh.material
  const mats = Array.isArray(original) ? original : [original]
  const next = mats.map((material) => {
    if (!material) return material

    const std = material as THREE.MeshStandardMaterial & THREE.MeshPhongMaterial
    if (std.map) std.map.colorSpace = THREE.SRGBColorSpace

    const toon = makeCelMaterial(material)
    toon.fog = false
    tuneToon(toon)
    return toon
  })

  mesh.material = Array.isArray(original) ? next : next[0]
}

/**
 * Flores importadas: Magnolia/Bouvardia vêm só com baseColor (sem textura embutida).
 * MeshStandard + luz forte do hero estoura o albedo → branco.
 * Toon preserva as cores do GLB e combina com o look do Vale.
 */
export function prepareSceneFlower(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return
    applyCelMesh(mesh, () => {})
  })
}

/** Samambaias — verde mais claro e quente para combinar com o pôr do sol do Vale */
export function prepareSceneFern(root: THREE.Object3D) {
  const softGradient = getCelGradientMapSoft()

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return

    applyCelMesh(mesh, (toon) => {
      toon.gradientMap = softGradient
      toon.color.lerp(_fernWarmGreen, 0.16)
      toon.color.multiplyScalar(1.06)
      toon.emissive.copy(_fernSunTint)
      toon.emissiveIntensity = 0.045
    })
  })
}

/** Lilás — flores mais claras e tom quente para harmonizar com a luz do Vale */
export function prepareSceneLilac(root: THREE.Object3D) {
  const softGradient = getCelGradientMapSoft()

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return

    applyCelMesh(mesh, (toon) => {
      toon.gradientMap = softGradient
      toon.color.lerp(_lilacLightBloom, 0.18)
      toon.color.multiplyScalar(1.07)
      toon.emissive.copy(_lilacSunTint)
      toon.emissiveIntensity = 0.05
    })
  })
}

/** Toco de árvore — preserva BaseColor/Roughness do OBJ quando existirem */
export function prepareSceneStump(root: THREE.Object3D) {
  const softGradient = getCelGradientMapSoft()

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return

    applyCelMesh(mesh, (toon) => {
      toon.gradientMap = softGradient
      if (toon.map) {
        toon.color.set('#ffffff')
        toon.emissive.copy(_stumpSunTint)
        toon.emissiveIntensity = 0.03
      } else {
        toon.color.lerp(_stumpWood, 0.42)
        toon.color.multiplyScalar(0.98)
        toon.emissive.copy(_stumpSunTint)
        toon.emissiveIntensity = 0.04
      }
    })
  })
}
