/**
 * Hit areas salvas — cliques em cada pedra do PNG caminho-de-pedras.png.
 * Coordenadas relativas à imagem (%): u = esquerda, v = topo, size = largura do hit.
 */

export const STONE_PATH_HIT_DEFAULTS: Record<
  string,
  { u: number; v: number; size: number }
> = {
  'stone-1': { u: 6, v: 80, size: 13 },
  'stone-2': { u: 24, v: 62, size: 13 },
  'stone-3': { u: 42, v: 44, size: 12 },
  'stone-4': { u: 58, v: 28, size: 12 },
  'stone-5': { u: 74, v: 14, size: 11 },
  'stone-6': { u: 88, v: 4, size: 10 },
}
