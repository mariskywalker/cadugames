import {
  DEFAULT_VALE_CAMERA_LAYOUT,
  mergeValeCameraLayout,
  type ValeCameraLayout,
  type ValeCameraOverride,
} from './valeCameraLayout'

export const CAMERA_EDITOR_STORAGE_KEY = 'cadu.vale.camera.overrides'

export function loadCameraOverride(): ValeCameraOverride {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(CAMERA_EDITOR_STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { version?: number; camera?: ValeCameraOverride }
    if (data.version !== 1) return {}
    return data.camera ?? {}
  } catch {
    return {}
  }
}

export function saveCameraOverride(override: ValeCameraOverride) {
  try {
    localStorage.setItem(
      CAMERA_EDITOR_STORAGE_KEY,
      JSON.stringify({ version: 1, camera: override, savedAt: Date.now() }),
    )
  } catch {
    // ignore
  }
}

export function loadMergedCameraLayout() {
  return mergeValeCameraLayout(loadCameraOverride())
}

export function resetCameraOverride() {
  saveCameraOverride({})
  return mergeValeCameraLayout({})
}

export function buildCameraOverride(layout: ValeCameraLayout): ValeCameraOverride {
  const override: ValeCameraOverride = {}
  const base = DEFAULT_VALE_CAMERA_LAYOUT
  if (Math.abs(layout.posX - base.posX) > 0.001) override.posX = layout.posX
  if (Math.abs(layout.posY - base.posY) > 0.001) override.posY = layout.posY
  if (Math.abs(layout.posZ - base.posZ) > 0.001) override.posZ = layout.posZ
  if (Math.abs(layout.targetX - base.targetX) > 0.001) override.targetX = layout.targetX
  if (Math.abs(layout.targetY - base.targetY) > 0.001) override.targetY = layout.targetY
  if (Math.abs(layout.targetZ - base.targetZ) > 0.001) override.targetZ = layout.targetZ
  if (Math.abs(layout.fov - base.fov) > 0.01) override.fov = layout.fov
  if (Math.abs(layout.sceneScale - base.sceneScale) > 0.001) override.sceneScale = layout.sceneScale
  if (Math.abs(layout.sceneOriginX - base.sceneOriginX) > 0.01) override.sceneOriginX = layout.sceneOriginX
  if (Math.abs(layout.sceneOriginY - base.sceneOriginY) > 0.01) override.sceneOriginY = layout.sceneOriginY
  return override
}
