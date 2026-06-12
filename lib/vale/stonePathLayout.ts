/**
 * Hit areas salvas — cliques em cada pedra do PNG caminho-de-pedras.png.
 * Coordenadas relativas à imagem (%): u = esquerda, v = topo, size = largura do hit.
 */

export const STONE_PATH_HIT_DEFAULTS: Record<
  string,
  { hitU: number; hitV: number; hitSize: number }
> = {
  'stone-1': { hitU: 6, hitV: 80, hitSize: 13 },
  'stone-2': { hitU: 24, hitV: 62, hitSize: 13 },
  'stone-3': { hitU: 42, hitV: 44, hitSize: 12 },
  'stone-4': { hitU: 58, hitV: 28, hitSize: 12 },
  'stone-5': { hitU: 74, hitV: 14, hitSize: 11 },
  'stone-6': { hitU: 88, hitV: 4, hitSize: 10 },
}
