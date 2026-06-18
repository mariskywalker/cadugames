/**
 * Flags de gameplay e re-exports do congelamento do personagem.
 */
export {
  VALE_BEAR_TARGET_EDITOR_ENABLED,
  VALE_CHARACTER_FROZEN,
} from './valeCharacterFreeze'

/** @deprecated alias — editor de destino desligado */
export { VALE_BEAR_TARGET_EDITOR_ENABLED as VALE_BEAR_SAFE_MODE } from './valeCharacterFreeze'

/** Gameplay ativo — hotspots, paths fixos, interações, walk/idle */
export const VALE_GAMEPLAY_ENABLED = true

export { VALE_HOTSPOT_EDITOR_ENABLED } from './valeGameplay'
export { VALE_STATIC_SCENE } from './valeStaticScene'

import { VALE_BEAR_USE_OVERLAY as _OVERLAY_FLAG } from './valeCharacterFreeze'
import { VALE_STATIC_SCENE } from './valeStaticScene'

/** Overlay 2.5D — só se explicitamente ligado em valeCharacterFreeze (nunca via static) */
export const VALE_BEAR_USE_OVERLAY = _OVERLAY_FLAG
