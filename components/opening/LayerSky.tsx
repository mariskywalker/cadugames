'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { ROOM_STUDIO_GRADIENT } from '@/lib/opening/roomBackdrop'

export function LayerSky({ opacity = 1 }: { opacity?: number }) {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(ROOM_STUDIO_GRADIENT.start) },
      uMid: { value: new THREE.Color(ROOM_STUDIO_GRADIENT.mid) },
      uBlend: { value: new THREE.Color(ROOM_STUDIO_GRADIENT.blend) },
      uBottom: { value: new THREE.Color(ROOM_STUDIO_GRADIENT.end) },
      uOpacity: { value: opacity },
    }),
    [opacity],
  )

  return (
    <mesh position={[0, 4.8, -12]} frustumCulled={false} renderOrder={-11_000}>
      <sphereGeometry args={[36, 32, 20]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        transparent
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
          uniform float uOpacity;
          varying vec3 vWorldPos;
          void main() {
            float t = clamp((vWorldPos.y + 2.0) / 24.0, 0.0, 1.0);
            vec3 sky = t < 0.38
              ? mix(uBottom, uBlend, t / 0.38)
              : t < 0.68
                ? mix(uBlend, uMid, (t - 0.38) / 0.30)
                : mix(uMid, uTop, (t - 0.68) / 0.32);
            gl_FragColor = vec4(sky, uOpacity);
          }
        `}
      />
    </mesh>
  )
}
