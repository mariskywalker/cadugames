'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { childProfile, familyActivities } from '@/lib/mockChildProfile'

function ActivityCard({
  activity,
  index,
}: {
  activity: (typeof familyActivities)[number]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.07 }}
    >
      <Card className={activity.today ? 'border-cadu-coral/40 bg-white/95' : ''}>
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cadu-pink/30 text-2xl">
            {activity.emoji}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-cadu-ink">{activity.title}</h2>
              {activity.today && (
                <span className="rounded-full bg-cadu-coral px-2.5 py-0.5 text-[11px] font-extrabold text-white">
                  Atividade de hoje
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs font-bold text-cadu-muted">
              ⏱️ {activity.duration} · 🎯 {activity.goal}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-cadu-cream p-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-cadu-muted">
              Materiais
            </p>
            <p className="mt-1 text-sm font-semibold text-cadu-ink">{activity.materials}</p>
          </div>
          <div className="rounded-2xl bg-cadu-cream p-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-cadu-muted">
              Como fazer
            </p>
            <p className="mt-1 text-sm font-semibold text-cadu-ink leading-snug">
              {activity.howTo}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-cadu-pink/25 p-3">
          <span className="text-lg" aria-hidden>
            🐻
          </span>
          <p className="text-sm font-semibold text-cadu-ink leading-snug">
            <span className="font-extrabold">Dica do Cadu:</span> {activity.caduTip}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}

export function FamilyActivities() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-extrabold">Fazer em Família 🏠</h1>
        <p className="text-cadu-muted mt-1 mb-5">
          Momentos simples em casa que fortalecem a jornada de {childProfile.name}.
        </p>
      </motion.div>

      <div className="grid gap-4">
        {familyActivities.map((activity, i) => (
          <ActivityCard key={activity.id} activity={activity} index={i} />
        ))}
      </div>
    </div>
  )
}
