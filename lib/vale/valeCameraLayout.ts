import { VALE_SCENE_ZOOM } from './valeSceneLayout'
import { VALE_CAMERA } from './valeWorld'

export interface ValeCameraLayout {
  posX: number
  posY: number
  posZ: number
  targetX: number
  targetY: number
  targetZ: number
  fov: number
  sceneScale: number
  sceneOriginX: number
  sceneOriginY: number
}

export type ValeCameraOverride = Partial<ValeCameraLayout>

export const DEFAULT_VALE_CAMERA_LAYOUT: ValeCameraLayout = {
  posX: VALE_CAMERA.position[0],
  posY: VALE_CAMERA.position[1],
  posZ: VALE_CAMERA.position[2],
  targetX: VALE_CAMERA.target[0],
  targetY: VALE_CAMERA.target[1],
  targetZ: VALE_CAMERA.target[2],
  fov: VALE_CAMERA.fov,
  sceneScale: VALE_SCENE_ZOOM.scale,
  sceneOriginX: parseFloat(VALE_SCENE_ZOOM.originX),
  sceneOriginY: parseFloat(VALE_SCENE_ZOOM.originY),
}

export function mergeValeCameraLayout(override: ValeCameraOverride = {}): ValeCameraLayout {
  const merged = { ...DEFAULT_VALE_CAMERA_LAYOUT, ...override }
  const result = { ...merged }

  for (const key of Object.keys(DEFAULT_VALE_CAMERA_LAYOUT) as Array<keyof ValeCameraLayout>) {
    const value = result[key]
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      result[key] = DEFAULT_VALE_CAMERA_LAYOUT[key]
    }
  }

  return result
}

export function formatValeCameraExport(layout: ValeCameraLayout): string {
  return `// Cole em lib/vale/valeWorld.ts e lib/vale/valeSceneLayout.ts
export const VALE_CAMERA = {
  position: [${layout.posX}, ${layout.posY}, ${layout.posZ}] as [number, number, number],
  target: [${layout.targetX}, ${layout.targetY}, ${layout.targetZ}] as [number, number, number],
  fov: ${layout.fov},
}

export const VALE_SCENE_ZOOM = {
  scale: ${layout.sceneScale},
  originX: '${layout.sceneOriginX}%',
  originY: '${layout.sceneOriginY}%',
} as const`
}
