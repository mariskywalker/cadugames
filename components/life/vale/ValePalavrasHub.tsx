'use client'

import { useState, type CSSProperties } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { LifeDimension } from '@/lib/types'
import {
  CASA_URSO_ACTION_ID,
  casaUrsoIntro,
  getValeAction,
  valeHubActions,
} from '@/lib/valeHubData'
import { ValeWorldScene } from './ValeWorldScene'
import { ValeFloatingLight } from './ValeFloatingLight'
import { ValeActionSheet } from './ValeActionSheet'
import { ValeLivingAtmosphere } from './ValeLivingAtmosphere'
import { ValeFireflyPaths } from './ValeFireflyPaths'

function HouseAliveOverlay({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <div className="vale-house-alive" aria-hidden>
      <span className="vale-house-window vale-house-window--left" />
      <span className="vale-house-window vale-house-window--right" />
      <span className="vale-house-door-pulse" />
      <span className="vale-house-chimney-smoke vale-house-chimney-smoke--1" />
      <span className="vale-house-chimney-smoke vale-house-chimney-smoke--2" />
    </div>
  )
}

export function ValePalavrasHub({ dimension }: { dimension: LifeDimension }) {
  const [currentActionId, setCurrentActionId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [introMessage, setIntroMessage] = useState<string | null>(null)

  const currentAction = currentActionId ? getValeAction(currentActionId) : null
  const hasSelection = currentActionId !== null
  const accent = dimension.color
  const houseFromCasaClick = currentActionId === CASA_URSO_ACTION_ID
  const houseResponding =
    houseFromCasaClick || (hasSelection && currentAction?.state !== 'locked')
  const houseHighlighted = houseResponding
  const activePlacement = currentAction?.placement ?? null

  function openAction(id: string) {
    setCurrentActionId(id)
    setFeedback(null)
    setIntroMessage(null)
  }

  function openHouse() {
    setCurrentActionId(CASA_URSO_ACTION_ID)
    setFeedback(null)
    setIntroMessage(casaUrsoIntro)
  }

  function closeSheet() {
    setCurrentActionId(null)
    setFeedback(null)
    setIntroMessage(null)
  }

  function pickWord(_word: string) {
    if (!currentAction) return
    setIntroMessage(null)
    setFeedback(currentAction.sheet.pickFeedback)
  }

  return (
    <section
      aria-label="Vale das Palavras"
      className="vale-world"
      style={{ '--vale-accent': accent } as CSSProperties}
    >
      <div className="vale-world-stage">
        <ValeLivingAtmosphere />

        <div className="vale-world-diorama">
          <ValeFireflyPaths
            placements={valeHubActions.map((a) => a.placement)}
            activePlacement={activePlacement}
          />

          <div className={cnHouseWrap(houseResponding, houseFromCasaClick)}>
            <ValeWorldScene highlighted={houseHighlighted} responding={houseFromCasaClick} />
            <HouseAliveOverlay active={houseFromCasaClick} />
            <button
              type="button"
              className="vale-house-touch"
              aria-label="Abrir Vale das Palavras"
              onClick={openHouse}
            />
          </div>

          {valeHubActions.map((action, index) => (
            <ValeFloatingLight
              key={action.id}
              action={action}
              isCurrent={action.id === currentActionId}
              onSelect={openAction}
              index={index}
            />
          ))}
        </div>

        <AnimatePresence>
          {currentAction && (
            <ValeActionSheet
              key={currentAction.id}
              action={currentAction}
              feedback={feedback}
              introMessage={introMessage}
              onPick={pickWord}
              onClose={closeSheet}
            />
          )}
        </AnimatePresence>
      </div>

      <p className="vale-world-whisper">
        O vale está acordado. Toque na casa ou nas luzinhas ao redor.
      </p>
    </section>
  )
}

function cnHouseWrap(responding: boolean, fromClick: boolean) {
  const parts = ['vale-world-house']
  if (responding) parts.push('vale-world-house--lit')
  if (fromClick) parts.push('vale-world-house--awake')
  return parts.join(' ')
}
