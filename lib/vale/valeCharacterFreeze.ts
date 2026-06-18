/**
 * Superfícies congeladas — personagem estável (jun/2026).
 * Não alterar sem revisão explícita de rig/GLB.
 */
export const VALE_CHARACTER_FROZEN = true

/** Arquivos protegidos — gameplay deve construir em cima, não dentro deles */
export const VALE_FROZEN_CHARACTER_FILES = [
  'components/vale/ValeCharacter.tsx',
  'lib/vale/valeWorld.ts',
  'lib/opening/celShade.ts',
  'lib/opening/animations.ts',
  'hooks/opening/useCharacterAnimations.ts',
] as const

/** Overlay 2.5D experimental — desligado; urso no canvas 3D */
export const VALE_BEAR_USE_OVERLAY = false

/** Editor visual de destino 2.5D — desligado enquanto personagem 3D está congelado */
export const VALE_BEAR_TARGET_EDITOR_ENABLED = false
