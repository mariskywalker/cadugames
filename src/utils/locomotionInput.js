import { DOUBLE_CLICK_MAX_DIST, RUN_INPUT_MIN_TAPS, RUN_INPUT_WINDOW_MS } from '../constants/animations'

/**
 * @param {number} now
 * @param {{ t: number, x: number, z: number }} last
 * @param {{ x: number, z: number }} point
 */
export function isDoubleClickMove(now, last, point) {
  const dt = now - last.t
  if (dt <= 0 || dt > RUN_INPUT_WINDOW_MS) return false
  const dx = point.x - last.x
  const dz = point.z - last.z
  return Math.hypot(dx, dz) <= DOUBLE_CLICK_MAX_DIST
}

/** @param {number[]} tapTimes ms timestamps, mutates filtered array */
export function shouldRunFromTapBurst(tapTimes, now = performance.now()) {
  while (tapTimes.length && now - tapTimes[0] > RUN_INPUT_WINDOW_MS) tapTimes.shift()
  tapTimes.push(now)
  return tapTimes.length >= RUN_INPUT_MIN_TAPS
}

export function resetTapBurst(tapTimes) {
  tapTimes.length = 0
}
