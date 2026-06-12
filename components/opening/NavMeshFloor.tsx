'use client'

import { NAV_ZONE } from '@/lib/opening/sceneComposition'
import { isInsideNavMesh } from '@/lib/opening/navMesh'
import { useOpeningStore } from '@/store/useOpeningStore'

export function NavMeshFloor() {
  const setWalkTarget = useOpeningStore((s) => s.setWalkTarget)
  const [cx, cz] = NAV_ZONE.center

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[cx, 0.024, cz]}
      scale={[NAV_ZONE.radiusX * 1.05, NAV_ZONE.radiusZ * 1.05, 1]}
      renderOrder={20}
      onPointerDown={(e) => {
        if (e.button !== 0) return
        e.stopPropagation()
        const { x, z } = e.point
        if (!isInsideNavMesh(x, z)) return
        setWalkTarget(x, z)
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <circleGeometry args={[1, 48]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
    </mesh>
  )
}
