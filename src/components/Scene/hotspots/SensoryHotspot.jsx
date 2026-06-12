import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useCallback, useMemo, useState } from 'react'
import { useCADUStore } from '../../../store/useCADUStore'
import { logBarsClick } from '../../../utils/activityBarsDebug'

function distXZ(a, b) {
  const dx = a[0] - b[0]
  const dz = a[2] - b[2]
  return Math.hypot(dx, dz)
}

/**
 * Floating indicator — label on hover / proximity.
 * Hotspots `static` mantêm o orbe sempre visível (ex.: piscina em foreground).
 */
export function SensoryHotspot({ hotspot }) {
  const [hovered, setHovered] = useState(false)
  const [near, setNear] = useState(false)
  const scenePickMode = useCADUStore((s) => s.scenePickMode)
  const sceneEditorMode = useCADUStore((s) => s.sceneEditorMode)
  const activityBarsEditMode = useCADUStore((s) => s.activityBarsEditMode)
  const activityBarsConfig = useCADUStore((s) => s.activityBarsConfig)
  const setWalkTarget = useCADUStore((s) => s.setWalkTarget)
  const charPos = useCADUStore((s) => s.characterWorldPosition)

  const isActivityBars = hotspot.id === 'activityBars'

  const worldPosition = useMemo(() => {
    if (isActivityBars) return activityBarsConfig.hotspotPosition
    return [hotspot.position[0], hotspot.position[1] ?? 0, hotspot.position[2]]
  }, [isActivityBars, activityBarsConfig.hotspotPosition, hotspot.position])

  const htmlOffsetY = isActivityBars ? 0 : (hotspot.hotspotYOffset ?? 1.1)

  if (sceneEditorMode || activityBarsEditMode) return null

  const isStatic = hotspot.static === true
  const distanceFactor = hotspot.distanceFactor ?? 11
  const zIndexRange = hotspot.zIndexRange ?? [40, 0]

  useFrame(() => {
    if (isStatic) return
    const d = distXZ(charPos, worldPosition)
    const next = d < (hotspot.proximity ?? 2.2)
    if (next !== near) setNear(next)
  })

  const showLabel = hovered || (near && !isStatic)
  const showOrb = isStatic || hovered || near

  const onActivate = useCallback(() => {
    if (useCADUStore.getState().playerControlLocked) return
    if (hotspot.sequenceId === 'activityBars') {
      try {
        logBarsClick(useCADUStore.getState().activityBarsConfig)
        useCADUStore.getState().startActivityBarsInteraction()
      } catch (err) {
        console.error(err)
        useCADUStore.getState().setAnimationError(err.message)
      }
      return
    }
    if (hotspot.sequenceId) {
      useCADUStore.getState().startStationSequence(hotspot.sequenceId)
      return
    }
    const [wx, wz] = hotspot.walkTarget ?? [worldPosition[0], worldPosition[2]]
    setWalkTarget(wx, wz)
  }, [hotspot.sequenceId, hotspot.walkTarget, worldPosition, setWalkTarget])

  if (scenePickMode) return null

  return (
    <group position={worldPosition}>
      <Html center position={[0, htmlOffsetY, 0]} distanceFactor={distanceFactor} zIndexRange={zIndexRange}>
        <button
          type="button"
          className={[
            'scene-hotspot',
            isStatic && 'scene-hotspot--static',
            showOrb && 'scene-hotspot--visible',
            showLabel && 'scene-hotspot--revealed',
            hovered && 'scene-hotspot--hover',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label={hotspot.label}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation()
            onActivate()
          }}
        >
          <span className="scene-hotspot__orb" aria-hidden />
          <span className="scene-hotspot__ring" aria-hidden />
          <span className="scene-hotspot__label">{hotspot.label}</span>
        </button>
      </Html>
    </group>
  )
}
