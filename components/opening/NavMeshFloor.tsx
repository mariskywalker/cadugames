'use client'

import { NAV_ZONE } from '@/lib/opening/sceneComposition'
import { SCENE_FLOOR_Y } from '@/lib/opening/sceneLayout'
import { isInsideNavMesh } from '@/lib/opening/navMesh'
import { useOpeningStore } from '@/store/useOpeningStore'
import { useOpeningSceneEditorStore } from '@/store/useOpeningSceneEditorStore'

export function NavMeshFloor() {
  const setWalkTarget = useOpeningStore((s) => s.setWalkTarget)
  const editorActive = useOpeningSceneEditorStore((s) => s.editorActive)
  const [cx, cz] = NAV_ZONE.center

  if (editorActive) return null

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[cx, SCENE_FLOOR_Y + 0.02, cz]}
      scale={[NAV_ZONE.radiusX * 1.05, NAV_ZONE.radiusZ * 1.05, 1]}
      renderOrder={-1}
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
      <circleGeometry args={[1, 64]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
    </mesh>
  )
}
