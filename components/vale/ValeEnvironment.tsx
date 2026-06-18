'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { Group } from 'three'
import { prepareGlbImportedLighting } from '@/lib/vale/glbImportedLighting'
import { computeValeComposition } from '@/lib/vale/valeComposition'
import { markValeObjectNonWalkable } from '@/lib/vale/valeWalkable'
import { valeStageReady, valeTerrain } from '@/lib/vale/valeWorld'
import { useValeIslandEditorStore } from '@/store/useValeIslandEditorStore'
const GLB_PATH = '/models/vale-palavras-lite.glb'

type IslandLayout = {
  island: Group
  center: THREE.Vector3
  minY: number
  maxXZ: number
}

function buildCasaUrsoLayout(scene: THREE.Object3D): IslandLayout {
  const cloned = scene.clone(true)

  prepareGlbImportedLighting(cloned)
  markValeObjectNonWalkable(cloned)

  const box = new THREE.Box3().setFromObject(cloned)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)

  const maxXZ = Math.max(size.x, size.z) || 1
  const island = new THREE.Group()
  island.add(cloned)

  return { island, center, minY: box.min.y, maxXZ }
}

function applyStageTransform(
  stage: Group,
  layout: IslandLayout,
  islandSize: number,
  offset: [number, number, number],
  rotationDeg: { x: number; y: number; z: number },
) {
  const scale = islandSize / layout.maxXZ
  stage.scale.setScalar(scale)
  stage.rotation.order = 'YXZ'
  stage.rotation.set(
    (rotationDeg.x * Math.PI) / 180,
    (rotationDeg.y * Math.PI) / 180,
    (rotationDeg.z * Math.PI) / 180,
  )
  stage.position.set(
    -layout.center.x * scale + offset[0],
    -layout.minY * scale + offset[1],
    -layout.center.z * scale + offset[2],
  )
  stage.updateMatrixWorld(true)
}

/** Carrega e renderiza o GLB real: /models/vale-palavras-lite.glb */
export function ValeEnvironment() {
  const { scene } = useGLTF(GLB_PATH)
  const { size } = useThree()
  const stageRef = useRef<Group>(null)
  const layoutRef = useRef<IslandLayout | null>(null)
  const islandSizeRef = useRef(0)
  const [stageReady, setStageReady] = useState(false)
  const islandLayout = useValeIslandEditorStore((s) => s.layout)
  const hydrateIsland = useValeIslandEditorStore((s) => s.hydrate)

  const layout = useMemo(() => buildCasaUrsoLayout(scene), [scene])
  layoutRef.current = layout

  useEffect(() => {
    hydrateIsland()
  }, [hydrateIsland])

  const offset = useMemo(
    (): [number, number, number] => [
      islandLayout.offsetX,
      islandLayout.offsetY,
      islandLayout.offsetZ,
    ],
    [islandLayout.offsetX, islandLayout.offsetY, islandLayout.offsetZ],
  )
  const rotationDeg = useMemo(
    () => ({
      x: islandLayout.rotationXDeg,
      y: islandLayout.rotationYDeg,
      z: islandLayout.rotationZDeg,
    }),
    [islandLayout.rotationXDeg, islandLayout.rotationYDeg, islandLayout.rotationZDeg],
  )

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage || size.width < 16 || size.height < 16) return

    const { islandSize } = computeValeComposition(size.width, size.height)
    islandSizeRef.current = islandSize
    applyStageTransform(stage, layout, islandSize, offset, rotationDeg)
    valeTerrain.object = stage
    valeStageReady.ready = true
    setStageReady(true)

    return () => {
      valeStageReady.ready = false
      if (valeTerrain.object === stage) valeTerrain.object = null
    }
  }, [layout, size.height, size.width, offset, rotationDeg])

  useFrame(() => {
    const stage = stageRef.current
    const current = layoutRef.current
    if (!stage || !current || !stageReady) return
    const { islandSize } = computeValeComposition(size.width, size.height)
    const sizeChanged = Math.abs(islandSize - islandSizeRef.current) >= 0.02
    if (!sizeChanged) return
    islandSizeRef.current = islandSize
    applyStageTransform(stage, current, islandSize, offset, rotationDeg)
  })

  return (
    <group ref={stageRef} visible={stageReady}>
      <primitive object={layout.island} />
    </group>
  )
}

useGLTF.preload(GLB_PATH)
