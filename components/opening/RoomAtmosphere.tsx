'use client'

import { HorizonGroundMist } from './HorizonGroundMist'
import { LayerSky } from './LayerSky'
import { SensoryRoomShell } from './SensoryRoomShell'

export function RoomAtmosphere() {
  return (
    <group>
      <SensoryRoomShell />
      <LayerSky />
      <HorizonGroundMist />
    </group>
  )
}
