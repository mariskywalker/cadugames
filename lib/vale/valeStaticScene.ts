/** Cenário estático 2.5D — desligado; Vale usa canvas 3D + ValeCharacter */
export const VALE_STATIC_SCENE = false

/** Ilha + casa — SVG exportado (raster embutido em pattern) */
export const VALE_STATIC_ISLAND_SRC = '/vale/vale-palavras.svg'

/** Enquadramento da ilha na tela (%) */
export const VALE_STATIC_ISLAND_LAYOUT = {
  left: '50%',
  top: '54%',
  width: 'min(88vw, 680px)',
  translateX: '-50%',
  translateY: '-50%',
} as const
