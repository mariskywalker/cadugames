import { useMemo } from 'react'
import { PALETTE } from '../../constants/palette'
import { ROOM_STUDIO_COLORS } from '../../constants/roomBackdrop'
import { SCENE_HUB, SCENE_HUB_RADIUS } from '../../constants/sceneLayout'
import * as THREE from 'three'

/** Tapete do hub + anéis LED — cores do ciclorama `room-backdrop.png`. */
export function StylizedRoom() {
  const carpetMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: ROOM_STUDIO_COLORS.carpet,
        roughness: 1,
        metalness: 0,
      }),
    [],
  )

  const carpetInnerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: ROOM_STUDIO_COLORS.carpetInner,
        roughness: 1,
        metalness: 0,
      }),
    [],
  )
  const ledCore = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PALETTE.led,
        emissive: new THREE.Color(PALETTE.led),
        emissiveIntensity: 3.2,
        transparent: true,
        opacity: 0.95,
        roughness: 0.15,
        metalness: 0,
      }),
    [],
  )

  const ledGlow = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: PALETTE.ledGlow,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  const ledGlowSoft = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: PALETTE.ledGlow,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  const y = 0.018
  const hub = SCENE_HUB

  return (
    <group position={[hub[0], 0, hub[2]]}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.011, 0]} material={carpetMat}>
        <circleGeometry args={[SCENE_HUB_RADIUS, 80]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, 0]} material={carpetInnerMat}>
        <circleGeometry args={[SCENE_HUB_RADIUS * 0.58, 64]} />
      </mesh>

      {/* Inner LED ring (around play zone / tube base) */}
      <mesh rotation-x={-Math.PI / 2} position={[0, y, 0]} material={ledCore}>
        <ringGeometry args={[1.02, 1.1, 72]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, y - 0.001, 0]} material={ledGlow}>
        <ringGeometry args={[0.92, 1.2, 72]} />
      </mesh>

      {/* Outer LED ring (stage edge) — tom pêssego, não branco puro no horizonte */}
      <mesh rotation-x={-Math.PI / 2} position={[0, y, 0]} material={ledGlowSoft}>
        <ringGeometry args={[SCENE_HUB_RADIUS * 0.86, SCENE_HUB_RADIUS * 0.92, 96]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, y - 0.002, 0]} material={ledGlow}>
        <ringGeometry args={[SCENE_HUB_RADIUS * 0.8, SCENE_HUB_RADIUS * 0.98, 96]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, y - 0.003, 0]} material={ledGlowSoft}>
        <ringGeometry args={[SCENE_HUB_RADIUS * 0.75, SCENE_HUB_RADIUS * 1.02, 96]} />
      </mesh>
    </group>
  )
}
