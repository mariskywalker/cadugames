/** Posições dos marcos sobre a cena 3D do Vale (% do container) */
export const valeMarcoPositions = [
  { x: 58, y: 78 },
  { x: 36, y: 52 },
  { x: 62, y: 26 },
] as const

/**
 * Casa do Urso / Vale das Palavras — GLB do ambiente 3D.
 * Renderizado por ValeEnvironment; o marco `casa-urso` ancora interação no centro.
 * ATENÇÃO: reexportar versão otimizada antes de produção (ver análise de performance).
 */
export const CASA_URSO_GLB_SRC = '/models/vale-palavras-lite.glb'
export const VALE_GLB_SRC = CASA_URSO_GLB_SRC
