'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { childProfile, growthDomains } from '@/lib/mockChildProfile'

export function GrowthDashboard() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-extrabold">Meu Crescimento 🌱</h1>
        <p className="text-cadu-muted mt-1 mb-5">
          Histórias sobre a evolução de {childProfile.name}, no ritmo dele e sem pressa.
        </p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2">
        {growthDomains.map((domain, i) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + i * 0.06 }}
          >
            <Card>
              <p className="text-sm font-extrabold text-cadu-ink">
                {domain.emoji} {domain.name}
              </p>
              <p className="mt-2.5 text-sm md:text-base font-semibold text-cadu-ink leading-relaxed">
                {domain.note}
              </p>
              <p className="mt-3 text-[11px] font-bold text-cadu-muted/70">
                Acompanhamento clínico · {domain.progress}%
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
