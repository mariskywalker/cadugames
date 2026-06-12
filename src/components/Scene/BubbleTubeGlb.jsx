import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { BUBBLE_TUBE_GLB_TARGET_HEIGHT, BUBBLE_TUBE_GLB_URL } from '../../constants/bubbleTube'
import { makeCelMaterial } from '../../utils/celShade'

function applyCelShade(root, cache) {
  root.traverse((obj) => {
    if (!obj?.isMesh) return
    obj.castShadow = true
    obj.receiveShadow = true
    const original = obj.material
    const materials = Array.isArray(original) ? original : [original]
    const nextMaterials = materials.map((mat) => {
      if (!mat) return mat
      const cached = cache.get(mat)
      if (cached) return cached
      const cel = makeCelMaterial(mat)
      cache.set(mat, cel)
      return cel
    })
    obj.material = Array.isArray(original) ? nextMaterials : nextMaterials[0]
  })
}

/** Mirror on X so baked one-sided bubbles fill the tube interior. */
function buildMirroredTwin(source) {
  const twin = source.clone(true)
  twin.scale.x = -1
  twin.traverse((obj) => {
    if (!obj?.isMesh) return
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
    const next = mats.map((m) => {
      if (!m) return m
      const c = m.clone()
      c.side = THREE.DoubleSide
      return c
    })
    obj.material = Array.isArray(obj.material) ? next : next[0]
  })
  return twin
}

/**
 * Loads the bubble-tube GLB from public/models and scales it to scene height.
 * Includes an X-mirrored copy so bubble geometry reads on both sides.
 */
export function BubbleTubeGlb({ onMetrics }) {
  const rootRef = useRef()
  const matCache = useRef(new WeakMap())
  const { scene } = useGLTF(BUBBLE_TUBE_GLB_URL)

  const tubeGroup = useMemo(() => {
    const original = scene.clone(true)
    applyCelShade(original, matCache.current)

    const group = new THREE.Group()
    group.add(original)
    group.add(buildMirroredTwin(original))

    return group
  }, [scene])

  const transform = useMemo(() => {
    const box = new THREE.Box3().setFromObject(tubeGroup)
    const size = new THREE.Vector3()
    box.getSize(size)
    if (!Number.isFinite(size.y) || size.y < 0.001) {
      return {
        scale: 1,
        yOffset: 0,
        innerRadius: 0.72,
        outerRadius: 0.95,
        height: BUBBLE_TUBE_GLB_TARGET_HEIGHT,
      }
    }
    const scale = BUBBLE_TUBE_GLB_TARGET_HEIGHT / size.y
    const outerRadius = Math.max(size.x, size.z) * 0.5 * scale
    const innerRadius = outerRadius * 0.72
    return {
      scale,
      yOffset: -box.min.y * scale,
      innerRadius,
      outerRadius,
      height: size.y * scale,
    }
  }, [tubeGroup])

  useEffect(() => {
    onMetrics?.(transform)
  }, [transform, onMetrics])

  return (
    <group ref={rootRef} scale={transform.scale} position={[0, transform.yOffset, 0]}>
      <primitive object={tubeGroup} />
    </group>
  )
}

useGLTF.preload(BUBBLE_TUBE_GLB_URL)
