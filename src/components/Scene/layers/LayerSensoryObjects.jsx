import { Suspense } from 'react'
import { BubbleTube } from '../BubbleTube'
import { ModelErrorBoundary } from '../ModelErrorBoundary'
import { SENSORY_OBJECT_STATIONS } from '../../../constants/sensoryObjects'
import { SCENE_OBJECTS, sceneObjectDefaults } from '../../../constants/sceneComposition'
import { EditableTransform } from '../EditableTransform'
import { SensoryStation } from '../sensory/SensoryStation'

/**
 * LAYER 3 — bubble column + sensory stations with subtle idle motion.
 */
export function LayerSensoryObjects() {
  return (
    <group>
      <ModelErrorBoundary>
        <Suspense fallback={null}>
          <BubbleTube />
        </Suspense>
      </ModelErrorBoundary>

      {SENSORY_OBJECT_STATIONS.filter((s) => !s.foreground).map((station) => (
        <EditableTransform
          key={station.id}
          objectId={station.id}
          defaults={{
            position: station.position,
            rotation: station.rotation ?? [0, 0, 0],
            scale: station.scale ?? [1, 1, 1],
          }}
        >
          <SensoryStation station={station} embedded />
        </EditableTransform>
      ))}

      <EditableTransform
        objectId="emotionPanel"
        defaults={sceneObjectDefaults(SCENE_OBJECTS.emotionPanel)}
      >
        <mesh visible={false}>
          <boxGeometry args={[0.5, 1.2, 0.12]} />
        </mesh>
      </EditableTransform>
    </group>
  )
}
