/** Transformação 3D para camadas 2D (caminho, props) */
export interface LayerTransform {
  translateXPx?: number
  translateYPx?: number
  translateZPx?: number
  rotateDeg: number
  rotateXDeg?: number
  rotateYDeg?: number
  flipX?: boolean
}

export type LayerMoveAxis = 'anchor' | 'offset' | 'depth'

export function buildLayerTransform({
  translateXPx = 0,
  translateYPx = 0,
  translateZPx = 0,
  rotateDeg,
  rotateXDeg = 0,
  rotateYDeg = 0,
  flipX,
}: LayerTransform): string {
  const parts = [
    `translateX(${translateXPx}px)`,
    `translateY(${translateYPx}px)`,
    `translateZ(${translateZPx}px)`,
    `rotateX(${rotateXDeg}deg)`,
    `rotateY(${rotateYDeg}deg)`,
    `rotateZ(${rotateDeg}deg)`,
  ]
  if (flipX) parts.push('scaleX(-1)')
  return parts.join(' ')
}

export function layerMoveFromPointer(
  axis: LayerMoveAxis,
  dxPx: number,
  dyPx: number,
  start: {
    leftPct: number
    bottomPct: number
    translateXPx: number
    translateYPx: number
    translateZPx: number
  },
): Partial<LayerTransform & { left: string; bottom: string }> {
  if (axis === 'offset') {
    return {
      translateXPx: start.translateXPx + dxPx,
      translateYPx: start.translateYPx - dyPx,
    }
  }
  if (axis === 'depth') {
    return { translateZPx: start.translateZPx - dyPx * 0.6 }
  }
  const vw = window.innerWidth / 100
  const vh = window.innerHeight / 100
  return {
    left: `${Math.min(100, Math.max(0, start.leftPct + dxPx / vw)).toFixed(1)}%`,
    bottom: `${Math.min(90, Math.max(0, start.bottomPct - dyPx / vh)).toFixed(1)}%`,
  }
}

export function pickLayerMoveAxis(shiftKey: boolean, altKey: boolean): LayerMoveAxis {
  if (altKey) return 'depth'
  if (shiftKey) return 'offset'
  return 'anchor'
}

export function formatTranslateExport(t: LayerTransform): string {
  const x = t.translateXPx != null && t.translateXPx !== 0 ? `, translateXPx: ${t.translateXPx}` : ''
  const y = t.translateYPx != null && t.translateYPx !== 0 ? `, translateYPx: ${t.translateYPx}` : ''
  const z = t.translateZPx != null && t.translateZPx !== 0 ? `, translateZPx: ${t.translateZPx}` : ''
  return `${x}${y}${z}`
}
