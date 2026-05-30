import { useMemo } from 'react'
import { SCENE_EDITOR_OBJECT_MAP } from '../constants/sceneEditorRegistry'
import { mergeSceneTransform } from '../utils/sceneEditorStorage'
import { useCADUStore } from '../store/useCADUStore'

export function useSceneObjectTransform(objectId, fallbackDefaults) {
  const overrides = useCADUStore((s) => s.sceneEditorOverrides)
  const registryDefaults = SCENE_EDITOR_OBJECT_MAP[objectId]?.defaults

  return useMemo(() => {
    const defaults = registryDefaults ?? fallbackDefaults
    if (!defaults) {
      return {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      }
    }
    return mergeSceneTransform(defaults, overrides[objectId])
  }, [objectId, registryDefaults, fallbackDefaults, overrides])
}
