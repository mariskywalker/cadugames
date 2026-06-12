import { useMemo } from 'react'
import { getStationSequence } from '../../../constants/stationSequences'
import { resolveStationAction } from '../../../utils/stationTransform'
import { useCADUStore } from '../../../store/useCADUStore'

const COLORS = {
  approach: '#38bdf8',
  hangPoint1: '#fbbf24',
  hangPoint2: '#a3e635',
  land: '#fb7185',
}

function Marker({ position, color }) {
  return (
    <group position={position}>
      <mesh renderOrder={999}>
        <sphereGeometry args={[0.1, 12, 10]} />
        <meshBasicMaterial color={color} depthTest={false} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, 0.22, 0]} renderOrder={999}>
        <boxGeometry args={[0.02, 0.35, 0.02]} />
        <meshBasicMaterial color={color} depthTest={false} transparent opacity={0.85} />
      </mesh>
    </group>
  )
}

/** Marcadores visíveis no editor — pontos de ação locais da estação. */
export function ActionPointMarkers({ stationId = 'activityBars' }) {
  const sceneEditorMode = useCADUStore((s) => s.sceneEditorMode)
  const selectedEditorObjectId = useCADUStore((s) => s.selectedEditorObjectId)

  const markers = useMemo(() => {
    const sequence = getStationSequence(stationId)
    if (!sequence?.points) return []

    return Object.entries(sequence.points)
      .map(([id, point]) => {
        const world = resolveStationAction(stationId, point)
        if (!world) return null
        return { id, position: world.position, color: COLORS[id] ?? '#fde68a' }
      })
      .filter(Boolean)
  }, [stationId])

  if (!sceneEditorMode || selectedEditorObjectId !== stationId) return null

  return (
    <group>
      {markers.map((m) => (
        <Marker key={m.id} position={m.position} color={m.color} />
      ))}
    </group>
  )
}
