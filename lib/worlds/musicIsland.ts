/** Ilha dos Sons — mundo Spline independente (musicoterapia) */

export type MusicWorldAssetType = 'spline'

export type MusicWorldStatus = 'locked' | 'available' | 'active'

export interface MusicHotspot {
  id: string
  label: string
  activity: 'ritmo' | 'escuta' | 'expressao'
  icon: string
  x: number
  y: number
}

export const MUSIC_ISLAND_WORLD = {
  id: 'ilha-dos-sons',
  title: 'Ilha dos Sons',
  domain: 'Musicoterapia',
  route: '/child/life/ilha-dos-sons',
  status: 'available' as MusicWorldStatus,
  assetType: 'spline' as MusicWorldAssetType,
  /** Share link Spline — cena embutida (iframe) */
  sceneEmbedUrl:
    'https://my.spline.design/floatingmusicisland-IZycUWo0zM9naOmZ9jfIgzws/',
  /** Export React/Code no editor → prod.spline.design/.../scene.splinecode */
  sceneProdUrl: null as string | null,
  /** Fallback local opcional */
  scenePath: '/worlds/music/floating_music_island.spline',
  /** No editor Spline: Export → Play Settings → BG Color OFF (transparente) */
  transparentBackground: true,
  /** Ajuste de escala da ilha: afastar câmera no editor Spline (Opção 1) */
  splineCameraHint:
    'No editor Spline: selecione a câmera e afaste (Z) para a ilha respirar na tela.',
  tagline: 'Ritmo, escuta e expressão',
  subtitle: 'Um mundo para explorar ritmo, escuta e expressão',
  missionTitle: 'Missão de hoje',
  missionText: 'Ouça, escolha e repita o som com o Cadu.',
  emoji: '🎵',
  color: '#B48CFF',
} as const

export type MusicIslandSceneMode = 'embed' | 'runtime' | 'local'

export function getMusicIslandSceneMode(): MusicIslandSceneMode {
  if (MUSIC_ISLAND_WORLD.sceneProdUrl) return 'runtime'
  if (MUSIC_ISLAND_WORLD.sceneEmbedUrl) return 'embed'
  return 'local'
}

/** Hotspots visuais — overlays HTML sobre a cena */
export const musicHotspots: MusicHotspot[] = [
  { id: 'disco', label: 'Escutar Sons', icon: '🎵', activity: 'escuta', x: 38, y: 46 },
  { id: 'violao', label: 'Ritmo', icon: '🎸', activity: 'ritmo', x: 62, y: 54 },
  { id: 'arco-iris', label: 'Emoções', icon: '🌈', activity: 'expressao', x: 50, y: 30 },
]
