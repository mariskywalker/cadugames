'use client'

import dynamic from 'next/dynamic'

const ValeExperience = dynamic(
  () => import('@/components/vale/ValeExperience').then((m) => m.ValeExperience),
  {
    ssr: false,
    loading: () => (
      <div className="vale-page vale-page--hero" aria-busy="true">
        <div className="vale-page__splash">
          <div className="vale-page__pulse" />
          <p className="vale-page__splash-hint">Abrindo o Vale das Palavras…</p>
        </div>
      </div>
    ),
  },
)

export function ValeExperienceLoader() {
  return <ValeExperience />
}
