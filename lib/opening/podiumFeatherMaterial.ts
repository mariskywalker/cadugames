import * as THREE from 'three'

/** Largura do degradê na transparência (0–1, canal alpha da textura). */
export const OPENING_PODIUM_FEATHER = 0.8

export function createPodiumFeatherMaterial(
  map: THREE.Texture,
  feather = OPENING_PODIUM_FEATHER,
): THREE.MeshBasicMaterial {
  const material = new THREE.MeshBasicMaterial({
    map,
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    depthTest: true,
    fog: false,
    toneMapped: false,
  })

  material.customProgramCacheKey = () => `podium-feather-${feather}`

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uFeather = { value: feather }
    shader.fragmentShader = `uniform float uFeather;\n${shader.fragmentShader}`
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
      diffuseColor.a = smoothstep(0.0, uFeather, diffuseColor.a);`,
    )
    material.userData.shader = shader
  }

  return material
}
