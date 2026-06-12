import { BUBBLE_TUBE_HEIGHT } from './animations'
import { SCENE_FLOOR_Y, SCENE_HUB } from './sceneLayout'

export const STAGE_CENTER = SCENE_HUB
export const BUBBLE_TUBE_LOOK_Y = STAGE_CENTER[1] + BUBBLE_TUBE_HEIGHT * 0.46

export const FIXED_CAMERA = {
  position: [0, 1.52, 10.75] as [number, number, number],
  target: [STAGE_CENTER[0], BUBBLE_TUBE_LOOK_Y, STAGE_CENTER[2]] as [number, number, number],
  fov: 50,
}

export function rotationYFacingCamera(x: number, z: number, yawOffset = 0) {
  return Math.atan2(FIXED_CAMERA.position[0] - x, FIXED_CAMERA.position[2] - z) + yawOffset
}

export const SCENE_OBJECTS = {
  bubbleColumn: {
    id: 'bubbleColumn',
    position: [0, 0, 1.09] as [number, number, number],
    scale: [1.08, 1.261, 1.08] as [number, number, number],
  },
  ballPit: {
    id: 'ballPit',
    position: [-2.83, 0.03, 5.62] as [number, number, number],
    rotation: [0, 1.129, 0] as [number, number, number],
    scale: [0.772, 0.485, 0.646] as [number, number, number],
    navRadius: 2.0,
  },
  sensoryCocoon: {
    id: 'sensoryCocoon',
    position: [3.2, 0.31, 4.03] as [number, number, number],
    rotation: [0, -0.643, 0] as [number, number, number],
    navRadius: 1.42,
  },
  activityBars: {
    id: 'activityBars',
    position: [3.71, SCENE_FLOOR_Y, 3.78] as [number, number, number],
    rotation: [3.142, -0.96, 3.142] as [number, number, number],
    navRadius: 1.68,
  },
  emotionPanel: {
    id: 'emotionPanel',
    position: [4.95, 1.76, 0.05] as [number, number, number],
    navRadius: 1.25,
  },
}

export const NAV_ZONE = {
  center: [STAGE_CENTER[0], STAGE_CENTER[2] - 0.05] as [number, number],
  radiusX: 3.2,
  radiusZ: 4.45,
}

export const ACTIVITY_BARS_APPROACH_ZONE = {
  center: [3.05, 4.25] as [number, number],
  radius: 2.1,
}

export const NAV_OBSTACLES = [
  { id: 'bubbleColumn', center: SCENE_OBJECTS.bubbleColumn.position, radius: 1.22, pad: 0.48 },
  { id: 'ballPit', center: SCENE_OBJECTS.ballPit.position, radius: SCENE_OBJECTS.ballPit.navRadius, pad: 0.52 },
  {
    id: 'sensoryCocoon',
    center: SCENE_OBJECTS.sensoryCocoon.position,
    radius: SCENE_OBJECTS.sensoryCocoon.navRadius,
    pad: 0.45,
  },
  {
    id: 'activityBars',
    center: SCENE_OBJECTS.activityBars.position,
    radius: 0.88,
    pad: 0.24,
  },
  {
    id: 'emotionPanel',
    center: SCENE_OBJECTS.emotionPanel.position,
    radius: SCENE_OBJECTS.emotionPanel.navRadius,
    pad: 0.44,
  },
]

const tube = SCENE_OBJECTS.bubbleColumn.position
const tubeNav = NAV_OBSTACLES.find((o) => o.id === 'bubbleColumn')
const standOff = (tubeNav?.radius ?? 1.22) + (tubeNav?.pad ?? 0.48) + 0.38

export const CADU_SPAWN: [number, number, number] = [tube[0], 0, tube[2] + standOff]
export const CADU_SPAWN_ROTATION: [number, number, number] = [
  0,
  rotationYFacingCamera(CADU_SPAWN[0], CADU_SPAWN[2]),
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
