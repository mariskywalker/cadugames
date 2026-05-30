import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useCADUStore } from '../../store/useCADUStore'
import { CHARACTER_Y_OFFSET } from '../../constants/animations'
import { makeCelMaterial } from '../../utils/celShade'
import { useCharacterAnimations } from '../../hooks/useCharacterAnimations'
import { useCharacterMovement } from '../../hooks/useCharacterMovement'
import { useKeyboardMovement } from '../../hooks/useKeyboardMovement'
import { isBarAnimActive, useActivityBarsInteraction } from '../../hooks/useActivityBarsInteraction'
import { ActivityBarsReward } from '../Interactions/ActivityBarsInteraction'
import '../Interactions/activity-bars-reward.css'
import { CharacterMoodPicker } from '../UI/CharacterMoodPicker'

import { CADU_MODEL_URL } from '../../constants/characterModel'
import { CANONICAL_CLIP_NAMES } from '../../constants/glbClipRenameMap'
import { registerEditorRef, unregisterEditorRef } from '../../utils/editorRefRegistry'
import { validateAnimationRegistry } from '../../utils/animationRegistry'
const DEV_CACHE_BUST = Math.random().toString(36).slice(2)

export function CharacterController({ scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const setModelStatus = useCADUStore((s) => s.setModelStatus)
  const clearTarget = useCADUStore((s) => s.clearTarget)
  const resetToIdle = useCADUStore((s) => s.resetToIdle)
  const group = useRef()
  const bodyRef = useRef()
  const modelRef = useRef()
  const materialCacheRef = useRef(new WeakMap())

  const modelUrl = useMemo(() => {
    return import.meta.env.DEV ? `${CADU_MODEL_URL}?v=${DEV_CACHE_BUST}` : CADU_MODEL_URL
  }, [])

  useEffect(() => {
    useGLTF.preload(modelUrl)
  }, [modelUrl])

  useEffect(() => {
    setModelStatus('loading', null)
  }, [setModelStatus])

  const { scene, animations } = useGLTF(modelUrl)
  const { actions, names, mixer } = useAnimations(animations, modelRef)

  const characterState = useCADUStore((s) => s.characterState)
  const targetPosition = useCADUStore((s) => s.targetPosition)
  const setCharacterState = useCADUStore((s) => s.setCharacterState)
  const debugRequestedClip = useCADUStore((s) => s.debugRequestedClip)
  const debug = useCADUStore((s) => s.debug)
  const barAnimPending = useCADUStore((s) => s.barAnimPending)
  const activityBarsPhase = useCADUStore((s) => s.activityBarsPhase)
  const manualClipName = useCADUStore((s) => s.manualClipName)
  const modelStatus = useCADUStore((s) => s.modelStatus)
  const setAnimationClips = useCADUStore((s) => s.setAnimationClips)
  const setCharacterSize = useCADUStore((s) => s.setCharacterSize)
  const characterSize = useCADUStore((s) => s.characterSize)
  const [moodOpen, setMoodOpen] = useState(false)

  const clipsReady = modelStatus === 'loaded' && names.length > 0
  const barAnimActive = isBarAnimActive(barAnimPending, targetPosition, activityBarsPhase)

  useEffect(() => {
    if (targetPosition) setMoodOpen(false)
  }, [targetPosition])

  useEffect(() => {
    const rawClipNames = animations?.map((clip) => clip.name) ?? []
    console.log('[CADU] Raw GLB clip names:', rawClipNames)
    console.log('[CADU] Canonical clip names:', CANONICAL_CLIP_NAMES)
    console.log('[CADU] Registry validation:', validateAnimationRegistry(CANONICAL_CLIP_NAMES))
    setAnimationClips(CANONICAL_CLIP_NAMES)
  }, [animations, setAnimationClips])

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    if (Number.isFinite(size.x) && Number.isFinite(size.y) && Number.isFinite(size.z)) {
      setCharacterSize({ w: size.x, h: size.y, d: size.z })
    }
  }, [scene, setCharacterSize])

  useEffect(() => {
    setModelStatus('loaded', null)
    resetToIdle()
  }, [setModelStatus, resetToIdle, scene])

  useEffect(() => {
    registerEditorRef('character', group)
    return () => unregisterEditorRef('character')
  }, [])

  useEffect(() => {
    clearTarget()
    resetToIdle()
    const g = group.current
    if (!g) return
    g.position.set(position[0], position[1], position[2])
    g.rotation.set(rotation[0], rotation[1], rotation[2])
    g.quaternion.setFromEuler(new THREE.Euler(rotation[0], rotation[1], rotation[2]))
  }, [clearTarget, resetToIdle, position, rotation])

  useCharacterMovement({
    groupRef: group,
    setCharacterState,
  })

  useKeyboardMovement({
    groupRef: group,
    setCharacterState,
  })

  useCharacterAnimations({
    actions,
    mixer,
    clipsReady,
    characterState,
    targetPosition,
    manualClipName,
    debugMode: debug,
    debugClip: debugRequestedClip,
    barAnimActive,
  })

  useActivityBarsInteraction({ groupRef: group, modelRef, actions, mixer, clipsReady })

  useEffect(() => {
    const cache = materialCacheRef.current

    scene.traverse((obj) => {
      if (!obj || !obj.isMesh) return
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
  }, [scene])

  const groundedYOffset = useMemo(() => {
    const box = new THREE.Box3()
    const v = new THREE.Vector3()
    const tmp = new THREE.Box3()

    scene.updateWorldMatrix(true, true)
    scene.traverse((obj) => {
      if (!obj || !obj.isMesh || !obj.geometry) return
      const geom = obj.geometry
      if (!geom.boundingBox) geom.computeBoundingBox()
      if (!geom.boundingBox) return
      tmp.copy(geom.boundingBox)
      tmp.applyMatrix4(obj.matrixWorld)
      box.union(tmp)
    })

    if (!Number.isFinite(box.min.y)) return 0
    v.set(0, Math.max(0, -box.min.y) + CHARACTER_Y_OFFSET, 0)
    return v.y
  }, [scene])

  const moodPickerY = useMemo(() => (characterSize?.h ?? 1.1) * 1.08, [characterSize])
  const rewardY = useMemo(() => (characterSize?.h ?? 1.1) * 1.12, [characterSize])
  const activityBarsRewardVisible = useCADUStore((s) => s.activityBarsRewardVisible)
  const setCharacterWorldPosition = useCADUStore((s) => s.setCharacterWorldPosition)

  useFrame((state) => {
    const body = bodyRef.current
    const root = group.current
    if (!body) return

    if (root) {
      setCharacterWorldPosition([root.position.x, root.position.y, root.position.z])
    }

    const { targetPosition: tp, activityBarsPhase: barPhase } = useCADUStore.getState()
    const base = groundedYOffset
    const barLocked = barPhase === 'snap' || barPhase === 'sequence'
    if (tp || barLocked) {
      body.position.y = base
      return
    }
    const t = state.clock.elapsedTime
    body.position.y = base + Math.sin(t * 0.65) * 0.012
  })

  const hitH = Math.max((characterSize?.h ?? 1.6) * 0.9, 1.2)
  const hitR = Math.max((characterSize?.w ?? 0.5) * 0.55, 0.32)

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      <group ref={bodyRef}>
        <primitive ref={modelRef} object={scene} />

        <mesh
          position={[0, hitH * 0.5, 0]}
          onPointerDown={(e) => {
            if (e.button !== 0) return
            if (useCADUStore.getState().playerControlLocked) return
            e.stopPropagation()
            setMoodOpen((v) => !v)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default'
          }}
        >
          <capsuleGeometry args={[hitR, hitH, 6, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {activityBarsRewardVisible && (
          <ActivityBarsReward rewardY={rewardY} />
        )}

        {moodOpen && (
          <Html
            center
            position={[0, moodPickerY + 0.35, 0]}
            distanceFactor={9}
            style={{ pointerEvents: 'auto' }}
          >
            <CharacterMoodPicker onClose={() => setMoodOpen(false)} />
          </Html>
        )}
      </group>
    </group>
  )
}
