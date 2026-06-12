import { useMemo } from 'react'
import * as THREE from 'three'
import { ROOM_STUDIO_GRADIENT } from '../../constants/roomBackdrop'
import { SCENE_HUB } from '../../constants/sceneLayout'

const VERTEX = /* glsl */ `
#include <fog_pars_vertex>
varying vec3 vWorldPos;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPos = world.xyz;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`

/** Degradê linear vertical absoluto (Figma 0% → 100%). */
const GRADIENT_SHELL_FRAGMENT = /* glsl */ `
#include <fog_pars_fragment>
uniform vec3 uStart;
uniform vec3 uEnd;
uniform vec3 uCenter;

varying vec3 vWorldPos;

void main() {
  vec3 dir = normalize(vWorldPos - uCenter);
  float t = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
  t = smoothstep(0.0, 1.0, t);
  vec3 col = mix(uStart, uEnd, t);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}
`

export function InfiniteGround() {
  const skyCenter = useMemo(
    () => new THREE.Vector3(SCENE_HUB[0], 0.35, SCENE_HUB[2]),
    [],
  )

  const shellMat = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      toneMapped: false,
      depthWrite: true,
      fog: true,
      side: THREE.BackSide,
      uniforms: {
        uStart: { value: new THREE.Color(ROOM_STUDIO_GRADIENT.start) },
        uEnd: { value: new THREE.Color(ROOM_STUDIO_GRADIENT.end) },
        uCenter: { value: skyCenter },
      },
      vertexShader: VERTEX,
      fragmentShader: GRADIENT_SHELL_FRAGMENT,
    })
    return mat
  }, [skyCenter])

  return (
    <mesh position={[0, 0, SCENE_HUB[2]]} material={shellMat}>
      <sphereGeometry args={[85, 48, 32]} />
    </mesh>
  )
}
