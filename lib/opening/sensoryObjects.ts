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
    scale: SCENE_OBJECTS.ballPit.scale,
    foreground: true,
    scaleToCharacter: true,
    characterScaleMode: 'fit',
    characterHeightMult: 0.76,
    characterWidthMult: 2.32,
    scaleMult: 1.1,
    grounded: true,
    sway: null,
    idleMotion: null,
  },
  {
    id: 'activityBars',
    url: OPENING_ASSETS.bars,
    position: SCENE_OBJECTS.activityBars.position,
    rotation: SCENE_OBJECTS.activityBars.rotation,
    scaleToCharacter: true,
    characterScaleMode: 'height',
    characterHeightMult: 1.86,
    characterWidthMult: 1.86,
    grounded: true,
    sway: { z: 0.004, x: 0.002, speed: 0.28 },
    idleMotion: null,
  },
  {
    id: 'sensoryCocoon',
    url: OPENING_ASSETS.sensorySwing,
    position: SCENE_OBJECTS.sensoryCocoon.position,
    rotation: SCENE_OBJECTS.sensoryCocoon.rotation,
    scaleToCharacter: true,
    characterScaleMode: 'height',
    characterHeightMult: 1.3,
    characterWidthMult: 1.06,
    grounded: false,
    sway: { z: 0.012, x: 0.007, speed: 0.38 },
    idleMotion: 'sway',
  },
]

export const BALL_PIT_STATION = STATIONS.find((s) => s.id === 'ballPit')!
export const SENSORY_OBJECT_STATIONS = STATIONS
