'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useBearTargetEditorMode } from '@/hooks/vale/useBearTargetEditorMode'
import { useCameraEditorMode } from '@/hooks/vale/useCameraEditorMode'
import { useFocusSpotEditorMode } from '@/hooks/vale/useFocusSpotEditorMode'
import { useFlowerEditorMode } from '@/hooks/vale/useFlowerEditorMode'
import { usePropEditorMode } from '@/hooks/vale/usePropEditorMode'
import { clearValeLocalStorageCache } from '@/lib/vale/clearValeCache'
import { loadMergedFocusSpots } from '@/lib/vale/focusSpotEditorStorage'
import { DEFAULT_FOCUS_SPOTS, focusSpotsToCssVars, type FocusSpot } from '@/lib/vale/focusSpotLayout'
import { useValeCameraEditorStore } from '@/store/useValeCameraEditorStore'
import { useValeIslandEditorStore } from '@/store/useValeIslandEditorStore'
import { VALE_HERO_MODE, VALE_REFERENCE_BG, VALE_USE_REFERENCE_BG } from '@/lib/vale/valeWorld'
import {
  VALE_GAMEPLAY_ENABLED,
  VALE_HOTSPOT_EDITOR_ENABLED,
  VALE_STATIC_SCENE,
} from '@/lib/vale/valeBearSafe'
import { VALE_BEAR_TARGET_EDITOR_ENABLED } from '@/lib/vale/valeCharacterFreeze'
import { ValeBearTargetEditorPanel } from './ValeBearTargetEditorPanel'
import { ValeVisualTargetDebug } from './ValeVisualTargetDebug'
import { ValeVisualTargetEditor } from './ValeVisualTargetEditor'
import { ValeCameraEditorPanel } from './ValeCameraEditorPanel'
import { ValeFlowerEditorPanel } from './ValeFlowerEditorPanel'
import { ValeFocusSpotEditor } from './ValeFocusSpotEditor'
import { ValeHotspotCard } from './ValeHotspotCard'
import { ValeHotspotLayer } from './ValeHotspotLayer'
import { ValeHotspotSheet } from './ValeHotspotSheet'
import { ValeNarrativeIntro } from './ValeNarrativeIntro'
import { ValePropEditorPanel } from './ValePropEditorPanel'
import { ValeProgressPath } from './ValeProgressPath'
import { ValeSceneProps } from './ValeSceneProps'
import { ValeStaticIsland } from './ValeStaticIsland'
import { ValeUIOverlay } from './ValeUIOverlay'
import { useStoneNodeEditorMode } from '@/hooks/vale/useStoneNodeEditorMode'
import { useHubPointEditorMode } from '@/hooks/worlds/useHubPointEditorMode'
import { useValeHotspotEditorMode } from '@/hooks/vale/useValeHotspotEditorMode'
import { useWalkPathEditorMode } from '@/hooks/vale/useWalkPathEditorMode'
import { ValeEditorControlPanel, type ValeEditorId } from './ValeEditorControlPanel'
import '@/components/worlds/world-interactions.css'
import './vale.css'

const HubPointEditorTools = dynamic(
  () => import('@/components/worlds/HubPointEditorTools').then((m) => m.HubPointEditorTools),
  { ssr: false },
)

const ValeHotspotEditorPanel = dynamic(
  () => import('./ValeHotspotEditorPanel').then((m) => m.ValeHotspotEditorPanel),
  { ssr: false },
)

const ValeHotspotPathScreenOverlay = dynamic(
  () => import('./ValeHotspotPathScreenOverlay').then((m) => m.ValeHotspotPathScreenOverlay),
  { ssr: false },
)

const ValeWalkPathEditorPanel = dynamic(
  () => import('./ValeWalkPathEditorPanel').then((m) => m.ValeWalkPathEditorPanel),
  { ssr: false },
)

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
    editorMode: cameraEditorMode,
    setEditorMode: setCameraEditorMode,
    message: cameraMessage,
    setMessage: setCameraMessage,
  } = useCameraEditorMode()
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
  const { editorMode: layoutEditorMode, setEditorMode: setLayoutEditorMode, message: layoutMessage, setMessage: setLayoutMessage } = useStoneNodeEditorMode()
  const {
    editorMode: bearTargetEditorMode,
    setEditorMode: setBearTargetEditorMode,
    message: bearTargetMessage,
    setMessage: setBearTargetMessage,
  } = useBearTargetEditorMode()
  const {
    editorMode: hubEditorMode,
    setEditorMode: setHubEditorMode,
    message: hubMessage,
    setMessage: setHubMessage,
  } = useHubPointEditorMode()
  const {
    editorMode: hotspotEditorMode,
    setEditorMode: setHotspotEditorMode,
    message: hotspotMessage,
    setMessage: setHotspotMessage,
  } = useValeHotspotEditorMode()
  const {
    editorMode: walkEditorMode,
    setEditorMode: setWalkEditorMode,
    message: walkMessage,
    setMessage: setWalkMessage,
  } = useWalkPathEditorMode()
  const [focusSpots, setFocusSpots] = useState<FocusSpot[]>(DEFAULT_FOCUS_SPOTS)
  const cameraLayout = useValeCameraEditorStore((s) => s.layout)
  const hydrateCamera = useValeCameraEditorStore((s) => s.hydrate)
  const hydrateIsland = useValeIslandEditorStore((s) => s.hydrate)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('clearCache') === '1') {
      clearValeLocalStorageCache()
      params.delete('clearCache')
      const qs = params.toString()
      const next = `${window.location.pathname}${qs ? `?${qs}` : ''}`
      window.history.replaceState(null, '', next)
    }
    hydrateCamera()
    hydrateIsland()
    setFocusSpots(loadMergedFocusSpots())
  }, [hydrateCamera, hydrateIsland])

  useEffect(() => {
    const page = document.querySelector('.vale-page') as HTMLElement | null
    page?.focus({ preventScroll: true })
  }, [])

  const focusStyle = useMemo(
    () => focusSpotsToCssVars(focusSpots) as CSSProperties,
    [focusSpots],
  )

  const closeAllEditors = useCallback(() => {
    setEditorMode(false)
    setMessage(null)
    setCameraEditorMode(false)
    setCameraMessage(null)
    setFlowerEditorMode(false)
    setFlowerMessage(null)
    setPropEditorMode(false)
    setPropMessage(null)
    setLayoutEditorMode(false)
    setLayoutMessage(null)
    setBearTargetEditorMode(false)
    setBearTargetMessage(null)
    setHubEditorMode(false)
    setHubMessage(null)
    setHotspotEditorMode(false)
    setHotspotMessage(null)
    setWalkEditorMode(false)
    setWalkMessage(null)
  }, [
    setBearTargetEditorMode,
    setBearTargetMessage,
    setCameraEditorMode,
    setCameraMessage,
    setEditorMode,
    setFlowerEditorMode,
    setFlowerMessage,
    setHubEditorMode,
    setHubMessage,
    setHotspotEditorMode,
    setHotspotMessage,
    setWalkEditorMode,
    setWalkMessage,
    setLayoutEditorMode,
    setLayoutMessage,
    setMessage,
    setPropEditorMode,
    setPropMessage,
  ])

  const openEditor = useCallback(
    (id: ValeEditorId) => {
      closeAllEditors()
      switch (id) {
        case 'bearPath':
          setWalkEditorMode(true)
          setWalkMessage('Arraste os pontos verdes no chão — é o trajeto que o Cadu percorre.')
          break
        case 'bearTarget':
          setBearTargetEditorMode(true)
          setBearTargetMessage('Arraste o ponto verde ou use o painel à esquerda.')
          break
        case 'flowers':
          setFlowerEditorMode(true)
          setFlowerMessage('Arraste as plantas na cena ou ajuste no painel.')
          break
        case 'props':
          setPropEditorMode(true)
          setPropMessage('Arraste o poste na cena ou ajuste no painel.')
          break
        case 'camera':
          setCameraEditorMode(true)
          setCameraMessage('Ajuste zoom e enquadramento até “Composição boa”.')
          break
        case 'focus':
          setEditorMode(true)
          setMessage('Arraste os círculos de nitidez na tela.')
          break
        case 'stones':
          setLayoutEditorMode(true)
          setLayoutMessage('Selecione Casa, Caminho ou um hotspot na tela.')
          break
        case 'hub':
          setHubEditorMode(true)
          setHubMessage('Arraste os pontos do hub na casa do urso.')
          break
        case 'hotspots':
          setHotspotEditorMode(true)
          setHotspotMessage('Arraste os círculos verdes sobre os objetos da cena.')
          break
      }
    },
    [
      closeAllEditors,
      setBearTargetEditorMode,
      setBearTargetMessage,
      setCameraEditorMode,
      setCameraMessage,
      setEditorMode,
      setFlowerEditorMode,
      setFlowerMessage,
      setWalkEditorMode,
      setWalkMessage,
      setHubEditorMode,
      setHubMessage,
      setHotspotEditorMode,
      setHotspotMessage,
      setLayoutEditorMode,
      setLayoutMessage,
      setMessage,
      setPropEditorMode,
      setPropMessage,
    ],
  )

  const handleEditorToggle = useCallback(
    (id: ValeEditorId, next: boolean) => {
      if (!next) {
        closeAllEditors()
        return
      }
      openEditor(id)
    },
    [closeAllEditors, openEditor],
  )

  const editorControls = useMemo(
    () =>
      [
        {
          id: 'bearPath' as const,
          label: 'Trajeto do urso',
          emoji: '🐾',
          hint: 'Caminho que o Cadu percorre até a casa',
          active: walkEditorMode,
        },
        {
          id: 'bearTarget' as const,
          label: 'Destino do urso',
          emoji: '🐻',
          hint: 'Onde o Cadu para em cada local',
          active: bearTargetEditorMode,
        },
        {
          id: 'flowers' as const,
          label: 'Plantas',
          emoji: '🌿',
          hint: 'Flores e arbustos no cenário 3D',
          active: flowerEditorMode,
        },
        {
          id: 'props' as const,
          label: 'Poste',
          emoji: '🪧',
          hint: 'Props 2D sobre a cena',
          active: propEditorMode,
        },
        {
          id: 'camera' as const,
          label: 'Câmera',
          emoji: '📷',
          hint: 'Zoom e posição da cena',
          active: cameraEditorMode,
        },
        {
          id: 'focus' as const,
          label: 'Nitidez',
          emoji: '🔍',
          hint: 'Áreas nítidas na tela',
          active: editorMode,
        },
        {
          id: 'stones' as const,
          label: 'Caminho de pedras',
          emoji: '🪨',
          hint: 'Layout do caminho e hotspots',
          active: layoutEditorMode,
        },
        {
          id: 'hub' as const,
          label: 'Pontos do hub',
          emoji: '📍',
          hint: 'Ícones dentro da casa do urso',
          active: hubEditorMode,
        },
        ...(VALE_HOTSPOT_EDITOR_ENABLED
          ? [
              {
                id: 'hotspots' as const,
                label: 'Hotspots & paths',
                emoji: '🎯',
                hint: 'Área clicável na tela — não move o urso',
                active: hotspotEditorMode,
              },
            ]
          : []),
      ].filter((item) => !(VALE_BEAR_TARGET_EDITOR_ENABLED && item.id === 'bearTarget')),
    [
      bearTargetEditorMode,
      cameraEditorMode,
      editorMode,
      flowerEditorMode,
      hubEditorMode,
      hotspotEditorMode,
      layoutEditorMode,
      propEditorMode,
      walkEditorMode,
    ],
  )

  const pageClass = [
    'vale-page',
    VALE_USE_REFERENCE_BG ? 'vale-page--reference' : '',
    VALE_HERO_MODE ? 'vale-page--hero' : '',
    VALE_STATIC_SCENE ? 'vale-page--static' : '',
    editorMode ? 'vale-page--focus-editor' : '',
    flowerEditorMode ? 'vale-page--flower-editor' : '',
    propEditorMode ? 'vale-page--prop-editor' : '',
    cameraEditorMode ? 'vale-page--camera-editor' : '',
    layoutEditorMode ? 'vale-page--stone-editor' : '',
    walkEditorMode ? 'vale-page--walk-editor' : '',
    bearTargetEditorMode ? 'vale-page--bear-target-editor' : '',
    hotspotEditorMode ? 'vale-page--hotspot-editor' : '',
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
          transform: `scale(${cameraLayout.sceneScale})`,
          transformOrigin: `${cameraLayout.sceneOriginX}% ${cameraLayout.sceneOriginY}%`,
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
        {VALE_HERO_MODE && !VALE_STATIC_SCENE && <ValeSceneProps />}
        {VALE_HERO_MODE && !VALE_STATIC_SCENE && (
          <ValeProgressPath
            heroMode
            editorMode={layoutEditorMode}
            setEditorMode={setLayoutEditorMode}
            message={layoutMessage}
            setMessage={setLayoutMessage}
          />
        )}
        {VALE_STATIC_SCENE && <ValeStaticIsland />}
        {VALE_HERO_MODE && VALE_USE_REFERENCE_BG && !VALE_STATIC_SCENE && (
          <div className="vale-ground-fog" aria-hidden />
        )}
        {!VALE_STATIC_SCENE && <ValeWorldScene />}
        {VALE_HERO_MODE && !VALE_STATIC_SCENE && VALE_BEAR_TARGET_EDITOR_ENABLED && <ValeVisualTargetDebug />}
        {VALE_HERO_MODE && !VALE_STATIC_SCENE && VALE_BEAR_TARGET_EDITOR_ENABLED && <ValeVisualTargetEditor />}
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
            <ValeCameraEditorPanel
              editorMode={cameraEditorMode}
              message={cameraMessage}
              onClose={() => {
                setCameraEditorMode(false)
                setCameraMessage(null)
              }}
            />
            <ValeWalkPathEditorPanel
              message={walkMessage}
              onClose={() => {
                setWalkEditorMode(false)
                setWalkMessage(null)
              }}
            />
            {VALE_BEAR_TARGET_EDITOR_ENABLED && (
              <ValeBearTargetEditorPanel
                message={bearTargetMessage}
                onClose={() => {
                  setBearTargetEditorMode(false)
                  setBearTargetMessage(null)
                }}
              />
            )}
            {VALE_GAMEPLAY_ENABLED && <ValeNarrativeIntro />}
            {VALE_GAMEPLAY_ENABLED && <ValeHotspotLayer />}
            {VALE_HOTSPOT_EDITOR_ENABLED && <ValeHotspotPathScreenOverlay />}
            {VALE_HOTSPOT_EDITOR_ENABLED && (
              <ValeHotspotEditorPanel
                message={hotspotMessage}
                onClose={() => {
                  setHotspotEditorMode(false)
                  setHotspotMessage(null)
                }}
              />
            )}
            <ValeHotspotCard />
            <ValeHotspotSheet />
            <HubPointEditorTools
              editorMode={hubEditorMode}
              message={hubMessage}
              onClose={() => {
                setHubEditorMode(false)
                setHubMessage(null)
              }}
            />
            <ValeEditorControlPanel
              editors={editorControls}
              onToggle={handleEditorToggle}
              onCloseAll={closeAllEditors}
            />
          </>
        )}
        {!VALE_HERO_MODE && <ValeUIOverlay />}
      </div>
      {!VALE_HERO_MODE && <div className="vale-page__vignette" aria-hidden />}
    </div>
  )
}
