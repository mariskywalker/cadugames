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
import { useValeHotspotMovement } from '@/hooks/vale/useValeHotspotMovement'
import { useValeKeyboardControls } from '@/hooks/vale/useValeKeyboardControls'
import { VALE_ANIMATION_TIME_SCALE } from '@/lib/vale/valeMotion'
import {
  VALE_BEAR_HERO,
  VALE_CHARACTER_FOOT_OFFSET,
  VALE_CHARACTER_SCALE,
  VALE_CHARACTER_Y_LIFT,
  VALE_GROUND_RAY_MAX_Y,
  VALE_HERO_MODE,
  VALE_PATH_GROUND_Y,
  VALE_SPAWN,
  VALE_SPAWN_ROTATION,
  valeCharacterWorldPos,
  valeTerrain,
} from '@/lib/vale/valeWorld'
import { getBearHeroIdlePose } from '@/lib/vale/valeNarrativeIntro'
import { getValeGroundY, resetValeGroundY } from '@/lib/vale/valeWalkable'
import { useValeStore } from '@/store/useValeStore'

// Mesma URL do /opening para compartilhar o cache do useGLTF
const BEAR_URL =
  process.env.NODE_ENV === 'development'
    ? `${OPENING_ASSETS.bear}?v=opening`
    : OPENING_ASSETS.bear

const terrainRay = new THREE.Raycaster()
const rayOrigin = new THREE.Vector3()
const RAY_DOWN = new THREE.Vector3(0, -1, 0)

const HERO_GROUND_LERP = 0.32

const animatedBounds = new THREE.Box3()
const bodyWorldPos = new THREE.Vector3()

function sampleAnimatedFootMinY(scene: THREE.Object3D, body: Group, scale: number): number | null {
  animatedBounds.makeEmpty()
  scene.updateWorldMatrix(true, true)
  body.updateWorldMatrix(true, true)
  bodyWorldPos.setFromMatrixPosition(body.matrixWorld)

  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh?.isMesh || !mesh.geometry) return
    const geom = mesh.geometry
    if (!geom.boundingBox) geom.computeBoundingBox()
    if (!geom.boundingBox) return
    const tmp = geom.boundingBox.clone()
    tmp.applyMatrix4(mesh.matrixWorld)
    animatedBounds.union(tmp)
  })

  if (!Number.isFinite(animatedBounds.min.y)) return null
  return (animatedBounds.min.y - bodyWorldPos.y) / scale
}

function sampleHeroGroundY(x: number, z: number) {
  return getValeGroundY(x, z) + VALE_CHARACTER_Y_LIFT
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

  const heroPose = VALE_HERO_MODE ? getBearHeroIdlePose() : null
  const spawnPosition = heroPose
    ? ([heroPose.x, VALE_PATH_GROUND_Y, heroPose.z] as [number, number, number])
    : VALE_SPAWN
  const spawnRotation = heroPose
    ? ([0, heroPose.rotationY, 0] as [number, number, number])
    : VALE_SPAWN_ROTATION
  const characterScale = VALE_HERO_MODE ? VALE_BEAR_HERO.scale : VALE_CHARACTER_SCALE

  useEffect(() => {
    setModelStatus('loading')
  }, [setModelStatus])

  const { scene, animations } = useGLTF(BEAR_URL)
  const { actions, names, mixer } = useAnimations(animations, modelRef)

  const isTraveling = useValeStore((s) => s.isTraveling)
  const hotspotJourney = useValeStore((s) => s.hotspotJourney)

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
    resetValeGroundY(VALE_PATH_GROUND_Y)
    const g = group.current
    if (!g) return
    g.position.set(...spawnPosition)
    g.rotation.set(spawnRotation[0], spawnRotation[1], spawnRotation[2])
    groundYRef.current = sampleHeroGroundY(spawnPosition[0], spawnPosition[2])
  }, [clearTarget, resetToIdle, spawnPosition, spawnRotation])

  useValeHotspotMovement({ groupRef: group, setCharacterState })
  useValeCharacterMovement({ groupRef: group, setCharacterState })
  useValeKeyboardControls({ groupRef: group, enabled: !VALE_HERO_MODE })

  useCharacterAnimations({
    actions,
    mixer,
    clipsReady,
    characterState,
    targetPosition:
      VALE_HERO_MODE && (isTraveling || hotspotJourney) ? ([0, 0, 0] as [number, number, number]) : VALE_HERO_MODE ? null : targetPosition,
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

  useFrame((state, delta) => {
    mixer?.update(delta)

    const g = group.current
    const body = bodyRef.current
    if (!g || !body) return

    const last = lastSampleRef.current
    const moved =
      !last || Math.hypot(g.position.x - last.x, g.position.z - last.z) > 0.04

    let targetGroundY = groundYRef.current

    if (VALE_HERO_MODE) {
      targetGroundY = sampleHeroGroundY(g.position.x, g.position.z)
    } else if (moved && valeTerrain.object) {
      rayOrigin.set(g.position.x, 30, g.position.z)
      terrainRay.set(rayOrigin, RAY_DOWN)
      let best: number | null = null
      for (const hit of terrainRay.intersectObject(valeTerrain.object, true)) {
        const y = hit.point.y
        if (y > VALE_GROUND_RAY_MAX_Y) continue
        if (best === null || y > best) best = y
      }
      if (best !== null) {
        const dy = best - groundYRef.current
        if (dy < 0.85) targetGroundY = best
      }
    }

    if (moved) {
      lastSampleRef.current = { x: g.position.x, z: g.position.z }
    }

    groundYRef.current = targetGroundY
    g.position.y = THREE.MathUtils.lerp(
      g.position.y,
      targetGroundY,
      VALE_HERO_MODE ? HERO_GROUND_LERP : 0.18,
    )

    valeCharacterWorldPos.set(g.position.x, g.position.y, g.position.z)

    const st = useValeStore.getState()
    const tp = st.targetPosition
    const traveling = st.isTraveling || st.hotspotJourney != null

    let bodyY = groundedYOffset
    if (VALE_HERO_MODE && traveling) {
      const footMinY = sampleAnimatedFootMinY(scene, body, characterScale)
      if (footMinY !== null) {
        const lift = Math.max(0, groundedYOffset - footMinY)
        bodyY = groundedYOffset + lift
      }
    } else if (!tp) {
      const t = state.clock.elapsedTime
      bodyY = groundedYOffset + Math.sin(t * 0.65) * 0.01
    }

    body.position.y = bodyY
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
