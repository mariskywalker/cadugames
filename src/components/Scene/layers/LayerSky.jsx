import { useMemo } from 'react'
import * as THREE from 'three'
import { ROOM_STUDIO_GRADIENT } from '../../../constants/roomBackdrop'
import { SCENE_HUB } from '../../../constants/sceneLayout'

/**
 * LAYER 0 — céu com degradê idêntico ao CSS (.cadu-room-studio-bg).
 * 0% #E1556C (topo) → 100% #FFA0A8 (base).
 */
export function LayerSky() {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(ROOM_STUDIO_GRADIENT.start) },
      uBottom: { value: new THREE.Color(ROOM_STUDIO_GRADIENT.end) },
    }),
    [],
  )

  return (
    <mesh position={[SCENE_HUB[0], 6, SCENE_HUB[2] - 4]} frustumCulled={false} renderOrder={-20}>
      <sphereGeometry args={[48, 32, 24]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPos;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `}
        fragmentShader={`
          uniform vec3 uTop;
          uniform vec3 uBottom;
          varying vec3 vWorldPos;
          void main() {
            float t = clamp((vWorldPos.y + 4.0) / 26.0, 0.0, 1.0);
            vec3 sky = mix(uBottom, uTop, t);
            gl_FragColor = vec4(sky, 1.0);
          }
        `}
      />
    </mesh>
  )
}
