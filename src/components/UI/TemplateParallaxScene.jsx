import { useMemo } from 'react'
import {
  BUBBLE_COLUMN_BOX,
  LAYER_BACKGROUND,
  LAYER_CADU,
  LAYER_CADU_LAYOUT,
  SHOW_TEMPLATE_COMPOSITE,
  SKY_PARTICLE_BOX,
  TEMPLATE_ENTER_HOTSPOT,
  TEMPLATE_GLASS_REGIONS,
  TEMPLATE_SRC,
} from '../../constants/templateLayers'
import { useParallaxPointer } from '../../hooks/useParallaxPointer'
import { useCADUStore } from '../../store/useCADUStore'
import { SkyFloatingClouds } from './SkyFloatingClouds'
import './landing.css'

function BubbleColumn() {
  if (!SHOW_TEMPLATE_COMPOSITE) return null

  const box = BUBBLE_COLUMN_BOX
  const bubbles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: 8 + (i * 17) % 84,
        delay: (i * 0.58) % 5,
        size: 4 + (i % 4) * 2,
        duration: 4.5 + (i % 5) * 0.8,
      })),
    [],
  )

  return (
    <div
      className="cadu-template-fx cadu-template-fx--bubbles"
      style={{
        left: `${box.left}%`,
        top: `${box.top}%`,
        width: `${box.width}%`,
        height: `${box.height}%`,
      }}
      aria-hidden
    >
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="cadu-template-fx__bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function SkyParticles() {
  const box = SKY_PARTICLE_BOX
  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: (i * 37) % 100,
        top: (i * 19 + 5) % 95,
        delay: (i * 0.36) % 4,
        scale: 0.5 + (i % 3) * 0.2,
      })),
    [],
  )

  return (
    <div
      className="cadu-template-fx cadu-template-fx--particles"
      style={{
        left: `${box.left}%`,
        top: `${box.top}%`,
        width: `${box.width}%`,
        height: `${box.height}%`,
      }}
      aria-hidden
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="cadu-template-fx__spark"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            transform: `scale(${s.scale})`,
          }}
        />
      ))}
    </div>
  )
}

function GlassBoost() {
  if (!SHOW_TEMPLATE_COMPOSITE) return null

  return (
    <div className="cadu-template-glass" aria-hidden>
      {TEMPLATE_GLASS_REGIONS.map((r) => (
        <div
          key={r.id}
          className={`cadu-template-glass__pane cadu-template-glass__pane--${r.id}`}
          style={{
            left: `${r.left}%`,
            top: `${r.top}%`,
            width: `${r.width}%`,
            height: `${r.height}%`,
          }}
        />
      ))}
    </div>
  )
}

function CaduHero({ onEnter, offset }) {
  const layout = LAYER_CADU_LAYOUT
  const tx = offset.x * layout.parallaxDepth
  const ty = offset.y * layout.parallaxDepth

  return (
    <div
      className="cadu-template-scene__cadu-wrap"
      style={{
        left: `${layout.anchorXPercent}%`,
        bottom: `${layout.bottomPercent}%`,
        transform: `translate3d(calc(-50% + ${tx}px), ${ty}px, 0)`,
      }}
    >
      <button type="button" className="cadu-template-scene__cadu-hit" onClick={onEnter}>
        <img
          className="cadu-template-scene__cadu"
          src={LAYER_CADU}
          alt="CADU"
          draggable={false}
          decoding="async"
          style={{
            maxHeight: layout.maxHeightPx,
            maxWidth: layout.maxWidthPx,
            height: `${layout.heightVh}vh`,
          }}
        />
      </button>
    </div>
  )
}

function EnterHotspot({ onEnter }) {
  const h = TEMPLATE_ENTER_HOTSPOT
  return (
    <button
      type="button"
      className="cadu-template-hotspot"
      style={{
        left: `${h.left}%`,
        top: `${h.top}%`,
        width: `${h.width}%`,
        height: `${h.height}%`,
      }}
      onClick={onEnter}
      aria-label="Explorar a sala sensorial"
    />
  )
}

/** Montagem por camadas — background aplicado; demais peças conforme você enviar. */
export function TemplateParallaxScene() {
  const enterRoom = useCADUStore((s) => s.enterRoom)
  const { rootRef, offset } = useParallaxPointer(6)

  const tiltX = offset.y * -0.028
  const tiltY = offset.x * 0.028
  const shiftX = offset.x * 0.15
  const shiftY = offset.y * 0.15
  const bgShiftX = offset.x * 0.06
  const bgShiftY = offset.y * 0.06

  return (
    <main ref={rootRef} className="cadu-template-scene" aria-label="CADU">
      <div
        className="cadu-template-scene__stage"
        style={{
          transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${shiftX}px, ${shiftY}px, 0)`,
        }}
      >
        <img
          className="cadu-template-scene__background"
          src={LAYER_BACKGROUND}
          alt=""
          draggable={false}
          decoding="async"
          style={{ transform: `translate3d(${bgShiftX}px, ${bgShiftY}px, 0) scale(1.03)` }}
        />

        <div className="cadu-template-scene__depth" aria-hidden />

        {SHOW_TEMPLATE_COMPOSITE && (
          <img
            className="cadu-template-scene__art"
            src={TEMPLATE_SRC}
            alt=""
            draggable={false}
            decoding="async"
          />
        )}
      </div>

      <SkyFloatingClouds offset={offset} />
      <SkyParticles />
      <CaduHero onEnter={enterRoom} offset={offset} />
      <BubbleColumn />
      <GlassBoost />

      {SHOW_TEMPLATE_COMPOSITE && <EnterHotspot onEnter={enterRoom} />}
    </main>
  )
}
