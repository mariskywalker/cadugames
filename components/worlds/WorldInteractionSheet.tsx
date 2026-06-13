'use client'

import { motion } from 'framer-motion'
import type { WorldInteractionPoint } from '@/lib/worlds/types'

export function WorldInteractionSheet({
  point,
  feedback,
  letterOverride,
  onPick,
  onClose,
}: {
  point: WorldInteractionPoint
  feedback: string | null
  /** Texto dinâmico (ex.: carta do dia na home) */
  letterOverride?: string
  onPick: (choice: string) => void
  onClose: () => void
}) {
  const sceneLine = point.sheet.sceneLine
  const promptText =
    letterOverride && point.id === 'home-letter'
      ? letterOverride
      : point.sheet.prompt

  return (
    <>
      <motion.button
        type="button"
        className="vale-story-backdrop"
        aria-label="Fechar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="vale-story-balloon"
        role="dialog"
        aria-labelledby="world-interaction-text"
        initial={{ y: 12, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <span className="vale-story-tail" aria-hidden />
        <span className="vale-story-sparkle" aria-hidden>
          {point.emoji}
        </span>

        <button type="button" className="vale-story-close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>

        {feedback ? (
          <motion.p
            id="world-interaction-text"
            className="vale-story-text vale-story-text--reply"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {feedback}
          </motion.p>
        ) : point.kind === 'breathing' ? (
          <>
            <p id="world-interaction-text" className="vale-story-text">
              {sceneLine}
            </p>
            <p className="vale-story-prompt">{promptText}</p>
            <BreathingGuide onComplete={onPick} />
          </>
        ) : (
          <>
            <p id="world-interaction-text" className="vale-story-text">
              {sceneLine}
            </p>
            <p className="vale-story-prompt">{promptText}</p>
            <div className="vale-story-words">
              {point.sheet.options.map((word, i) => (
                <motion.button
                  key={word}
                  type="button"
                  className="vale-story-word"
                  onClick={() => onPick(word)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + i * 0.04 }}
                >
                  {word}
                </motion.button>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </>
  )
}

function BreathingGuide({ onComplete }: { onComplete: (step: string) => void }) {
  const steps = ['Inspire devagar…', 'Segure um pouco…', 'Expire suave…']

  return (
    <div className="world-breathing">
      {steps.map((step, i) => (
        <motion.button
          key={step}
          type="button"
          className="vale-story-word world-breathing__step"
          onClick={() => onComplete(step)}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.35 }}
        >
          {step}
        </motion.button>
      ))}
    </div>
  )
}
