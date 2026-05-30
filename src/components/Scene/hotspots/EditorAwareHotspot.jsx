import { useMemo } from 'react'
import { SCENE_EDITOR_OBJECT_MAP } from '../../../constants/sceneEditorRegistry'
import { useSceneObjectTransform } from '../../../hooks/useSceneObjectTransform'
import { SensoryHotspot } from '../hotspots/SensoryHotspot'

export function EditorAwareHotspot({ hotspot }) {
  const registry = SCENE_EDITOR_OBJECT_MAP[hotspot.id]
  const transform = useSceneObjectTransform(hotspot.id, registry?.defaults)

  const adjusted = useMemo(() => {
    const [x, y, z] = transform.position
    return {
      ...hotspot,
      position: [x, y ?? 0, z],
    }
  }, [hotspot, transform.position])

  return <SensoryHotspot hotspot={adjusted} />
}
