'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { PODIUM_RADIUS, PODIUM_SURFACE_Y } from '@/lib/opening/sceneLayout'

const PINK = {
  tierOuter: '#F2B4C4',
  tierMid: '#EEA8BC',
  tierInner: '#E99CB4',
  edge: '#E08EAA',
  ring: '#FFF5F8',
  ringGlow: '#FFDCE8',
  shadow: '#D88AA4',
  reflection: '#F8C8D4',
}

function tierHeights(radius: number) {
  return {
    outer: { r: radius, h: 0.22, y: 0.11 },
    mid: { r: radius * 0.78, h: 0.18, y: 0.31 },
    inner: { r: radius * 0.56, h: 0.14, y: 0.47 },
  }
}

export function PinkPodium({ radius = PODIUM_RADIUS }: { radius?: number }) {
  const tiers = useMemo(() => tierHeights(radius), [radius])

  const tierMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PINK.tierOuter,
        roughness: 0.48,
        metalness: 0.06,
      }),
    [],
  )

  const tierMidMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PINK.tierMid,
        roughness: 0.44,
        metalness: 0.08,
      }),
    [],
  )

  const tierInnerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PINK.tierInner,
        roughness: 0.4,
        metalness: 0.1,
      }),
    [],
  )

  const ringCoreMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PINK.ring,
        emissive: new THREE.Color(PINK.ringGlow),
        emissiveIntensity: 2.2,
        roughness: 0.2,
        metalness: 0,
        transparent: true,
        opacity: 0.95,
      }),
    [],
  )

  const ringGlowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: PINK.ringGlow,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  const shadowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: PINK.shadow,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    [],
  )

  const reflectionMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PINK.reflection,
        transparent: true,
        opacity: 0.14,
        roughness: 0.08,
        metalness: 0.35,
        depthWrite: false,
      }),
    [],
  )

  const { outer, mid, inner } = tiers
  const ringY = inner.y + inner.h * 0.5 + 0.018

  return (
    <group>
      <mesh position={[0, outer.y, 0]} material={tierMat} receiveShadow castShadow>
        <cylinderGeometry args={[outer.r, outer.r * 1.01, outer.h, 96]} />
      </mesh>

      <mesh position={[0, mid.y, 0]} material={tierMidMat} receiveShadow castShadow>
        <cylinderGeometry args={[mid.r, mid.r * 1.008, mid.h, 96]} />
      </mesh>

      <mesh position={[0, inner.y, 0]} material={tierInnerMat} receiveShadow castShadow>
        <cylinderGeometry args={[inner.r, inner.r * 1.006, inner.h, 96]} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, ringY, 0]} material={ringCoreMat}>
        <ringGeometry args={[inner.r * 0.88, inner.r * 0.98, 96]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, ringY - 0.002, 0]} material={ringGlowMat}>
        <ringGeometry args={[inner.r * 0.82, inner.r * 1.04, 96]} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, PODIUM_SURFACE_Y + 0.004, 0]} material={reflectionMat}>
        <circleGeometry args={[radius * 1.08, 96]} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, -0.04, 0]} material={shadowMat}>
        <circleGeometry args={[radius * 1.22, 64]} />
      </mesh>
    </group>
  )
}
