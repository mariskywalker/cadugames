/** Constantes de gameplay — não alteram rig, GLB ou raycast */

/** Editor visual de hitArea 2D — só posição de clique na tela */
export const VALE_HOTSPOT_EDITOR_ENABLED = true

/** Pausa após idle antes de abrir card/hub/sheet */
export const VALE_HOTSPOT_ARRIVE_DELAY_MS = 480

/** Velocidade nos caminhos fixos entre hotspots */
export const VALE_HOTSPOT_MOVE_SPEED = 1.02

/** Velocidade da abertura narrativa — mais lenta para acompanhar a animação de caminhada */
export const VALE_NARRATIVE_MOVE_SPEED = 0.46

/** Distância para considerar que o urso chegou ao destino */
export const VALE_HOTSPOT_ARRIVE_THRESHOLD = 0.36

/** Passo do editor de arriveTarget — posição X/Z no mundo */
export const VALE_HOTSPOT_PATH_STEP = 0.08

/** Passo do editor de arriveTarget — rotação Y (radianos) */
export const VALE_HOTSPOT_ROT_STEP = Math.PI / 20
