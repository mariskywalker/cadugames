export const ROOM_STUDIO_GRADIENT = {
  start: '#E8A8AC',
  mid: '#F0C4BE',
  blend: '#F5D4CC',
  end: '#FFF2EC',
}

export const ROOM_STUDIO_GRADIENT_CSS = `
  radial-gradient(ellipse 88% 62% at 68% 14%, rgba(255, 168, 182, 0.32) 0%, transparent 58%),
  radial-gradient(ellipse 72% 50% at 18% 28%, rgba(240, 190, 175, 0.24) 0%, transparent 52%),
  linear-gradient(
    180deg,
    ${ROOM_STUDIO_GRADIENT.start} 0%,
    ${ROOM_STUDIO_GRADIENT.mid} 36%,
    ${ROOM_STUDIO_GRADIENT.blend} 58%,
    ${ROOM_STUDIO_GRADIENT.end} 100%
  )
`

export const ROOM_STUDIO_FOG = {
  color: '#FFF0EB',
  density: 0.024,
  sheetY: 0.024,
  sheetRadiusMult: 3.35,
  groundOpacity: 0.32,
}

export const ROOM_STUDIO_COLORS = {
  carpet: '#E8C4AE',
  carpetInner: '#F5D9C8',
  carpetEdge: '#D4A892',
  carpetShadow: '#C99582',
}

export const ROOM_STUDIO_LIGHTING = {
  ambient: '#FFF3EE',
  hemisphereSky: '#FFE6E2',
  hemisphereGround: '#F5C8C0',
  sunsetKey: '#FFCB9A',
  sunsetFill: '#FFDCC4',
  sunsetRim: '#FFB888',
  tubeFill: '#B8E4F8',
  tubeSpill: '#93C5FD',
}
