import * as THREE from 'three'

/**
 * Composição do mundo 3D do Vale das Palavras.
 * O GLB tem bbox nativo ~0,20 × 0,12 × 0,20 — escalamos em runtime.
 */

/** Plano de fundo da referência (pôr do sol + montanhas) — preservar intacto */
export const VALE_REFERENCE_BG = '/vale/reference-sunset.png'
export const VALE_USE_REFERENCE_BG = true

/** Modo composição imersiva — sem personagem nem UI */
export const VALE_HERO_MODE = true

/** Escala imersiva — zoom leve na composição */
export const ISLAND_TARGET_SIZE = 11

/**
 * Câmera imersiva 3/4 — mais próxima, FOV menor, horizonte preservado.
 * LookAt deslocado à direita para acompanhar a casa.
 */
export const VALE_CAMERA = {
  position: [0.25, 1.38, 8.5] as [number, number, number],
  target: [0.48, 1.08, -5.2] as [number, number, number],
  fov: 50,
}

/** Rotação 3D da ilha — ajustada no editor G (rad) */
export const VALE_ISLAND_ROTATION_X = 0
export const VALE_ISLAND_ROTATION_Y = -0.4189
export const VALE_ISLAND_ROTATION_Z = 0

/**
 * Deslocamento da Casa do Urso — ajustado no editor G.
 */
export const VALE_ISLAND_OFFSET: [number, number, number] = [1, -0.55, -10.8]

/** Escala visual do Cadu */
export const VALE_CHARACTER_SCALE = 0.9

/** Altura do chão no início do caminho de pedras (hero) */
export const VALE_PATH_GROUND_Y = -0.18

/** Altura do chão na porta da Casa do Urso — último degrau do GLB */
export const VALE_HOUSE_GROUND_Y = 0.22

/** Folga extra nos últimos degraus antes da porta */
export const VALE_LAST_STEP_LIFT = 0.14

/** Ajuste fino dos pés sobre o chão visual */
export const VALE_CHARACTER_FOOT_OFFSET = 0.24

/** Compensa raycast no terreno 3D — evita o urso afundar */
export const VALE_CHARACTER_Y_LIFT = 0.18

/** Acima disso o raycast ignora (telhado, copa, paredes) */
export const VALE_GROUND_RAY_MAX_Y = VALE_PATH_GROUND_Y + 0.42

/** Limite mais alto no hero — degraus da casa no GLB */
export const VALE_HERO_GROUND_RAY_MAX_Y =
  VALE_HOUSE_GROUND_Y + VALE_LAST_STEP_LIFT + 0.22

/** Porta da Casa do Urso — frente da ilha voltada para o caminho */
export const VALE_HOUSE_ENTRY: [number, number] = [
  VALE_ISLAND_OFFSET[0] + 0.05,
  VALE_ISLAND_OFFSET[2] + 4.2,
]

export const VALE_NAV = {
  center: [1.0, -3.4] as [number, number],
  radius: VALE_HERO_MODE ? 9.2 : 5.5,
}

/** Spawn no início do caminho — primeiro plano, jornada até a casa */
export const VALE_SPAWN: [number, number, number] = [0.15, 0, 5.6]
export const VALE_SPAWN_ROTATION: [number, number, number] = [0, Math.PI + 0.1, 0]

/** Urso riggado no modo hero — caminho em direção à Casa do Urso */
export const VALE_BEAR_HERO = {
  position: [0.55, VALE_PATH_GROUND_Y, 0.35] as [number, number, number],
  rotation: [0, 2.75, 0] as [number, number, number],
  scale: VALE_CHARACTER_SCALE,
}

export const VALE_FOG = {
  color: '#d4b8a4',
  near: 38,
  far: 62,
}

export interface ValeLandmark {
  id: string
  name: string
  emoji: string
  position: [number, number]
  proximity: number
}

export const VALE_LANDMARKS: ValeLandmark[] = [
  { id: 'casa-urso', name: 'Casa do Urso', emoji: '🏡', position: VALE_HOUSE_ENTRY, proximity: 1.75 },
  { id: 'arvore-palavras', name: 'Árvore das Palavras', emoji: '🌳', position: [-1.35, -0.55], proximity: 1.25 },
  { id: 'caminho-silabas', name: 'Caminho das Sílabas', emoji: '🪨', position: [0.45, -1.55], proximity: 1.1 },
  { id: 'portal-comunicacao', name: 'Portal da Comunicação', emoji: '✨', position: [1.05, -2.35], proximity: 1.3 },
]

/** Interpola altura do caminho 2D → degraus da casa conforme o urso avança */
export function getValeHeroGroundY(_x: number, z: number) {
  const pathStartZ = VALE_BEAR_HERO.position[2]
  const houseZ = VALE_HOUSE_ENTRY[1]
  if (z >= pathStartZ) return VALE_PATH_GROUND_Y
  const span = pathStartZ - houseZ
  if (span <= 0.01) return VALE_HOUSE_GROUND_Y + VALE_LAST_STEP_LIFT

  const raw = Math.min(1, Math.max(0, (pathStartZ - z) / span))
  const t = raw * raw * (3 - 2 * raw)

  let y = VALE_PATH_GROUND_Y + (VALE_HOUSE_GROUND_Y - VALE_PATH_GROUND_Y) * t
  if (raw > 0.68) {
    const last = (raw - 0.68) / 0.32
    y += VALE_LAST_STEP_LIFT * last
  }
  return y
}

export function clampToValeNav(x: number, z: number): [number, number] {
  const [cx, cz] = VALE_NAV.center
  const dx = x - cx
  const dz = z - cz
  const dist = Math.hypot(dx, dz)
  if (dist <= VALE_NAV.radius || dist < 1e-5) return [x, z]
  const k = VALE_NAV.radius / dist
  return [cx + dx * k, cz + dz * k]
}

export function isInsideValeNav(x: number, z: number) {
  const [cx, cz] = VALE_NAV.center
  const dx = x - cx
  const dz = z - cz
  return dx * dx + dz * dz <= (VALE_NAV.radius * 1.04) ** 2
}

export const valeTerrain: { object: THREE.Object3D | null } = { object: null }
export const valeCharacterWorldPos = new THREE.Vector3(...VALE_SPAWN)
