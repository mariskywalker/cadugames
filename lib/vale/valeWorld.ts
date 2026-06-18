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

/** Escala visual do Cadu — proporcional à ilha (~11u) e à Casa do Urso */
export const VALE_CHARACTER_SCALE = 0.62

/** Altura do chão no início do caminho de pedras 2D (hero) */
export const VALE_PATH_GROUND_Y = 0.32

/** Elevação do personagem sobre o chão amostrado (hero) */
export const VALE_CHARACTER_Y_LIFT = 0.18

/** Primeiro degrau da ilha 3D — transição do caminho 2D */
export const VALE_ISLAND_PATH_Y = 0.42

/** Altura do chão na porta da Casa do Urso — último degrau do GLB */
export const VALE_HOUSE_GROUND_Y = 0.78

/** Folga extra nos últimos degraus antes da porta */
export const VALE_LAST_STEP_LIFT = 0.34

/** Ajuste fino dos pés (modo não-hero) */
export const VALE_CHARACTER_FOOT_OFFSET = 0.14

/** Folga visual acima da superfície detectada (hero) */
export const VALE_CHARACTER_SURFACE_FUDGE = 0.03

/** Sola abaixo dos ossos ToeBase — calibrado no modelo do urso */
export const VALE_SOLE_BELOW_TOE = 0.22

/** Folga extra no topo dos degraus detectados pelo raycast */
export const VALE_MESH_SURFACE_BIAS = 0.08

/** Faces com normal.y abaixo disso são paredes/laterais — ignorar */
export const VALE_MIN_WALKABLE_NORMAL_Y = 0.15

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

/** Spawn no início do caminho — primeiro plano, jornada até a casa */
export const VALE_SPAWN: [number, number, number] = [0.15, 0, 5.6]
export const VALE_SPAWN_ROTATION: [number, number, number] = [0, Math.PI + 0.1, 0]

/** Urso riggado no modo hero — início do caminho de pedras (walk-spawn) */
export const VALE_BEAR_HERO = {
  position: [-3.15, VALE_PATH_GROUND_Y, 0.52] as [number, number, number],
  rotation: [0, Math.PI + 0.08, 0] as [number, number, number],
  scale: VALE_CHARACTER_SCALE,
}

export const VALE_NAV = {
  center: [1.0, -3.4] as [number, number],
  radius: VALE_HERO_MODE ? 9.2 : 5.5,
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
  const islandBlendZ = pathStartZ - 1.35

  if (z >= pathStartZ) return VALE_PATH_GROUND_Y

  if (z >= islandBlendZ) {
    const t = (pathStartZ - z) / (pathStartZ - islandBlendZ)
    const smooth = t * t * (3 - 2 * t)
    return VALE_PATH_GROUND_Y + (VALE_ISLAND_PATH_Y - VALE_PATH_GROUND_Y) * smooth
  }

  const span = islandBlendZ - houseZ
  if (span <= 0.01) return VALE_HOUSE_GROUND_Y + VALE_LAST_STEP_LIFT

  const raw = Math.min(1, Math.max(0, (islandBlendZ - z) / span))
  const t = raw * raw * (3 - 2 * raw)

  let y = VALE_ISLAND_PATH_Y + (VALE_HOUSE_GROUND_Y - VALE_ISLAND_PATH_Y) * t
  if (raw > 0.68) {
    const last = (raw - 0.68) / 0.32
    y += VALE_LAST_STEP_LIFT * last
  }
  return y
}

function clampToValeCircle(x: number, z: number): [number, number] {
  const [cx, cz] = VALE_NAV.center
  const dx = x - cx
  const dz = z - cz
  const dist = Math.hypot(dx, dz)
  if (dist <= VALE_NAV.radius || dist < 1e-5) return [x, z]
  const k = VALE_NAV.radius / dist
  return [cx + dx * k, cz + dz * k]
}

export function clampToValeNav(x: number, z: number): [number, number] {
  return clampToValeCircle(x, z)
}

export function isInsideValeNav(x: number, z: number) {
  const [cx, cz] = VALE_NAV.center
  const dx = x - cx
  const dz = z - cz
  return dx * dx + dz * dz <= (VALE_NAV.radius * 1.04) ** 2
}

export const valeTerrain: { object: THREE.Object3D | null } = { object: null }

/** ValeEnvironment só expõe a ilha após aplicar escala/posição — evita flash gigante */
export const valeStageReady = { ready: false }

export const valeCharacterWorldPos = new THREE.Vector3(...VALE_SPAWN)
