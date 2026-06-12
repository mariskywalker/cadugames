import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { DustParticles } from '../DustParticles'
import { useSceneAnimating } from '../../../hooks/useSceneAnimating'
import { SCENE_HUB } from '../../../constants/sceneLayout'
import { PALETTE } from '../../../constants/palette'

function rand01(i, s) {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453123
  return x - Math.floor(x)
}

function MagicSparkles({ count = 22 }) {
  const inst = useRef()
  const animating = useSceneAnimating()
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (rand01(i, 1) * 2 - 1) * 5,
        y: 0.6 + rand01(i, 2) * 3.5,
        z: SCENE_HUB[2] + (rand01(i, 3) * 2 - 1) * 4,
        s: 0.03 + rand01(i, 4) * 0.05,
        sp: 0.15 + rand01(i, 5) * 0.35,
        ph: rand01(i, 6) * Math.PI * 2,
      })),
    [count],
  )

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const run = animating && !reduced

  useFrame((state) => {
    if (!run) return
    const m = inst.current
    if (!m) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const p = seeds[i]
      dummy.position.set(
        p.x + Math.sin(t * p.sp + p.ph) * 0.12,
        p.y + Math.cos(t * p.sp * 0.85 + p.ph) * 0.08,
        p.z,
      )
      const sc = p.s * (0.9 + 0.12 * Math.sin(t * 1.2 + p.ph))
      dummy.scale.set(sc, sc, sc)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={inst} args={[null, null, count]} frustumCulled renderOrder={8}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#fef9c3" transparent opacity={0.5} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  )
}

function HubSoftGlow() {
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: PALETTE.ledGlow,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  return (
    <mesh position={[SCENE_HUB[0], 0.04, SCENE_HUB[2]]} rotation-x={-Math.PI / 2} material={mat} renderOrder={1}>
      <circleGeometry args={[3.2, 48]} />
    </mesh>
  )
}

/**
 * LAYER 5 — sparkles, tube dust, soft hub glow.
 */
export function LayerMagic({ calm = false }) {
  return (
    <group>
      <DustParticles count={calm ? 140 : 220} />
      <MagicSparkles count={calm ? 12 : 22} />
      <HubSoftGlow />
    </group>
  )
}
