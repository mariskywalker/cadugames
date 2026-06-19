'use client'

import type { ReactNode } from 'react'
import { useCallback, useLayoutEffect, useRef } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { Group } from 'three'
import { SCENE_FLOOR_Y } from '@/lib/opening/sceneLayout'
import { applyMeshRenderOrder } from '@/lib/opening/sceneRenderOrder'
import {
  OPENING_INTERACTIVE_RENDER_ORDER,
  OPENING_PODIUM_RENDER_ORDER,
  openingObjectToWorld,
  type OpeningSceneObjectId,
} from '@/lib/opening/openingSceneEditorLayout'
import { useOpeningSceneEditorStore } from '@/store/useOpeningSceneEditorStore'

export function OpeningSceneObjectWrap({
  id,
  children,
}: {
  id: OpeningSceneObjectId
  children: ReactNode
}) {
  const sceneLayout = useOpeningSceneEditorStore((s) => s.layout)
  const layout = sceneLayout.objects[id]
  const editorActive = useOpeningSceneEditorStore((s) => s.editorActive)
  const selectedId = useOpeningSceneEditorStore((s) => s.selectedId)
  const select = useOpeningSceneEditorStore((s) => s.select)
  const patchObject = useOpeningSceneEditorStore((s) => s.patchObject)
  const groupRef = useRef<Group>(null)
  const dragRef = useRef({
    active: false,
    startX: 0,
    startZ: 0,
    baseX: 0,
    baseZ: 0,
  })

  const { position, rotation, scale } = openingObjectToWorld(layout, id, sceneLayout)
  const isPodium = id === 'podium'
  const selected = editorActive && selectedId === id

  useLayoutEffect(() => {
    if (!groupRef.current) return
    applyMeshRenderOrder(
      groupRef.current,
      isPodium ? OPENING_PODIUM_RENDER_ORDER : OPENING_INTERACTIVE_RENDER_ORDER,
    )
  })

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!editorActive) return
      e.stopPropagation()
      select(id)
      dragRef.current = {
        active: true,
        startX: e.point.x,
        startZ: e.point.z,
        baseX: layout.x,
        baseZ: layout.z,
      }
      const el = e.nativeEvent.target as HTMLElement
      el?.setPointerCapture?.(e.nativeEvent.pointerId)
    },
    [editorActive, id, layout.x, layout.z, select],
  )

  const onPointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!editorActive || !dragRef.current.active) return
      const dx = e.point.x - dragRef.current.startX
      const dz = e.point.z - dragRef.current.startZ
      patchObject(id, {
        x: Math.round((dragRef.current.baseX + dx) * 100) / 100,
        z: Math.round((dragRef.current.baseZ + dz) * 100) / 100,
      })
    },
    [editorActive, id, patchObject],
  )

  const onPointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    dragRef.current.active = false
    try {
      const el = e.nativeEvent.target as HTMLElement
      el?.releasePointerCapture?.(e.nativeEvent.pointerId)
    } catch {
      // ignore
    }
  }, [])

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      renderOrder={isPodium ? OPENING_PODIUM_RENDER_ORDER : OPENING_INTERACTIVE_RENDER_ORDER}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {selected && (
        <mesh position={[0, id === 'podium' ? 0 : 0.4, 0]} rotation-x={id === 'podium' ? 0 : -Math.PI / 2}>
          <ringGeometry args={id === 'podium' ? [3.2, 3.45, 48] : [0.55, 0.62, 32]} />
          <meshBasicMaterial color="#ff7b9b" transparent opacity={0.85} depthWrite={false} />
        </mesh>
      )}
      {children}
    </group>
  )
}

/** Plano invisível para raycast de arraste no editor. */
export function OpeningEditorGround() {
  const editorActive = useOpeningSceneEditorStore((s) => s.editorActive)
  if (!editorActive) return null
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, SCENE_FLOOR_Y + 0.01, 0]} visible={false}>
      <circleGeometry args={[12, 48]} />
      <meshBasicMaterial />
    </mesh>
  )
}
