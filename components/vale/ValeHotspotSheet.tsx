'use client'

import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { recordInteractionVisit } from '@/lib/worlds/dailyWorldState'
import { getWorldInteraction, resolveFeedback } from '@/lib/worlds/worldInteractions'
import { useValeStore } from '@/store/useValeStore'
import { WorldInteractionSheet } from '@/components/worlds/WorldInteractionSheet'

/** Sheet de narrativa ao chegar em hotspot com onArrive: open-sheet */
export function ValeHotspotSheet() {
  const sheetId = useValeStore((s) => s.activeHotspotSheetId)
  const closeHotspotSheet = useValeStore((s) => s.closeHotspotSheet)
  const isTraveling = useValeStore((s) => s.isTraveling)
  const interactionPending = useValeStore((s) => s.interactionPending)
  const [feedback, setFeedback] = useState<string | null>(null)

  const point = sheetId ? getWorldInteraction(sheetId) : null

  const close = useCallback(() => {
    closeHotspotSheet()
    setFeedback(null)
  }, [closeHotspotSheet])

  const pick = useCallback(
    (choice: string) => {
      if (!point) return
      setFeedback(resolveFeedback(point.sheet, choice))
      recordInteractionVisit('vale', point.id, choice)
    },
    [point],
  )

  if (isTraveling || interactionPending) return null

  return (
    <AnimatePresence>
      {point && sheetId && (
        <WorldInteractionSheet
          key={point.id}
          point={point}
          feedback={feedback}
          onPick={pick}
          onClose={close}
        />
      )}
    </AnimatePresence>
  )
}
