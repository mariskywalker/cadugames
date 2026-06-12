import { BUBBLE_TUBE_HEIGHT } from './animations'
import { SCENE_HUB } from './sceneLayout'

/** Palco central — coluna de bolhas no centro visual. */
export const STAGE_CENTER = SCENE_HUB

/** Centro visual da coluna (alvo da câmera fixa). */
export const BUBBLE_TUBE_LOOK_Y = STAGE_CENTER[1] + BUBBLE_TUBE_HEIGHT * 0.46

/** Câmera fixa — validada pelo usuário. */
export const FIXED_CAMERA = {
  position: [0, 1.52, 10.75],
  target: [STAGE_CENTER[0], BUBBLE_TUBE_LOOK_Y, STAGE_CENTER[2]],
  fov: 50,
}

/** Rotação Y para encarar a câmera fixa (plano XZ). */
export function rotationYFacingCamera(x, z, yawOffset = 0) {
  return (
    Math.atan2(FIXED_CAMERA.position[0] - x, FIXED_CAMERA.position[2] - z) + yawOffset
  )
}

/**
 * Layout calibrado no editor de cena (G / ?edit=1).
 */
export const SCENE_OBJECTS = {
  bubbleColumn: {
    id: 'bubbleColumn',
    label: 'Coluna de bolhas',
    position: [0, 0, 1.09],
    scale: [1.08, 1.261, 1.08],
    hotspot: {
      yOffset: 2.05,
      walkTarget: [STAGE_CENTER[0] + 0.92, STAGE_CENTER[2] + 0.58],
      proximity: 2.15,
      static: false,
      distanceFactor: 10,
    },
  },

  ballPit: {
    id: 'ballPit',
    label: 'Piscina de bolinhas',
    position: [-2.83, 0.03, 5.62],
    rotation: [0, 1.129, 0],
    scale: [0.772, 0.485, 0.646],
    hotspot: {
      yOffset: 1.02,
      walkTarget: [0.1, 2.68],
      proximity: 3.4,
      static: true,
      distanceFactor: 5.6,
      foreground: true,
    },
    navRadius: 2.0,
  },

  sensoryCocoon: {
    id: 'sensoryCocoon',
    label: 'Casulo sensorial',
    position: [3.2, 0.31, 4.03],
    rotation: [0, -0.643, 0],
    hotspot: {
      yOffset: 1.18,
      proximity: 2.25,
      static: false,
      distanceFactor: 10.5,
    },
    navRadius: 1.42,
    approachAngle: 0.62,
  },

  activityBars: {
    id: 'activityBars',
    label: 'Barras de atividades',
    position: [3.71, 0, 3.78],
    rotation: [3.142, -0.96, 3.142],
    hotspotPosition: [3.71, 1.22, 3.78],
    hotspot: {
      yOffset: 1.22,
      proximity: 4.5,
      static: true,
      distanceFactor: 10.5,
    },
    navRadius: 1.68,
    approachAngle: 0.12,
  },

  emotionPanel: {
    id: 'emotionPanel',
    label: 'Painel emocional',
    position: [4.95, 1.76, 0.05],
    hotspot: {
      yOffset: 1.15,
      walkTarget: [4.1, 0.85],
      proximity: 2.05,
      static: false,
      distanceFactor: 11,
    },
    navRadius: 1.25,
  },
}

/** @deprecated aliases */
export const BALL_PIT_LAYOUT = {
  position: SCENE_OBJECTS.ballPit.position,
  rotation: SCENE_OBJECTS.ballPit.rotation,
  scale: SCENE_OBJECTS.ballPit.scale,
  hotspotYOffset: SCENE_OBJECTS.ballPit.hotspot.yOffset,
}

export const OBJECT_LAYOUT = {
  ballPit: BALL_PIT_LAYOUT,
  sensoryCocoon: {
    position: SCENE_OBJECTS.sensoryCocoon.position,
    rotation: SCENE_OBJECTS.sensoryCocoon.rotation,
  },
  activityBars: {
    position: SCENE_OBJECTS.activityBars.position,
    rotation: SCENE_OBJECTS.activityBars.rotation,
  },
}

export const EMOTION_PANEL_ANCHOR = {
  position: SCENE_OBJECTS.emotionPanel.position,
  walkTarget: SCENE_OBJECTS.emotionPanel.hotspot.walkTarget,
  hotspotYOffset: SCENE_OBJECTS.emotionPanel.hotspot.yOffset,
  proximity: SCENE_OBJECTS.emotionPanel.hotspot.proximity,
}

export const NAV_ZONE = {
  center: [STAGE_CENTER[0], STAGE_CENTER[2] - 0.05],
  /** Expandido para cobrir interactionPoint / animationAnchor das barras. */
  radiusX: 3.2,
  radiusZ: 4.45,
}

/** Bolha walkable em frente às barras — inclui marcadores verde e vermelho. */
export const ACTIVITY_BARS_APPROACH_ZONE = {
  center: [3.05, 4.25],
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
    /** Raio menor — estrutura central; approach zone cobre os marcadores. */
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

/** Frente do tubo, de frente para a câmera. */
export const CADU_SPAWN = (() => {
  const tube = SCENE_OBJECTS.bubbleColumn.position
  const tubeNav = NAV_OBSTACLES.find((o) => o.id === 'bubbleColumn')
  const standOff = (tubeNav?.radius ?? 1.22) + (tubeNav?.pad ?? 0.48) + 0.38
  return [tube[0], 0, tube[2] + standOff]
})()

export const CADU_SPAWN_ROTATION = [
  0,
  rotationYFacingCamera(CADU_SPAWN[0], CADU_SPAWN[2]),
  0,
]

export function walkTargetNearObject(position, obstacleRadius, approachAngle, standOff = 0.62) {
  const r = obstacleRadius + standOff
  return [
    position[0] + Math.sin(approachAngle) * r,
    position[2] + Math.cos(approachAngle) * r,
  ]
}

export function hotspotWorldPosition(objectDef) {
  if (objectDef.hotspotPosition) return objectDef.hotspotPosition
  return [
    objectDef.position[0],
    objectDef.position[1] ?? 0,
    objectDef.position[2],
  ]
}

export function sceneObjectDefaults(objectDef) {
  return {
    position: [...objectDef.position],
    rotation: objectDef.rotation ? [...objectDef.rotation] : [0, 0, 0],
    scale: objectDef.scale ? [...objectDef.scale] : [1, 1, 1],
  }
}
