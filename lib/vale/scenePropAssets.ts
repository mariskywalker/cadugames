export const VALE_SCENE_PROP_ASSETS = {
  'poste-lanterna': {
    id: 'poste-lanterna',
    label: 'Poste com lanterna',
    src: '/vale/props/pau-lanterna.png',
    width: 682,
    height: 1024,
  },
} as const

export type ValeScenePropId = keyof typeof VALE_SCENE_PROP_ASSETS

export interface ScenePropLayout {
  id: ValeScenePropId
  left: string
  bottom: string
  width: string
  translateXPx?: number
  translateYPx?: number
  translateZPx?: number
  rotateDeg: number
  rotateXDeg?: number
  rotateYDeg?: number
  zIndex: number
  opacity: number
  /** Desfoque em px — props ao fundo ficam mais suaves */
  blurPx?: number
  flipX?: boolean
}

export type ScenePropOverride = Partial<
  Pick<
    ScenePropLayout,
    | 'left'
    | 'bottom'
    | 'width'
    | 'translateXPx'
    | 'translateYPx'
    | 'translateZPx'
    | 'rotateDeg'
    | 'rotateXDeg'
    | 'rotateYDeg'
    | 'zIndex'
    | 'opacity'
    | 'blurPx'
    | 'flipX'
  >
>

export type ScenePropOverrides = Record<string, ScenePropOverride>

/** Posição inicial — ajuste no editor com tecla O ou ?poste=1 */
export const VALE_SCENE_PROP_PLACEMENTS: ScenePropLayout[] = [
  {
    id: 'poste-lanterna',
    left: '76%',
    bottom: '2%',
    width: '11vw',
    rotateDeg: 0,
    zIndex: 1,
    opacity: 1,
    blurPx: 1.5,
  },
]

export function mergeScenePropPlacements(overrides: ScenePropOverrides): ScenePropLayout[] {
  return VALE_SCENE_PROP_PLACEMENTS.map((prop) => ({
    ...prop,
    ...overrides[prop.id],
  }))
}

export function formatScenePropExport(placements: ScenePropLayout[]): string {
  const rows = placements.map((p) => {
    const tx = p.translateXPx != null && p.translateXPx !== 0 ? `, translateXPx: ${p.translateXPx}` : ''
    const ty = p.translateYPx != null && p.translateYPx !== 0 ? `, translateYPx: ${p.translateYPx}` : ''
    const tz = p.translateZPx != null && p.translateZPx !== 0 ? `, translateZPx: ${p.translateZPx}` : ''
    const rotX = p.rotateXDeg != null && p.rotateXDeg !== 0 ? `, rotateXDeg: ${p.rotateXDeg}` : ''
    const rotY = p.rotateYDeg != null && p.rotateYDeg !== 0 ? `, rotateYDeg: ${p.rotateYDeg}` : ''
    const flip = p.flipX ? ', flipX: true' : ''
    const blur = p.blurPx != null && p.blurPx > 0 ? `, blurPx: ${p.blurPx}` : ''
    return `  { id: '${p.id}', left: '${p.left}', bottom: '${p.bottom}', width: '${p.width}'${tx}${ty}${tz}, rotateDeg: ${p.rotateDeg}${rotX}${rotY}, zIndex: ${p.zIndex}, opacity: ${p.opacity}${blur}${flip} },`
  })
  return `export const VALE_SCENE_PROP_PLACEMENTS: ScenePropLayout[] = [\n${rows.join('\n')}\n]`
}
