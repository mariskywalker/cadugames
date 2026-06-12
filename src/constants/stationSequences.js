import { animationCommands, getCommandLabel } from './animationCommandMap'
import { loadActivityBarsConfig } from '../utils/activityBarsConfigStorage'

const barsConfig = loadActivityBarsConfig()

/** Barras de atividades — passos via AnimationCommandMap + config. */
export const ACTIVITY_BARS_STEPS = barsConfig.animationSequence.map((commandKey) => ({
  id: commandKey,
  commandKey,
  label: getCommandLabel(commandKey),
  clipName: animationCommands[commandKey],
}))

export const ACTIVITY_BARS_SEQUENCE = {
  id: 'activityBars',
  label: 'Barras de atividades',
  steps: ACTIVITY_BARS_STEPS,
}

export const STATION_SEQUENCES = {
  activityBars: ACTIVITY_BARS_SEQUENCE,
}

export function getStationSequence(stationId) {
  return stationId === 'activityBars' ? ACTIVITY_BARS_SEQUENCE : null
}

export function getBarAnimationSteps() {
  return ACTIVITY_BARS_STEPS
}
