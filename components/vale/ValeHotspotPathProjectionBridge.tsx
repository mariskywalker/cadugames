'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { VALE_HOTSPOT_EDITOR_ENABLED } from '@/lib/vale/valeGameplay'
import { buildHotspotPath } from '@/lib/vale/valeHotspots'
import { getBuildHotspotPathContext } from '@/lib/vale/valeHotspotPathEditorStorage'
import { getValeHeroGroundY, valeCharacterWorldPos } from '@/lib/vale/valeWorld'
import { useValeHotspotEditorStore } from '@/store/useValeHotspotEditorStore'
import { useValeHotspotPathDebugStore } from '@/store/useValeHotspotPathDebugStore'

const _vec = new THREE.Vector3()

function projectPoint(camera: THREE.Camera, x: number, y: number, z: number) {
  _vec.set(x, y, z)
  _vec.project(camera)
  return {
    x: (_vec.x + 1) / 2,
    y: 1 - (_vec.y + 1) / 2,
    onScreen: _vec.z >= -1 && _vec.z <= 1,
  }
}

/** Projeta path 3D + urso para overlay 2D (só com editor ativo) */
export function ValeHotspotPathProjectionBridge() {
  const editorActive = useValeHotspotEditorStore((s) => s.editorActive)
  const selectedId = useValeHotspotEditorStore((s) => s.selectedId)
  const selectedPoint = useValeHotspotEditorStore((s) => s.selectedPoint)
  const hotspots = useValeHotspotEditorStore((s) => s.hotspots)
  const setProjection = useValeHotspotPathDebugStore((s) => s.setProjection)
  const clearProjection = useValeHotspotPathDebugStore((s) => s.clearProjection)
  const { camera } = useThree()
  const frame = useRef(0)

  useFrame(() => {
    if (!VALE_HOTSPOT_EDITOR_ENABLED || !editorActive || !selectedId) {
      clearProjection()
      return
    }

    frame.current += 1
    if (frame.current % 2 !== 0) return

    const hotspot = hotspots.find((h) => h.id === selectedId)
    if (!hotspot) {
      clearProjection()
      return
    }

    const bearX = valeCharacterWorldPos.x
    const bearZ = valeCharacterWorldPos.z
    const { mainPath } = getBuildHotspotPathContext()
    const route = buildHotspotPath(bearX, bearZ, hotspot, { mainPath })

    const segments: Array<{ x1: number; y1: number; x2: number; y2: number }> = []
    const points: Array<{
      x: number
      y: number
      kind: 'main' | 'start' | 'waypoint' | 'arrive' | 'bear' | 'branch'
      index?: number
      label?: string
      selected?: boolean
    }> = []

    const projectedRoute: Array<{ x: number; y: number }> = []
    for (let i = 0; i < route.length; i++) {
      const p = route[i]!
      const groundY = getValeHeroGroundY(p.x, p.z) + 0.1
      const screen = projectPoint(camera, p.x, groundY, p.z)
      if (!screen.onScreen) continue
      projectedRoute.push({ x: screen.x, y: screen.y })
    }

    for (let i = 1; i < projectedRoute.length; i++) {
      const a = projectedRoute[i - 1]!
      const b = projectedRoute[i]!
      segments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y })
    }

    for (let i = 0; i < mainPath.length; i++) {
      const p = mainPath[i]!
      const groundY = getValeHeroGroundY(p.x, p.z) + 0.1
      const screen = projectPoint(camera, p.x, groundY, p.z)
      if (!screen.onScreen) continue
      points.push({
        x: screen.x,
        y: screen.y,
        kind: 'main',
        index: i,
        selected: selectedPoint.kind === 'main' && selectedPoint.index === i,
        label: `M${i}`,
      })
    }

    const start = hotspot.pathStart
    const startY = getValeHeroGroundY(start.x, start.z) + 0.12
    const startScreen = projectPoint(camera, start.x, startY, start.z)
    if (startScreen.onScreen) {
      points.push({
        x: startScreen.x,
        y: startScreen.y,
        kind: 'start',
        label: 'P',
        selected: selectedPoint.kind === 'start',
      })
    }

    for (let i = 0; i < hotspot.path.length; i++) {
      const p = hotspot.path[i]!
      const groundY = getValeHeroGroundY(p.x, p.z) + 0.1
      const screen = projectPoint(camera, p.x, groundY, p.z)
      if (!screen.onScreen) continue
      const isLast = i === hotspot.path.length - 1
      points.push({
        x: screen.x,
        y: screen.y,
        kind: 'branch',
        index: i,
        selected: selectedPoint.kind === 'branch' && selectedPoint.index === i,
        label: isLast ? '★' : String(i),
      })
    }

    const bearGroundY = getValeHeroGroundY(bearX, bearZ) + 0.14
    const bearScreen = projectPoint(camera, bearX, bearGroundY, bearZ)
    if (bearScreen.onScreen) {
      points.push({
        x: bearScreen.x,
        y: bearScreen.y,
        kind: 'bear',
        label: '🐻',
      })
    }

    setProjection({
      hotspotId: selectedId,
      segments,
      points,
    })
  })

  return null
}
