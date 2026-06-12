import { SCENE_HUB } from './sceneLayout'

export const CHARACTER_STATES = {
  IDLE: 'idle',
  WALK: 'walk',
  RUN: 'run',
} as const

export type CharacterState = (typeof CHARACTER_STATES)[keyof typeof CHARACTER_STATES]

export const MOVE_SPEED = 0.75
export const RUN_SPEED = 1.45
export const ROTATION_SPEED = 10
export const ARRIVAL_THRESHOLD = 0.18
export const CROSSFADE_DURATION = 0.25

export const BUBBLE_TUBE_CENTER: [number, number, number] = [SCENE_HUB[0], 0, SCENE_HUB[2]]
export const BUBBLE_TUBE_RADIUS = 0.72
export const BUBBLE_TUBE_HEIGHT = 4.0
export const CHARACTER_Y_OFFSET = 0
