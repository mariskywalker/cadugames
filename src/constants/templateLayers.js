import { FIGMA_TEMPLATE_LAYOUT } from './figmaTemplate'

/** Artboard Figma — 6276×4184. Composição espacial fixa; só melhorias visuais em cima. */
export const TEMPLATE_SIZE = {
  width: FIGMA_TEMPLATE_LAYOUT.width,
  height: FIGMA_TEMPLATE_LAYOUT.height,
}

export const TEMPLATE_SRC = FIGMA_TEMPLATE_LAYOUT.path

/** Camadas exportadas do Figma (montagem incremental). */
export const LAYER_BACKGROUND = '/ui/layers/background.png'
export const LAYER_CADU = '/ui/layers/cadu.svg'
/** Nav Figma (referência visual) — UI real: CADUTopBar em LandingScreen / HUD. */
export const LAYER_NAV = '/ui/layers/nav.svg'

/** CADU — centro do palco (referência composição template.svg). */
export const LAYER_CADU_LAYOUT = {
  anchorXPercent: 50,
  bottomPercent: 8,
  heightVh: 108,
  maxHeightPx: 920,
  maxWidthPx: 640,
  parallaxDepth: 0.14,
}

/** Composite completo — desligado enquanto as camadas chegam separadas. */
export const SHOW_TEMPLATE_COMPOSITE = false

/** Coluna de bolhas — rect pattern4 (2202.63, 761.656, 1819.12×2944.53). */
export const BUBBLE_COLUMN_BOX = {
  left: 35.1,
  top: 18.2,
  width: 29,
  height: 70.4,
}

/** Faixa de céu para partículas (sem cobrir UI). */
export const SKY_PARTICLE_BOX = {
  left: 0,
  top: 0,
  width: 100,
  height: 46,
}

export const TEMPLATE_GLASS_REGIONS = [
  { id: 'topbar', left: 0, top: 0, width: 100, height: 11.8 },
  { id: 'leftRail', left: 0, top: 13.5, width: 12.5, height: 44 },
  { id: 'rightPanel', left: 71.5, top: 15.5, width: 28, height: 58 },
  { id: 'dock', left: 23.5, top: 82.2, width: 53, height: 15.5 },
  { id: 'moodCard', left: 3.5, top: 74, width: 22, height: 14 },
]

export const TEMPLATE_ENTER_HOTSPOT = {
  left: 73,
  top: 70.5,
  width: 24,
  height: 13,
}
