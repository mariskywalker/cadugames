'use client'

import { LayerAmbient } from './LayerAmbient'
import { ForegroundBallPit } from './ForegroundBallPit'
import { LayerMagic } from './LayerMagic'
import { RoomAtmosphere } from './RoomAtmosphere'
import { LayerCharacter } from './layers/LayerCharacter'
import { LayerEnvironment } from './layers/LayerEnvironment'
import { LayerSensoryObjects } from './layers/LayerSensoryObjects'

export function LayeredRoomScene({ fixedCamera = true }: { fixedCamera?: boolean }) {
  return (
    <>
      <RoomAtmosphere />
      <LayerAmbient calm={fixedCamera} />
      <LayerEnvironment />
      <LayerSensoryObjects />
      <LayerCharacter />
      <ForegroundBallPit />
      <LayerMagic calm={fixedCamera} />
    </>
  )
}
