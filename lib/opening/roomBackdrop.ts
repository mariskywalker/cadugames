export const ROOM_STUDIO_GRADIENT = {
  start: '#E8A0AE',
  mid: '#F0B8C4',
  blend: '#F8D0D8',
  end: '#FFF4F6',
}

export const ROOM_STUDIO_GRADIENT_CSS = `
  radial-gradient(ellipse 90% 58% at 50% 18%, rgba(255, 210, 220, 0.42) 0%, transparent 62%),
  radial-gradient(ellipse 70% 48% at 22% 32%, rgba(255, 190, 205, 0.22) 0%, transparent 55%),
  linear-gradient(
    180deg,
    ${ROOM_STUDIO_GRADIENT.start} 0%,
    ${ROOM_STUDIO_GRADIENT.mid} 34%,
    ${ROOM_STUDIO_GRADIENT.blend} 58%,
    ${ROOM_STUDIO_GRADIENT.end} 100%
  )
`

export const ROOM_STUDIO_FOG = {
  color: '#FFE8EE',
  density: 0.009,
  sheetY: 0.02,
  sheetRadiusMult: 4.2,
  groundOpacity: 0.22,
}

export const ROOM_STUDIO_COLORS = {
  carpet: '#F0B0C0',
  carpetInner: '#F8C8D4',
  carpetEdge: '#E8A0B4',
  carpetShadow: '#D890A8',
}

export const ROOM_STUDIO_LIGHTING = {
  ambient: '#FFF6F8',
  hemisphereSky: '#FFE8EE',
  hemisphereGround: '#F5B8C8',
  key: '#FFF0F4',
  fill: '#FFD8E4',
  rim: '#FFC8D8',
  hubGlow: '#FFB8CC',
  tubeSpill: '#E8F4FF',
}
