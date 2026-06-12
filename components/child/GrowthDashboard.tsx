'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { childProfile, growthDomains, weekSummary } from '@/lib/mockChildProfile'

export function GrowthDashboard() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-extrabold">Meu Crescimento 🌱</h1>
        <p className="text-cadu-muted mt-1 mb-5">
          Um olhar carinhoso sobre a evolução de {childProfile.name}, sem pressa e no ritmo dele.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
      >
        <Card className="mb-5">
          <p className="text-sm font-extrabold text-cadu-ink mb-3">Resumo da semana ✨</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-cadu-cream p-3 text-center">
              <p className="text-2xl font-extrabold text-cadu-coral">
                {weekSummary.activitiesDone}
              </p>
              <p className="text-[11px] font-bold text-cadu-muted mt-0.5">atividades feitas</p>
            </div>
            <div className="rounded-2xl bg-cadu-cream p-3 text-center">
              <p className="text-2xl font-extrabold text-cadu-coral">
                {weekSummary.emotionEntries}
              </p>
              <p className="text-[11px] font-bold text-cadu-muted mt-0.5">registros emocionais</p>
            </div>
            <div className="rounded-2xl bg-cadu-cream p-3 text-center">
              <p className="text-2xl font-extrabold text-cadu-coral">
                {weekSummary.familyActivitiesDone}
              </p>
              <p className="text-[11px] font-bold text-cadu-muted mt-0.5">
                atividade em família
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2">
        {growthDomains.map((domain, i) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
          >
            <Card>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-extrabold text-cadu-ink">
                  {domain.emoji} {domain.name}
                </p>
                <span className="text-sm font-extrabold" style={{ color: domain.color }}>
                  {domain.progress}%
                </span>
              </div>
              <div
                className="mt-2 h-2.5 rounded-full bg-cadu-cream overflow-hidden"
                role="progressbar"
                aria-valuenow={domain.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={domain.name}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${domain.progress}%` }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: domain.color }}
                />
              </div>
              <p className="mt-2.5 text-xs text-cadu-muted leading-snug">{domain.note}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
