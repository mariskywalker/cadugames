/** Assets da home / menu principal — servidos de /public/home/ */
export const HOME_ASSETS = {
  logo: '/home/cadu-logo.svg',
  background: '/home/layers/background.png',
  cadu: '/home/layers/cadu.svg',
  palco: '/home/layers/palco.png',
  lucasProfile: '/home/lucas-profile.png',
} as const

/** Posicionamento e parallax — tamanhos visuais ficam em home.css */
export const CADU_LAYOUT = {
  anchorXPercent: 50,
  bottomPercent: 13,
  parallaxDepth: 0.14,
} as const
