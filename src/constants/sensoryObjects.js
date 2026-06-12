import {
  SCENE_OBJECTS,
  hotspotWorldPosition,
  walkTargetNearObject,
} from './sceneComposition'
import { getStationSequence } from './stationSequences'

const GLB = {
  ballPit: '/models/bolinhaspiscina.glb',
  activityBars: '/models/barras.glb',
  sensoryCocoon: '/models/balanco.glb',
}

function buildStation(key, model) {
  const def = SCENE_OBJECTS[key]
  const walkTarget =
    def.hotspot.walkTarget ??
    walkTargetNearObject(def.position, def.navRadius, def.approachAngle ?? 0)

  return {
    id: def.id,
    label: def.label,
    url: model.url,
    position: def.position,
    rotation: def.rotation,
    scale: def.scale ?? [1, 1, 1],
    ...model.station,
    hotspotPosition: def.hotspotPosition,
    hotspotYOffset: def.hotspot.yOffset,
    proximity: def.hotspot.proximity,
    staticHotspot: def.hotspot.static === true,
    foreground: def.hotspot.foreground === true,
    walkTarget,
    navRadius: def.navRadius,
    approachAngle: def.approachAngle,
  }
}

const STATIONS = [
  buildStation('ballPit', {
    url: GLB.ballPit,
    station: {
      scaleToCharacter: true,
      characterScaleMode: 'fit',
      characterHeightMult: 0.76,
      characterWidthMult: 2.32,
      scaleMult: 1.1,
      renderOrder: 32,
      grounded: true,
      sway: null,
      idleMotion: null,
    },
  }),
  buildStation('activityBars', {
    url: GLB.activityBars,
    station: {
      scaleToCharacter: true,
      characterScaleMode: 'height',
      characterHeightMult: 1.86,
      characterWidthMult: 1.86,
      grounded: true,
      sway: { z: 0.004, x: 0.002, speed: 0.28 },
      idleMotion: null,
    },
  }),
  buildStation('sensoryCocoon', {
    url: GLB.sensoryCocoon,
    station: {
      scaleToCharacter: true,
      characterScaleMode: 'height',
      characterHeightMult: 1.3,
      characterWidthMult: 1.06,
      sway: { z: 0.012, x: 0.007, speed: 0.38 },
      idleMotion: 'sway',
    },
  }),
]

export const BALL_PIT_STATION = STATIONS.find((s) => s.id === 'ballPit')
export const SENSORY_OBJECT_STATIONS = STATIONS

function buildHotspot(defKey) {
  const def = SCENE_OBJECTS[defKey]
  const station = STATIONS.find((s) => s.id === def.id)
  return {
    id: def.id,
    label: def.label,
    position: hotspotWorldPosition(def),
    walkTarget: def.hotspot.walkTarget ?? station?.walkTarget,
    sequenceId: getStationSequence(def.id) ? def.id : null,
    hotspotYOffset: def.hotspot.yOffset,
    proximity: def.hotspot.proximity,
    static: def.hotspot.static === true,
    distanceFactor: def.hotspot.distanceFactor ?? 11,
    zIndexRange: def.hotspot.foreground ? [120, 0] : [40, 0],
  }
}

/** Ordem: fundo → foreground (piscina por último). */
export const SENSORY_HOTSPOTS = [
  'bubbleColumn',
  'sensoryCocoon',
  'activityBars',
  'emotionPanel',
  'ballPit',
].map(buildHotspot)

/** @deprecated */
export const BUBBLE_COLUMN_HOTSPOT = SENSORY_HOTSPOTS[0]
export const EMOTION_PANEL_HOTSPOT = SENSORY_HOTSPOTS[3]
export const THERAPEUTIC_CIRCUIT_STATIONS = SENSORY_OBJECT_STATIONS
