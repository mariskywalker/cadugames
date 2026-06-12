'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { useApp } from '@/context/AppContext'
import { parentDashboard } from '@/lib/mockData'

const GlbIcon = dynamic(() => import('@/components/ui/GlbIcon'), {
  ssr: false,
  loading: () => <span className="text-4xl">⭐</span>,
})

const weekDays = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

function RingProgress({
  emoji,
  current,
  total,
  color,
}: {
  emoji: string
  current: number
  total: number
  color: string
}) {
  const pct = (current / total) * 100
  const r = 28
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-[72px] w-[72px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl">{emoji}</span>
      </div>
      <span className="text-[10px] font-bold text-white/90">
        {current}/{total}
      </span>
    </div>
  )
}

export function ParentDashboard() {
  const { child } = useApp()
  const xp = child.xp ?? 600
  const xpGoal = child.xpGoal ?? 1000
  const xpPct = Math.round((xp / xpGoal) * 100)
  const data = parentDashboard

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-extrabold">Olá, mamãe! 👋</h1>
        <p className="text-white/80 mt-1">Aqui está o resumo do {child.name}.</p>
      </motion.div>

      <div className="grid gap-3 md:grid-cols-12 md:grid-rows-[auto_auto_auto]">
        {/* Perfil + nível */}
        <GlassCard className="md:col-span-4 md:row-span-2" glow>
          <div className="flex flex-col items-center text-center h-full justify-center py-2">
            <span className="text-6xl mb-2">{child.avatar}</span>
            <p className="text-xl font-extrabold">{child.name}</p>
            <p className="text-sm text-white/70 mt-1">Nível {child.level}</p>
            <div className="w-full mt-4">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>{xp} / {xpGoal} XP</span>
                <GlbIcon src="/models/star.glb" size={20} glowColor="rgba(255,196,87,0.5)" />
              </div>
              <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cadu-honey to-amber-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Sequência */}
        <GlassCard className="md:col-span-4">
          <p className="text-sm font-bold text-white/80 mb-2">Sequência</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-extrabold">{child.streak} dias seguidos</span>
          </div>
          <div className="flex justify-between gap-1">
            {weekDays.map((day, i) => (
              <div key={`${day}-${i}`} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-white/60">{day}</span>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                    data.streakDays[i] ? 'bg-cadu-pink/80 text-white' : 'bg-white/10 text-white/40'
                  }`}
                >
                  {data.streakDays[i] ? '✓' : ''}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Trilhas */}
        <GlassCard className="md:col-span-4">
          <p className="text-sm font-bold text-white/80 mb-3">Trilhas em andamento</p>
          <div className="flex justify-between">
            {data.trailProgress.map((t) => (
              <RingProgress
                key={t.id}
                emoji={t.emoji}
                current={t.current}
                total={t.total}
                color={t.ringColor}
              />
            ))}
          </div>
        </GlassCard>

        {/* Stats row */}
        <GlassCard className="md:col-span-3">
          <span className="text-2xl">📅</span>
          <p className="text-2xl font-extrabold mt-2">{data.activitiesThisWeek}</p>
          <p className="text-xs text-white/70">atividades realizadas</p>
        </GlassCard>

        <GlassCard className="md:col-span-3">
          <span className="text-4xl">{data.dominantEmotion.emoji}</span>
          <p className="text-lg font-extrabold mt-2">{data.dominantEmotion.label}</p>
          <p className="text-xs text-white/70">Emoção mais frequente</p>
        </GlassCard>

        <GlassCard className="md:col-span-3">
          <GlbIcon src="/models/star.glb" size={52} />
          <p className="text-2xl font-extrabold mt-2">{data.achievementsStars}</p>
          <p className="text-xs text-white/70">estrelas · Conquistas</p>
        </GlassCard>

        {/* Resumo */}
        <GlassCard className="md:col-span-5">
          <p className="text-sm font-bold text-white/80 mb-2">Resumo da semana</p>
          <p className="text-sm leading-relaxed text-white/90">{data.weekSummary}</p>
          <Link
            href="/parent/report"
            className="inline-flex mt-4 items-center gap-2 rounded-full bg-gradient-to-r from-cadu-pink to-cadu-coral px-4 py-2.5 text-sm font-bold shadow-lg hover:brightness-110 transition"
          >
            Ver relatório completo →
          </Link>
        </GlassCard>

        {/* Última atividade */}
        <GlassCard className="md:col-span-4">
          <p className="text-sm font-bold text-white/80 mb-3">Última atividade</p>
          <div className="flex gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl">
              {data.lastActivity.emoji}
            </div>
            <div>
              <p className="font-bold">{data.lastActivity.title}</p>
              <p className="text-xs text-white/70">{data.lastActivity.trail}</p>
              <p className="text-xs text-cadu-pink mt-1 font-semibold">{data.lastActivity.when}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <motion.div
        className="hidden md:flex justify-center -mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-7xl drop-shadow-lg" role="img" aria-label="CADU">
          🐻
        </span>
      </motion.div>
    </div>
  )
}
