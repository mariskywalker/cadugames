'use client'

import { Line, Text } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { VALE_HOTSPOT_EDITOR_ENABLED } from '@/lib/vale/valeGameplay'
import { buildHotspotPath } from '@/lib/vale/valeHotspots'
import { getBuildHotspotPathContext } from '@/lib/vale/valeHotspotPathEditorStorage'
import { getValeHeroGroundY, valeCharacterWorldPos } from '@/lib/vale/valeWorld'
import { useValeHotspotEditorStore } from '@/store/useValeHotspotEditorStore'
import { useValeStore } from '@/store/useValeStore'

function groundY(x: number, z: number) {
  return getValeHeroGroundY(x, z) + 0.1
}

function toLinePoints(waypoints: Array<{ x: number; z: number }>) {
  return waypoints.map((p) => new THREE.Vector3(p.x, groundY(p.x, p.z), p.z))
}

function PathMarker({
  index,
  x,
  z,
  color,
  size = 0.08,
  label,
}: {
  index: number
  x: number
  z: number
  color: string
  size?: number
  label?: string
}) {
  const y = groundY(x, z)
  return (
    <group position={[x, y, z]}>
      <mesh>
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial color={color} depthTest={false} transparent opacity={0.92} />
      </mesh>
      <Text
        position={[0, 0.14, 0]}
        fontSize={0.11}
        color="#1b3d1f"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#ffffff"
      >
        {label ?? String(index)}
      </Text>
    </group>
  )
}

/** Debug 3D — caminho principal + ramificação do hotspot selecionado */
export function ValeHotspotPathDebug() {
  const editorActive = useValeHotspotEditorStore((s) => s.editorActive)
  const selectedId = useValeHotspotEditorStore((s) => s.selectedId)
  const selectedPoint = useValeHotspotEditorStore((s) => s.selectedPoint)
  const hotspots = useValeHotspotEditorStore((s) => s.hotspots)
  const journey = useValeStore((s) => s.hotspotJourney)
  const gameplayMainPath = useMemo(() => getBuildHotspotPathContext().mainPath, [])

  const selectedHotspot = useMemo(
    () => hotspots.find((h) => h.id === selectedId) ?? null,
    [hotspots, selectedId],
  )

  const preview = useMemo(() => {
    if (!selectedHotspot) return null
    const { x, z } = valeCharacterWorldPos
    return buildHotspotPath(x, z, selectedHotspot, { mainPath: gameplayMainPath })
  }, [selectedHotspot, gameplayMainPath, journey?.hotspotId, journey?.segmentIndex])

  if (!VALE_HOTSPOT_EDITOR_ENABLED || !editorActive) return null

  const mainPoints = toLinePoints(gameplayMainPath)
  const routePoints = preview ? toLinePoints(preview) : []
  const bearX = valeCharacterWorldPos.x
  const bearZ = valeCharacterWorldPos.z

  return (
    <group name="vale-hotspot-path-debug">
      <Line
        points={mainPoints}
        color="#6ecf82"
        lineWidth={1.5}
        dashed
        dashSize={0.18}
        gapSize={0.12}
        depthTest={false}
        transparent
        opacity={0.55}
      />

      {gameplayMainPath.map((p, i) => (
        <PathMarker
          key={`main-${i}`}
          index={i}
          x={p.x}
          z={p.z}
          color={selectedPoint.kind === 'main' && selectedPoint.index === i ? '#e91e63' : '#48bb62'}
          size={selectedPoint.kind === 'main' && selectedPoint.index === i ? 0.09 : 0.06}
          label={`M${i}`}
        />
      ))}

      {routePoints.length > 1 && (
        <Line
          points={routePoints}
          color="#ffd54f"
          lineWidth={2.5}
          dashed
          dashSize={0.22}
          gapSize={0.1}
          depthTest={false}
        />
      )}

      {preview?.map((p, i) => (
        <PathMarker
          key={`route-${i}`}
          index={i}
          x={p.x}
          z={p.z}
          color={i === preview.length - 1 ? '#ffc107' : '#8bc34a'}
          size={i === preview.length - 1 ? 0.11 : 0.08}
        />
      ))}

      {selectedHotspot && (
        <PathMarker
          index={0}
          x={selectedHotspot.pathStart.x}
          z={selectedHotspot.pathStart.z}
          color={selectedPoint.kind === 'start' ? '#e91e63' : '#ff9800'}
          size={selectedPoint.kind === 'start' ? 0.13 : 0.11}
          label="P"
        />
      )}

      {selectedHotspot?.path.map((p, i) => {
        const isSelected = selectedPoint.kind === 'branch' && selectedPoint.index === i
        const isLast = i === selectedHotspot.path.length - 1
        return (
          <PathMarker
            key={`branch-${i}`}
            index={i}
            x={p.x}
            z={p.z}
            color={isSelected ? '#e91e63' : isLast ? '#ffeb3b' : '#66bb6a'}
            size={isSelected ? 0.12 : isLast ? 0.11 : 0.08}
            label={isLast ? '★' : String(i)}
          />
        )
      })}

      <PathMarker index={0} x={bearX} z={bearZ} color="#42a5f5" size={0.1} label="🐻" />
    </group>
  )
}
