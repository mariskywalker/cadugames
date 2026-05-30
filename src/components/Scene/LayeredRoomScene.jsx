import { SCENE_LAYER_PARALLAX, SCENE_LAYERS } from '../../constants/sceneLayers'
import { LayerParallax } from './layers/LayerParallax'
import { LayerAmbient } from './layers/LayerAmbient'
import { LayerEnvironment } from './layers/LayerEnvironment'
import { LayerSensoryObjects } from './layers/LayerSensoryObjects'
import { LayerCharacter } from './layers/LayerCharacter'
import { LayerMagic } from './layers/LayerMagic'
import { LayerHotspots } from './layers/LayerHotspots'
import { ForegroundBallPit } from './sensory/ForegroundBallPit'

function MaybeParallax({ depth, fixedCamera, children }) {
  if (fixedCamera) return children
  return <LayerParallax depth={depth}>{children}</LayerParallax>
}

/**
 * Layered interactive sensory room (world-first, UI-second).
 */
export function LayeredRoomScene({ fixedCamera = false }) {
  return (
    <>
      <MaybeParallax depth={SCENE_LAYER_PARALLAX[SCENE_LAYERS.AMBIENT]} fixedCamera={fixedCamera}>
        <LayerAmbient calm={fixedCamera} />
      </MaybeParallax>

      <MaybeParallax depth={SCENE_LAYER_PARALLAX[SCENE_LAYERS.ENVIRONMENT]} fixedCamera={fixedCamera}>
        <LayerEnvironment />
      </MaybeParallax>

      <MaybeParallax depth={SCENE_LAYER_PARALLAX[SCENE_LAYERS.SENSORY]} fixedCamera={fixedCamera}>
        <LayerSensoryObjects />
      </MaybeParallax>

      <MaybeParallax depth={SCENE_LAYER_PARALLAX[SCENE_LAYERS.CHARACTER]} fixedCamera={fixedCamera}>
        <LayerCharacter />
      </MaybeParallax>

      <ForegroundBallPit />

      <MaybeParallax depth={SCENE_LAYER_PARALLAX[SCENE_LAYERS.MAGIC]} fixedCamera={fixedCamera}>
        <LayerMagic calm={fixedCamera} />
      </MaybeParallax>

      <LayerHotspots />
    </>
  )
}
