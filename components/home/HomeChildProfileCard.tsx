'use client'

import Image from 'next/image'
import { HOME_ASSETS } from '@/lib/home/assets'
import { childProfile } from '@/lib/mockChildProfile'
import type { ChildProfile } from '@/lib/types'

export function HomeChildProfileCard({ child }: { child: ChildProfile }) {
  const weekProgress = Math.round(
    (childProfile.completedActivities / childProfile.totalActivities) * 100,
  )
  const photoSrc = child.id === 'lucas' ? HOME_ASSETS.lucasProfile : null

  return (
    <article className="home-child-card" aria-label={`Perfil de ${childProfile.name}`}>
      <div className="home-child-card__main">
        <div className="home-child-card__avatar-wrap">
          {photoSrc ? (
            <Image
              className="home-child-card__photo"
              src={photoSrc}
              alt=""
              width={56}
              height={56}
            />
          ) : (
            <span className="home-child-card__emoji" aria-hidden>
              {child.avatar}
            </span>
          )}
        </div>
        <div className="home-child-card__copy">
          <p className="home-child-card__name">{childProfile.name}</p>
          <p className="home-child-card__meta">{childProfile.age} anos</p>
          <p className="home-child-card__program">{childProfile.currentProgram}</p>
          <div
            className="home-child-card__progress"
            role="progressbar"
            aria-valuenow={weekProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="home-child-card__progress-track">
              <div
                className="home-child-card__progress-fill"
                style={{ width: `${weekProgress}%` }}
              />
            </div>
            <span className="home-child-card__progress-label">
              {childProfile.completedActivities} de {childProfile.totalActivities} atividades da semana
            </span>
          </div>
        </div>
      </div>

      <p className="home-child-card__last">
        {childProfile.lastActivity.emoji} Última atividade: {childProfile.lastActivity.title} ·{' '}
        {childProfile.lastActivity.when}
      </p>
    </article>
  )
}
