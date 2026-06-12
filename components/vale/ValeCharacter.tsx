'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { Group } from 'three'
import { OPENING_ASSETS } from '@/lib/opening/assets'
import { CHARACTER_STATES, CHARACTER_Y_OFFSET } from '@/lib/opening/animations'
import { makeCelMaterial } from '@/lib/opening/celShade'
import {
  getCanonicalClipName,
  getEffectiveCanonicalClipNames,
} from '@/lib/opening/glbClipRenameMap'
import { useCharacterAnimations } from '@/hooks/opening/useCharacterAnimations'
import { useValeCharacterMovement } from '@/hooks/vale/useValeCharacterMovement'
import { useValeKeyboardControls } from '@/hooks/vale/useValeKeyboardControls'
import { VALE_ANIMATION_TIME_SCALE } from '@/lib/vale/valeMotion'
import {
  VALE_BEAR_HERO,
  VALE_CHARACTER_FOOT_OFFSET,
  VALE_CHARACTER_SCALE,
  VALE_GROUND_RAY_MAX_Y,
  VALE_HERO_MODE,
  VALE_PATH_GROUND_Y,
  VALE_SPAWN,
  VALE_SPAWN_ROTATION,
  getValeHeroGroundY,
  valeCharacterWorldPos,
  valeTerrain,
} from '@/lib/vale/valeWorld'
import { useValeStore } from '@/store/useValeStore'

// Mesma URL do /opening para compartilhar o cache do useGLTF
const BEAR_URL =
  process.env.NODE_ENV === 'development'
    ? `${OPENING_ASSETS.bear}?v=opening`
    : OPENING_ASSETS.bear

const terrainRay = new THREE.Raycaster()
const rayOrigin = new THREE.Vector3()
const RAY_DOWN = new THREE.Vector3(0, -1, 0)

/** Ignora telhado/paredes — usa o ponto de chão mais alto abaixo do teto do raycast */
function sampleWalkableGroundY(hits: THREE.Intersection[]) {
  let best: number | null = null
  for (const hit of hits) {
    const y = hit.point.y
    if (y > VALE_GROUND_RAY_MAX_Y) continue
    if (best === null || y > best) best = y
  }
  return best
}

export function ValeCharacter() {
  const group = useRef<Group>(null)
  const bodyRef = useRef<Group>(null)
  const modelRef = useRef<Group>(null)
  const materialCacheRef = useRef(new WeakMap<THREE.Material, THREE.MeshToonMaterial>())
  const groundYRef = useRef(0)
  const lastSampleRef = useRef<{ x: number; z: number } | null>(null)

  const clearTarget = useValeStore((s) => s.clearTarget)
  const resetToIdle = useValeStore((s) => s.resetToIdle)
  const setModelStatus = useValeStore((s) => s.setModelStatus)
  const characterState = useValeStore((s) => s.characterState)
  const targetPosition = useValeStore((s) => s.targetPosition)
  const setCharacterState = useValeStore((s) => s.setCharacterState)
  const modelStatus = useValeStore((s) => s.modelStatus)
  const animationClips = useValeStore((s) => s.animationClips)
  const setAnimationClips = useValeStore((s) => s.setAnimationClips)

  const spawnPosition = VALE_HERO_MODE ? VALE_BEAR_HERO.position : VALE_SPAWN
  const spawnRotation = VALE_HERO_MODE ? VALE_BEAR_HERO.rotation : VALE_SPAWN_ROTATION
  const characterScale = VALE_HERO_MODE ? VALE_BEAR_HERO.scale : VALE_CHARACTER_SCALE

  useEffect(() => {
    setModelStatus('loading')
  }, [setModelStatus])

  const { scene, animations } = useGLTF(BEAR_URL)
  const { actions, names, mixer } = useAnimations(animations, modelRef)

  const clipsReady = modelStatus === 'loaded' && names.length > 0

  useEffect(() => {
    const rawClipNames = animations?.map((clip) => clip.name) ?? []
    const canonicalClips = [
      ...new Set(rawClipNames.map((name) => getCanonicalClipName(name)).filter(Boolean)),
    ].sort()
    setAnimationClips(canonicalClips.length ? canonicalClips : getEffectiveCanonicalClipNames())
  }, [animations, setAnimationClips])

  useEffect(() => {
    setModelStatus('loaded')
    resetToIdle()
  }, [setModelStatus, resetToIdle, scene])

  useEffect(() => {
    if (!mixer) return
    mixer.timeScale = VALE_ANIMATION_TIME_SCALE
  }, [mixer])

  useEffect(() => {
    clearTarget()
    resetToIdle()
    const g = group.current
    if (!g) return
    g.position.set(...spawnPosition)
    g.quaternion.setFromEuler(new THREE.Euler(...spawnRotation))
    groundYRef.current = spawnPosition[1]
  }, [clearTarget, resetToIdle, spawnPosition, spawnRotation])

  useValeCharacterMovement({ groupRef: group, setCharacterState })
  useValeKeyboardControls({ groupRef: group, enabled: true })

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
      mesh.castShadow = !VALE_HERO_MODE
      mesh.receiveShadow = !VALE_HERO_MODE
      ;(mesh as THREE.Object3D & { fog?: boolean }).fog = false
      mesh.renderOrder = 14
      const original = mesh.material
      const materials = Array.isArray(original) ? original : [original]
      const nextMaterials = materials.map((mat) => {
        if (!mat) return mat
        const cached = cache.get(mat)
        if (cached) return cached
        const cel = makeCelMaterial(mat)
        cel.fog = false
        cache.set(mat, cel)
        return cel
      })
      mesh.material = Array.isArray(original) ? nextMaterials : nextMaterials[0]
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
    const footLift = VALE_HERO_MODE ? VALE_CHARACTER_FOOT_OFFSET : 0
    return Math.max(0, -box.min.y * characterScale) + CHARACTER_Y_OFFSET + footLift
  }, [scene, characterScale])

  useFrame((state) => {
    const g = group.current
    const body = bodyRef.current
    if (!g || !body) return

    const last = lastSampleRef.current
    const moved =
      !last || Math.hypot(g.position.x - last.x, g.position.z - last.z) > 0.04

    let targetGroundY = groundYRef.current

    if (VALE_HERO_MODE) {
      targetGroundY = getValeHeroGroundY(g.position.x, g.position.z)
    } else if (moved && valeTerrain.object) {
      rayOrigin.set(g.position.x, 30, g.position.z)
      terrainRay.set(rayOrigin, RAY_DOWN)
      const groundY = sampleWalkableGroundY(
        terrainRay.intersectObject(valeTerrain.object, true),
      )
      if (groundY !== null) {
        const dy = groundY - groundYRef.current
        if (dy < 0.85) targetGroundY = groundY
      }
    }

    if (moved) {
      lastSampleRef.current = { x: g.position.x, z: g.position.z }
    }

    groundYRef.current = targetGroundY
    g.position.y = THREE.MathUtils.lerp(g.position.y, targetGroundY, VALE_HERO_MODE ? 0.28 : 0.18)

    valeCharacterWorldPos.set(g.position.x, g.position.y, g.position.z)

    const st = useValeStore.getState()
    const tp = st.targetPosition
    const isMoving =
      tp != null ||
      st.characterState === CHARACTER_STATES.WALK ||
      st.characterState === CHARACTER_STATES.RUN
    const walkFootBoost = VALE_HERO_MODE && isMoving ? 0.08 : 0

    if (tp) {
      body.position.y = groundedYOffset + walkFootBoost
      return
    }
    const t = state.clock.elapsedTime
    body.position.y = groundedYOffset + walkFootBoost + Math.sin(t * 0.65) * 0.012
  })

  return (
    <group ref={group} position={spawnPosition} rotation={spawnRotation}>
      <group ref={bodyRef} position={[0, groundedYOffset, 0]} scale={characterScale}>
        <primitive ref={modelRef} object={scene} />
      </group>
    </group>
  )
}

useGLTF.preload(BEAR_URL)
