/**
 * Nuvens do meio da tela pra baixo — cantos e bordas, centro livre (CADU).
 * `top` / `left` em % da faixa inferior (.cadu-sky-clouds, top: 50%).
 */
export const CLOUD_ASSETS = {
  soft: '/ui/clouds/nuvem1.svg',
  puff: '/ui/clouds/c2.svg',
  hero: '/ui/clouds/C3.svg',
  bluePng: [
    '/ui/clouds/cloud-blue-1.png',
    '/ui/clouds/cloud-blue-2.png',
    '/ui/clouds/cloud-blue-3.png',
  ],
  softBlur: '/ui/clouds/cloud-soft-1.png',
}

export const SKY_CLOUD_INSTANCES = [
  /* Linha do meio — só nas laterais */
  { id: 'mid-l1', asset: 'softBlur', left: -6, top: 0, width: 38, depth: 0.2, opacity: 0.42, drift: 240, float: 34, delay: 0 },
  { id: 'mid-r1', asset: 'soft', left: 78, top: 2, width: 36, depth: 0.2, opacity: 0.45, drift: 235, float: 31, delay: -6, reverse: true },
  { id: 'mid-l2', asset: 'puff', left: 0, top: 8, width: 30, depth: 0.24, opacity: 0.48, drift: 228, float: 28, delay: -8 },
  { id: 'mid-r2', asset: 'bluePng', assetIndex: 1, left: 84, top: 10, width: 26, depth: 0.22, opacity: 0.4, drift: 252, float: 29, delay: 4 },
  /* Borda esquerda */
  { id: 'el1', asset: 'puff', left: -4, top: 22, width: 30, depth: 0.42, opacity: 0.52, drift: 178, float: 17, delay: 0 },
  { id: 'el2', asset: 'soft', left: 2, top: 40, width: 34, depth: 0.38, opacity: 0.5, drift: 162, float: 15, delay: -6 },
  { id: 'el3', asset: 'bluePng', assetIndex: 0, left: 6, top: 58, width: 28, depth: 0.44, opacity: 0.48, drift: 154, float: 14, delay: 5 },
  /* Borda direita */
  { id: 'er1', asset: 'bluePng', assetIndex: 2, left: 80, top: 20, width: 28, depth: 0.4, opacity: 0.48, drift: 170, float: 14, delay: 3, reverse: true },
  { id: 'er2', asset: 'puff', left: 86, top: 38, width: 32, depth: 0.44, opacity: 0.55, drift: 154, float: 12, delay: -4 },
  { id: 'er3', asset: 'hero', left: 82, top: 56, width: 34, depth: 0.48, opacity: 0.46, drift: 142, float: 11.5, delay: 2 },
  /* Canto inferior esquerdo */
  { id: 'bl1', asset: 'hero', left: -8, top: 62, width: 42, depth: 0.55, opacity: 0.5, drift: 142, float: 11, delay: 0 },
  { id: 'bl2', asset: 'softBlur', left: 0, top: 74, width: 36, depth: 0.48, opacity: 0.45, drift: 148, float: 10, delay: -7 },
  { id: 'bl3', asset: 'bluePng', assetIndex: 0, left: 4, top: 86, width: 30, depth: 0.5, opacity: 0.52, drift: 128, float: 9, delay: 5 },
  /* Canto inferior direito */
  { id: 'br1', asset: 'soft', left: 74, top: 64, width: 44, depth: 0.58, opacity: 0.55, drift: 120, float: 9, delay: 0, reverse: true },
  { id: 'br2', asset: 'hero', left: 82, top: 76, width: 38, depth: 0.62, opacity: 0.5, drift: 112, float: 8.5, delay: -3 },
  { id: 'br3', asset: 'puff', left: 88, top: 88, width: 32, depth: 0.68, opacity: 0.6, drift: 104, float: 7.5, delay: 2 },
]
