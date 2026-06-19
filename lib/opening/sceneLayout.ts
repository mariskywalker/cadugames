export const PODIUM_RADIUS = 7

const PODIUM_TIERS = {
  outer: { h: 0.22, y: 0.11 },
  mid: { h: 0.18, y: 0.31 },
  inner: { h: 0.14, y: 0.47 },
} as const

/** Topo do palco interno (mesh 3D legado). */
export const PODIUM_SURFACE_Y = PODIUM_TIERS.inner.y + PODIUM_TIERS.inner.h * 0.5

/** Plano do chão da cena — base (bottom) dos objetos em y = 0. */
export const SCENE_FLOOR_Y = 0
export const SCENE_HUB: [number, number, number] = [0, SCENE_FLOOR_Y, 0]
export const SCENE_HUB_RADIUS = PODIUM_RADIUS

/** Z sugerido do palco (atrás dos objetos). */
export const OPENING_PODIUM_DEFAULT_Z = -4.5

/** Z mínimo do background (mais negativo = mais ao fundo). Prefira resolveBackdropWorldZ(layout). */
export function openingBackdropZ(distance: number, behindZ?: number) {
  if (behindZ != null) return behindZ - Math.max(distance, 2)
  return -Math.max(distance, 6)
}
