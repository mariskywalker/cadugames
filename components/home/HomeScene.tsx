'use client'

import { CADU_LAYOUT, HOME_ASSETS } from '@/lib/home/assets'
import { buildHomeCaduStackStyle } from '@/lib/home/homeCaduEditorLayout'
import { useParallaxPointer } from '@/hooks/home/useParallaxPointer'
import { useHomeCaduEditorStore } from '@/store/useHomeCaduEditorStore'
import { HomeMissionStack } from './HomeMissionStack'
import { HomeAmbientLife } from './HomeAmbientLife'
import { HomeIntroSpeech } from './HomeIntroSpeech'
import { SkyFloatingClouds } from './SkyFloatingClouds'
import {
  HomeCaduEditorSelection,
  useHomeCaduDrag,
  useHomeCaduEditorHydrate,
  useHomeWideLayout,
} from './HomeCaduEditorTools'
import { todayMission } from '@/lib/mockChildProfile'
import type { ChildProfile } from '@/lib/types'
import Link from 'next/link'

export function HomeScene({
  child,
  onExploreRoom,
  editorMode = false,
}: {
  child: ChildProfile
  onExploreRoom: () => void
  editorMode?: boolean
}) {
  useHomeCaduEditorHydrate()
  const layout = useHomeCaduEditorStore((s) => s.layout)
  const wide = useHomeWideLayout()
  const { onPointerDown, onPointerMove, onPointerUp } = useHomeCaduDrag(editorMode)
  const { rootRef, offset } = useParallaxPointer(6)

  const tiltX = offset.y * -0.028
  const tiltY = offset.x * 0.028
  const shiftX = offset.x * 0.15
  const shiftY = offset.y * 0.15
  const bgShiftX = offset.x * 0.06
  const bgShiftY = offset.y * 0.06
  const parallax = editorMode ? 0 : CADU_LAYOUT.parallaxDepth
  const caduTx = offset.x * parallax
  const caduTy = offset.y * parallax

  const bottomPercent = wide ? layout.bottomPercentWide : layout.bottomPercent
  const stackStyle = buildHomeCaduStackStyle(layout, wide)

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
      <HomeAmbientLife />
      <HomeIntroSpeech childName={child.name} />
      <HomeMissionStack />

      <div
        className={`home-scene__cadu-wrap${editorMode ? ' home-scene__cadu-wrap--editable' : ''}`}
        style={{
          left: `${layout.anchorXPercent}%`,
          bottom: `${bottomPercent}%`,
          transform: `translate3d(calc(-50% + ${layout.offsetX + caduTx}px), ${layout.offsetY + caduTy}px, 0)`,
        }}
      >
        <div className="home-scene__cadu-stack" style={stackStyle}>
          <div className="home-scene__palco-wrap" aria-hidden>
            <img
              className="home-scene__palco"
              src={HOME_ASSETS.palco}
              alt=""
              draggable={false}
              decoding="async"
            />
          </div>
          <div className="home-scene__cadu-hit">
            <HomeCaduEditorSelection editorMode={editorMode} />
            <img
              className={`home-scene__cadu${editorMode ? ' home-scene__cadu--editable' : ''}${layout.floatEnabled && !editorMode ? '' : ' home-scene__cadu--static'}`}
              src={HOME_ASSETS.cadu}
              alt="CADU"
              draggable={false}
              decoding="async"
              style={{
                transform: `rotate(${layout.rotateDeg}deg) scale(${layout.scale})`,
                opacity: layout.opacity,
                filter: `drop-shadow(0 ${layout.shadowY}px ${layout.shadowBlur}px rgba(92, 45, 58, ${layout.shadowAlpha}))`,
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
          </div>
        </div>
      </div>

      <div className="home-scene__cta-group">
        <Link href={todayMission.ctaHref} className="home-scene__cta">
          {todayMission.ctaLabel}
        </Link>
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
