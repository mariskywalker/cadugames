'use client'

import { motion } from 'framer-motion'

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${8 + (i * 6.5) % 88}%`,
  delay: i * 0.35,
  duration: 5.5 + (i % 4),
  size: 6 + (i % 3) * 2,
  drift: (i % 2 === 0 ? 1 : -1) * (12 + (i % 5) * 4),
}))

const CLOUDS = [
  { left: '12%', top: '8%', w: 72, delay: 0 },
  { left: '58%', top: '5%', w: 96, delay: 1.2 },
  { left: '78%', top: '14%', w: 56, delay: 2.4 },
]

export function ValeLivingAtmosphere() {
  return (
    <div className="vale-living-atmosphere" aria-hidden>
      <div className="vale-living-sky" />
      <div className="vale-living-haze" />

      {CLOUDS.map((c, i) => (
        <motion.div
          key={i}
          className="vale-living-cloud"
          style={{ left: c.left, top: c.top, width: c.w }}
          animate={{ x: [0, 14, 0], opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 12 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
        />
      ))}

      <div className="vale-living-ground" />
      <div className="vale-living-island-glow" />

      <svg className="vale-living-scenery" viewBox="0 0 400 120" preserveAspectRatio="xMidYMax meet">
        <ellipse cx="200" cy="108" rx="168" ry="22" fill="rgba(168, 210, 160, 0.35)" />
        <ellipse cx="88" cy="98" rx="28" ry="14" fill="rgba(140, 195, 130, 0.45)" />
        <ellipse cx="310" cy="100" rx="32" ry="15" fill="rgba(150, 200, 140, 0.4)" />
        {/* cogumelos */}
        <g className="vale-mushroom" transform="translate(52, 78)">
          <ellipse cx="12" cy="18" rx="14" ry="9" fill="#f5b8c8" opacity="0.9" />
          <rect x="8" y="18" width="8" height="14" rx="3" fill="#f8efe6" />
          <circle cx="9" cy="14" r="2" fill="rgba(255,255,255,0.5)" />
          <circle cx="15" cy="12" r="1.5" fill="rgba(255,255,255,0.4)" />
        </g>
        <g className="vale-mushroom" transform="translate(318, 80)">
          <ellipse cx="12" cy="16" rx="12" ry="8" fill="#d4b8f0" opacity="0.85" />
          <rect x="9" y="16" width="6" height="12" rx="2" fill="#f8efe6" />
        </g>
        {/* flores com glow */}
        <g className="vale-flower-glow">
          <circle cx="130" cy="92" r="8" fill="rgba(255, 190, 210, 0.25)" />
          <circle cx="130" cy="92" r="4" fill="#ffb8d0" opacity="0.8" />
        </g>
        <g className="vale-flower-glow">
          <circle cx="268" cy="90" r="7" fill="rgba(255, 190, 210, 0.22)" />
          <circle cx="268" cy="90" r="3.5" fill="#ffc8dc" opacity="0.75" />
        </g>
        <g className="vale-flower-glow">
          <circle cx="200" cy="96" r="6" fill="rgba(255, 200, 220, 0.2)" />
          <circle cx="200" cy="96" r="3" fill="#ffd0e0" opacity="0.7" />
        </g>
        {/* arbustos */}
        <ellipse cx="155" cy="102" rx="18" ry="10" fill="rgba(130, 185, 125, 0.5)" />
        <ellipse cx="245" cy="103" rx="20" ry="11" fill="rgba(125, 180, 120, 0.48)" />
      </svg>

      <div className="vale-living-petals">
        {PETALS.map((p) => (
          <motion.span
            key={p.id}
            className="vale-living-petal"
            style={{
              left: p.left,
              width: p.size,
              height: p.size * 1.4,
            }}
            initial={{ top: '-5%', opacity: 0, rotate: 0 }}
            animate={{
              top: ['-5%', '105%'],
              opacity: [0, 0.75, 0.75, 0],
              x: [0, p.drift, p.drift * 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </div>
  )
}
