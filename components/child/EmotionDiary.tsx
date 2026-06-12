'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { emotionDiary, emotions } from '@/lib/mockData'
import { childProfile, emotionContexts } from '@/lib/mockChildProfile'
import type { EmotionId } from '@/lib/types'
import { cn } from '@/lib/cn'

type DiaryStep = 'emotion' | 'context' | 'done'

export function EmotionDiary() {
  const [step, setStep] = useState<DiaryStep>('emotion')
  const [todayEmotion, setTodayEmotion] = useState<EmotionId | null>(null)
  const [context, setContext] = useState<string | null>(null)

  const pickEmotion = (id: EmotionId) => {
    setTodayEmotion(id)
    setStep('context')
  }

  const pickContext = (id: string) => {
    setContext(id)
    setStep('done')
  }

  const restart = () => {
    setStep('emotion')
    setTodayEmotion(null)
    setContext(null)
  }

  const selectedEmotion = emotions.find((e) => e.id === todayEmotion)
  const selectedContext = emotionContexts.find((c) => c.id === context)

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-extrabold">Diário das emoções 📔</h1>
        <p className="text-cadu-muted mt-1 mb-5">
          Oi {childProfile.name}! Esse é o seu cantinho para contar como você está.
        </p>
      </motion.div>

      <Card className="mb-5 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 'emotion' && (
            <motion.div
              key="emotion"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
            >
              <p className="text-base font-extrabold text-cadu-ink mb-3">
                Como você está se sentindo hoje?
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {emotions.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => pickEmotion(e.id)}
                    className={cn(
                      'rounded-3xl border-2 p-4 text-center transition-all min-h-[72px]',
                      'border-transparent bg-cadu-cream hover:border-cadu-pink/40 hover:scale-[1.03]',
                    )}
                  >
                    <span className="text-3xl">{e.emoji}</span>
                    <p className="text-xs font-bold mt-2">{e.label}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'context' && selectedEmotion && (
            <motion.div
              key="context"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                  style={{ backgroundColor: `${selectedEmotion.color}55` }}
                >
                  {selectedEmotion.emoji}
                </span>
                <div>
                  <p className="text-sm font-bold text-cadu-muted">
                    Você está se sentindo {selectedEmotion.label.toLowerCase()}
                  </p>
                  <p className="text-base font-extrabold text-cadu-ink">
                    Entendi. Quer me contar o que aconteceu?
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {emotionContexts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pickContext(c.id)}
                    className="rounded-3xl border-2 border-transparent bg-cadu-cream p-3.5 text-center transition-all hover:border-cadu-pink/40 hover:scale-[1.03] min-h-[64px]"
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <p className="text-xs font-bold mt-1.5">{c.label}</p>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={restart}
                className="mt-4 text-xs font-bold text-cadu-muted underline-offset-2 hover:underline"
              >
                ← Escolher outra emoção
              </button>
            </motion.div>
          )}

          {step === 'done' && selectedEmotion && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cadu-pink/40 text-4xl"
              >
                🐻
              </motion.span>
              <p className="mt-3 text-lg font-extrabold text-cadu-ink">
                Registrado! O Cadu ficou feliz em saber 💕
              </p>
              <p className="mt-1 text-sm text-cadu-muted">
                Hoje: {selectedEmotion.emoji} {selectedEmotion.label}
                {selectedContext && selectedContext.id !== 'nao-sei'
                  ? ` · ${selectedContext.emoji} ${selectedContext.label}`
                  : ''}
              </p>
              <button
                type="button"
                onClick={restart}
                className="mt-4 rounded-full bg-cadu-coral px-5 py-2 text-sm font-extrabold text-white shadow-cadu transition-transform hover:-translate-y-0.5"
              >
                Registrar de novo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-cadu-muted mb-4">Esta semana</p>
        <div className="grid grid-cols-5 gap-2">
          {emotionDiary.map((entry, i) => {
            const em = emotions.find((x) => x.id === entry.emotion)
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-cadu-cream p-3 text-center"
              >
                <p className="text-[10px] font-bold text-cadu-muted">{entry.date}</p>
                <p className="text-2xl mt-1">{em?.emoji}</p>
                {entry.note && (
                  <p className="text-[9px] text-cadu-muted mt-1 line-clamp-2">{entry.note}</p>
                )}
              </motion.div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
