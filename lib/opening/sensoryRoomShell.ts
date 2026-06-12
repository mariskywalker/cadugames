import { ROOM_STUDIO_GRADIENT, ROOM_STUDIO_LIGHTING } from './roomBackdrop'

export const SENSORY_SHELL_COLORS = {
  wallTop: ROOM_STUDIO_GRADIENT.start,
  wallMid: ROOM_STUDIO_GRADIENT.mid,
  wallBase: ROOM_STUDIO_GRADIENT.blend,
  wallFloor: ROOM_STUDIO_GRADIENT.end,
  lavenderShadow: '#E8D0DC',
  sideWall: '#FFF5F0',
  blueSpill: ROOM_STUDIO_LIGHTING.tubeSpill,
}

export const SENSORY_SHELL_LAYOUT = {
  backZ: -8.6,
  sideX: 10.8,
  sideZ: -1.8,
  sideYaw: 0.52,
  cycloramaRadius: 15.5,
  cycloramaHeight: 10.2,
  cycloramaArc: Math.PI * 0.68,
  cycloramaArcStart: Math.PI * 0.66,
}
