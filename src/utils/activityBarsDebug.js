import { getCommandClipName } from '../constants/animationCommandMap'
import { copyActivityBarsPoint, copyAnimationAnchor } from '../constants/activityBarsDefaults'

function isVec3(v) {
  return (
    Array.isArray(v) &&
    v.length === 3 &&
    v.every((n) => typeof n === 'number' && Number.isFinite(n))
  )
}

export function assertActivityBarsConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('[CADU Bars] activityBarsConfig is missing')
  }
  for (const key of ['hotspotPosition', 'interactionPoint', 'faceTarget']) {
    if (!isVec3(config[key])) {
      throw new Error(`[CADU Bars] activityBarsConfig.${key} is invalid — config must be used from store`)
    }
  }
  if (!copyAnimationAnchor(config.animationAnchor)) {
    throw new Error('[CADU Bars] activityBarsConfig.animationAnchor is invalid')
  }
  if (!Array.isArray(config.animationSequence) || config.animationSequence.length === 0) {
    throw new Error('[CADU Bars] activityBarsConfig.animationSequence is empty')
  }
  return config
}

export function assertConfigPointUsed(label, used, fromConfig) {
  const expected = copyActivityBarsPoint(fromConfig)
  const actual = copyActivityBarsPoint(used)
  if (!expected || !actual) {
    throw new Error(`[CADU Bars] ${label}: config point not applied`)
  }
  for (let i = 0; i < 3; i++) {
    if (Math.abs(expected[i] - actual[i]) > 0.001) {
      throw new Error(
        `[CADU Bars] ${label}: config not used — expected [${expected.join(', ')}] got [${actual.join(', ')}]`,
      )
    }
  }
}

export function characterPositionFromGroup(group) {
  if (!group) return null
  return {
    x: group.position.x,
    y: group.position.y,
    z: group.position.z,
  }
}

export function logBarsClick(config) {
  assertActivityBarsConfig(config)
  console.log('BARS clicked', config)
}

export function logBarsWalkTo(interactionPoint) {
  console.log('walking to interactionPoint', interactionPoint)
}

export function logBarsArrived(group) {
  console.log('arrived', characterPositionFromGroup(group))
}

export function logBarsFacingTarget(faceTarget) {
  console.log('facing target', faceTarget)
}

export function logBarsSnapToAnchor(animationAnchor) {
  console.log('snapping to animationAnchor', animationAnchor)
}

export function debugSnapToAnimationAnchor(config, characterGroup, applySnap) {
  console.log('SNAPPING TO ANIMATION ANCHOR', {
    anchorPosition: config.animationAnchor.position,
    anchorRotation: config.animationAnchor.rotation,
    beforePosition: characterGroup.position.toArray(),
    beforeRotation: characterGroup.rotation.toArray(),
  })
  const ok = applySnap()
  console.log('AFTER SNAP', {
    position: characterGroup.position.toArray(),
    rotation: characterGroup.rotation.toArray(),
  })
  return ok
}

export function logBarsPlayingCommand(commandName, clipName) {
  console.log('playing command', commandName, clipName)
}

export function resolveCommandClipName(commandName) {
  const clipName = getCommandClipName(commandName)
  if (!clipName) {
    throw new Error(`[CADU Bars] Unknown command in activityBarsConfig.animationSequence: "${commandName}"`)
  }
  return clipName
}
