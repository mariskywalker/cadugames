'use client'

import Spline from '@splinetool/react-spline'
import { useEffect, useState } from 'react'
import { MUSIC_ISLAND_WORLD } from '@/lib/worlds/musicIsland'
import { MusicIslandFallback } from './MusicIslandFallback'

async function validateLocalSplineAsset(path: string): Promise<string | null> {
  try {
    const res = await fetch(path, { method: 'GET' })
    if (!res.ok) {
      return `Arquivo não encontrado (HTTP ${res.status}). Coloque floating_music_island.spline em public/worlds/music/.`
    }
    const snippet = await res.text()
    if (snippet.trimStart().startsWith('<?xml') || snippet.includes('<Error>')) {
      return 'Arquivo inválido ou link expirado — reenvie floating_music_island.spline.'
    }
    if (snippet.length < 1024) {
      return 'Arquivo .spline incompleto ou corrompido.'
    }
    return null
  } catch (err) {
    return err instanceof Error ? err.message : 'Falha ao verificar o arquivo Spline.'
  }
}

export function MusicIslandSplineView({ mode }: { mode: 'runtime' | 'local' }) {
  const [loadError, setLoadError] = useState<string | null>(null)
  const [assetReady, setAssetReady] = useState(mode === 'runtime')

  useEffect(() => {
    if (mode !== 'local') return

    let cancelled = false
    validateLocalSplineAsset(MUSIC_ISLAND_WORLD.scenePath).then((error) => {
      if (cancelled) return
      if (error) setLoadError(error)
      else setAssetReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [mode])

  if (loadError) {
    return <MusicIslandFallback error={loadError} />
  }

  if (!assetReady) {
    return (
      <div className="music-island-scene__loading" aria-busy="true">
        <div className="music-island-scene__spinner" aria-hidden />
        <p>Preparando a Ilha dos Sons…</p>
      </div>
    )
  }

  const runtimeScene =
    mode === 'runtime'
      ? MUSIC_ISLAND_WORLD.sceneProdUrl!
      : MUSIC_ISLAND_WORLD.scenePath

  return (
    <div className="music-island-scene">
      <Spline scene={runtimeScene} />
    </div>
  )
}
