'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { therapist } from '@/lib/mockData'

const priorityLabel = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }
const priorityClass = {
  alta: 'bg-red-500/30 text-red-100',
  media: 'bg-amber-500/30 text-amber-100',
  baixa: 'bg-white/20 text-white/80',
}

export function TherapistConnection() {
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-extrabold">Conexão terapêutica 💬</h1>
        <p className="text-white/80 mt-1">Alinhamento com a equipe CADU.</p>
      </motion.div>

      <GlassCard glow className="!p-5">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-4xl">
            {therapist.avatar}
          </span>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold">{therapist.name}</h2>
            <p className="text-sm text-white/70">{therapist.role}</p>
            <p className="text-sm mt-2 text-white/90">
              📍 {therapist.clinic}
              <br />
              📅 Próxima sessão: <strong className="text-white">{therapist.nextSession}</strong>
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed rounded-2xl bg-white/10 p-4 border border-white/15">
          {therapist.message}
        </p>
        <Button className="mt-4 w-full sm:w-auto">Enviar mensagem</Button>
      </GlassCard>

      <h2 className="font-bold text-lg">Recomendações terapêuticas</h2>
      <div className="space-y-3">
        {therapist.recommendations.map((rec, i) => (
          <GlassCard key={rec.id}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="font-bold">{rec.title}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityClass[rec.priority]}`}
                >
                  Prioridade {priorityLabel[rec.priority]}
                </span>
              </div>
              <p className="text-sm text-white/80">{rec.summary}</p>
            </motion.div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
