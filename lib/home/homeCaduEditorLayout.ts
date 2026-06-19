import { CADU_LAYOUT } from './assets'

export interface HomeCaduLayout {
  anchorXPercent: number
  bottomPercent: number
  bottomPercentWide: number
  offsetX: number
  offsetY: number
  caduHeightMin: number
  caduHeightVh: number
  caduHeightMax: number
  palcoWidthMin: number
  palcoWidthVw: number
  palcoWidthMax: number
  caduExtraLiftCm: number
  caduFeetLiftRatio: number
  caduFeetLiftRatioWide: number
  palcoSurfaceRatio: number
  palcoSurfaceRatioWide: number
  scale: number
  rotateDeg: number
  opacity: number
  shadowBlur: number
  shadowY: number
  shadowAlpha: number
  floatEnabled: boolean
}

export const DEFAULT_HOME_CADU_LAYOUT: HomeCaduLayout = {
  anchorXPercent: CADU_LAYOUT.anchorXPercent,
  bottomPercent: CADU_LAYOUT.bottomPercent,
  bottomPercentWide: 16,
  offsetX: 0,
  offsetY: 0,
  caduHeightMin: 460,
  caduHeightVh: 56,
  caduHeightMax: 670,
  palcoWidthMin: 920,
  palcoWidthVw: 62,
  palcoWidthMax: 1100,
  caduExtraLiftCm: 3,
  caduFeetLiftRatio: -0.038,
  caduFeetLiftRatioWide: -0.034,
  palcoSurfaceRatio: 258 / 1024,
  palcoSurfaceRatioWide: 246 / 1024,
  scale: 1,
  rotateDeg: 0,
  opacity: 1,
  shadowBlur: 22,
  shadowY: 10,
  shadowAlpha: 0.16,
  floatEnabled: true,
}

export type HomeCaduLayoutOverride = Partial<HomeCaduLayout>

export function mergeHomeCaduLayout(override: HomeCaduLayoutOverride = {}): HomeCaduLayout {
  return { ...DEFAULT_HOME_CADU_LAYOUT, ...override }
}

export function formatHomeCaduExport(layout: HomeCaduLayout): string {
  return `// Cole em lib/home/homeCaduEditorLayout.ts (DEFAULT_HOME_CADU_LAYOUT)
export const DEFAULT_HOME_CADU_LAYOUT = {
  anchorXPercent: ${layout.anchorXPercent},
  bottomPercent: ${layout.bottomPercent},
  bottomPercentWide: ${layout.bottomPercentWide},
  offsetX: ${layout.offsetX},
  offsetY: ${layout.offsetY},
  caduHeightMin: ${layout.caduHeightMin},
  caduHeightVh: ${layout.caduHeightVh},
  caduHeightMax: ${layout.caduHeightMax},
  palcoWidthMin: ${layout.palcoWidthMin},
  palcoWidthVw: ${layout.palcoWidthVw},
  palcoWidthMax: ${layout.palcoWidthMax},
  caduExtraLiftCm: ${layout.caduExtraLiftCm},
  caduFeetLiftRatio: ${layout.caduFeetLiftRatio},
  caduFeetLiftRatioWide: ${layout.caduFeetLiftRatioWide},
  palcoSurfaceRatio: ${layout.palcoSurfaceRatio},
  palcoSurfaceRatioWide: ${layout.palcoSurfaceRatioWide},
  scale: ${layout.scale},
  rotateDeg: ${layout.rotateDeg},
  opacity: ${layout.opacity},
  shadowBlur: ${layout.shadowBlur},
  shadowY: ${layout.shadowY},
  shadowAlpha: ${layout.shadowAlpha},
  floatEnabled: ${layout.floatEnabled},
}`
}

export function buildHomeCaduStackStyle(
  layout: HomeCaduLayout,
  wide: boolean,
): Record<string, string> {
  const feetRatio = wide ? layout.caduFeetLiftRatioWide : layout.caduFeetLiftRatio
  const surfaceRatio = wide ? layout.palcoSurfaceRatioWide : layout.palcoSurfaceRatio
  return {
    '--cadu-height': `clamp(${layout.caduHeightMin}px, ${layout.caduHeightVh}vh, ${layout.caduHeightMax}px)`,
    '--palco-width': `clamp(${layout.palcoWidthMin}px, ${layout.palcoWidthVw}vw, ${layout.palcoWidthMax}px)`,
    '--cadu-extra-lift': `${layout.caduExtraLiftCm}cm`,
    '--palco-surface-offset': `calc(var(--palco-width) * ${surfaceRatio})`,
    '--cadu-feet-lift': `calc(var(--palco-width) * ${feetRatio} - var(--cadu-extra-lift))`,
  }
}
