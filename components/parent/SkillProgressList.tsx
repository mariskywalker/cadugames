'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { useApp } from '@/context/AppContext'
import { skills } from '@/lib/mockData'

const trendLabel = { up: '↑ Subindo', stable: '→ Estável', down: '↓ Atenção' }

export function SkillProgressList() {
  const { child } = useApp()

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-extrabold">Perfil evolutivo 📈</h1>
        <p className="text-white/80 mt-1">
          Habilidades socioemocionais de {child.name} — visão terapêutica.
        </p>
      </motion.div>

      <div className="space-y-3">
        {skills.map((skill, i) => (
          <GlassCard key={skill.id} glow>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <p className="text-lg font-bold">
                  {skill.emoji} {skill.name}
                </p>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                  {trendLabel[skill.trend]}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cadu-sky to-cadu-mint"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.progress}%` }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                />
              </div>
              <p className="text-xs text-white/70 mt-2">{skill.progress}% de domínio estimado</p>
            </motion.div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <p className="text-sm text-white/80 leading-relaxed">
          Os dados são orientativos e complementam o acompanhamento com a terapeuta. Use o{' '}
          <strong className="text-white">relatório semanal</strong> para conversar em casa.
        </p>
      </GlassCard>
    </div>
  )
}
