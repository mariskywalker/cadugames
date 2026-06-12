'use client'

import { CADU_LAYOUT, HOME_ASSETS } from '@/lib/home/assets'
import { useParallaxPointer } from '@/hooks/home/useParallaxPointer'
import { HomeChildProfileCard } from './HomeChildProfileCard'
import { HomeIntroSpeech } from './HomeIntroSpeech'
import { SkyFloatingClouds } from './SkyFloatingClouds'
import type { ChildProfile } from '@/lib/types'

export function HomeScene({
  child,
  onContinueJourney,
  onExploreRoom,
}: {
  child: ChildProfile
  onContinueJourney: () => void
  onExploreRoom: () => void
}) {
  const { rootRef, offset } = useParallaxPointer(6)
  const layout = CADU_LAYOUT

  const tiltX = offset.y * -0.028
  const tiltY = offset.x * 0.028
  const shiftX = offset.x * 0.15
  const shiftY = offset.y * 0.15
  const bgShiftX = offset.x * 0.06
  const bgShiftY = offset.y * 0.06
  const caduTx = offset.x * layout.parallaxDepth
  const caduTy = offset.y * layout.parallaxDepth

  return (
    <main ref={rootRef} className="home-scene" aria-label="Mundo CADU">
      <div
        className="home-scene__stage"
        style={{
          transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${shiftX}px, ${shiftY}px, 0)`,
        }}
      >
        <img
          className="home-scene__background"
          src={HOME_ASSETS.background}
          alt=""
          draggable={false}
          decoding="async"
          style={{ transform: `translate3d(${bgShiftX}px, ${bgShiftY}px, 0) scale(1.03)` }}
        />
        <div className="home-scene__depth" aria-hidden />
      </div>

      <SkyFloatingClouds offset={offset} />
      <HomeIntroSpeech />
      <HomeChildProfileCard child={child} />

      <div
        className="home-scene__cadu-wrap"
        style={{
          left: `${layout.anchorXPercent}%`,
          bottom: `${layout.bottomPercent}%`,
          transform: `translate3d(calc(-50% + ${caduTx}px), ${caduTy}px, 0)`,
        }}
      >
        <div className="home-scene__cadu-stack">
          <div className="home-scene__palco-wrap" aria-hidden>
            <img
              className="home-scene__palco"
              src={HOME_ASSETS.palco}
              alt=""
              draggable={false}
              decoding="async"
            />
          </div>
          <img
            className="home-scene__cadu"
            src={HOME_ASSETS.cadu}
            alt="CADU"
            draggable={false}
            decoding="async"
          />
        </div>
      </div>

      <div className="home-scene__cta-group">
        <button type="button" className="home-scene__cta" onClick={onContinueJourney}>
          Continuar jornada
        </button>
        <button
          type="button"
          className="home-scene__cta home-scene__cta--ghost"
          onClick={onExploreRoom}
        >
          Explorar sala
        </button>
      </div>
    </main>
  )
}
