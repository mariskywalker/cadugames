'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useCallback, useMemo, useRef, type ComponentProps } from 'react'
import * as THREE from 'three'
import type { Group, Object3D } from 'three'
import {
  useFernFlowerSource,
  useGltfFlowerSource,
  useLilacFlowerSource,
  useStumpFlowerSource,
} from '@/hooks/vale/useSceneFlowerSource'
import { preloadSceneFern } from '@/lib/vale/loadSceneFern'
import { preloadSceneLilac } from '@/lib/vale/loadSceneLilac'
import { preloadSceneStump } from '@/lib/vale/loadSceneStump'
import {
  prepareSceneFern,
  prepareSceneFlower,
  prepareSceneLilac,
  prepareSceneStump,
} from '@/lib/vale/prepareSceneFlower'
import {
  VALE_FLOWER_ASSETS,
  clampFlowerDepth,
  type FlowerMoveAxis,
  type ValeFlowerPlacement,
} from '@/lib/vale/sceneFlowerAssets'
import { useValeFlowerEditorStore } from '@/store/useValeFlowerEditorStore'

const _plane = new THREE.Plane()
const _hit = new THREE.Vector3()
const _offset = new THREE.Vector3()

const SCREEN_DRAG = { lateral: 0.012, depth: 0.018, vertical: 0.008 } as const

type DragStart = {
  clientX: number
  clientY: number
  position: [number, number, number]
  offsetX: number
  offsetZ: number
  axis: FlowerMoveAxis
}

function computeFlowerTransform(scene: THREE.Object3D, targetHeight: number, scaleMult = 1) {
  const box = new THREE.Box3().setFromObject(scene)
  const size = new THREE.Vector3()
  box.getSize(size)
  const scale = (targetHeight / Math.max(size.y, 0.001)) * scaleMult
  const yOffset = -box.min.y * scale
  return { scale, yOffset }
}

function applyAxisMove(
  axis: FlowerMoveAxis,
  start: DragStart,
  clientX: number,
  clientY: number,
  groundHit: THREE.Vector3 | null,
): [number, number, number] {
  const [sx, sy, sz] = start.position
  const dx = clientX - start.clientX
  const dy = clientY - start.clientY

  if (axis === 'depth') {
    return [sx, sy, clampFlowerDepth(sz - dy * SCREEN_DRAG.depth)]
  }
  if (axis === 'lateral') {
    return [sx + dx * SCREEN_DRAG.lateral, sy, sz]
  }
  if (axis === 'vertical') {
    return [sx, sy - dy * SCREEN_DRAG.vertical, sz]
  }

  if (!groundHit) return start.position
  return [
    groundHit.x + start.offsetX,
    sy,
    clampFlowerDepth(groundHit.z + start.offsetZ),
  ]
}

function ValeFlowerInstanceBody({
  placement,
  scene,
  editorActive,
  selected,
  moveAxis,
  onSelect,
  onMove,
  onResize,
  onDepthDrag,
}: {
  placement: ValeFlowerPlacement
  scene: Object3D
  editorActive: boolean
  selected: boolean
  moveAxis: FlowerMoveAxis
  onSelect: () => void
  onMove: (position: [number, number, number]) => void
  onResize: (targetHeight: number) => void
  onDepthDrag: () => void
}) {
  const swayRef = useRef<Group>(null)
  const dragRef = useRef<DragStart | null>(null)

  const prepared = useMemo(() => {
    const clone = scene.clone(true)
    if (placement.kind === 'fern') {
      prepareSceneFern(clone)
    } else if (placement.kind === 'lilac') {
      prepareSceneLilac(clone)
    } else if (placement.kind === 'stump') {
      prepareSceneStump(clone)
    } else {
      prepareSceneFlower(clone)
    }
    return clone
  }, [scene, placement.kind])

  const { scale, yOffset } = useMemo(
    () => computeFlowerTransform(prepared, placement.targetHeight, placement.scaleMult ?? 1),
    [prepared, placement.targetHeight, placement.scaleMult],
  )

  const swaySeed = useMemo(() => placement.id.charCodeAt(2) * 0.17, [placement.id])

  const intersectGround = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      _plane.set(new THREE.Vector3(0, 1, 0), -placement.position[1])
      if (!e.ray.intersectPlane(_plane, _hit)) return null
      return _hit.clone()
    },
    [placement.position],
  )

  const beginDrag = useCallback(
    (e: ThreeEvent<PointerEvent>, axis: FlowerMoveAxis) => {
      if (!editorActive) return
      e.stopPropagation()
      onSelect()
      const hit = intersectGround(e)
      const [px, py, pz] = placement.position
      dragRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        position: [px, py, pz],
        offsetX: hit ? px - hit.x : 0,
        offsetZ: hit ? pz - hit.z : 0,
        axis,
      }
      if (axis === 'depth') onDepthDrag()
      const target = e.target
      if (target && 'setPointerCapture' in target) {
        ;(target as Element).setPointerCapture(e.pointerId)
      }
    },
    [editorActive, intersectGround, onDepthDrag, onSelect, placement.position],
  )

  const handleGroundDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => beginDrag(e, moveAxis),
    [beginDrag, moveAxis],
  )

  const handleDepthDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => beginDrag(e, 'depth'),
    [beginDrag],
  )

  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!editorActive || !dragRef.current) return
      const hit = intersectGround(e)
      const next = applyAxisMove(
        dragRef.current.axis,
        dragRef.current,
        e.clientX,
        e.clientY,
        hit,
      )
      onMove(next)
    },
    [editorActive, intersectGround, onMove],
  )

  // When dragging from depth handle, force depth axis
  const handleDepthMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!editorActive || !dragRef.current) return
      const next = applyAxisMove('depth', dragRef.current, e.clientX, e.clientY, null)
      onMove(next)
    },
    [editorActive, onMove],
  )

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    dragRef.current = null
    const target = e.target
    if (target && 'hasPointerCapture' in target && 'releasePointerCapture' in target) {
      const el = target as Element
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId)
      }
    }
  }, [])

  const handleWheel = useCallback(
    (e: ThreeEvent<WheelEvent>) => {
      if (!editorActive || !selected) return
      e.stopPropagation()
      const delta = e.deltaY > 0 ? -1 : 1
      const [px, py, pz] = placement.position

      if (e.shiftKey) {
        onResize(Math.min(1.2, Math.max(0.2, placement.targetHeight + delta * 0.04)))
        return
      }
      if (e.altKey) {
        onMove([px, py - delta * 0.02, pz])
        return
      }
      onMove([px, py, clampFlowerDepth(pz - delta * 0.1)])
    },
    [editorActive, onMove, onResize, placement.position, placement.targetHeight, selected],
  )

  useFrame((state) => {
    if (editorActive || !swayRef.current || placement.kind === 'stump') return
    const t = state.clock.elapsedTime * 0.55 + swaySeed
    swayRef.current.rotation.z = Math.sin(t) * 0.018
    swayRef.current.rotation.x = Math.sin(t * 0.82 + 0.4) * 0.012
  })

  const [px, py, pz] = placement.position

  return (
    <group
      position={[px, py, pz]}
      rotation={[placement.tiltX ?? 0, placement.rotationY, placement.tiltZ ?? 0]}
    >
      {editorActive && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.04, 0]}
          onPointerDown={handleGroundDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          <circleGeometry args={[0.42, 28]} />
          <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
        </mesh>
      )}

      {editorActive && selected && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
            <ringGeometry args={[0.32, 0.44, 32]} />
            <meshBasicMaterial color="#c080e8" transparent opacity={0.9} depthWrite={false} />
          </mesh>

          {/* Alça de profundidade (eixo Z) */}
          <group position={[0, 0.06, 0.55]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 1.1, 8]} />
              <meshBasicMaterial color="#7ec8ff" transparent opacity={0.75} depthWrite={false} />
            </mesh>
            <mesh
              position={[0, 0, 0.62]}
              onPointerDown={handleDepthDown}
              onPointerMove={handleDepthMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onWheel={handleWheel}
            >
              <sphereGeometry args={[0.11, 14, 14]} />
              <meshBasicMaterial color="#4aa8ff" depthWrite={false} />
            </mesh>
          </group>
        </>
      )}

      <group ref={swayRef} scale={scale} position={[0, yOffset, 0]}>
        <primitive object={prepared} />
      </group>
    </group>
  )
}

function ValeFlowerInstance(props: {
  placement: ValeFlowerPlacement
  editorActive: boolean
  selected: boolean
  moveAxis: FlowerMoveAxis
  onSelect: () => void
  onMove: (position: [number, number, number]) => void
  onResize: (targetHeight: number) => void
  onDepthDrag: () => void
}) {
  if (props.placement.kind === 'fern') {
    return <ValeFernFlowerInstance {...props} />
  }
  if (props.placement.kind === 'lilac') {
    return <ValeLilacFlowerInstance {...props} />
  }
  if (props.placement.kind === 'stump') {
    return <ValeStumpFlowerInstance {...props} />
  }
  return <ValeGltfFlowerInstance {...props} />
}

function ValeGltfFlowerInstance(
  props: Omit<ComponentProps<typeof ValeFlowerInstanceBody>, 'scene'>,
) {
  const scene = useGltfFlowerSource()
  return <ValeFlowerInstanceBody {...props} scene={scene} />
}

function ValeFernFlowerInstance(
  props: Omit<ComponentProps<typeof ValeFlowerInstanceBody>, 'scene'>,
) {
  const scene = useFernFlowerSource()
  return <ValeFlowerInstanceBody {...props} scene={scene} />
}

function ValeLilacFlowerInstance(
  props: Omit<ComponentProps<typeof ValeFlowerInstanceBody>, 'scene'>,
) {
  const scene = useLilacFlowerSource()
  return <ValeFlowerInstanceBody {...props} scene={scene} />
}

function ValeStumpFlowerInstance(
  props: Omit<ComponentProps<typeof ValeFlowerInstanceBody>, 'scene'>,
) {
  const scene = useStumpFlowerSource()
  return <ValeFlowerInstanceBody {...props} scene={scene} />
}

export function ValeSceneFlowers() {
  const placements = useValeFlowerEditorStore((s) => s.placements)
  const editorActive = useValeFlowerEditorStore((s) => s.editorActive)
  const selectedId = useValeFlowerEditorStore((s) => s.selectedId)
  const moveAxis = useValeFlowerEditorStore((s) => s.moveAxis)
  const select = useValeFlowerEditorStore((s) => s.select)
  const patch = useValeFlowerEditorStore((s) => s.patch)
  const setMoveAxis = useValeFlowerEditorStore((s) => s.setMoveAxis)

  return (
    <group name="vale-scene-flowers">
      {placements.map((placement) => (
        <ValeFlowerInstance
          key={placement.id}
          placement={placement}
          editorActive={editorActive}
          selected={selectedId === placement.id}
          moveAxis={moveAxis}
          onSelect={() => select(placement.id)}
          onMove={(position) => patch(placement.id, { position })}
          onResize={(targetHeight) => patch(placement.id, { targetHeight })}
          onDepthDrag={() => setMoveAxis('depth')}
        />
      ))}
    </group>
  )
}

useGLTF.preload(VALE_FLOWER_ASSETS.lavender.url)
preloadSceneFern()
preloadSceneLilac()
preloadSceneStump()
