/** Assets das plantas do Vale — GLB ou OBJ+MTL */
export const VALE_FLOWER_ASSETS = {
  lavender: {
    type: 'gltf' as const,
    url: '/models/cenario/purple-flower-with-green-stems-and-leaves-2026-02-08-23-48-56-utc/16%20Lavender.glb',
  },
  fern: {
    type: 'obj' as const,
  },
  lilac: {
    type: 'gltf' as const,
    url: '/models/cenario/two-pink-flowers-2026-02-09-00-22-32-utc/Magnolia.glb',
  },
  stump: {
    type: 'obj' as const,
  },
} as const

export type ValeFlowerKind = keyof typeof VALE_FLOWER_ASSETS

export interface ValeFlowerPlacement {
  id: string
  kind: ValeFlowerKind
  /** Posição no mundo 3D */
  position: [number, number, number]
  /** Rotação Y (rad) */
  rotationY: number
  /** Inclinação leve para parecer plantada no terreno */
  tiltX?: number
  tiltZ?: number
  /** Altura alvo em unidades do mundo */
  targetHeight: number
  /** Variação de escala adicional */
  scaleMult?: number
}

/** Posições ajustadas no editor — plantas sobre o caminho de pedras */
export const VALE_FLOWER_PLACEMENTS: ValeFlowerPlacement[] = [
  { id: 'f-01', kind: 'lavender', position: [-1.75, 0.59, -4.95], rotationY: 0.35, tiltX: 0.04, targetHeight: 0.8, scaleMult: 1.9 },
  { id: 'f-02', kind: 'lavender', position: [2.38, 0.24, -0.45], rotationY: 2.15, tiltZ: -0.03, targetHeight: 0.64, scaleMult: 1.6 },
  { id: 'f-03', kind: 'lavender', position: [-6.35, -0.51, -0.5], rotationY: -0.45, tiltX: 0.03, targetHeight: 0.72, scaleMult: 1.75 },
  { id: 'p-01', kind: 'fern', position: [-2.45, 0.24, -1.2], rotationY: 0.35, targetHeight: 0.52, scaleMult: 1.35 },
  { id: 'p-02', kind: 'fern', position: [1.09, -0.36, 1.66], rotationY: -0.95, tiltX: 0.02, targetHeight: 0.48, scaleMult: 1.22 },
  { id: 'p-03', kind: 'fern', position: [-0.4, -0.21, 0.9], rotationY: 1.15, targetHeight: 0.5, scaleMult: 0.6 },
  { id: 'p-04', kind: 'fern', position: [0.6, 0.29, 0.8], rotationY: -0.55, tiltZ: 0.03, targetHeight: 0.46, scaleMult: 1.18 },
  { id: 'p-05', kind: 'fern', position: [-1.05, 0.09, -8.5], rotationY: 0.82, tiltX: -0.02, targetHeight: 0.54, scaleMult: 1.32 },
  { id: 'p-06', kind: 'fern', position: [1.9, -0.51, 4.85], rotationY: -1.25, targetHeight: 0.47, scaleMult: 1.24 },
  { id: 'p-07', kind: 'fern', position: [1.95, -0.51, 2.45], rotationY: 0.48, tiltX: 0.03, targetHeight: 0.51, scaleMult: 1.3 },
  { id: 'l-01', kind: 'lilac', position: [-3.8, -0.75, 3.25], rotationY: 0.6, tiltX: 0.02, targetHeight: 0.78, scaleMult: 1.15 },
  { id: 'l-02', kind: 'lilac', position: [2.55, 0.3, 1.25], rotationY: -1.1, targetHeight: 0.72, scaleMult: 1.1 },
  { id: 'l-03', kind: 'lilac', position: [3.45, -0.5, -5], rotationY: 2.4, tiltZ: -0.02, targetHeight: 0.8, scaleMult: 1.2 },
  { id: 'l-04', kind: 'lilac', position: [3.5, -0.1, -2.5], rotationY: -0.3, tiltX: 0.03, targetHeight: 0.76, scaleMult: 1 },
  { id: 's-01', kind: 'stump', position: [-2.2, -0.35, 2.8], rotationY: 0.65, targetHeight: 0.42, scaleMult: 1.05 },
]

export type FlowerPlacementOverride = Partial<
  Pick<ValeFlowerPlacement, 'position' | 'rotationY' | 'targetHeight' | 'scaleMult' | 'tiltX' | 'tiltZ'>
>

export type FlowerPlacementOverrides = Record<string, FlowerPlacementOverride>

/** Eixo de movimento no editor de plantas */
export type FlowerMoveAxis = 'free' | 'depth' | 'lateral' | 'vertical'

/** Z visível do primeiro plano (perto da câmera) até o meio da composição (caminho/casa) */
export const VALE_FLOWER_DEPTH_RANGE = { min: -8.5, max: 9.2 } as const

export function clampFlowerDepth(z: number) {
  return Math.min(VALE_FLOWER_DEPTH_RANGE.max, Math.max(VALE_FLOWER_DEPTH_RANGE.min, z))
}

export function mergeFlowerPlacements(overrides: FlowerPlacementOverrides): ValeFlowerPlacement[] {
  return VALE_FLOWER_PLACEMENTS.map((flower) => ({
    ...flower,
    ...overrides[flower.id],
  }))
}

export function formatFlowerPlacementsExport(placements: ValeFlowerPlacement[]): string {
  const rows = placements.map((f) => {
    const tiltX = f.tiltX != null ? `, tiltX: ${f.tiltX}` : ''
    const tiltZ = f.tiltZ != null ? `, tiltZ: ${f.tiltZ}` : ''
    const scale = f.scaleMult != null ? `, scaleMult: ${f.scaleMult}` : ''
    return `  { id: '${f.id}', kind: '${f.kind}', position: [${f.position.map((n) => +n.toFixed(2)).join(', ')}], rotationY: ${f.rotationY.toFixed(2)}${tiltX}${tiltZ}, targetHeight: ${f.targetHeight.toFixed(2)}${scale} },`
  })
  return `// Cole em lib/vale/sceneFlowerAssets.ts\nexport const VALE_FLOWER_PLACEMENTS: ValeFlowerPlacement[] = [\n${rows.join('\n')}\n]`
}
