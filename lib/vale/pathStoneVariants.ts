/** Catálogo de assets individuais — pedra isolada, fundo transparente, pronta para UI/game */

export type PathStoneVariantId =
  | 'small'
  | 'medium'
  | 'large'
  | 'oval'
  | 'circular'
  | 'checkpoint'

export interface PathStoneAsset {
  id: PathStoneVariantId
  label: string
  /** Caminho público do SVG exportável */
  src: string
  /** Dimensões nativas do viewBox (px) */
  width: number
  height: number
}

export const PATH_STONE_ASSETS: Record<PathStoneVariantId, PathStoneAsset> = {
  small: {
    id: 'small',
    label: 'Pequena',
    src: '/vale/path-stones/stone-small.svg',
    width: 64,
    height: 56,
  },
  medium: {
    id: 'medium',
    label: 'Média',
    src: '/vale/path-stones/stone-medium.svg',
    width: 80,
    height: 68,
  },
  large: {
    id: 'large',
    label: 'Grande',
    src: '/vale/path-stones/stone-large.svg',
    width: 96,
    height: 80,
  },
  oval: {
    id: 'oval',
    label: 'Oval',
    src: '/vale/path-stones/stone-oval.svg',
    width: 88,
    height: 64,
  },
  circular: {
    id: 'circular',
    label: 'Circular',
    src: '/vale/path-stones/stone-circular.svg',
    width: 84,
    height: 76,
  },
  checkpoint: {
    id: 'checkpoint',
    label: 'Checkpoint',
    src: '/vale/path-stones/stone-checkpoint.svg',
    width: 108,
    height: 92,
  },
}

export const PATH_STONE_ASSET_LIST = Object.values(PATH_STONE_ASSETS)

/** @deprecated Use PATH_STONE_ASSETS */
export const PATH_STONE_VARIANTS = PATH_STONE_ASSETS
