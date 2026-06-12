'use client'

import { useMemo } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { isInsideNavMesh } from '@/lib/opening/navMesh'
import { PALETTE } from '@/lib/opening/palette'
import { ROOM_STUDIO_COLORS } from '@/lib/opening/roomBackdrop'
import { SCENE_HUB, SCENE_HUB_RADIUS } from '@/lib/opening/sceneLayout'
import { useOpeningStore } from '@/store/useOpeningStore'

function createCarpetGradientTexture(inner: string, mid: string, outer: string, shadow: string) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const cx = size / 2
  const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, size * 0.5)
  g.addColorStop(0, inner)
  g.addColorStop(0.38, mid)
  g.addColorStop(0.72, outer)
  g.addColorStop(0.92, shadow)
  g.addColorStop(1, shadow)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function StylizedRoom() {
  const setWalkTarget = useOpeningStore((s) => s.setWalkTarget)

  const carpetMap = useMemo(
    () =>
      createCarpetGradientTexture(
        ROOM_STUDIO_COLORS.carpetInner,
        ROOM_STUDIO_COLORS.carpet,
        ROOM_STUDIO_COLORS.carpetEdge,
        ROOM_STUDIO_COLORS.carpetShadow,
      ),
    [],
  )

  const carpetMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: carpetMap,
        roughness: 0.94,
        metalness: 0,
      }),
    [carpetMap],
  )

  const aoMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ROOM_STUDIO_COLORS.carpetShadow,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      }),
    [],
  )

  const tubeShadowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#B88878',
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    [],
  )

  const ledCore = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PALETTE.led,
        emissive: new THREE.Color(PALETTE.ledGlow),
        emissiveIntensity: 2.4,
        transparent: true,
        opacity: 0.92,
        roughness: 0.18,
        metalness: 0,
      }),
    [],
  )

  const ledGlow = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: PALETTE.ledGlow,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  const ledGlowSoft = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#FFF0E6',
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  const handleFloorPointer = (e: ThreeEvent<PointerEvent>) => {
    if (e.button !== 0) return
    e.stopPropagation()
    const { x, z } = e.point
    if (!isInsideNavMesh(x, z)) return
    setWalkTarget(x, z)
  }

  const y = 0.018
  const hub = SCENE_HUB

  return (
    <group position={[hub[0], 0, hub[2]]}>
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.011, 0]}
        material={carpetMat}
        receiveShadow
        onPointerDown={handleFloorPointer}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <circleGeometry args={[SCENE_HUB_RADIUS, 80]} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, 0.08]} material={tubeShadowMat}>
        <circleGeometry args={[2.1, 48]} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.013, 0]} material={aoMat}>
        <ringGeometry args={[SCENE_HUB_RADIUS * 0.68, SCENE_HUB_RADIUS * 0.98, 96]} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, y, 0]} material={ledCore}>
        <ringGeometry args={[1.02, 1.1, 72]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, y - 0.001, 0]} material={ledGlow}>
        <ringGeometry args={[0.92, 1.2, 72]} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, y, 0]} material={ledGlowSoft}>
        <ringGeometry args={[SCENE_HUB_RADIUS * 0.86, SCENE_HUB_RADIUS * 0.92, 96]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, y - 0.002, 0]} material={ledGlow}>
        <ringGeometry args={[SCENE_HUB_RADIUS * 0.8, SCENE_HUB_RADIUS * 0.98, 96]} />
      </mesh>
    </group>
  )
}
