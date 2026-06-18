'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { Group } from 'three'
import {
  VALE_WALK_DEBUG,
  WALKABLE_LAYER,
  getPathPointAtT,
  getValePathHalfWidth,
  registerValeWalkable,
  unregisterValeWalkable,
  type ValeWalkPathPoint,
} from '@/lib/vale/valeWalkable'
import { VALE_HERO_MODE, getValeHeroGroundY } from '@/lib/vale/valeWorld'
import { useValeWalkPathEditorStore } from '@/store/useValeWalkPathEditorStore'

type SegmentSpec = {
  midX: number
  midZ: number
  length: number
  width: number
  groundY: number
  rotationY: number
  blockWidth: number
}

function buildWalkSegments(points: ReadonlyArray<ValeWalkPathPoint>): SegmentSpec[] {
  const segments: SegmentSpec[] = []

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const dx = b.x - a.x
    const dz = b.z - a.z
    const length = Math.hypot(dx, dz)
    if (length < 1e-4) continue

    const midX = (a.x + b.x) * 0.5
    const midZ = (a.z + b.z) * 0.5
    const t = i / Math.max(1, points.length - 2)
    const halfA = a.halfWidth ?? getValePathHalfWidth(t)
    const halfB = b.halfWidth ?? getValePathHalfWidth(Math.min(1, t + 0.15))
    const width = (halfA + halfB) * 2.05
    const groundY = getValeHeroGroundY(midX, midZ)

    segments.push({
      midX,
      midZ,
      length: length + 0.18,
      width,
      groundY,
      rotationY: Math.atan2(dx, dz),
      blockWidth: Math.max(1.1, 2.6 - t * 1.4),
    })
  }

  return segments
}

/** Superfície invisível do caminho de pedras — única fonte de altura para o urso */
export function ValeWalkablePath() {
  const rootRef = useRef<Group>(null)
  const hydrate = useValeWalkPathEditorStore((s) => s.hydrate)
  const points = useValeWalkPathEditorStore((s) => s.points)
  const segments = useMemo(() => buildWalkSegments(points), [points])
  const endPoint = useMemo(() => getPathPointAtT(0.995), [points])
  const debug = VALE_WALK_DEBUG

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (VALE_HERO_MODE) return
    const root = rootRef.current
    if (!root) return
    root.userData.walkable = true
    registerValeWalkable(root)
    return () => unregisterValeWalkable(root)
  }, [])

  return (
    <group ref={rootRef} name="vale-walkable-path">
      {segments.map((seg, index) => (
        <group key={`walk-seg-${index}`}>
          <mesh
            position={[seg.midX, seg.groundY + 0.045, seg.midZ]}
            rotation={[0, seg.rotationY, 0]}
            userData={{ walkable: true }}
            layers={WALKABLE_LAYER}
            renderOrder={debug ? 40 : -20}
          >
            <boxGeometry args={[seg.width, 0.09, seg.length]} />
            {debug ? (
              <meshBasicMaterial
                attach="material"
                color="#3ecf6a"
                transparent
                opacity={0.38}
                depthWrite={false}
              />
            ) : (
              <meshBasicMaterial
                attach="material"
                transparent
                opacity={0}
                depthWrite={false}
                colorWrite={false}
              />
            )}
          </mesh>

          {debug && (
            <>
              {(() => {
                const perpX = Math.cos(seg.rotationY)
                const perpZ = -Math.sin(seg.rotationY)
                const offset = seg.width * 0.5 + seg.blockWidth * 0.5
                return (
                  <>
                    <mesh
                      position={[seg.midX + perpX * offset, seg.groundY + 0.04, seg.midZ + perpZ * offset]}
                      rotation={[0, seg.rotationY, 0]}
                      renderOrder={39}
                    >
                      <boxGeometry args={[seg.blockWidth, 0.07, seg.length]} />
                      <meshBasicMaterial color="#e84b4b" transparent opacity={0.28} depthWrite={false} />
                    </mesh>
                    <mesh
                      position={[seg.midX - perpX * offset, seg.groundY + 0.04, seg.midZ - perpZ * offset]}
                      rotation={[0, seg.rotationY, 0]}
                      renderOrder={39}
                    >
                      <boxGeometry args={[seg.blockWidth, 0.07, seg.length]} />
                      <meshBasicMaterial color="#e84b4b" transparent opacity={0.28} depthWrite={false} />
                    </mesh>
                  </>
                )
              })()}
            </>
          )}
        </group>
      ))}

      <mesh
        position={[endPoint.x, getValeHeroGroundY(endPoint.x, endPoint.z) + 0.9, endPoint.z - 0.22]}
        userData={{ walkable: false, valeBarrier: true }}
        renderOrder={debug ? 39 : -20}
      >
        <boxGeometry args={[2.4, 1.8, 0.35]} />
        {debug ? (
          <meshBasicMaterial color="#e84b4b" transparent opacity={0.42} depthWrite={false} />
        ) : (
          <meshBasicMaterial attach="material" transparent opacity={0} depthWrite={false} colorWrite={false} />
        )}
      </mesh>
    </group>
  )
}
