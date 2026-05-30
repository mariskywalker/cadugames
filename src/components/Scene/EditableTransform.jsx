import { useEffect, useLayoutEffect, useRef } from 'react'
import { useSceneObjectTransform } from '../../hooks/useSceneObjectTransform'
import { useCADUStore } from '../../store/useCADUStore'
import { registerEditorRef, unregisterEditorRef } from '../../utils/editorRefRegistry'

/**
 * Wrapper com ref registrada no editor — position / rotation / scale.
 */
export function EditableTransform({ objectId, defaults, children, onClickSelect = true }) {
  const groupRef = useRef()
  const sceneEditorMode = useCADUStore((s) => s.sceneEditorMode)
  const selectedEditorObjectId = useCADUStore((s) => s.selectedEditorObjectId)
  const sceneEditorDragging = useCADUStore((s) => s.sceneEditorDragging)
  const setSelectedEditorObject = useCADUStore((s) => s.setSelectedEditorObject)
  const transform = useSceneObjectTransform(objectId, defaults)

  useEffect(() => {
    registerEditorRef(objectId, groupRef)
    return () => unregisterEditorRef(objectId)
  }, [objectId])

  useLayoutEffect(() => {
    const g = groupRef.current
    if (!g) return
    if (sceneEditorMode && sceneEditorDragging && selectedEditorObjectId === objectId) return
    g.position.set(...transform.position)
    g.rotation.set(...transform.rotation)
    g.scale.set(...transform.scale)
  }, [transform, sceneEditorMode, sceneEditorDragging, selectedEditorObjectId, objectId])

  const handleClick = (e) => {
    if (!sceneEditorMode || !onClickSelect) return
    e.stopPropagation()
    setSelectedEditorObject(objectId)
  }

  const isSelected = sceneEditorMode && selectedEditorObjectId === objectId

  return (
    <group ref={groupRef} onClick={handleClick}>
      {isSelected && (
        <mesh renderOrder={998}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color="#fbbf24" depthTest={false} transparent opacity={0.85} />
        </mesh>
      )}
      {children}
    </group>
  )
}
