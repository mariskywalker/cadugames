import { childProfile, familyActivities } from '@/lib/mockChildProfile'
import { lifeConquistas } from '@/lib/lifeSliceData'
import { valeHubActions, type ValeAction } from '@/lib/valeHubData'

export const casaUrsoAchievements = lifeConquistas.filter(
  (c) => c.dimensionId === 'comunicacao' && c.unlocked,
)

export const casaUrsoNextActivities: ValeAction[] = valeHubActions.filter(
  (a) => a.state === 'active' || a.state === 'current',
)

export const casaUrsoCaduTip =
  familyActivities.find((a) => a.today)?.caduTip ??
  'Celebre tentativas, não só respostas corretas — cada palavra é um passo no vale.'

export const casaUrsoProgramProgress = {
  completed: childProfile.completedActivities,
  total: childProfile.totalActivities,
  percent: Math.round((childProfile.completedActivities / childProfile.totalActivities) * 100),
  program: childProfile.currentProgram,
  week: childProfile.currentWeek,
  totalWeeks: childProfile.totalWeeks,
  journeyProgress: childProfile.journeyProgress,
  mission: childProfile.currentMission,
  childName: childProfile.name,
}
