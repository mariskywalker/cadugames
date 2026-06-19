'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { Group } from 'three'
import { OPENING_ASSETS } from '@/lib/opening/assets'
import { CHARACTER_Y_OFFSET } from '@/lib/opening/animations'
import { OPENING_INTERACTIVE_RENDER_ORDER } from '@/lib/opening/openingSceneEditorLayout'
import { makeCelMaterial } from '@/lib/opening/celShade'
import {
  getCanonicalClipName,
  getEffectiveCanonicalClipNames,
} from '@/lib/opening/glbClipRenameMap'
import { useCharacterAnimations } from '@/hooks/opening/useCharacterAnimations'
import { useCharacterMovement } from '@/hooks/opening/useCharacterMovement'
import { useOpeningStore } from '@/store/useOpeningStore'

export function CharacterController({
  scale = 1,
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}) {
  const clearTarget = useOpeningStore((s) => s.clearTarget)
  const resetToIdle = useOpeningStore((s) => s.resetToIdle)
  const setModelStatus = useOpeningStore((s) => s.setModelStatus)
  const group = useRef<Group>(null)
  const bodyRef = useRef<Group>(null)
  const modelRef = useRef<Group>(null)
  const materialCacheRef = useRef(new WeakMap<THREE.Material, THREE.MeshToonMaterial>())

  const modelUrl = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      return `${OPENING_ASSETS.bear}?v=opening`
    }
    return OPENING_ASSETS.bear
  }, [])

  useEffect(() => {
    useGLTF.preload(modelUrl)
  }, [modelUrl])

  useEffect(() => {
    setModelStatus('loading')
  }, [setModelStatus])

  const { scene, animations } = useGLTF(modelUrl)
  const { actions, names, mixer } = useAnimations(animations, modelRef)

  const characterState = useOpeningStore((s) => s.characterState)
  const targetPosition = useOpeningStore((s) => s.targetPosition)
  const setCharacterState = useOpeningStore((s) => s.setCharacterState)
  const modelStatus = useOpeningStore((s) => s.modelStatus)
  const animationClips = useOpeningStore((s) => s.animationClips)
  const setAnimationClips = useOpeningStore((s) => s.setAnimationClips)
  const setCharacterSize = useOpeningStore((s) => s.setCharacterSize)

  const clipsReady = modelStatus === 'loaded' && names.length > 0

  useEffect(() => {
    const rawClipNames = animations?.map((clip) => clip.name) ?? []
    const canonicalClips = [
      ...new Set(rawClipNames.map((name) => getCanonicalClipName(name)).filter(Boolean)),
    ].sort()
    setAnimationClips(canonicalClips.length ? canonicalClips : getEffectiveCanonicalClipNames())
  }, [animations, setAnimationClips])

  useEffect(() => {
    // Mede só uma vez por sessão: em visitas seguintes o esqueleto está em pose
    // de animação e o bbox sai menor, encolhendo os objetos proporcionais ao urso.
    if (useOpeningStore.getState().characterSize) return
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    if (Number.isFinite(size.x) && Number.isFinite(size.y) && Number.isFinite(size.z)) {
      setCharacterSize({ w: size.x, h: size.y, d: size.z })
    }
  }, [scene, setCharacterSize])

  useEffect(() => {
    setModelStatus('loaded')
    resetToIdle()
  }, [setModelStatus, resetToIdle, scene])

  useEffect(() => {
    clearTarget()
    resetToIdle()
    const g = group.current
    if (!g) return
    g.position.set(position[0], position[1], position[2])
    g.rotation.set(rotation[0], rotation[1], rotation[2])
    g.quaternion.setFromEuler(new THREE.Euler(rotation[0], rotation[1], rotation[2]))
  }, [clearTarget, resetToIdle, position, rotation])

  useCharacterMovement({ groupRef: group, setCharacterState })

  useCharacterAnimations({
    actions,
    mixer,
    clipsReady,
    characterState,
    targetPosition,
    animationClips,
  })

  useEffect(() => {
    const cache = materialCacheRef.current
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh?.isMesh) return
      mesh.castShadow = true
      mesh.receiveShadow = true
      const original = mesh.material
      const materials = Array.isArray(original) ? original : [original]
      const nextMaterials = materials.map((mat) => {
        if (!mat) return mat
        const cached = cache.get(mat)
        if (cached) return cached
        const cel = makeCelMaterial(mat)
        cache.set(mat, cel)
        return cel
      })
      mesh.material = Array.isArray(original) ? nextMaterials : nextMaterials[0]
      mesh.renderOrder = OPENING_INTERACTIVE_RENDER_ORDER
    })
  }, [scene])

  const groundedYOffset = useMemo(() => {
    const box = new THREE.Box3()
    const tmp = new THREE.Box3()

    scene.updateWorldMatrix(true, true)
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh?.isMesh || !mesh.geometry) return
      const geom = mesh.geometry
      if (!geom.boundingBox) geom.computeBoundingBox()
      if (!geom.boundingBox) return
      tmp.copy(geom.boundingBox)
      tmp.applyMatrix4(mesh.matrixWorld)
      box.union(tmp)
    })

    if (!Number.isFinite(box.min.y)) return 0
    return Math.max(0, -box.min.y) + CHARACTER_Y_OFFSET
  }, [scene])

  useFrame((state) => {
    const body = bodyRef.current
    if (!body) return

    const tp = useOpeningStore.getState().targetPosition
    const base = groundedYOffset
    if (tp) {
      body.position.y = base
      return
    }
    const t = state.clock.elapsedTime
    body.position.y = base + Math.sin(t * 0.65) * 0.012
  })

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <group ref={bodyRef} position={[0, groundedYOffset, 0]}>
        <primitive ref={modelRef} object={scene} />
      </group>
    </group>
  )
}

useGLTF.preload(OPENING_ASSETS.bear)
