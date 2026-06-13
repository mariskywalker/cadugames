/**
 * Mock central do companion CADU Life — perfil, programa terapêutico,
 * domínios de crescimento, atividades em família e resumo da semana.
 * Sem backend: tudo aqui até a Etapa 2.
 */

export interface TodayMission {
  title: string
  objective: string
  duration: string
  ctaHref: string
  ctaLabel: string
}

export interface FocusMeta {
  program: string
  practicing: string[]
}

export interface ChildJourneyProfile {
  id: string
  name: string
  age: number
  level: number
  currentProgram: string
  currentWeek: number
  totalWeeks: number
  journeyProgress: number
  currentMission: string
  completedActivities: number
  totalActivities: number
  lastActivity: { title: string; when: string; emoji: string }
}

export const todayMission: TodayMission = {
  title: 'Responder perguntas simples',
  objective: 'Treinar respostas curtas durante conversas.',
  duration: '5 minutos',
  ctaHref: '/child/life/comunicacao',
  ctaLabel: 'Começar missão',
}

export const focusMeta: FocusMeta = {
  program: 'Comunicação e Linguagem',
  practicing: ['responder perguntas', 'fazer escolhas', 'pedir ajuda'],
}

export const familyTip =
  'Experimente repetir a atividade durante o lanche ou banho.'

/** Habilidades já consolidadas na trilha atual */
export const trailConqueredSkills = ['Escolher entre opções', 'Nomear objetos']

export const childProfile: ChildJourneyProfile = {
  id: 'lucas',
  name: 'Lucas',
  age: 7,
  level: 12,
  currentProgram: 'Comunicação e Linguagem',
  currentWeek: 3,
  totalWeeks: 8,
  journeyProgress: 60,
  currentMission: 'Responder perguntas simples',
  completedActivities: 12,
  totalActivities: 20,
  lastActivity: { title: 'Caça às palavras', when: 'Ontem', emoji: '🔤' },
}

/* ─── Mundos da jornada ─── */

export type WorldStatus = 'active' | 'next' | 'locked'

export interface JourneyWorld {
  id: string
  name: string
  status: WorldStatus
  description: string
  href: string | null
}

export const journeyWorlds: JourneyWorld[] = [
  {
    id: 'vale-palavras',
    name: 'Vale das Palavras',
    status: 'active',
    description: 'Comunicação e linguagem — nomear, pedir e responder.',
    href: '/child/life/comunicacao',
  },
  {
    id: 'montanha-rotina',
    name: 'Montanha da Rotina',
    status: 'next',
    description: 'Autonomia no dia a dia — pequenos passos, grandes conquistas.',
    href: null,
  },
  {
    id: 'floresta-emocoes',
    name: 'Floresta das Emoções',
    status: 'locked',
    description: 'Reconhecer e regular emoções com apoio do Cadu.',
    href: null,
  },
  {
    id: 'cidade-amigos',
    name: 'Cidade dos Amigos',
    status: 'locked',
    description: 'Habilidades sociais — brincar junto e fazer amigos.',
    href: null,
  },
]

export const worldStatusMeta: Record<WorldStatus, { label: string; emoji: string }> = {
  active: { label: 'Ativo', emoji: '🌟' },
  next: { label: 'Próximo', emoji: '🔜' },
  locked: { label: 'Em breve', emoji: '🔒' },
}

/* ─── Diário das emoções ─── */

export interface EmotionContext {
  id: string
  label: string
  emoji: string
}

export const emotionContexts: EmotionContext[] = [
  { id: 'escola', label: 'Escola', emoji: '🏫' },
  { id: 'familia', label: 'Família', emoji: '🏠' },
  { id: 'brincadeiras', label: 'Brincadeiras', emoji: '🧸' },
  { id: 'terapia', label: 'Terapia', emoji: '💛' },
  { id: 'nao-sei', label: 'Não sei', emoji: '🤔' },
]

/* ─── Fazer em Família ─── */

export interface FamilyActivity {
  id: string
  title: string
  skill: string
  objective: string
  duration: string
  materials: string
  howTo: string
  caduTip: string
  emoji: string
  today?: boolean
}

export const familyActivities: FamilyActivity[] = [
  {
    id: 'caca-palavras',
    title: 'Caça às palavras pela casa',
    skill: 'Comunicação',
    objective: 'Nomear objetos do cotidiano',
    duration: '10 minutos',
    materials: 'Objetos da casa',
    howTo:
      'Escolha 3 objetos e peça para Lucas nomear, apontar ou escolher entre duas opções.',
    caduTip: 'Celebre tentativas, não só respostas corretas.',
    emoji: '🔍',
    today: true,
  },
  {
    id: 'hora-historia',
    title: 'Hora da história com pausas',
    skill: 'Comunicação',
    objective: 'Manter atenção compartilhada em momentos curtos',
    duration: '15 minutos',
    materials: 'Um livro ilustrado favorito',
    howTo:
      'Leia uma história conhecida e faça pausas para Lucas completar palavras ou apontar figuras.',
    caduTip: 'Espere alguns segundos a mais — o tempo de resposta dele é precioso.',
    emoji: '📖',
  },
  {
    id: 'chef-ajudante',
    title: 'Pequeno chef ajudante',
    skill: 'Autonomia',
    objective: 'Seguir uma sequência simples com apoio mínimo',
    duration: '20 minutos',
    materials: 'Lanche simples (pão, frutas)',
    howTo:
      'Montem um lanche juntos em 3 passos. Deixe Lucas escolher e executar uma parte sozinho.',
    caduTip: 'Nomeie cada passo em voz alta — rotina também é linguagem.',
    emoji: '🥪',
  },
]

/* ─── Meu Crescimento ─── */

export interface GrowthDomain {
  id: string
  name: string
  emoji: string
  progress: number
  note: string
  color: string
}

export const growthDomains: GrowthDomain[] = [
  {
    id: 'comunicacao',
    name: 'Comunicação',
    emoji: '💬',
    progress: 80,
    note: 'Lucas começou a responder mais perguntas espontaneamente.',
    color: '#5B9FFF',
  },
  {
    id: 'autonomia',
    name: 'Autonomia',
    emoji: '🌱',
    progress: 65,
    note: 'Lucas está ganhando confiança para fazer pequenas tarefas sozinho.',
    color: '#6BCB77',
  },
  {
    id: 'socializacao',
    name: 'Socialização',
    emoji: '🤝',
    progress: 55,
    note: 'Lucas procurou colegas para brincar em momentos curtos.',
    color: '#B388FF',
  },
  {
    id: 'regulacao',
    name: 'Regulação Emocional',
    emoji: '🫧',
    progress: 40,
    note: 'Estamos observando momentos de ansiedade para entender padrões.',
    color: '#FF6B9D',
  },
  {
    id: 'sensorial',
    name: 'Sensorial',
    emoji: '✨',
    progress: 70,
    note: 'A sala sensorial tem ajudado nos momentos de transição.',
    color: '#FFB84D',
  },
  {
    id: 'rotina',
    name: 'Rotina',
    emoji: '🗓️',
    progress: 60,
    note: 'Lucas está seguindo partes da rotina com menos ajuda.',
    color: '#4ECDC4',
  },
]

export const weekSummary = {
  activitiesDone: 3,
  emotionEntries: 4,
  familyActivitiesDone: 1,
}
