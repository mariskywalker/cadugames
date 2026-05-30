import { TransformControls } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'
import { rotationYToFacePoint } from '../../../constants/activityBarsInteraction'
import { copyActivityBarsPoint } from '../../../constants/activityBarsDefaults'
import { useCADUStore } from '../../../store/useCADUStore'
import { getEditorRef } from '../../../utils/editorRefRegistry'

/** Gizmo no CADU para calibrar animationAnchor manualmente. */
export function ActivityBarsCharacterGizmo({ controlsRef }) {
  const anchorPreview = useCADUStore((s) => s.activityBarsAnchorPreview)
  const previewTick = useCADUStore((s) => s.activityBarsAnchorPreviewTick)
  const anchorGizmoMode = useCADUStore((s) => s.activityBarsAnchorGizmoMode)
  const config = useCADUStore((s) => s.activityBarsConfig)
  const setActivityBarsEditDragging = useCADUStore((s) => s.setActivityBarsEditDragging)

  useEffect(() => {
    if (!anchorPreview) return
    const group = getEditorRef('character')?.current
    if (!group) return

    const point = copyActivityBarsPoint(config.interactionPoint)
    if (!point) return

    group.position.set(point[0], point[1] ?? 0, point[2])
    const [tx, , tz] = config.faceTarget
    const yaw = rotationYToFacePoint(point[0], point[2], tx, tz)
    group.rotation.set(0, yaw, 0)
    group.quaternion.setFromEuler(new THREE.Euler(0, yaw, 0))
  }, [anchorPreview, previewTick, config.interactionPoint, config.faceTarget])

  if (!anchorPreview) return null

  const group = getEditorRef('character')?.current
  if (!group) return null

  return (
    <TransformControls
      object={group}
      mode={anchorGizmoMode}
      space="world"
      size={0.85}
      onMouseDown={() => {
        setActivityBarsEditDragging(true)
        if (controlsRef?.current) controlsRef.current.enabled = false
      }}
      onMouseUp={() => {
        setActivityBarsEditDragging(false)
        if (controlsRef?.current) controlsRef.current.enabled = true
      }}
    />
  )
}
