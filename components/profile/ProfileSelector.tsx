'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useApp } from '@/context/AppContext'
import { children } from '@/lib/mockData'
import type { UserMode } from '@/lib/types'
import { cn } from '@/lib/cn'

export function ProfileSelector() {
  const router = useRouter()
  const { child, setChild, setMode } = useApp()

  const pickMode = (mode: UserMode) => {
    setMode(mode)
    router.push(mode === 'child' ? '/child/diary' : '/parent/journey')
  }

  return (
    <div className="mx-auto max-w-2xl pt-6 md:pt-12">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-cadu-pink via-cadu-peach to-cadu-coral text-4xl shadow-cadu-lg">
          🐻
        </div>
        <h1 className="text-cadu-display text-cadu-ink">CADU Games</h1>
        <p className="text-cadu-body mt-2 max-w-md mx-auto">
          Um mundo acolhedor para brincar, sentir e crescer — com apoio da família e da terapeuta.
        </p>
      </motion.header>

      <Card className="mb-6">
        <p className="text-sm font-semibold text-cadu-muted mb-3">Quem vai entrar?</p>
        <div className="grid grid-cols-2 gap-3">
          {children.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChild(c)}
              className={cn(
                'rounded-3xl border-2 p-4 text-left transition-all min-h-[56px]',
                child.id === c.id
                  ? 'border-cadu-coral bg-cadu-pink/25 shadow-cadu'
                  : 'border-transparent bg-cadu-cream hover:border-cadu-pink/40',
              )}
            >
              <span className="text-3xl">{c.avatar}</span>
              <p className="mt-2 font-bold">{c.name}</p>
              <p className="text-xs text-cadu-muted">Nível {c.level}</p>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Button size="lg" className="w-full" onClick={() => pickMode('child')}>
          🎮 Modo Criança
        </Button>
        <Button size="lg" variant="secondary" className="w-full" onClick={() => pickMode('parent')}>
          👩‍👦 Modo Responsável
        </Button>
      </div>
    </div>
  )
}
