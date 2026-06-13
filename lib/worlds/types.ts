export type WorldId = 'sensory' | 'vale' | 'montanha' | 'cidade'

export type InteractionKind = 'choice' | 'breathing' | 'sequence' | 'narrative'

export interface InteractionSheet {
  sceneLine: string
  prompt: string
  options: string[]
  /** Feedback genérico ou por opção escolhida */
  pickFeedback: string | Record<string, string>
}

export interface WorldInteractionPoint {
  id: string
  worldId: WorldId
  label: string
  emoji: string
  /** Posição em % do container */
  x: number
  y: number
  size?: number
  kind: InteractionKind
  sheet: InteractionSheet
  /** Ordem para atividades de sequência */
  sequenceSteps?: string[]
}
