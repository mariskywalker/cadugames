import { SENSORY_HOTSPOTS } from '../../../constants/sensoryObjects'
import { EditorAwareHotspot } from '../hotspots/EditorAwareHotspot'

/**
 * LAYER 6 — hotspots alinhados aos objetos (ordem já define profundidade visual).
 */
export function LayerHotspots() {
  return (
    <group>
      {SENSORY_HOTSPOTS.map((hotspot) => (
        <EditorAwareHotspot key={hotspot.id} hotspot={hotspot} />
      ))}
    </group>
  )
}
