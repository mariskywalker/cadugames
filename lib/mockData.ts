import type {
  Activity,
  ChildProfile,
  EmotionEntry,
  GuidedActivity,
  Reward,
  Skill,
  TherapistConnection,
  TrailNode,
  WeeklyReportData,
} from './types'

export const children: ChildProfile[] = [
  {
    id: 'lucas',
    name: 'Lucas',
    age: 7,
    avatar: '👦',
    streak: 7,
    stars: 128,
    level: 12,
    xp: 600,
    xpGoal: 1000,
  },
  {
    id: 'maria',
    name: 'Maria',
    age: 6,
    avatar: '🦊',
    streak: 3,
    stars: 86,
    level: 3,
    xp: 320,
    xpGoal: 500,
  },
]

export const parentDashboard = {
  activitiesThisWeek: 18,
  dominantEmotion: { label: 'Alegria', emoji: '😊' },
  achievementsStars: 24,
  weekSummary:
    'Lucas tem mostrado muita evolução! Ele desbloqueou novas emoções e está se comunicando melhor.',
  lastActivity: {
    title: 'Respiração do Balão',
    trail: 'Trilha das Emoções',
    when: 'Hoje • 10 min',
    emoji: '🫧',
  },
  streakDays: [true, true, true, true, true, true, true],
  trailProgress: [
    { id: 'tp1', name: 'Emoções', emoji: '😊', current: 4, total: 10, ringColor: '#FF6B9D' },
    { id: 'tp2', name: 'Comunicação', emoji: '💬', current: 6, total: 10, ringColor: '#5B9FFF' },
    { id: 'tp3', name: 'Autonomia', emoji: '🌱', current: 5, total: 10, ringColor: '#6BCB77' },
    { id: 'tp4', name: 'Social', emoji: '🤝', current: 7, total: 10, ringColor: '#B388FF' },
  ],
}

export const trails: TrailNode[] = [
  { id: 't1', title: 'Início', emoji: '🌟', color: '#FFB8D2', status: 'completed', x: 12, y: 78, activityId: 'a1' },
  { id: 't2', title: 'Emoções', emoji: '💛', color: '#FFCAB0', status: 'completed', x: 28, y: 62, activityId: 'a2' },
  { id: 't3', title: 'Respirar', emoji: '🫧', color: '#B8E8FF', status: 'selected', x: 44, y: 48, activityId: 'a3' },
  { id: 't4', title: 'Amizade', emoji: '🤝', color: '#C9F0C2', status: 'available', x: 58, y: 36, activityId: 'a4' },
  { id: 't5', title: 'Calma', emoji: '🌈', color: '#E8D4FF', status: 'locked', x: 72, y: 24, activityId: 'a5' },
  { id: 't6', title: 'Conquista', emoji: '🏆', color: '#FFD88A', status: 'locked', x: 86, y: 14, activityId: 'a6' },
]

export const activities: Activity[] = [
  {
    id: 'a1',
    trailId: 't1',
    title: 'Como você está?',
    prompt: 'Toque na emoção que mais combina com você agora',
    helperText: 'Não existe resposta errada 💕',
    emoji: '😊',
    options: [
      { id: 'o1', label: 'Feliz', emoji: '😊' },
      { id: 'o2', label: 'Calmo', emoji: '😌' },
      { id: 'o3', label: 'Animado', emoji: '🤩' },
    ],
  },
  {
    id: 'a2',
    trailId: 't2',
    title: 'Nomeie a emoção',
    prompt: 'O CADU sentiu o coração acelerado antes da aula. O que será?',
    helperText: 'Pense no corpo e no rosto do CADU',
    emoji: '💭',
    options: [
      { id: 'o1', label: 'Ansioso', emoji: '😰', isCorrect: true },
      { id: 'o2', label: 'Com sono', emoji: '😴' },
      { id: 'o3', label: 'Com fome', emoji: '🍎' },
    ],
  },
  {
    id: 'a3',
    trailId: 't3',
    title: 'Respira comigo',
    prompt: 'Escolha o ritmo que deixa você mais tranquilo',
    helperText: 'Vamos fazer juntos, devagar',
    emoji: '🫧',
    options: [
      { id: 'o1', label: 'Lento e suave', emoji: '🐢', isCorrect: true },
      { id: 'o2', label: 'Rápido', emoji: '⚡' },
      { id: 'o3', label: 'Pulando', emoji: '🦘' },
    ],
  },
  {
    id: 'a4',
    trailId: 't4',
    title: 'Pedir ajuda',
    prompt: 'Quando alguém precisa de ajuda, o que fazemos?',
    helperText: 'Ser amigo é cuidar',
    emoji: '🤝',
    options: [
      { id: 'o1', label: 'Ignorar', emoji: '🙈' },
      { id: 'o2', label: 'Perguntar se está bem', emoji: '💬', isCorrect: true },
      { id: 'o3', label: 'Rir', emoji: '😅' },
    ],
  },
]

export const skills: Skill[] = [
  { id: 's1', name: 'Regulação emocional', emoji: '💛', progress: 72, trend: 'up' },
  { id: 's2', name: 'Comunicação', emoji: '💬', progress: 58, trend: 'up' },
  { id: 's3', name: 'Autonomia', emoji: '🌱', progress: 64, trend: 'stable' },
  { id: 's4', name: 'Interação social', emoji: '🤝', progress: 49, trend: 'up' },
  { id: 's5', name: 'Atenção', emoji: '🎯', progress: 41, trend: 'down' },
]

export const rewards: Reward[] = [
  {
    id: 'r1',
    title: 'Estrela da Calma',
    emoji: '⭐',
    description: 'Você completou a trilha de respiração!',
    starsEarned: 15,
  },
]

export const emotions = [
  { id: 'feliz' as const, label: 'Feliz', emoji: '😊', color: '#FFD88A' },
  { id: 'calmo' as const, label: 'Calmo', emoji: '😌', color: '#B8E8FF' },
  { id: 'ansioso' as const, label: 'Ansioso', emoji: '😰', color: '#FFCAB0' },
  { id: 'triste' as const, label: 'Triste', emoji: '😢', color: '#C9D4FF' },
  { id: 'animado' as const, label: 'Animado', emoji: '🤩', color: '#FFB8D2' },
  { id: 'cansado' as const, label: 'Cansado', emoji: '😴', color: '#E8D4FF' },
]

export const emotionDiary: EmotionEntry[] = [
  { id: 'e1', date: 'Seg', emotion: 'feliz' },
  { id: 'e2', date: 'Ter', emotion: 'calmo' },
  { id: 'e3', date: 'Qua', emotion: 'ansioso', note: 'Dia de prova' },
  { id: 'e4', date: 'Qui', emotion: 'animado' },
  { id: 'e5', date: 'Sex', emotion: 'calmo' },
]

export const guidedActivities: GuidedActivity[] = [
  { id: 'g1', title: 'Ritual de chegada em casa', duration: '8 min', category: 'Rotina', emoji: '🏠', status: 'done' },
  { id: 'g2', title: 'Cartão das emoções', duration: '12 min', category: 'Emoções', emoji: '🎴', status: 'in_progress' },
  { id: 'g3', title: 'Pausa sensorial', duration: '5 min', category: 'Regulação', emoji: '🫧', status: 'pending' },
  { id: 'g4', title: 'História do CADU', duration: '10 min', category: 'Social', emoji: '📖', status: 'pending' },
]

export const weeklyReport: WeeklyReportData = {
  weekLabel: '24–30 Mai',
  sessionsCompleted: 6,
  avgMood: 4.2,
  highlights: [
    'Lucas usou respiração antes de tarefas difíceis',
    'Melhora na nomeação de emoções após atividades',
    'Manteve sequência de 5 dias',
  ],
  challenges: [
    'Transições entre atividades ainda geram frustração',
    'Atenção sustentada cai após 12 minutos',
  ],
  therapistNote:
    'Continuar trilha de regulação e reforçar pausas curtas. Sugiro repetir “Respira comigo” 3x na semana.',
}

export const therapist: TherapistConnection = {
  name: 'Dra. Camila Rocha',
  role: 'Terapeuta Ocupacional',
  avatar: '👩‍⚕️',
  nextSession: 'Quinta, 15h30',
  clinic: 'Instituto CADU — Sala 2',
  message:
    'Lucas está evoluindo bem na comunicação de emoções. Vamos alinhar atividades para casa na próxima sessão.',
  recommendations: [
    {
      id: 'rec1',
      title: 'Repetir trilha Respirar',
      priority: 'alta',
      summary: '3 sessões curtas antes de tarefas escolares.',
    },
    {
      id: 'rec2',
      title: 'Diário emocional noturno',
      priority: 'media',
      summary: 'Registrar 1 emoção por dia com desenho ou emoji.',
    },
    {
      id: 'rec3',
      title: 'Atividade social guiada',
      priority: 'baixa',
      summary: 'Brincadeira cooperativa de 10 min com irmão ou colega.',
    },
  ],
}

export function getActivityById(id: string) {
  return activities.find((a) => a.id === id)
}

export function getActivityByTrail(trailId: string) {
  const trail = trails.find((t) => t.id === trailId)
  return trail ? getActivityById(trail.activityId) : undefined
}
