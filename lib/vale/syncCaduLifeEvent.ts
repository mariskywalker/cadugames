export type CaduLifeEventStatus = 'started' | 'completed' | 'skipped'

export interface CaduLifeEvent {
  childId: string
  world: string
  hotspot: string
  activity: string
  status: CaduLifeEventStatus
  timestamp: number
}

/** Mock — futuramente conecta com Cadu App / Cadu Life em tempo real */
export function syncCaduLifeEvent(event: CaduLifeEvent): void {
  console.log('[CaduLife sync]', event)
}
