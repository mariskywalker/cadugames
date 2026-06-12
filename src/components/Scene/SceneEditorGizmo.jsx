import { TransformControls } from '@react-three/drei'
import { useCADUStore } from '../../store/useCADUStore'
import { getEditorRef } from '../../utils/editorRefRegistry'

export function SceneEditorGizmo({ controlsRef }) {
  const sceneEditorMode = useCADUStore((s) => s.sceneEditorMode)
  const selectedEditorObjectId = useCADUStore((s) => s.selectedEditorObjectId)
  const sceneEditorTransformMode = useCADUStore((s) => s.sceneEditorTransformMode)
  const updateEditorTransform = useCADUStore((s) => s.updateEditorTransform)
  const setSceneEditorDragging = useCADUStore((s) => s.setSceneEditorDragging)

  if (!sceneEditorMode || !selectedEditorObjectId) return null

  const targetRef = getEditorRef(selectedEditorObjectId)
  const object = targetRef?.current
  if (!object) return null

  const syncTransform = () => {
    updateEditorTransform(selectedEditorObjectId, {
      position: [object.position.x, object.position.y, object.position.z],
      rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
      scale: [object.scale.x, object.scale.y, object.scale.z],
    })
  }

  return (
    <TransformControls
      object={object}
      mode={sceneEditorTransformMode}
      space="world"
      size={0.85}
      onMouseDown={() => {
        setSceneEditorDragging(true)
        if (controlsRef?.current) controlsRef.current.enabled = false
      }}
      onMouseUp={() => {
        setSceneEditorDragging(false)
        if (controlsRef?.current) controlsRef.current.enabled = true
        syncTransform()
      }}
      onObjectChange={syncTransform}
    />
  )
}
