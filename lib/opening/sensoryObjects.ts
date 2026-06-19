import { OPENING_ASSETS } from './assets'
import { SCENE_OBJECTS } from './sceneComposition'

export interface SensoryStationConfig {
  id: string
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale?: [number, number, number]
  foreground?: boolean
  scaleToCharacter: boolean
  characterScaleMode: 'fit' | 'height' | 'width'
  characterHeightMult: number
  characterWidthMult: number
  scaleMult?: number
  targetHeight?: number
  grounded: boolean
  sway: { z: number; x: number; speed: number } | null
  idleMotion: string | null
}

const STATIONS: SensoryStationConfig[] = [
  {
    id: 'ballPit',
    url: OPENING_ASSETS.ballPit,
    position: SCENE_OBJECTS.ballPit.position,
    rotation: SCENE_OBJECTS.ballPit.rotation,
    foreground: true,
    scaleToCharacter: false,
    characterScaleMode: 'fit',
    characterHeightMult: 0.42,
    characterWidthMult: 0.42,
    scaleMult: 1,
    targetHeight: 0.62,
    grounded: true,
    sway: null,
    idleMotion: null,
  },
  {
    id: 'activityBars',
    url: OPENING_ASSETS.bars,
    position: SCENE_OBJECTS.activityBars.position,
    rotation: SCENE_OBJECTS.activityBars.rotation,
    scaleToCharacter: false,
    characterScaleMode: 'height',
    characterHeightMult: 0.62,
    characterWidthMult: 0.62,
    targetHeight: 2.45,
    grounded: true,
    sway: { z: 0.003, x: 0.0015, speed: 0.22 },
    idleMotion: null,
  },
  {
    id: 'sensoryCocoon',
    url: OPENING_ASSETS.sensorySwing,
    position: SCENE_OBJECTS.sensoryCocoon.position,
    rotation: SCENE_OBJECTS.sensoryCocoon.rotation,
    scaleToCharacter: false,
    characterScaleMode: 'height',
    characterHeightMult: 0.58,
    characterWidthMult: 0.58,
    targetHeight: 2.2,
    grounded: true,
    sway: { z: 0.008, x: 0.004, speed: 0.3 },
    idleMotion: 'sway',
  },
]

export const BALL_PIT_STATION = STATIONS.find((s) => s.id === 'ballPit')!
export const SENSORY_OBJECT_STATIONS = STATIONS
