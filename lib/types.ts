export type UserMode = 'child' | 'parent'

export type NodeStatus = 'locked' | 'available' | 'completed' | 'selected'

export type EmotionId = 'feliz' | 'calmo' | 'ansioso' | 'triste' | 'animado' | 'cansado'

export interface ChildProfile {
  id: string
  name: string
  age: number
  avatar: string
  streak: number
  stars: number
  level: number
  xp?: number
  xpGoal?: number
}

export interface TrailProgressItem {
  id: string
  name: string
  emoji: string
  current: number
  total: number
  ringColor: string
}

export interface ParentDashboardData {
  activitiesThisWeek: number
  dominantEmotion: { label: string; emoji: string }
  achievementsStars: number
  weekSummary: string
  lastActivity: {
    title: string
    trail: string
    when: string
    emoji: string
  }
  streakDays: boolean[]
  trailProgress: TrailProgressItem[]
}

export interface TrailNode {
  id: string
  title: string
  emoji: string
  color: string
  status: NodeStatus
  x: number
  y: number
  activityId: string
}

export interface ActivityOption {
  id: string
  label: string
  emoji: string
  isCorrect?: boolean
}

export interface Activity {
  id: string
  trailId: string
  title: string
  prompt: string
  helperText: string
  emoji: string
  options: ActivityOption[]
}

export interface Skill {
  id: string
  name: string
  emoji: string
  progress: number
  trend: 'up' | 'stable' | 'down'
}

export interface Reward {
  id: string
  title: string
  emoji: string
  description: string
  starsEarned: number
}

export interface EmotionEntry {
  id: string
  date: string
  emotion: EmotionId
  note?: string
}

export interface GuidedActivity {
  id: string
  title: string
  duration: string
  category: string
  emoji: string
  status: 'pending' | 'in_progress' | 'done'
}

export interface WeeklyReportData {
  weekLabel: string
  sessionsCompleted: number
  avgMood: number
  highlights: string[]
  challenges: string[]
  therapistNote: string
}

export interface TherapistRecommendation {
  id: string
  title: string
  priority: 'alta' | 'media' | 'baixa'
  summary: string
}

export interface TherapistConnection {
  name: string
  role: string
  avatar: string
  nextSession: string
  clinic: string
  message: string
  recommendations: TherapistRecommendation[]
}

/* ============================================================
 * CADU LIFE — desenvolvimento humano em 7 dimensoes da vida
 * ============================================================ */

export type LifeDimensionId =
  | 'autorregulacao'
  | 'comunicacao'
  | 'relacionamentos'
  | 'autocuidado'
  | 'independencia'
  | 'participacao'
  | 'projeto-vida'

export type LifeSkillStatus = 'completed' | 'available' | 'locked'

export type LifeMissionStatus = 'done' | 'in_progress' | 'todo'

export type WorldJourneyState = 'horizon' | 'discovered' | 'exploring' | 'explored'

export interface LifeDimension {
  id: LifeDimensionId
  clinicalName: string
  worldName: string
  childLabel: string
  emoji: string
  color: string
  tagline: string
  journeyOrder: number
  mapX: number
  mapY: number
  /** Mundo navegavel neste vertical slice */
  sliceActive?: boolean
}

/** Marco = transformacao de desenvolvimento observavel */
export interface LifeMarco {
  id: string
  dimensionId: LifeDimensionId
  name: string
  emoji: string
  status: LifeSkillStatus
  /** Fala do Tato sobre este marco */
  tatoLine?: string
}

/** Conquista = narrativa que celebra um marco */
export interface LifeConquista {
  id: string
  dimensionId: LifeDimensionId
  marcoId: string
  title: string
  emoji: string
  /** Texto narrativo de celebracao — nunca quantitativo */
  celebration: string
  unlocked: boolean
}

/** Transformacao familiar — o que mudou, como observar, o que significa */
export interface FamilyTransformation {
  id: string
  dimensionId: LifeDimensionId
  marcoId: string
  conquistaId: string
  worldName: string
  marcoName: string
  whatChanged: string
  howToObserve: string
  whatItMeans: string
}

/** @deprecated Vertical slice — use LifeMarco */
export type LifeSkill = LifeMarco

/** @deprecated Vertical slice — use LifeConquista */
export type LifeAchievement = LifeConquista
