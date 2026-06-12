'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { ROOM_STUDIO_GRADIENT } from '@/lib/opening/roomBackdrop'
import { SCENE_HUB } from '@/lib/opening/sceneLayout'

export function LayerSky() {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(ROOM_STUDIO_GRADIENT.start) },
      uMid: { value: new THREE.Color(ROOM_STUDIO_GRADIENT.mid) },
      uBlend: { value: new THREE.Color(ROOM_STUDIO_GRADIENT.blend) },
      uBottom: { value: new THREE.Color(ROOM_STUDIO_GRADIENT.end) },
    }),
    [],
  )

  return (
    <mesh position={[SCENE_HUB[0], 5.5, SCENE_HUB[2] - 10]} frustumCulled={false} renderOrder={-35}>
      <sphereGeometry args={[36, 32, 20]} />
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
          uniform vec3 uMid;
          uniform vec3 uBlend;
          uniform vec3 uBottom;
          varying vec3 vWorldPos;
          void main() {
            float t = clamp((vWorldPos.y + 2.0) / 24.0, 0.0, 1.0);
            vec3 sky = t < 0.38
              ? mix(uBottom, uBlend, t / 0.38)
              : t < 0.68
                ? mix(uBlend, uMid, (t - 0.38) / 0.30)
                : mix(uMid, uTop, (t - 0.68) / 0.32);
            float pinkWash = smoothstep(0.35, 0.95, vWorldPos.x * 0.04 + 0.5) * 0.08;
            sky = mix(sky, vec3(0.98, 0.78, 0.80), pinkWash);
            gl_FragColor = vec4(sky, 1.0);
          }
        `}
      />
    </mesh>
  )
}
