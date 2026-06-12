export const CLOUD_ASSETS = {
  soft: '/home/clouds/nuvem1.svg',
  puff: '/home/clouds/c2.svg',
  hero: '/home/clouds/C3.svg',
  bluePng: [
    '/home/clouds/cloud-blue-1.png',
    '/home/clouds/cloud-blue-2.png',
    '/home/clouds/cloud-blue-3.png',
  ],
  softBlur: '/home/clouds/cloud-soft-1.png',
} as const

export type CloudInstance = {
  id: string
  asset: keyof typeof CLOUD_ASSETS | 'bluePng'
  assetIndex?: number
  left: number
  top: number
  width: number
  depth: number
  opacity: number
  drift: number
  float: number
  delay: number
  reverse?: boolean
}

export const SKY_CLOUD_INSTANCES: CloudInstance[] = [
  { id: 'mid-l1', asset: 'softBlur', left: -6, top: 0, width: 38, depth: 0.2, opacity: 0.42, drift: 240, float: 34, delay: 0 },
  { id: 'mid-r1', asset: 'soft', left: 78, top: 2, width: 36, depth: 0.2, opacity: 0.45, drift: 235, float: 31, delay: -6, reverse: true },
  { id: 'mid-l2', asset: 'puff', left: 0, top: 8, width: 30, depth: 0.24, opacity: 0.48, drift: 228, float: 28, delay: -8 },
  { id: 'mid-r2', asset: 'bluePng', assetIndex: 1, left: 84, top: 10, width: 26, depth: 0.22, opacity: 0.4, drift: 252, float: 29, delay: 4 },
  { id: 'el1', asset: 'puff', left: -4, top: 22, width: 30, depth: 0.42, opacity: 0.52, drift: 178, float: 17, delay: 0 },
  { id: 'el2', asset: 'soft', left: 2, top: 40, width: 34, depth: 0.38, opacity: 0.5, drift: 162, float: 15, delay: -6 },
  { id: 'er1', asset: 'bluePng', assetIndex: 2, left: 80, top: 20, width: 28, depth: 0.4, opacity: 0.48, drift: 170, float: 14, delay: 3, reverse: true },
  { id: 'er2', asset: 'puff', left: 86, top: 38, width: 32, depth: 0.44, opacity: 0.55, drift: 154, float: 12, delay: -4 },
  { id: 'bl1', asset: 'hero', left: -8, top: 62, width: 42, depth: 0.55, opacity: 0.5, drift: 142, float: 11, delay: 0 },
  { id: 'br1', asset: 'soft', left: 74, top: 64, width: 44, depth: 0.58, opacity: 0.55, drift: 120, float: 9, delay: 0, reverse: true },
]
