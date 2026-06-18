'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { Group } from 'three'
import { OPENING_ASSETS } from '@/lib/opening/assets'
import { CHARACTER_STATES } from '@/lib/opening/animations'
import { makeCelMaterial } from '@/lib/opening/celShade'
import {
  getCanonicalClipName,
  getEffectiveCanonicalClipNames,
} from '@/lib/opening/glbClipRenameMap'
import { useCharacterAnimations } from '@/hooks/opening/useCharacterAnimations'
import { VALE_ANIMATION_TIME_SCALE } from '@/lib/vale/valeMotion'
import { VALE_CHARACTER_SCALE } from '@/lib/vale/valeWorld'
import { useValeStore } from '@/store/useValeStore'

const BEAR_URL =
  process.env.NODE_ENV === 'development'
    ? `${OPENING_ASSETS.bear}?v=overlay`
    : OPENING_ASSETS.bear

/** Urso GLB no mini-canvas do overlay — sem raycast/terreno */
export function ValeOverlayBearModel({ rotationY }: { rotationY: number }) {
  const groupRef = useRef<Group>(null)
  const { scene, animations } = useGLTF(BEAR_URL)

  const model = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = false
      mesh.receiveShadow = false
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => makeCelMaterial(m))
      } else if (mesh.material) {
        mesh.material = makeCelMaterial(mesh.material)
      }
    })
    return clone
  }, [scene])

  const renamedClips = useMemo(
    () =>
      animations.map((clip) => {
        const name = getCanonicalClipName(clip.name)
        if (name === clip.name) return clip
        const next = clip.clone()
        next.name = name
        return next
      }),
    [animations],
  )

  const { actions, mixer, names } = useAnimations(renamedClips, groupRef)
  const characterState = useValeStore((s) => s.characterState)
  const animationClips = useValeStore((s) => s.animationClips)
  const setAnimationClips = useValeStore((s) => s.setAnimationClips)
  const setModelStatus = useValeStore((s) => s.setModelStatus)

  const clipsReady = names.length > 0

  useEffect(() => {
    const rawClipNames = renamedClips.map((clip) => clip.name)
    const canonicalClips = [
      ...new Set(rawClipNames.map((name) => getCanonicalClipName(name)).filter(Boolean)),
    ].sort()
    setAnimationClips(canonicalClips.length ? canonicalClips : getEffectiveCanonicalClipNames())
    setModelStatus('loaded')
  }, [renamedClips, setAnimationClips, setModelStatus])

  useCharacterAnimations({
    actions,
    mixer,
    clipsReady,
    characterState,
    targetPosition: null,
    animationClips,
  })

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY
    }
  })

  return (
    <group ref={groupRef} position={[0, -1.1, 0]} scale={VALE_CHARACTER_SCALE * 1.12}>
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload(BEAR_URL)
