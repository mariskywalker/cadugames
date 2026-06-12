/** Gera SVG de pedra do caminho — fundo transparente, estilo Disney/Pixar cozy */

export interface StoneSvgParams {
  width: number
  height: number
  stoneRx: number
  stoneRy: number
  stoneCy: number
  sideH: number
  crack?: boolean
  glow?: boolean
}

export function buildPathStoneSvg({
  width,
  height,
  stoneRx,
  stoneRy,
  stoneCy,
  sideH,
  crack = true,
  glow = false,
}: StoneSvgParams): string {
  const cx = width / 2
  const grassY = stoneCy + stoneRy * 0.55

  const cracks = crack
    ? `
  <path d="M${cx - stoneRx * 0.2} ${stoneCy - stoneRy * 0.1} Q${cx - stoneRx * 0.05} ${stoneCy + stoneRy * 0.05} ${cx + stoneRx * 0.08} ${stoneCy + stoneRy * 0.15}" stroke="#d89088" stroke-width="1.2" fill="none" opacity="0.45" stroke-linecap="round"/>
  <path d="M${cx + stoneRx * 0.15} ${stoneCy - stoneRy * 0.2} Q${cx + stoneRx * 0.28} ${stoneCy} ${cx + stoneRx * 0.12} ${stoneCy + stoneRy * 0.2}" stroke="#d08078" stroke-width="0.9" fill="none" opacity="0.35" stroke-linecap="round"/>`
    : ''

  const glowFilter = glow
    ? `
  <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="3" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`
    : ''

  const glowAttr = glow ? ' filter="url(#glow)"' : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="stoneTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffd4c8"/>
      <stop offset="45%" stop-color="#f5b0a0"/>
      <stop offset="100%" stop-color="#e89890"/>
    </linearGradient>
    <linearGradient id="stoneSide" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d88880"/>
      <stop offset="100%" stop-color="#b87068"/>
    </linearGradient>
    <radialGradient id="grass" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#7ec85a"/>
      <stop offset="70%" stop-color="#5aad42"/>
      <stop offset="100%" stop-color="#3d8a30"/>
    </radialGradient>
    ${glowFilter}
  </defs>

  <!-- Grama -->
  <ellipse cx="${cx}" cy="${grassY + 4}" rx="${stoneRx * 1.15}" ry="${stoneRy * 0.45}" fill="url(#grass)" opacity="0.95"/>
  <ellipse cx="${cx - stoneRx * 0.5}" cy="${grassY + 2}" rx="${stoneRx * 0.35}" ry="${stoneRy * 0.2}" fill="#6bc04a" opacity="0.7"/>
  <ellipse cx="${cx + stoneRx * 0.45}" cy="${grassY + 3}" rx="${stoneRx * 0.3}" ry="${stoneRy * 0.18}" fill="#72c850" opacity="0.65"/>

  <!-- Flores -->
  <circle cx="${cx - stoneRx * 0.7}" cy="${grassY + 1}" r="2.2" fill="#ffb8c8"/>
  <circle cx="${cx - stoneRx * 0.7}" cy="${grassY + 1}" r="0.8" fill="#ffe880"/>
  <circle cx="${cx + stoneRx * 0.55}" cy="${grassY + 4}" r="1.8" fill="#ffc0d0"/>
  <circle cx="${cx + stoneRx * 0.55}" cy="${grassY + 4}" r="0.7" fill="#ffe880"/>
  <circle cx="${cx - stoneRx * 0.15}" cy="${grassY + 6}" r="1.5" fill="#ffb0c0"/>
  <circle cx="${cx - stoneRx * 0.15}" cy="${grassY + 6}" r="0.6" fill="#ffe880"/>

  <!-- Lateral da pedra (volume) -->
  <ellipse cx="${cx}" cy="${stoneCy + stoneRy * 0.35 + sideH * 0.5}" rx="${stoneRx * 0.92}" ry="${sideH}" fill="url(#stoneSide)" opacity="0.9"/>

  <!-- Corpo principal -->
  <ellipse cx="${cx}" cy="${stoneCy}" rx="${stoneRx}" ry="${stoneRy}" fill="url(#stoneTop)"${glowAttr}/>

  <!-- Highlight lateral quente -->
  <ellipse cx="${cx - stoneRx * 0.25}" cy="${stoneCy - stoneRy * 0.15}" rx="${stoneRx * 0.45}" ry="${stoneRy * 0.35}" fill="#ffe8e0" opacity="0.55"/>
  <ellipse cx="${cx + stoneRx * 0.3}" cy="${stoneCy + stoneRy * 0.1}" rx="${stoneRx * 0.25}" ry="${stoneRy * 0.2}" fill="#c87870" opacity="0.18"/>

  ${cracks}
</svg>`
}

export const STONE_SVG_PRESETS = {
  small: { width: 64, height: 56, stoneRx: 16, stoneRy: 10, stoneCy: 24, sideH: 5 },
  medium: { width: 80, height: 68, stoneRx: 22, stoneRy: 13, stoneCy: 30, sideH: 6 },
  large: { width: 96, height: 80, stoneRx: 28, stoneRy: 16, stoneCy: 36, sideH: 7 },
  oval: { width: 88, height: 64, stoneRx: 30, stoneRy: 12, stoneCy: 28, sideH: 6 },
  circular: { width: 84, height: 76, stoneRx: 24, stoneRy: 22, stoneCy: 32, sideH: 6.5 },
  checkpoint: { width: 108, height: 92, stoneRx: 34, stoneRy: 19, stoneCy: 40, sideH: 8, crack: true, glow: true },
} as const
