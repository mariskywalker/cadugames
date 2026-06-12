'use client'

import Image from 'next/image'
import { HOME_ASSETS } from '@/lib/home/assets'
import type { ChildProfile } from '@/lib/types'

export function HomeTopBar({ child }: { child: ChildProfile }) {
  const photoSrc = child.id === 'lucas' ? HOME_ASSETS.lucasProfile : null

  return (
    <header className="home-topbar" aria-label="Menu principal CADU">
      <div className="home-topbar__left">
        <div className="home-logo" aria-label="CADU">
          <img className="home-logo__img" src={HOME_ASSETS.logo} alt="CADU" draggable={false} decoding="async" />
        </div>
      </div>

      <div className="home-topbar__right">
        <div className="home-profile" title={`Perfil ${child.name}`}>
          {photoSrc ? (
            <Image
              className="home-profile__avatar"
              src={photoSrc}
              alt=""
              width={38}
              height={38}
              draggable={false}
            />
          ) : (
            <span className="home-profile__avatar home-profile__avatar--emoji" aria-hidden>
              {child.avatar}
            </span>
          )}
          <span className="home-profile__name">{child.name}</span>
        </div>
      </div>
    </header>
  )
}
