import * as THREE from 'three'

/**
 * Preserva a iluminação natural do GLB (emissive bake + texturas PBR).
 * O asset vale-palavras-lite.glb traz emissiveTexture e maps calibrados na exportação.
 */
export function prepareGlbImportedLighting(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return

    mesh.castShadow = false
    mesh.receiveShadow = false

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const material of materials) {
      if (!material || !(material as THREE.MeshStandardMaterial).isMeshStandardMaterial) continue
      const mat = material as THREE.MeshStandardMaterial

      if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace
      if (mat.emissiveMap) {
        mat.emissiveMap.colorSpace = THREE.SRGBColorSpace
        mat.emissiveIntensity = 1.35
      }
      if (mat.normalMap) mat.normalMap.colorSpace = THREE.NoColorSpace
      if (mat.metalnessMap) mat.metalnessMap.colorSpace = THREE.NoColorSpace
      if (mat.roughnessMap) mat.roughnessMap.colorSpace = THREE.NoColorSpace

      mat.envMapIntensity = 0
      mat.needsUpdate = true
    }
  })
}
