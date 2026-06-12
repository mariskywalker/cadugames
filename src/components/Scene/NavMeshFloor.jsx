import { useMemo } from 'react'
import * as THREE from 'three'
import { useCADUStore } from '../../store/useCADUStore'
import { NAV_ZONE } from '../../constants/sceneComposition'
import { isInsideNavMesh } from '../../utils/navMesh'

/**
 * Chão clicável limitado à área navegável.
 */
export function NavMeshFloor() {
  const setWalkTarget = useCADUStore((s) => s.setWalkTarget)
  const debug = useCADUStore((s) => s.debug)
  const scenePickMode = useCADUStore((s) => s.scenePickMode)
  const [cx, cz] = NAV_ZONE.center

  const debugMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#7dd3fc',
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        wireframe: true,
      }),
    [],
  )

  if (scenePickMode) return null

  return (
    <group>
      <mesh
        rotation-x={-Math.PI / 2}
        position={[cx, 0.008, cz]}
        scale={[NAV_ZONE.radiusX * 1.05, NAV_ZONE.radiusZ * 1.05, 1]}
        onPointerDown={(e) => {
          if (e.button !== 0) return
          e.stopPropagation()
          const { x, z } = e.point
          if (!isInsideNavMesh(x, z)) return
          setWalkTarget(x, z)
        }}
      >
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {debug && (
        <mesh
          rotation-x={-Math.PI / 2}
          position={[cx, 0.012, cz]}
          scale={[NAV_ZONE.radiusX, NAV_ZONE.radiusZ, 1]}
          material={debugMat}
        >
          <ringGeometry args={[0.88, 1, 64]} />
        </mesh>
      )}
    </group>
  )
}
