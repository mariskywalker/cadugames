export const CHARACTER_STATES = {
  IDLE: 'idle',
  WALK: 'walk',
  RUN: 'run',
  HAPPY: 'happy',
  SAD: 'sad',
  ANGRY: 'angry',
  SCARED: 'scared',
}

export const MOVE_SPEED = 0.75
export const RUN_SPEED = 1.45
export const ROTATION_SPEED = 10
export const ARRIVAL_THRESHOLD = 0.18
export const CROSSFADE_DURATION = 0.25

/** @deprecated use animationCommandMap */
export const LOCOMOTION_CLIPS = {
  IDLE: 'Idle_11',
  WALK: 'Walking',
  RUN: 'Running',
}

/** Duplo clique / toques rápidos nas setas → correr. */
export const RUN_INPUT_WINDOW_MS = 380
export const RUN_INPUT_MIN_TAPS = 2
export const DOUBLE_CLICK_MAX_DIST = 0.85

import { SCENE_HUB } from './sceneLayout'

export const INTERACTION_CENTER = [SCENE_HUB[0], 0, SCENE_HUB[2]]
export const INTERACTION_RADIUS = 3.1

export const BUBBLE_TUBE_CENTER = [SCENE_HUB[0], 0, SCENE_HUB[2]]
export const BUBBLE_TUBE_RADIUS = 0.72
export const BUBBLE_TUBE_HEIGHT = 4.0

export const CHARACTER_Y_OFFSET = 0
