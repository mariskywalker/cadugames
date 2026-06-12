export const PATH_LAYER_ID = 'path-layer'
export const PATH_LAYER_COPY_ID = 'path-layer-copy'

export interface PathLayerLayout {
  id: string
  left: string
  bottom: string
  width: string
  /** Ajuste fino horizontal (px) */
  translateXPx?: number
  /** Ajuste fino vertical (px) */
  translateYPx?: number
  /** Profundidade 3D (px) */
  translateZPx?: number
  /** Rotação Z (plano da tela) */
  rotateDeg: number
  /** Inclinação vertical — perspectiva 3D */
  rotateXDeg?: number
  /** Inclinação lateral — perspectiva 3D */
  rotateYDeg?: number
  zIndex: number
  opacity: number
}

/** Layout salvo — caminho de pedras (editor G) */
export const DEFAULT_PATH_LAYER: PathLayerLayout = {
  id: PATH_LAYER_ID,
  left: '7.5%',
  bottom: '0%',
  width: '37.5vw',
  translateXPx: -20,
  translateYPx: -10,
  translateZPx: -273,
  rotateDeg: -9.5,
  rotateXDeg: -10,
  rotateYDeg: -24,
  zIndex: 5,
  opacity: 1,
}

/** Cópia do caminho — mesma imagem, layout independente (editor G → Caminho 2) */
export const DEFAULT_PATH_LAYER_COPY: PathLayerLayout = {
  id: PATH_LAYER_COPY_ID,
  left: '21%',
  bottom: '0%',
  width: '36.5vw',
  rotateDeg: -1,
  zIndex: 5,
  opacity: 1,
}
