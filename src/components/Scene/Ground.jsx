import { useRef } from 'react'
import { useCADUStore } from '../../store/useCADUStore'
import { isDoubleClickMove } from '../../utils/locomotionInput'

export function Ground() {
  const setWalkTarget = useCADUStore((s) => s.setWalkTarget)
  const lastClickRef = useRef({ t: 0, x: 0, z: 0 })

  return (
    <group>
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0, 0]}
        onPointerDown={(e) => {
          if (e.button !== 0) return
          e.stopPropagation()
          const { x, z } = e.point
          const now = performance.now()
          const run = isDoubleClickMove(now, lastClickRef.current, e.point)
          lastClickRef.current = { t: now, x, z }
          setWalkTarget(x, z, { run })
        }}
      >
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}
