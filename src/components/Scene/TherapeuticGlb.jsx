import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useCADUStore } from '../../store/useCADUStore'
import { useSceneAnimating } from '../../hooks/useSceneAnimating'
import { makeCelMaterial } from '../../utils/celShade'

const DEFAULT_CHARACTER_H = 1.1

export function TherapeuticGlb({
  url,
  position,
  rotation,
  targetHeight,
  scaleToCharacter = false,
  characterScaleMode = 'fit',
  characterHeightMult = 0.5,
  characterWidthMult = 1.6,
  scaleMult = 1,
  renderOrder = null,
  sway = null,
}) {
  const animRef = useRef()
  const matCache = useRef(new WeakMap())
  const animating = useSceneAnimating()
  const characterSize = useCADUStore((s) => s.characterSize)
  const { scene } = useGLTF(url)

  useEffect(() => {
    const cache = matCache.current
    scene.traverse((obj) => {
      if (!obj?.isMesh) return
      obj.castShadow = true
      obj.receiveShadow = true
      const original = obj.material
      const mats = Array.isArray(original) ? original : [original]
      const next = mats.map((mat) => {
        if (!mat) return mat
        const hit = cache.get(mat)
        if (hit) return hit
        const cel = makeCelMaterial(mat)
        cache.set(mat, cel)
        return cel
      })
      obj.material = Array.isArray(original) ? next : next[0]
      if (renderOrder != null) obj.renderOrder = renderOrder
    })
  }, [scene, renderOrder])

  const yOffset = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    if (!Number.isFinite(box.min.y)) return 0
    return -box.min.y
  }, [scene])

  const modelScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    if (scaleToCharacter) {
      const ch = characterSize?.h ?? DEFAULT_CHARACTER_H
      const targetH = ch * characterHeightMult
      const targetW = ch * characterWidthMult
      const sy = targetH / Math.max(size.y, 0.0001)
      const sx = targetW / Math.max(size.x, size.z, 0.0001)
      if (characterScaleMode === 'height') return Math.max(0.12, sy)
      if (characterScaleMode === 'width') return Math.max(0.12, sx)
      return Math.max(0.12, Math.min(sx, sy))
    }
    const s = (targetHeight ?? DEFAULT_CHARACTER_H) / Math.max(size.y, 0.0001)
    return Math.max(0.2, s)
  }, [
    scene,
    targetHeight,
    scaleToCharacter,
    characterSize,
    characterScaleMode,
    characterHeightMult,
    characterWidthMult,
    scaleMult,
  ])

  const finalScale = modelScale * scaleMult

  useFrame((state) => {
    if (!animating || !sway || !animRef.current) return
    const t = state.clock.elapsedTime * (sway.speed ?? 0.5)
    animRef.current.rotation.z = Math.sin(t) * (sway.z ?? 0.02)
    animRef.current.rotation.x = Math.sin(t * 0.82 + 0.5) * (sway.x ?? 0.01)
  })

  return (
    <group position={position} rotation={rotation} scale={finalScale}>
      <group ref={animRef} position={[0, yOffset, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  )
}
