import * as THREE from 'three'

function buildRadialCanvas(stops: [number, string][]) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const cx = size / 2
  const gradient = ctx.createRadialGradient(cx, cx, 0, cx, cx, size * 0.5)
  for (const [offset, color] of stops) {
    gradient.addColorStop(offset, color)
  }
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

let mistMap: THREE.CanvasTexture | null = null
let shadowMap: THREE.CanvasTexture | null = null

export function getPodiumMistMap() {
  if (!mistMap) {
    mistMap = buildRadialCanvas([
      [0, 'rgba(255, 255, 255, 0)'],
      [0.42, 'rgba(255, 255, 255, 0)'],
      [0.58, 'rgba(255, 178, 190, 0.1)'],
      [0.72, 'rgba(255, 198, 208, 0.32)'],
      [0.86, 'rgba(255, 218, 224, 0.2)'],
      [1, 'rgba(255, 255, 255, 0)'],
    ])
  }
  return mistMap
}

export function getPodiumShadowMap() {
  if (!shadowMap) {
    shadowMap = buildRadialCanvas([
      [0, 'rgba(255, 255, 255, 0)'],
      [0.5, 'rgba(255, 255, 255, 0)'],
      [0.68, 'rgba(210, 110, 135, 0.14)'],
      [0.82, 'rgba(230, 150, 165, 0.1)'],
      [1, 'rgba(255, 255, 255, 0)'],
    ])
  }
  return shadowMap
}
