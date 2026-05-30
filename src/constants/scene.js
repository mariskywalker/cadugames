export {
  CADU_SPAWN as CADU_START_POSITION,
  CADU_SPAWN_ROTATION as CADU_START_ROTATION,
  FIXED_CAMERA,
} from './sceneComposition'
import { FIXED_CAMERA } from './sceneComposition'

export const DEFAULT_CAMERA_POSITION = FIXED_CAMERA.position
export const DEFAULT_CAMERA_TARGET = FIXED_CAMERA.target
export const DEFAULT_CAMERA_FOV = FIXED_CAMERA.fov

export const CAMERA_STORAGE_KEY = 'cadu.camera.v1'
