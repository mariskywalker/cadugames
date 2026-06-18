'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { childProfile, journeyWorlds, worldStatusMeta } from '@/lib/mockChildProfile'

export function CurrentGoalCard() {
  const activityProgress = Math.round(
    (childProfile.completedActivities / childProfile.totalActivities) * 100,
  )

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl bg-white/75 backdrop-blur-md border border-white/70 shadow-cadu p-4 md:p-5"
      aria-label="Objetivo atual"
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="rounded-full bg-cadu-pink/40 px-3 py-1 text-xs font-extrabold text-cadu-ink">
          {childProfile.currentProgram}
        </span>
        <span className="text-xs font-bold text-cadu-muted">
          Semana {childProfile.currentWeek} de {childProfile.totalWeeks}
        </span>
      </div>

      <p className="text-sm font-semibold text-cadu-ink">
        Próxima missão: <span className="text-cadu-coral">{childProfile.currentMission}</span>
      </p>

      <div className="mt-3" role="progressbar" aria-valuenow={activityProgress} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-2 rounded-full bg-cadu-cream overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cadu-honey to-cadu-coral"
            style={{ width: `${activityProgress}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs font-bold text-cadu-muted">
          {childProfile.completedActivities} de {childProfile.totalActivities} atividades
        </p>
      </div>
    </motion.section>
  )
}

export function WorldStatusList() {
  return (
    <section aria-label="Mundos da jornada" className="grid gap-2.5 sm:grid-cols-2">
      {journeyWorlds.map((world, i) => {
        const meta = worldStatusMeta[world.status]
        const isActive = world.status === 'active'
        const isAvailable = world.status === 'available'
        const isPlayable = (isActive || isAvailable) && world.href

        return (
          <motion.article
            key={world.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.06 }}
            className={`rounded-3xl border p-4 backdrop-blur-md ${
              isActive
                ? 'bg-white/85 border-cadu-coral/40 shadow-cadu'
                : isAvailable
                  ? 'bg-white/80 border-[#B48CFF]/35 shadow-cadu'
                  : 'bg-white/55 border-white/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-extrabold text-cadu-ink text-sm">{world.name}</h3>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                  isActive
                    ? 'bg-cadu-mint text-cadu-ink'
                    : isAvailable
                      ? 'bg-[#E8D9FF] text-[#5B4B8A]'
                      : world.status === 'next'
                        ? 'bg-cadu-honey/50 text-cadu-ink'
                        : 'bg-cadu-cream text-cadu-muted'
                }`}
              >
                {meta.emoji} {meta.label}
              </span>
            </div>
            {world.domain && (
              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wide text-[#8B7BB8]">
                {world.domain}
              </p>
            )}
            <p className="mt-1.5 text-xs text-cadu-muted leading-snug">
              {world.tagline ?? world.description}
            </p>
            {isPlayable && (
              <Link
                href={world.href!}
                className={`mt-3 inline-block rounded-full px-4 py-1.5 text-xs font-extrabold text-white shadow-cadu transition-transform hover:-translate-y-0.5 ${
                  isAvailable
                    ? 'bg-gradient-to-r from-[#B48CFF] to-[#8B7AE8]'
                    : 'bg-cadu-coral'
                }`}
              >
                {isAvailable ? 'Explorar' : 'Entrar'}
              </Link>
            )}
          </motion.article>
        )
      })}
    </section>
  )
}
