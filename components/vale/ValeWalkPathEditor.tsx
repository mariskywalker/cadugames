'use client'

import { Line } from '@react-three/drei'
import { type ThreeEvent } from '@react-three/fiber'
import { useCallback, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getValeHeroGroundY } from '@/lib/vale/valeWorld'
import { getValePathHalfWidth } from '@/lib/vale/valeWalkable'
import { useValeWalkPathEditorStore } from '@/store/useValeWalkPathEditorStore'

const _plane = new THREE.Plane()
const _hit = new THREE.Vector3()

type DragStart = {
  offsetX: number
  offsetZ: number
  groundY: number
}

function WalkPathPointHandle({
  index,
  x,
  z,
  halfWidth,
  selected,
  onSelect,
  onMove,
}: {
  index: number
  x: number
  z: number
  halfWidth?: number
  selected: boolean
  onSelect: () => void
  onMove: (x: number, z: number) => void
}) {
  const dragRef = useRef<DragStart | null>(null)
  const groundY = getValeHeroGroundY(x, z) + 0.12
  const radius = halfWidth ?? getValePathHalfWidth(index / 7)

  const intersectGround = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      _plane.set(new THREE.Vector3(0, 1, 0), -groundY)
      if (!e.ray.intersectPlane(_plane, _hit)) return null
      return _hit.clone()
    },
    [groundY],
  )

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      onSelect()
      const hit = intersectGround(e)
      dragRef.current = {
        offsetX: hit ? x - hit.x : 0,
        offsetZ: hit ? z - hit.z : 0,
        groundY,
      }
      const target = e.target as Element
      target.setPointerCapture?.(e.pointerId)
    },
    [groundY, intersectGround, onSelect, x, z],
  )

  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!dragRef.current) return
      e.stopPropagation()
      const hit = intersectGround(e)
      if (!hit) return
      onMove(hit.x + dragRef.current.offsetX, hit.z + dragRef.current.offsetZ)
    },
    [intersectGround, onMove],
  )

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    dragRef.current = null
    const target = e.target as Element
    if (target.hasPointerCapture?.(e.pointerId)) {
      target.releasePointerCapture(e.pointerId)
    }
  }, [])

  return (
    <group position={[x, groundY, z]}>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        renderOrder={60}
      >
        <sphereGeometry args={[selected ? 0.16 : 0.12, 16, 16]} />
        <meshBasicMaterial color={selected ? '#fff176' : '#7cf5a0'} depthTest={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.11, 0]} renderOrder={55}>
        <ringGeometry args={[radius * 0.85, radius, 32]} />
        <meshBasicMaterial color={selected ? '#fff176' : '#7cf5a0'} transparent opacity={0.35} depthTest={false} />
      </mesh>
    </group>
  )
}

/** Gizmos 3D para editar o path caminhável */
export function ValeWalkPathEditor() {
  const editorActive = useValeWalkPathEditorStore((s) => s.editorActive)
  const points = useValeWalkPathEditorStore((s) => s.points)
  const selectedId = useValeWalkPathEditorStore((s) => s.selectedId)
  const select = useValeWalkPathEditorStore((s) => s.select)
  const patch = useValeWalkPathEditorStore((s) => s.patch)

  const linePoints = useMemo(
    () =>
      points.map((p) => {
        const y = getValeHeroGroundY(p.x, p.z) + 0.14
        return new THREE.Vector3(p.x, y, p.z)
      }),
    [points],
  )

  if (!editorActive) return null

  return (
    <group name="vale-walk-path-editor">
      <Line points={linePoints} color="#b8ffd0" lineWidth={2} depthTest={false} />

      {points.map((point, index) => (
        <WalkPathPointHandle
          key={point.id}
          index={index}
          x={point.x}
          z={point.z}
          halfWidth={point.halfWidth}
          selected={selectedId === point.id}
          onSelect={() => select(point.id)}
          onMove={(x, z) => patch(point.id, { x, z })}
        />
      ))}
    </group>
  )
}
