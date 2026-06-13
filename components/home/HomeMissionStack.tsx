'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import {
  familyTip,
  focusMeta,
  todayMission,
} from '@/lib/mockChildProfile'
import { getHomeDailyState, saveHomeMoodResponse } from '@/lib/worlds/homeDailyState'

const MOOD_OPTIONS = ['😊 Bem', '😐 Mais ou menos', '😔 Triste', '😤 Irritado'] as const

const MOOD_FEEDBACK: Record<(typeof MOOD_OPTIONS)[number], string> = {
  '😊 Bem': 'Que bom! Vamos aproveitar este dia juntos.',
  '😐 Mais ou menos': 'Tudo bem sentir assim — estou aqui com você.',
  '😔 Triste': 'Obrigado por contar. Às vezes precisamos de um abraço.',
  '😤 Irritado': 'Sentir raiva também faz parte — respiramos juntos?',
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-extrabold uppercase tracking-wide text-cadu-muted">
      {children}
    </p>
  )
}

export function HomeMissionStack() {
  const [dailyLetter, setDailyLetter] = useState('')
  const [moodReply, setMoodReply] = useState<string | null>(null)

  useEffect(() => {
    const state = getHomeDailyState()
    setDailyLetter(state.letter)
    if (state.moodResponse) {
      setMoodReply(MOOD_FEEDBACK[state.moodResponse as (typeof MOOD_OPTIONS)[number]] ?? null)
    }
  }, [])

  function pickMood(mood: (typeof MOOD_OPTIONS)[number]) {
    saveHomeMoodResponse(mood)
    setMoodReply(MOOD_FEEDBACK[mood])
  }

  return (
    <aside className="home-mission-stack" aria-label="Missão e orientações de hoje">
      <Card className="home-mission-card home-mission-card--primary !p-3.5 border-cadu-coral/35 bg-white/95">
        <Eyebrow>Missão de hoje</Eyebrow>
        <h2 className="mt-1 text-base font-extrabold text-cadu-ink leading-snug">
          {todayMission.title}
        </h2>
        <p className="mt-1.5 text-sm font-semibold text-cadu-ink leading-snug">
          {todayMission.objective}
        </p>
        <p className="mt-1 text-xs font-bold text-cadu-muted">
          Tempo estimado: {todayMission.duration}
        </p>
        <Link
          href={todayMission.ctaHref}
          className="mt-3 inline-block rounded-full bg-cadu-coral px-4 py-2 text-xs font-extrabold text-white shadow-cadu transition-transform hover:-translate-y-0.5"
        >
          {todayMission.ctaLabel}
        </Link>
      </Card>

      <Card className="home-mission-card !p-3.5 bg-white/95">
        <Eyebrow>Meta em foco</Eyebrow>
        <p className="mt-1 text-sm font-extrabold text-cadu-ink">{focusMeta.program}</p>
        <p className="mt-2 text-xs font-bold text-cadu-muted">Estamos praticando:</p>
        <ul className="mt-1 space-y-0.5 pl-4 text-sm font-semibold text-cadu-ink list-disc marker:text-cadu-coral">
          {focusMeta.practicing.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {dailyLetter && (
          <div className="mt-3 rounded-2xl bg-cadu-cream px-3 py-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-cadu-muted">
              Carta do Cadu
            </p>
            <p className="mt-0.5 text-sm font-semibold text-cadu-ink leading-snug">{dailyLetter}</p>
          </div>
        )}
      </Card>

      <Card className="home-mission-card !p-3.5 bg-white/95">
        <Eyebrow>Dica para a família</Eyebrow>
        <p className="mt-1 text-sm font-semibold text-cadu-ink leading-snug">{familyTip}</p>

        <div className="mt-3 pt-3 border-t border-cadu-cream">
          <Eyebrow>Conversa rápida</Eyebrow>
          <p className="mt-1 text-xs font-bold text-cadu-muted">Como você está hoje?</p>
          {moodReply ? (
            <p className="mt-2 text-sm font-semibold text-cadu-ink leading-snug">{moodReply}</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  className="rounded-full border border-cadu-cream bg-cadu-cream px-2.5 py-1 text-[11px] font-bold text-cadu-ink transition-colors hover:bg-cadu-pink/30"
                  onClick={() => pickMood(mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </aside>
  )
}
