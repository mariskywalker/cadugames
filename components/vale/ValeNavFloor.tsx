'use client'

import { VALE_NAV, isInsideValeNav } from '@/lib/vale/valeWorld'
import { useValeStore } from '@/store/useValeStore'

/** Disco invisível sobre o platô que captura cliques/toques para mover o urso. */
export function ValeNavFloor() {
  const setWalkTarget = useValeStore((s) => s.setWalkTarget)
  const [cx, cz] = VALE_NAV.center

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[cx, 0.03, cz]}
      scale={[VALE_NAV.radius * 1.08, VALE_NAV.radius * 1.08, 1]}
      renderOrder={20}
      onPointerDown={(e) => {
        if (e.button !== 0) return
        e.stopPropagation()
        const { x, z } = e.point
        if (!isInsideValeNav(x, z)) return
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
