'use client'

import { motion } from 'framer-motion'
import type { ValeAction } from '@/lib/valeHubData'

export function ValeActionSheet({
  action,
  feedback,
  introMessage,
  onPick,
  onClose,
}: {
  action: ValeAction
  feedback: string | null
  introMessage?: string | null
  onPick: (word: string) => void
  onClose: () => void
}) {
  const isLocked = action.state === 'locked'
  const storyText = introMessage ?? action.sheet.sceneLine

  return (
    <>
      <motion.button
        type="button"
        className="vale-story-backdrop"
        aria-label="Voltar ao vale"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="vale-story-balloon"
        role="dialog"
        aria-labelledby="vale-story-text"
        initial={{ y: 12, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <span className="vale-story-tail" aria-hidden />
        <span className="vale-story-sparkle" aria-hidden>
          ✨
        </span>

        <button type="button" className="vale-story-close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>

        {isLocked ? (
          <p id="vale-story-text" className="vale-story-text vale-story-text--dormant">
            {action.sheet.lockedMessage ?? 'Esta luz ainda está dormindo no vale…'}
          </p>
        ) : feedback ? (
          <motion.p
            id="vale-story-text"
            className="vale-story-text vale-story-text--reply"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✨ {feedback}
          </motion.p>
        ) : (
          <>
            <p id="vale-story-text" className="vale-story-text">
              {storyText}
            </p>
            <p className="vale-story-prompt">{action.sheet.prompt}</p>
            <div className="vale-story-words">
              {action.sheet.options.map((word, i) => (
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
