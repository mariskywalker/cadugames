'use client'

import type { CSSProperties } from 'react'
import type { LifeDimension } from '@/lib/types'
import type { WorldId } from '@/lib/worlds/types'
import { WorldInteractionLayer } from './WorldInteractionLayer'
import { HubPointEditorTools } from './HubPointEditorTools'
import '@/components/worlds/world-interactions.css'

const DIMENSION_WORLD: Partial<Record<string, WorldId>> = {
  independencia: 'montanha',
  participacao: 'cidade',
}

export function WorldPreviewDiorama({ dimension }: { dimension: LifeDimension }) {
  const worldId = DIMENSION_WORLD[dimension.id]
  if (!worldId) return null

  return (
    <section className="world-preview" aria-label={`Explorar ${dimension.worldName}`}>
      <p className="world-preview__hint">
        Enquanto este mundo se prepara, você pode explorar um pouquinho:
      </p>
      <div
        className={`world-preview__stage world-preview__stage--${worldId}`}
        style={{ '--world-accent': dimension.color } as CSSProperties}
      >
        <div className="world-preview__sky" aria-hidden />
        <div className="world-preview__ground" aria-hidden />
        <WorldInteractionLayer worldId={worldId} />
      </div>
      <HubPointEditorTools />
    </section>
  )
}
