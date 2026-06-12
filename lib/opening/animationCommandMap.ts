export const animationCommands: Record<string, string> = {
  idle: 'Idle',
  walk: 'Walking',
  run: 'Running',
}

export function getCommandClipName(commandKey: string) {
  return animationCommands[commandKey] ?? null
}
