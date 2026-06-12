'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useFocusSpotEditorMode } from '@/hooks/vale/useFocusSpotEditorMode'
import { useFlowerEditorMode } from '@/hooks/vale/useFlowerEditorMode'
import { usePropEditorMode } from '@/hooks/vale/usePropEditorMode'
import { loadMergedFocusSpots } from '@/lib/vale/focusSpotEditorStorage'
import { focusSpotsToCssVars, type FocusSpot } from '@/lib/vale/focusSpotLayout'
import { VALE_SCENE_ZOOM } from '@/lib/vale/valeSceneLayout'
import { VALE_HERO_MODE, VALE_REFERENCE_BG, VALE_USE_REFERENCE_BG } from '@/lib/vale/valeWorld'
import { ValeFlowerEditorPanel } from './ValeFlowerEditorPanel'
import { ValeFocusSpotEditor } from './ValeFocusSpotEditor'
import { ValeHeroHousePrompt } from './ValeHeroHousePrompt'
import { ValePropEditorPanel } from './ValePropEditorPanel'
import { ValeSceneProps } from './ValeSceneProps'
import { ValeUIOverlay } from './ValeUIOverlay'
import './vale.css'

const ValeWorldScene = dynamic(() => import('./ValeWorldScene'), {
  ssr: false,
  loading: () => (
    <div className="vale-page__splash" aria-hidden>
      <div className="vale-page__pulse" />
      <p className="vale-page__splash-hint">Abrindo o Vale das Palavras…</p>
    </div>
  ),
})

export function ValeExperience() {
  const { editorMode, setEditorMode, message, setMessage } = useFocusSpotEditorMode()
  const {
    editorMode: flowerEditorMode,
    setEditorMode: setFlowerEditorMode,
    message: flowerMessage,
    setMessage: setFlowerMessage,
  } = useFlowerEditorMode()
  const {
    editorMode: propEditorMode,
    setEditorMode: setPropEditorMode,
    message: propMessage,
    setMessage: setPropMessage,
  } = usePropEditorMode()
  const [focusSpots, setFocusSpots] = useState<FocusSpot[]>(() => loadMergedFocusSpots())

  useEffect(() => {
    setFocusSpots(loadMergedFocusSpots())
  }, [])

  useEffect(() => {
    const page = document.querySelector('.vale-page') as HTMLElement | null
    page?.focus({ preventScroll: true })
  }, [])

  const focusStyle = useMemo(
    () => focusSpotsToCssVars(focusSpots) as CSSProperties,
    [focusSpots],
  )

  const pageClass = [
    'vale-page',
    VALE_USE_REFERENCE_BG ? 'vale-page--reference' : '',
    VALE_HERO_MODE ? 'vale-page--hero' : '',
    editorMode ? 'vale-page--focus-editor' : '',
    flowerEditorMode ? 'vale-page--flower-editor' : '',
    propEditorMode ? 'vale-page--prop-editor' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={pageClass}
      style={VALE_HERO_MODE ? focusStyle : undefined}
      tabIndex={-1}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest('input, textarea, button, [role="dialog"]')) return
        e.currentTarget.focus({ preventScroll: true })
      }}
    >
      <div
        className="vale-scene"
        style={{
          transform: `scale(${VALE_SCENE_ZOOM.scale})`,
          transformOrigin: `${VALE_SCENE_ZOOM.originX} ${VALE_SCENE_ZOOM.originY}`,
        }}
      >
        {VALE_USE_REFERENCE_BG ? (
          <>
            <div
              className="vale-page__reference-bg"
              style={{ backgroundImage: `url(${VALE_REFERENCE_BG})` }}
              aria-hidden
            />
            <div className="vale-page__reference-sunglow" aria-hidden />
            <div className="vale-page__reference-haze" aria-hidden />
          </>
        ) : (
          <div className="vale-page__bg" aria-hidden />
        )}
        {VALE_HERO_MODE && <ValeSceneProps />}
        {VALE_HERO_MODE && VALE_USE_REFERENCE_BG && (
          <div className="vale-ground-fog" aria-hidden />
        )}
        <ValeWorldScene />
        {VALE_HERO_MODE && (
          <div className="vale-scene-fx" aria-hidden>
            <div className="vale-air-blur" />
            <div className="vale-air-tint" />
            <div className="vale-color-grade" />
            <div className="vale-haze" />
            <div className="vale-bloom-glow" />
            <div className="vale-bloom-blur" />
          </div>
        )}
      </div>
      <div className="vale-ui-root">
        {VALE_HERO_MODE && (
          <>
            <ValeFocusSpotEditor
              spots={focusSpots}
              editorMode={editorMode}
              message={message}
              onSpotsChange={setFocusSpots}
              onClose={() => {
                setEditorMode(false)
                setMessage(null)
              }}
            />
            <ValeFlowerEditorPanel
              message={flowerMessage}
              onClose={() => {
                setFlowerEditorMode(false)
                setFlowerMessage(null)
              }}
            />
            <ValePropEditorPanel
              message={propMessage}
              onClose={() => {
                setPropEditorMode(false)
                setPropMessage(null)
              }}
            />
            <ValeHeroHousePrompt />
          </>
        )}
        {!VALE_HERO_MODE && <ValeUIOverlay />}
      </div>
      {!VALE_HERO_MODE && <div className="vale-page__vignette" aria-hidden />}
    </div>
  )
}
