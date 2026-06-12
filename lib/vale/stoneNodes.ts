import { STONE_PATH_HIT_DEFAULTS } from './stonePathLayout'
import type { PathStoneVariantId } from './pathStoneVariants'

export type StoneNodeState = 'locked' | 'current' | 'completed'

export interface StoneNodeLayout {
  id: string
  label: string
  emoji: string
  actionId: string
  variant: PathStoneVariantId
  /** Hit dentro do overlay do caminho (%) */
  hitU: number
  hitV: number
  hitSize: number
  zIndex: number
}

/**
 * Metadados + áreas clicáveis relativas ao PNG do caminho.
 * left/bottom/width legados removidos — cliques seguem a imagem.
 */
export const STONE_NODES: StoneNodeLayout[] = [
  {
    id: 'stone-1',
    label: 'Primeiras palavras',
    emoji: '👋',
    actionId: 'iniciar-conversa',
    variant: 'large',
    ...STONE_PATH_HIT_DEFAULTS['stone-1'],
    zIndex: 8,
  },
  {
    id: 'stone-2',
    label: 'Pedir ajuda',
    emoji: '🙋',
    actionId: 'pedir-ajuda',
    variant: 'large',
    ...STONE_PATH_HIT_DEFAULTS['stone-2'],
    zIndex: 8,
  },
  {
    id: 'stone-3',
    label: 'Escolher',
    emoji: '✋',
    actionId: 'escolher',
    variant: 'medium',
    ...STONE_PATH_HIT_DEFAULTS['stone-3'],
    zIndex: 8,
  },
  {
    id: 'stone-4',
    label: 'Nomear emoção',
    emoji: '💗',
    actionId: 'nomear-emocao',
    variant: 'oval',
    ...STONE_PATH_HIT_DEFAULTS['stone-4'],
    zIndex: 8,
  },
  {
    id: 'stone-5',
    label: 'Último passo',
    emoji: '🪨',
    actionId: 'pedir-ajuda',
    variant: 'circular',
    ...STONE_PATH_HIT_DEFAULTS['stone-5'],
    zIndex: 8,
  },
  {
    id: 'stone-6',
    label: 'Porta da casa',
    emoji: '🏡',
    actionId: 'casa-urso',
    variant: 'small',
    ...STONE_PATH_HIT_DEFAULTS['stone-6'],
    zIndex: 8,
  },
]
