import { SCENE_FLOOR_Y, SCENE_HUB } from './sceneLayout'

export const STAGE_CENTER = SCENE_HUB
export const STAGE_LOOK_Y = SCENE_FLOOR_Y + 0.85

export const FIXED_CAMERA = {
  position: [0, 3.2, 8] as [number, number, number],
  target: [STAGE_CENTER[0], STAGE_LOOK_Y, STAGE_CENTER[2]] as [number, number, number],
  fov: 50,
}

export const CADU_CHARACTER_SCALE = 0.7

export function rotationYFacingCamera(x: number, z: number, yawOffset = 0) {
  return Math.atan2(FIXED_CAMERA.position[0] - x, FIXED_CAMERA.position[2] - z) + yawOffset
}

function onFloor(x: number, yOffset = 0, z: number): [number, number, number] {
  return [x, SCENE_FLOOR_Y + yOffset, z]
}

export const SCENE_OBJECTS = {
  bubbleColumn: {
    id: 'bubbleColumn',
    position: onFloor(1.35, 0, 0.15),
    scale: [0.9, 1.05, 0.9] as [number, number, number],
  },
  ballPit: {
    id: 'ballPit',
    position: onFloor(2.55, 0, 2.35),
    rotation: [0, -0.72, 0] as [number, number, number],
    scale: [1, 1, 1] as [number, number, number],
    navRadius: 1.1,
  },
  sensoryCocoon: {
    id: 'sensoryCocoon',
    position: onFloor(3.05, 0.18, 0.35),
    rotation: [0, -0.92, 0] as [number, number, number],
    navRadius: 1.0,
  },
  activityBars: {
    id: 'activityBars',
    position: onFloor(3.35, 0, -0.75),
    rotation: [0, -1.05, 0] as [number, number, number],
    navRadius: 1.2,
  },
  emotionPanel: {
    id: 'emotionPanel',
    position: [4.2, SCENE_FLOOR_Y + 1.4, -0.2] as [number, number, number],
    navRadius: 1.0,
  },
}

export const NAV_ZONE = {
  center: [0, -0.35] as [number, number],
  radiusX: 4.4,
  radiusZ: 5.4,
}

export const ACTIVITY_BARS_APPROACH_ZONE = {
  center: [3, -4.8] as [number, number],
  radius: 1.8,
}

export const NAV_OBSTACLES = [
  { id: 'bubbleColumn', center: SCENE_OBJECTS.bubbleColumn.position, radius: 0.95, pad: 0.35 },
  { id: 'ballPit', center: SCENE_OBJECTS.ballPit.position, radius: SCENE_OBJECTS.ballPit.navRadius, pad: 0.3 },
  {
    id: 'sensoryCocoon',
    center: SCENE_OBJECTS.sensoryCocoon.position,
    radius: SCENE_OBJECTS.sensoryCocoon.navRadius,
    pad: 0.28,
  },
  {
    id: 'activityBars',
    center: SCENE_OBJECTS.activityBars.position,
    radius: SCENE_OBJECTS.activityBars.navRadius,
    pad: 0.22,
  },
]

export const CADU_SPAWN: [number, number, number] = onFloor(-1.05, 0, 1.2)
export const CADU_SPAWN_ROTATION: [number, number, number] = [
  0,
  rotationYFacingCamera(CADU_SPAWN[0], CADU_SPAWN[2], 0.22),
  0,
]

export function sceneObjectDefaults(objectDef: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}) {
  return {
    position: [...objectDef.position] as [number, number, number],
    rotation: objectDef.rotation ? ([...objectDef.rotation] as [number, number, number]) : ([0, 0, 0] as [number, number, number]),
    scale: objectDef.scale ? ([...objectDef.scale] as [number, number, number]) : ([1, 1, 1] as [number, number, number]),
  }
}
