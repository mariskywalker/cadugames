/**
 * Fundo da sala 3D — linear do Figma (Fill → Linear, 100%).
 * 0% #E1556C → 100% #FFA0A8
 */
export const ROOM_STUDIO_GRADIENT = {
  start: '#E1556C',
  end: '#FFA0A8',
}

/** CSS equivalente ao degradê do Figma (esquerda → direita). */
export const ROOM_STUDIO_GRADIENT_CSS = `linear-gradient(90deg, ${ROOM_STUDIO_GRADIENT.start} 0%, ${ROOM_STUDIO_GRADIENT.end} 100%)`

/** Névoa no horizonte — tom derivado do degradê. */
export const ROOM_STUDIO_FOG = {
  color: '#FFA0A8',
  density: 0.024,
  sheetY: 0.026,
  sheetRadiusMult: 3.2,
  groundOpacity: 0.32,
}

export const ROOM_STUDIO_COLORS = {
  background: ROOM_STUDIO_GRADIENT.end,
  fog: ROOM_STUDIO_FOG.color,
  carpet: '#F8ACAF',
  carpetInner: '#F8B6B7',
}

export const ROOM_BACKDROP_URL = '/scene/room-backdrop.png'
