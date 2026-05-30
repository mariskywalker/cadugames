import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { BUBBLE_TUBE_CENTER, BUBBLE_TUBE_HEIGHT } from '../../constants/animations'

export function DustParticles({ count = 220 }) {
  const pointsRef = useRef()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#7dd3fc') },
    }),
    [],
  )

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // only near tube light (small cylinder-ish volume)
      const a = (i / count) * Math.PI * 12.0
      const r = 0.2 + (i % 13) * 0.012
      const x = BUBBLE_TUBE_CENTER[0] + Math.cos(a) * r
      const z = BUBBLE_TUBE_CENTER[2] + Math.sin(a) * r
      const y = 0.25 + ((i * 37) % 100) / 100 * (BUBBLE_TUBE_HEIGHT * 0.95)
      arr[i * 3 + 0] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
    }
    return arr
  }, [count])

  const seeds = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) arr[i] = (i * 0.137) % 1
    return arr
  }, [count])

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    const pts = pointsRef.current
    if (!pts) return
    // tiny drift: update positions in-place (cheap)
    const t = state.clock.elapsedTime
    const attr = pts.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      const s = seeds[i]
      const ix = i * 3
      const baseX = positions[ix + 0]
      const baseY = positions[ix + 1]
      const baseZ = positions[ix + 2]
      attr.array[ix + 0] = baseX + Math.sin(t * 0.12 + s * 12.0) * 0.03
      attr.array[ix + 1] = baseY + Math.cos(t * 0.10 + s * 9.0) * 0.02
      attr.array[ix + 2] = baseZ + Math.sin(t * 0.11 + s * 7.0) * 0.03
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying float vA;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            float d = length(mv.xyz);
            // size falls off with distance (soft)
            gl_PointSize = (7.0 / max(1.0, d)) * (0.75 + 0.25 * sin(uTime * 0.6 + position.y));
            gl_Position = projectionMatrix * mv;
            vA = clamp(1.0 - d * 0.22, 0.0, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vA;
          void main() {
            vec2 p = gl_PointCoord.xy - 0.5;
            float r = dot(p,p);
            // soft dot, no hard "UI" edge
            float a = smoothstep(0.25, 0.0, r);
            gl_FragColor = vec4(uColor, a * 0.22 * vA);
          }
        `}
      />
    </points>
  )
}

