import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useCADUStore } from '../../store/useCADUStore'

function formatPosition([x, y, z]) {
  return `[${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}]`
}

/**
 * Modo marcação — clique em qualquer ponto da cena; coords vão para o clipboard e o store.
 */
export function ScenePickTool() {
  const scenePickMode = useCADUStore((s) => s.scenePickMode)
  const sceneEditorMode = useCADUStore((s) => s.sceneEditorMode)
  const lastScenePick = useCADUStore((s) => s.lastScenePick)
  const recordScenePick = useCADUStore((s) => s.recordScenePick)
  const markerRef = useRef()

  const markerMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#fbbf24',
        transparent: true,
        opacity: 0.95,
        depthTest: false,
      }),
    [],
  )

  if (!scenePickMode || sceneEditorMode) return null

  const onPick = (e) => {
    e.stopPropagation()
    const { x, y, z } = e.point
    const hitName = e.object?.name || e.eventObject?.type || 'scene'
    recordScenePick([x, y, z], hitName)
    if (markerRef.current) markerRef.current.position.set(x, y + 0.06, z)
  }

  const markerPos = lastScenePick?.position ?? [0, 0.06, 0]

  return (
    <group>
      <mesh
        name="pick-floor"
        rotation-x={-Math.PI / 2}
        position={[0, 0.015, 0]}
        onPointerDown={onPick}
      >
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {lastScenePick && (
        <group ref={markerRef} position={markerPos}>
          <mesh material={markerMat} renderOrder={999}>
            <sphereGeometry args={[0.14, 16, 12]} />
          </mesh>
          <mesh position={[0, 0.35, 0]} material={markerMat} renderOrder={999}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          </mesh>
        </group>
      )}
    </group>
  )
}

export { formatPosition }
