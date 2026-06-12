/**
 * CADU LIFE — Vertical Slice (mock)
 * Escopo: Mapa → Vale das Palavras → Marco Escolher → Conquista → Transformação Familiar
 */

import type {
  FamilyTransformation,
  LifeConquista,
  LifeDimension,
  LifeDimensionId,
  LifeMarco,
  WorldJourneyState,
} from './types'

export const tato = {
  name: 'Tato',
  avatar: '🐻',
}

/* ------------------------------------------------------------------ */
/* 7 Mundos (mapa geral)                                              */
/* ------------------------------------------------------------------ */

export const lifeDimensions: LifeDimension[] = [
  {
    id: 'comunicacao',
    clinicalName: 'Comunicação',
    worldName: 'Vale das Palavras',
    childLabel: 'Me expressar',
    emoji: '💬',
    color: '#D98BA8',
    tagline: 'Onde cada palavra abre um novo caminho.',
    journeyOrder: 0,
    mapX: 48,
    mapY: 82,
    sliceActive: true,
  },
  {
    id: 'autorregulacao',
    clinicalName: 'Autorregulação',
    worldName: 'Floresta da Calma',
    childLabel: 'Ficar tranquilo',
    emoji: '🌬️',
    color: '#7AA0CE',
    tagline: 'Um lugar para respirar, sentir e encontrar a calma.',
    journeyOrder: 1,
    mapX: 22,
    mapY: 64,
    sliceActive: false,
  },
  {
    id: 'relacionamentos',
    clinicalName: 'Relacionamentos',
    worldName: 'Bosque dos Amigos',
    childLabel: 'Amizades',
    emoji: '🤝',
    color: '#9D8FD4',
    tagline: 'Árvores e laços que crescem juntos.',
    journeyOrder: 2,
    mapX: 74,
    mapY: 58,
    sliceActive: false,
  },
  {
    id: 'autocuidado',
    clinicalName: 'Autocuidado',
    worldName: 'Vila do Cuidado',
    childLabel: 'Cuidar de mim',
    emoji: '🪥',
    color: '#5FB3A8',
    tagline: 'Uma vila acolhedora para cuidar do corpo e do bem-estar.',
    journeyOrder: 3,
    mapX: 28,
    mapY: 40,
    sliceActive: false,
  },
  {
    id: 'independencia',
    clinicalName: 'Independência',
    worldName: 'Montanha da Autonomia',
    childLabel: 'Fazer sozinho',
    emoji: '🌱',
    color: '#82B187',
    tagline: 'Subidas que ensinam a resolver a vida do dia a dia.',
    journeyOrder: 4,
    mapX: 72,
    mapY: 32,
    sliceActive: false,
  },
  {
    id: 'participacao',
    clinicalName: 'Participação',
    worldName: 'Cidade das Aventuras',
    childLabel: 'Fazer parte',
    emoji: '🌍',
    color: '#E0976E',
    tagline: 'Ruas cheias de gente, ideias e descobertas.',
    journeyOrder: 5,
    mapX: 38,
    mapY: 18,
    sliceActive: false,
  },
  {
    id: 'projeto-vida',
    clinicalName: 'Projeto de Vida',
    worldName: 'Reino dos Sonhos',
    childLabel: 'Meus sonhos',
    emoji: '✨',
    color: '#D9B24B',
    tagline: 'O horizonte onde sonhos viram caminho.',
    journeyOrder: 6,
    mapX: 62,
    mapY: 8,
    sliceActive: false,
  },
]

/* ------------------------------------------------------------------ */
/* Vale das Palavras — Marco 1: Escolher                              */
/* ------------------------------------------------------------------ */

export const sliceMarcoId = 'marco-co-escolher'

export const lifeMarcos: LifeMarco[] = [
  {
    id: sliceMarcoId,
    dimensionId: 'comunicacao',
    name: 'Escolher',
    emoji: '✋',
    status: 'completed',
    tatoLine:
      'Cada escolha é uma palavra nova no vale. O Tato viu você escolher com coragem!',
  },
  {
    id: 'marco-co-pedir-ajuda',
    dimensionId: 'comunicacao',
    name: 'Pedir ajuda',
    emoji: '🙋',
    status: 'locked',
    tatoLine: 'Mais adiante no vale, uma nova palavra espera por você.',
  },
  {
    id: 'marco-co-iniciar-conversa',
    dimensionId: 'comunicacao',
    name: 'Iniciar conversa',
    emoji: '👋',
    status: 'locked',
    tatoLine: 'O caminho continua — uma conversa de cada vez.',
  },
]

export const lifeConquistas: LifeConquista[] = [
  {
    id: 'conquista-primeira-voz',
    dimensionId: 'comunicacao',
    marcoId: sliceMarcoId,
    title: 'A Primeira Voz',
    emoji: '🌸',
    celebration:
      'Lucas encontrou sua voz nas pequenas escolhas do dia — e o vale floresceu.',
    unlocked: true,
  },
]

export const sliceFamilyTransformation: FamilyTransformation = {
  id: 'tf-escolher',
  dimensionId: 'comunicacao',
  marcoId: sliceMarcoId,
  conquistaId: 'conquista-primeira-voz',
  worldName: 'Vale das Palavras',
  marcoName: 'Escolher',
  whatChanged:
    'Lucas começou a fazer escolhas do dia a dia com mais segurança — roupa, lanche, brincadeira.',
  howToObserve:
    'Observe quando ele escolhe algo sozinho, mesmo nas coisas pequenas. Cada escolha é participação.',
  whatItMeans:
    'Fazer escolhas é uma forma de participar da própria vida. Lucas está aprendendo a usar sua voz no mundo.',
}

/* ------------------------------------------------------------------ */
/* Falas do Tato                                                      */
/* ------------------------------------------------------------------ */

export const tatoLines = {
  map: 'Oi! Sou o Tato. Este mapa é a nossa jornada — toque no Vale das Palavras para começar.',
  worldEntry:
    'Bem-vindo ao Vale das Palavras! Aqui, cada escolha abre um caminho novo.',
  marcoCompleted:
    'Você conquistou algo lindo: aprender a escolher. O vale guardou essa história para sempre.',
  worldLocked: 'Este mundo ainda está no horizonte. A jornada chega lá em breve.',
}

const worldStateLabels: Record<WorldJourneyState, string> = {
  horizon: 'Novo horizonte',
  discovered: 'Descoberto',
  exploring: 'Explorando agora',
  explored: 'Já conheço bem',
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

export function getLifeDimension(id: string): LifeDimension | undefined {
  return lifeDimensions.find((d) => d.id === id)
}

export function getJourneyWorlds(): LifeDimension[] {
  return [...lifeDimensions].sort((a, b) => a.journeyOrder - b.journeyOrder)
}

export function getMarcosByDimension(id: LifeDimensionId): LifeMarco[] {
  return lifeMarcos.filter((m) => m.dimensionId === id)
}

export function getConquistasByDimension(id: LifeDimensionId): LifeConquista[] {
  return lifeConquistas.filter((c) => c.dimensionId === id)
}

export function getConquistaForMarco(marcoId: string): LifeConquista | undefined {
  return lifeConquistas.find((c) => c.marcoId === marcoId && c.unlocked)
}

export function isWorldInSlice(id: LifeDimensionId): boolean {
  return getLifeDimension(id)?.sliceActive ?? false
}

export function getWorldJourneyState(dimensionId: LifeDimensionId): WorldJourneyState {
  const dim = getLifeDimension(dimensionId)
  if (!dim?.sliceActive) return 'horizon'

  const marcos = getMarcosByDimension(dimensionId)
  const hasCompleted = marcos.some((m) => m.status === 'completed')
  const hasAvailable = marcos.some((m) => m.status === 'available')

  if (hasAvailable || dimensionId === 'comunicacao') return 'exploring'
  if (hasCompleted) return 'discovered'
  return 'horizon'
}

export function getWorldStateLabel(state: WorldJourneyState): string {
  return worldStateLabels[state]
}

export function getActiveWorldId(): LifeDimensionId {
  return 'comunicacao'
}

/** Progresso visual do caminho no mapa (0–1), baseado em mundos com marcos */
export function getJourneyPathProgress(): number {
  const active = lifeDimensions.filter((d) => d.sliceActive).length
  return active / Math.max(lifeDimensions.length - 1, 1)
}

export function getSliceFamilyTransformation(): FamilyTransformation {
  return sliceFamilyTransformation
}
