import { useEffect, useRef, useState } from 'react'
import { WATER_REGION } from './waterConfig'

const ASSETS = {
  waterVideo: '/interactive-map/water.mp4',
  waterFallback: '/interactive-map/water-fallback.svg',
}

/**
 * Masked water layer: video/CSS only inside shoreline clip.
 * Pauses video + shimmer when offscreen or tab hidden.
 */
export function WaterLayer({ layerStyle, reducedMotion }) {
  const zoneRef = useRef(null)
  const videoRef = useRef(null)
  const [videoOk, setVideoOk] = useState(true)
  const [inView, setInView] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)

  const shouldAnimate = inView && tabVisible && !reducedMotion

  // Pause when scrolled offscreen (or parent hidden)
  useEffect(() => {
    const el = zoneRef.current
    if (!el) return undefined

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root: null, threshold: 0.02, rootMargin: '40px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Pause when browser tab is backgrounded
  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Control video playback explicitly (no autoplay fighting pause)
  useEffect(() => {
    const v = videoRef.current
    if (!v || !videoOk) return undefined

    if (shouldAnimate) {
      const p = v.play()
      if (p?.catch) p.catch(() => setVideoOk(false))
    } else {
      v.pause()
    }
    return undefined
  }, [shouldAnimate, videoOk])

  const maskStyle = WATER_REGION.maskImage
    ? {
        WebkitMaskImage: `url(${WATER_REGION.maskImage})`,
        maskImage: `url(${WATER_REGION.maskImage})`,
        WebkitMaskSize: 'cover',
        maskSize: 'cover',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        clipPath: 'none',
      }
    : { clipPath: WATER_REGION.clipPath }

  return (
    <div
      ref={zoneRef}
      className={`interactive-map__water-zone ${shouldAnimate ? 'is-animating' : ''}`}
      style={{ ...layerStyle, ...maskStyle }}
      aria-hidden
    >
      <div className="interactive-map__water-media">
        {videoOk ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            poster={ASSETS.waterFallback}
            disablePictureInPicture
            onError={() => setVideoOk(false)}
          >
            <source src={ASSETS.waterVideo} type="video/mp4" />
          </video>
        ) : (
          <img
            className="interactive-map__water-fallback-img"
            src={ASSETS.waterFallback}
            alt=""
            draggable={false}
          />
        )}
      </div>

      {/* Lightweight reflection shimmer (CSS only, paused when offscreen) */}
      <div className="interactive-map__water-shimmer" />
      <div className="interactive-map__water-shimmer interactive-map__water-shimmer--soft" />
    </div>
  )
}
