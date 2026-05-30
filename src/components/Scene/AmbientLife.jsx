import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useSceneAnimating } from '../../hooks/useSceneAnimating'

const COUNT = 22

function rand01(i, s) {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453123
  return x - Math.floor(x)
}

function CloudPuff({ position, phase }) {
  const g = useRef()
  const animating = useSceneAnimating()

  useFrame((state) => {
    if (!animating || !g.current) return
    const t = state.clock.elapsedTime + phase
    g.current.position.y = position[1] + Math.sin(t * 0.35) * 0.08
    g.current.position.x = position[0] + Math.cos(t * 0.22) * 0.06
  })

  return (
    <group ref={g} position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.42, 8, 6]} />
        <meshToonMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0.32, 0.06, 0.08]} castShadow>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshToonMaterial color="#f1f5f9" />
      </mesh>
      <mesh position={[-0.28, -0.04, 0]} castShadow>
        <sphereGeometry args={[0.24, 8, 6]} />
        <meshToonMaterial color="#e2e8f0" />
      </mesh>
    </group>
  )
}

/**
 * Lightweight instanced sparkles (paused when tab hidden / 2d map mode).
 */
export function AmbientLife() {
  const inst = useRef()
  const animating = useSceneAnimating()
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        x: (rand01(i, 1) * 2 - 1) * 4.5,
        y: 0.8 + rand01(i, 2) * 3.2,
        z: (rand01(i, 3) * 2 - 1) * 3.5 + 1.2,
        s: 0.035 + rand01(i, 4) * 0.045,
        sp: 0.12 + rand01(i, 5) * 0.28,
        ph: rand01(i, 6) * Math.PI * 2,
      })),
    [],
  )

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const run = animating && !reduced

  useFrame((state) => {
    if (!run) return
    const m = inst.current
    if (!m) return
    const t = state.clock.elapsedTime

    for (let i = 0; i < COUNT; i++) {
      const p = seeds[i]
      dummy.position.set(
        p.x + Math.sin(t * p.sp + p.ph) * 0.1,
        p.y + Math.cos(t * p.sp * 0.85 + p.ph) * 0.06,
        p.z,
      )
      const sc = p.s * (0.92 + 0.1 * Math.sin(t * 1.1 + p.ph))
      dummy.scale.set(sc, sc, sc)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={inst} args={[null, null, COUNT]} frustumCulled>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#e0f2fe" transparent opacity={0.45} depthWrite={false} />
      </instancedMesh>

      <CloudPuff position={[-3.4, 3.9, -2.2]} phase={0} />
      <CloudPuff position={[3.8, 4.1, -1.8]} phase={2.1} />
    </group>
  )
}
