'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

function createSkyGradientTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, '#c8d8f8')
  grad.addColorStop(0.18, '#dce8ff')
  grad.addColorStop(0.38, '#ffe8f0')
  grad.addColorStop(0.58, '#ffd8c8')
  grad.addColorStop(0.8, '#f0c0a8')
  grad.addColorStop(1, '#d8b090')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 4, 256)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function createHazeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(255, 220, 210, 0.22)')
  g.addColorStop(0.5, 'rgba(255, 200, 190, 0.08)')
  g.addColorStop(1, 'rgba(255, 195, 185, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const DISTANT_ISLANDS: Array<{ pos: [number, number, number]; scale: number; color: string }> = [
  { pos: [-9, -0.4, -14], scale: 2.8, color: '#e8b8c8' },
  { pos: [11, -0.2, -16], scale: 3.2, color: '#ddb8d0' },
  { pos: [-6, 0, -20], scale: 2.1, color: '#f0c8d4' },
  { pos: [7, 0.1, -22], scale: 2.5, color: '#e4b0c4' },
]

const DISTANT_TREES: Array<{ pos: [number, number, number]; h: number }> = [
  { pos: [-7.5, 0, -8], h: 2.4 },
  { pos: [-5.2, 0, -10.5], h: 3.1 },
  { pos: [6.8, 0, -9], h: 2.8 },
  { pos: [8.5, 0, -11], h: 3.4 },
  { pos: [-9, 0, -12], h: 2.2 },
  { pos: [10, 0, -13], h: 2.6 },
]

/** Profundidade atmosférica — céu, ilhas distantes, árvores na névoa */
export function ValeBackdrop() {
  const skyTex = useMemo(() => createSkyGradientTexture(), [])
  const hazeTex = useMemo(() => createHazeTexture(), [])

  const islandMaterials = useMemo(
    () =>
      DISTANT_ISLANDS.map(
        (island) =>
          new THREE.MeshBasicMaterial({
            color: island.color,
            transparent: true,
            opacity: 0.55,
            fog: true,
            depthWrite: false,
          }),
      ),
    [],
  )

  const treeTrunkMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#6a4a38', fog: true, transparent: true, opacity: 0.7 }),
    [],
  )
  const treeCanopyMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#9a6a88', fog: true, transparent: true, opacity: 0.55 }),
    [],
  )

  return (
    <group>
      <mesh scale={[160, 88, 160]} position={[0, 26, -24]} renderOrder={-20}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshBasicMaterial map={skyTex} side={THREE.BackSide} fog={false} depthWrite={false} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.05, -6]} renderOrder={-10}>
        <planeGeometry args={[48, 48]} />
        <meshBasicMaterial
          map={hazeTex}
          transparent
          opacity={0.65}
          depthWrite={false}
          fog
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {DISTANT_ISLANDS.map((island, i) => (
        <mesh
          key={`island-${i}`}
          position={island.pos}
          scale={island.scale}
          material={islandMaterials[i]}
          renderOrder={-8}
        >
          <sphereGeometry args={[1, 16, 12]} />
        </mesh>
      ))}

      {DISTANT_TREES.map((tree, i) => (
        <group key={`tree-${i}`} position={tree.pos}>
          <mesh position={[0, tree.h * 0.28, 0]} material={treeTrunkMat}>
            <cylinderGeometry args={[0.08, 0.12, tree.h * 0.55, 6]} />
          </mesh>
          <mesh position={[0, tree.h * 0.72, 0]} material={treeCanopyMat}>
            <coneGeometry args={[0.45, tree.h * 0.5, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
