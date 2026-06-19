import {
  openingObjectToWorld,
  type OpeningSceneLayout,
  type OpeningSceneObjectId,
} from './openingSceneEditorLayout'
import { ACTIVITY_BARS_APPROACH_ZONE, NAV_ZONE } from './sceneComposition'

const OBSTACLE_DEFS: Partial<
  Record<OpeningSceneObjectId, { radius: number; pad: number }>
> = {
  bubbleColumn: { radius: 0.85, pad: 0.35 },
  ballPit: { radius: 1.05, pad: 0.3 },
  sensoryCocoon: { radius: 1, pad: 0.28 },
  activityBars: { radius: 1.15, pad: 0.22 },
}

export function getOpeningNavObstacles(layout: OpeningSceneLayout) {
  return (Object.keys(OBSTACLE_DEFS) as OpeningSceneObjectId[]).map((id) => {
    const def = OBSTACLE_DEFS[id]!
    const { position } = openingObjectToWorld(layout.objects[id], id, layout)
    return {
      id,
      center: position,
      radius: def.radius,
      pad: def.pad,
    }
  })
}

export { ACTIVITY_BARS_APPROACH_ZONE, NAV_ZONE }
