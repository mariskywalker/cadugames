'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { useApp } from '@/context/AppContext'
import { weeklyReport } from '@/lib/mockData'

export function WeeklyReport() {
  const { child } = useApp()

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-extrabold">Relatório semanal 📊</h1>
        <p className="text-white/80 mt-1">
          Semana {weeklyReport.weekLabel} · {child.name}
        </p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2">
        <GlassCard glow>
          <p className="text-sm text-white/70">Sessões concluídas</p>
          <p className="text-4xl font-extrabold mt-1">{weeklyReport.sessionsCompleted}</p>
        </GlassCard>
        <GlassCard glow>
          <p className="text-sm text-white/70">Humor médio</p>
          <p className="text-4xl font-extrabold mt-1">
            {weeklyReport.avgMood}
            <span className="text-lg text-white/60">/5</span>
          </p>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="font-bold text-cadu-honey mb-3">✨ Conquistas</h2>
        <ul className="space-y-2 text-sm text-white/90">
          {weeklyReport.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span>•</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard>
        <h2 className="font-bold text-cadu-peach mb-3">🌱 Pontos de atenção</h2>
        <ul className="space-y-2 text-sm text-white/90">
          {weeklyReport.challenges.map((c) => (
            <li key={c} className="flex gap-2">
              <span>•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard glow>
        <p className="text-sm font-semibold text-white/70">Nota da terapeuta</p>
        <p className="mt-2 leading-relaxed">{weeklyReport.therapistNote}</p>
        <Link
          href="/parent/therapist"
          className="inline-flex mt-4 text-sm font-bold text-cadu-pink hover:text-white transition"
        >
          Falar com a terapeuta →
        </Link>
      </GlassCard>
    </div>
  )
}
