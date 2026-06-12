/**
 * Layered room scene — render order and parallax depth (world units, pointer-driven).
 * Lower index = farther back. Hotspots (6) are not parallaxed.
 */
export const SCENE_LAYERS = {
  SKY: 0,
  AMBIENT: 1,
  ENVIRONMENT: 2,
  SENSORY: 3,
  CHARACTER: 4,
  MAGIC: 5,
  HOTSPOTS: 6,
}

/** Very slow parallax multipliers per layer (pointer × depth). */
export const SCENE_LAYER_PARALLAX = {
  [SCENE_LAYERS.SKY]: 0.02,
  [SCENE_LAYERS.AMBIENT]: 0.055,
  [SCENE_LAYERS.ENVIRONMENT]: 0.025,
  [SCENE_LAYERS.SENSORY]: 0.012,
  [SCENE_LAYERS.CHARACTER]: 0.008,
  [SCENE_LAYERS.MAGIC]: 0.04,
}
