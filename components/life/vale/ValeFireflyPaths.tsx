'use client'

import { motion } from 'framer-motion'
import type { ValePlacement } from '@/lib/valeHubData'

const DIRECTIONS: ValePlacement[] = ['top', 'left', 'right', 'bottom']

export function ValeFireflyPaths({
  activePlacement,
}: {
  placements: ValePlacement[]
  activePlacement: ValePlacement | null
}) {
  return (
    <div className="vale-fireflies" aria-hidden>
      {DIRECTIONS.map((dir, i) => (
        <div key={dir} className={`vale-firefly-lane vale-firefly-lane--${dir}`}>
          {[0, 1, 2].map((j) => (
            <motion.span
              key={j}
              className={
                activePlacement === dir
                  ? 'vale-firefly vale-firefly--lit'
                  : 'vale-firefly'
              }
              animate={{
                opacity: [0.15, 0.85, 0.15],
                scale: [0.7, 1.15, 0.7],
              }}
              transition={{
                duration: 2.8 + j * 0.5,
                repeat: Infinity,
                delay: i * 0.4 + j * 0.7,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
