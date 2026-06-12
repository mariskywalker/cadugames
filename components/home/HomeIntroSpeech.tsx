'use client'

import { useMemo } from 'react'
import { childProfile } from '@/lib/mockChildProfile'

const SUBTEXT = 'Hoje vamos continuar sua jornada.'

export function HomeIntroSpeech({ childName }: { childName?: string }) {
  const subWords = useMemo(() => SUBTEXT.split(' '), [])
  const name = childName ?? childProfile.name

  return (
    <section className="home-intro" aria-label="Saudação do CADU">
      <h1 className="home-intro__head">
        <span className="home-intro__lead" style={{ animationDelay: '0.35s' }}>
          Olá,
        </span>
        <span className="home-intro__title" style={{ animationDelay: '1.05s' }}>
          {name}!
        </span>
      </h1>
      <p className="home-intro__sub">
        {subWords.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="home-intro__word"
            style={{ animationDelay: `${1.75 + index * 0.11}s` }}
          >
            {word}
          </span>
        ))}
      </p>
      <div className="home-intro__program" style={{ animationDelay: '2.6s' }}>
        <span className="home-intro__program-name">{childProfile.currentProgram}</span>
        <span className="home-intro__program-week">
          Semana {childProfile.currentWeek} de {childProfile.totalWeeks} · {childProfile.journeyProgress}% da trilha
        </span>
      </div>
    </section>
  )
}
