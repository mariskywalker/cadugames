import { Line, TransformControls } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useCADUStore } from '../../../store/useCADUStore'
import {
  ACTIVITY_BARS_POINT_KEYS,
  getActivityBarsPointRef,
  isAnimationAnchorKey,
} from '../../../utils/activityBarsEditorRefs'

const MARKER_COLORS = {
  hotspotPosition: '#fbbf24',
  interactionPoint: '#4ade80',
  faceTarget: '#38bdf8',
  animationAnchor: '#ef4444',
}

function ConfigMarker({ pointKey, position, rotation, selected, onSelect }) {
  const color = MARKER_COLORS[pointKey]
  const radius = pointKey === 'animationAnchor' ? 0.11 : 0.13

  return (
    <group
      ref={getActivityBarsPointRef(pointKey)}
      position={position}
      rotation={rotation ?? [0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(pointKey)
      }}
    >
      <mesh renderOrder={998}>
        <sphereGeometry args={[radius, 18, 14]} />
        <meshBasicMaterial
          color={color}
          depthTest={false}
          transparent
          opacity={selected ? 1 : 0.88}
        />
      </mesh>
      {selected && (
        <mesh renderOrder={997}>
          <sphereGeometry args={[radius * 1.45, 18, 14]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}

function ActivityBarsConfigGizmo({ controlsRef }) {
  const selection = useCADUStore((s) => s.activityBarsEditSelection)
  const activityBarsAnchorGizmoMode = useCADUStore((s) => s.activityBarsAnchorGizmoMode)
  const updateActivityBarsConfigPoint = useCADUStore((s) => s.updateActivityBarsConfigPoint)
  const updateActivityBarsAnimationAnchor = useCADUStore((s) => s.updateActivityBarsAnimationAnchor)
  const setActivityBarsEditDragging = useCADUStore((s) => s.setActivityBarsEditDragging)

  const targetRef = getActivityBarsPointRef(selection)
  const object = targetRef?.current
  if (!object || !selection) return null

  const syncTransform = () => {
    if (isAnimationAnchorKey(selection)) {
      updateActivityBarsAnimationAnchor({
        position: [object.position.x, object.position.y, object.position.z],
        rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
      })
      return
    }
    updateActivityBarsConfigPoint(selection, [
      object.position.x,
      object.position.y,
      object.position.z,
    ])
  }

  return (
    <TransformControls
      object={object}
      mode={isAnimationAnchorKey(selection) ? activityBarsAnchorGizmoMode : 'translate'}
      space="world"
      size={0.75}
      onMouseDown={() => {
        setActivityBarsEditDragging(true)
        if (controlsRef?.current) controlsRef.current.enabled = false
      }}
      onMouseUp={() => {
        setActivityBarsEditDragging(false)
        if (controlsRef?.current) controlsRef.current.enabled = true
        syncTransform()
      }}
      onObjectChange={syncTransform}
    />
  )
}

export function ActivityBarsConfigEditor({ controlsRef }) {
  const editMode = useCADUStore((s) => s.activityBarsEditMode)
  const config = useCADUStore((s) => s.activityBarsConfig)
  const selection = useCADUStore((s) => s.activityBarsEditSelection)
  const setActivityBarsEditSelection = useCADUStore((s) => s.setActivityBarsEditSelection)

  const lookLine = useMemo(
    () => [config.interactionPoint, config.faceTarget],
    [config.interactionPoint, config.faceTarget],
  )

  const anchorLine = useMemo(
    () => [config.interactionPoint, config.animationAnchor?.position ?? config.interactionPoint],
    [config.interactionPoint, config.animationAnchor],
  )

  useEffect(() => {
    if (!editMode) return
    for (const key of ACTIVITY_BARS_POINT_KEYS) {
      const ref = getActivityBarsPointRef(key)
      const obj = ref?.current
      if (!obj) continue

      if (isAnimationAnchorKey(key)) {
        const anchor = config.animationAnchor
        if (!anchor?.position) continue
        obj.position.set(anchor.position[0], anchor.position[1], anchor.position[2])
        const rot = anchor.rotation ?? [0, 0, 0]
        obj.rotation.set(rot[0], rot[1], rot[2])
        obj.quaternion.setFromEuler(new THREE.Euler(rot[0], rot[1], rot[2]))
        continue
      }

      const pos = config[key]
      if (!pos) continue
      obj.position.set(pos[0], pos[1], pos[2])
      obj.rotation.set(0, 0, 0)
    }
  }, [editMode, config])

  if (!editMode) return null

  return (
    <group name="activity-bars-config-editor">
      <Line points={lookLine} color="#38bdf8" lineWidth={2.5} transparent opacity={0.95} depthTest={false} />
      <Line
        points={anchorLine}
        color="#ef4444"
        lineWidth={1.5}
        transparent
        opacity={0.7}
        dashed
        dashSize={0.08}
        gapSize={0.06}
        depthTest={false}
      />

      {ACTIVITY_BARS_POINT_KEYS.map((key) => (
        <ConfigMarker
          key={key}
          pointKey={key}
          position={
            key === 'animationAnchor'
              ? config.animationAnchor?.position ?? config.interactionPoint
              : config[key]
          }
          rotation={key === 'animationAnchor' ? config.animationAnchor?.rotation : undefined}
          selected={selection === key}
          onSelect={setActivityBarsEditSelection}
        />
      ))}

      <ActivityBarsConfigGizmo controlsRef={controlsRef} />
    </group>
  )
}
