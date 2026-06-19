'use client'

import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import { BUBBLE_TUBE_HEIGHT, BUBBLE_TUBE_RADIUS } from '@/lib/opening/animations'
import {
  BUBBLE_TUBE_GLB_TARGET_HEIGHT,
  BUBBLE_TUBE_GLB_URL,
} from '@/lib/opening/bubbleTube'
import { measureBubbleTubeGeometry } from '@/lib/opening/bubbleTubeMetrics'
import { makeCelMaterial } from '@/lib/opening/celShade'
import { SCENE_OBJECTS, sceneObjectDefaults } from '@/lib/opening/sceneComposition'
import { OPENING_INTERACTIVE_RENDER_ORDER } from '@/lib/opening/openingSceneEditorLayout'
import { BubbleTubeVideoScreen } from './BubbleTubeVideoScreen'

const TUBE_BASE_SCALE = sceneObjectDefaults(SCENE_OBJECTS.bubbleColumn).scale[0]

const DEFAULT_METRICS = {
  innerRadius: BUBBLE_TUBE_RADIUS * 0.78,
  height: BUBBLE_TUBE_HEIGHT,
}

function isTubeBaseMesh(
  box: THREE.Box3,
  center: THREE.Vector3,
  size: THREE.Vector3,
  shell: ReturnType<typeof measureBubbleTubeGeometry>,
) {
  const totalH = shell.localMaxY - shell.localMinY
  const baseTop = shell.localMinY + totalH * 0.26
  const touchesFloor = box.min.y <= shell.localMinY + totalH * 0.06
  const inBaseBand = center.y <= baseTop
  const wideEnough = Math.max(size.x, size.z) >= shell.localOuterRadius * 0.45
  const lowProfile = size.y <= totalH * 0.42
  return touchesFloor && inBaseBand && wideEnough && lowProfile
}

function applyTubeMaterials(
  root: THREE.Object3D,
  shell: ReturnType<typeof measureBubbleTubeGeometry>,
  cache: Map<string, THREE.MeshToonMaterial>,
) {
  const _size = new THREE.Vector3()
  const _center = new THREE.Vector3()

  root.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh?.isMesh) return
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.renderOrder = OPENING_INTERACTIVE_RENDER_ORDER

    const box = new THREE.Box3().setFromObject(mesh)
    box.getSize(_size)
    box.getCenter(_center)
    const isBase = isTubeBaseMesh(box, _center, _size, shell)

    const original = mesh.material
    const materials = Array.isArray(original) ? original : [original]
    const nextMaterials = materials.map((mat) => {
      if (!mat) return mat
      const cacheKey = `${mat.uuid}-${isBase ? 'base' : 'glass'}`
      const cached = cache.get(cacheKey)
      if (cached) return cached

      const cel = makeCelMaterial(mat)
      if (isBase) {
        cel.transparent = false
        cel.opacity = 1
        cel.depthWrite = true
        cel.depthTest = true
        cel.side = THREE.DoubleSide
      } else {
        cel.transparent = true
        cel.opacity = 0.18
        cel.depthWrite = false
        cel.depthTest = true
        cel.side = THREE.DoubleSide
      }
      cache.set(cacheKey, cel)
      return cel
    })
    mesh.material = Array.isArray(original) ? nextMaterials : nextMaterials[0]
  })
}

function hideInteriorDecorMeshes(root: THREE.Object3D, shell: ReturnType<typeof measureBubbleTubeGeometry>) {
  const { localInnerRadius, localOuterRadius, localMinY, localMaxY } = shell
  const yLo = localMinY + (localMaxY - localMinY) * 0.06
  const yHi = localMaxY - (localMaxY - localMinY) * 0.06
  const _size = new THREE.Vector3()
  const _center = new THREE.Vector3()

  root.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh) return
    const box = new THREE.Box3().setFromObject(mesh)
    box.getSize(_size)
    box.getCenter(_center)
    if (isTubeBaseMesh(box, _center, _size, shell)) return

    const radial = Math.hypot(_center.x, _center.z)
    const inShellY = _center.y > yLo && _center.y < yHi
    const spansShellWall = Math.max(_size.x, _size.z) >= localOuterRadius * 0.68
    const inInterior = radial < localInnerRadius * 1.02 && inShellY

    if (inInterior && !spansShellWall) mesh.visible = false
  })
}

export function BubbleTubeGlb({
  onMetrics,
}: {
  onMetrics?: (m: {
    innerRadius: number
    height: number
    outerRadius?: number
  }) => void
}) {
  const rootRef = useRef<Group>(null)
  const matCache = useRef(new Map<string, THREE.MeshToonMaterial>())
  const { scene } = useGLTF(BUBBLE_TUBE_GLB_URL)

  const { tubeGroup, shell } = useMemo(() => {
    const original = scene.clone(true)
    const geom = measureBubbleTubeGeometry(original)
    hideInteriorDecorMeshes(original, geom)
    applyTubeMaterials(original, geom, matCache.current)

    const group = new THREE.Group()
    group.add(original)
    return { tubeGroup: group, shell: geom }
  }, [scene])

  const transform = useMemo(() => {
    const { localShellHeight, localCenterY, localInnerRadius, localOuterRadius, localMinY, localMaxY } =
      shell
    const fullHeight = Math.max(localMaxY - localMinY, 0.001)
    const scale = BUBBLE_TUBE_GLB_TARGET_HEIGHT / fullHeight

    return {
      scale,
      yOffset: -localMinY * scale,
      innerRadius: localInnerRadius * scale,
      outerRadius: localOuterRadius * scale,
      height: localShellHeight * scale,
      localCenterY,
      localShellHeight,
      localInnerRadius,
    }
  }, [shell])

  useEffect(() => {
    onMetrics?.(transform)
  }, [transform, onMetrics])

  const baseH = shell.localBaseTopY - shell.localMinY
  const baseY = shell.localMinY + baseH * 0.5

  return (
    <group ref={rootRef} scale={transform.scale} position={[0, transform.yOffset, 0]}>
      <primitive object={tubeGroup} />
      <mesh position={[0, baseY, 0]} renderOrder={OPENING_INTERACTIVE_RENDER_ORDER}>
        <cylinderGeometry args={[shell.localOuterRadius * 1.02, shell.localOuterRadius * 1.02, baseH, 48]} />
        <meshStandardMaterial color="#eef2f7" roughness={0.92} metalness={0} />
      </mesh>
      <BubbleTubeVideoScreen
        centerY={transform.localCenterY}
        height={transform.localShellHeight}
        radius={transform.localInnerRadius}
      />
    </group>
  )
}

useGLTF.preload(BUBBLE_TUBE_GLB_URL)
