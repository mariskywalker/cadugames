import { todayMission } from '@/lib/mockChildProfile'
import type { WorldId, WorldInteractionPoint } from './types'

export const worldInteractions: WorldInteractionPoint[] = [
  /* ─── Sala Sensorial ─── */
  {
    id: 'sensory-bubbles',
    worldId: 'sensory',
    label: 'Tubo de bolhas',
    emoji: '🫧',
    x: 18,
    y: 42,
    kind: 'choice',
    sheet: {
      sceneLine: 'Vamos observar as bolhas juntos?',
      prompt: 'Como você se sente agora?',
      options: ['🌊 Calmo', '✨ Curioso', '😊 Feliz'],
      pickFeedback: {
        '🌊 Calmo': 'Que bom sentir calma — o corpo pode descansar um pouquinho.',
        '✨ Curioso': 'Curiosidade é uma porta aberta para descobrir coisas novas.',
        '😊 Feliz': 'Que alegria compartilhar este momento com você.',
      },
    },
  },
  {
    id: 'sensory-swing',
    worldId: 'sensory',
    label: 'Balanço sensorial',
    emoji: '🌬️',
    x: 72,
    y: 38,
    kind: 'breathing',
    sheet: {
      sceneLine: 'Vamos respirar juntos?',
      prompt: 'Siga o ritmo: inspire… expire…',
      options: ['Inspire devagar', 'Segure um pouco', 'Expire suave'],
      pickFeedback: 'Respirar juntos acalma o corpo e a mente.',
    },
  },
  {
    id: 'sensory-ballpit',
    worldId: 'sensory',
    label: 'Piscina de bolinhas',
    emoji: '⚪',
    x: 50,
    y: 72,
    kind: 'choice',
    sheet: {
      sceneLine: 'Como seu corpo está hoje?',
      prompt: 'Escolha o que mais combina com você agora:',
      options: ['⚡ Agitado', '🙂 Tranquilo', '😴 Cansado'],
      pickFeedback: {
        '⚡ Agitado': 'Obrigado por contar — movimento também é uma forma de falar.',
        '🙂 Tranquilo': 'Que bom sentir tranquilidade no corpo hoje.',
        '😴 Cansado': 'Descansar também é importante. Vamos no seu ritmo.',
      },
    },
  },

  /* ─── Vale das Palavras ─── */
  {
    id: 'vale-mailbox',
    worldId: 'vale',
    label: 'Caixa de correio',
    emoji: '📬',
    x: 12,
    y: 58,
    kind: 'narrative',
    sheet: {
      sceneLine: 'Uma cartinha do Cadu chegou hoje.',
      prompt: todayMission.title,
      options: ['Entendi', 'Vamos praticar', 'Conta mais'],
      pickFeedback: {
        Entendi: 'Ótimo — uma palavra de cada vez.',
        'Vamos praticar': 'Estou aqui com você nesta missão.',
        'Conta mais': todayMission.objective,
      },
    },
  },
  {
    id: 'vale-garden',
    worldId: 'vale',
    label: 'Jardim',
    emoji: '🌸',
    x: 28,
    y: 68,
    kind: 'choice',
    sheet: {
      sceneLine: 'Cada flor guarda uma habilidade que você vem cultivando.',
      prompt: 'Qual flor quer visitar?',
      options: ['🌸 Comunicação', '🌼 Socialização', '🌱 Autonomia'],
      pickFeedback: {
        '🌸 Comunicação': 'Você nomeou 3 objetos esta semana — cada nome é uma ponte.',
        '🌼 Socialização': 'Você procurou colegas para brincar em momentos curtos.',
        '🌱 Autonomia': 'Pequenas tarefas do dia a dia estão ficando mais fáceis.',
      },
    },
  },
  {
    id: 'vale-tree',
    worldId: 'vale',
    label: 'Árvore principal',
    emoji: '🌳',
    x: 62,
    y: 52,
    kind: 'narrative',
    sheet: {
      sceneLine: 'Coisas que descobrimos juntos',
      prompt: 'O que ficou guardado na árvore:',
      options: ['Escolher entre opções', 'Nomear objetos', 'Pedir ajuda'],
      pickFeedback: 'Cada descoberta fica aqui — lembranças da nossa jornada.',
    },
  },
  {
    id: 'vale-lantern',
    worldId: 'vale',
    label: 'Lanterna',
    emoji: '🏮',
    x: 84,
    y: 44,
    kind: 'narrative',
    sheet: {
      sceneLine: 'A lanterna acende com uma curiosidade do dia.',
      prompt: 'Sabia que responder perguntas curtas ajuda nas conversas do dia a dia?',
      options: ['Que legal', 'Quero tentar', 'Me conta outra'],
      pickFeedback: {
        'Que legal': 'Curiosidades iluminam o caminho.',
        'Quero tentar': 'Vamos praticar juntos, no seu tempo.',
        'Me conta outra': 'Palavras são pontes — e você já está construindo várias.',
      },
    },
  },

  /* ─── Montanha da Rotina ─── */
  {
    id: 'montanha-clock',
    worldId: 'montanha',
    label: 'Relógio',
    emoji: '🕐',
    x: 22,
    y: 35,
    kind: 'choice',
    sheet: {
      sceneLine: 'O que vem depois?',
      prompt: 'Depois de escovar os dentes, o que fazemos?',
      options: ['Tomar banho', 'Dormir', 'Jantar'],
      pickFeedback: {
        'Tomar banho': 'Boa sequência — uma coisa de cada vez.',
        Dormir: 'Rotina da noite ajuda o corpo a descansar.',
        Jantar: 'Cada passo da rotina tem seu lugar.',
      },
    },
  },
  {
    id: 'montanha-signs',
    worldId: 'montanha',
    label: 'Placas do caminho',
    emoji: '🪧',
    x: 48,
    y: 55,
    kind: 'sequence',
    sequenceSteps: ['Escovar os dentes', 'Tomar banho', 'Dormir'],
    sheet: {
      sceneLine: 'Vamos organizar a rotina da noite?',
      prompt: 'Qual é o primeiro passo?',
      options: ['Escovar os dentes', 'Tomar banho', 'Dormir'],
      pickFeedback: 'Escovar os dentes vem primeiro — depois banho, depois dormir.',
    },
  },
  {
    id: 'montanha-cabin',
    worldId: 'montanha',
    label: 'Cabana do topo',
    emoji: '🏔️',
    x: 74,
    y: 28,
    kind: 'narrative',
    sheet: {
      sceneLine: 'O Cadu te espera no topo da montanha.',
      prompt: 'Cada passo pequeno é uma grande conquista.',
      options: ['Obrigado, Cadu', 'Vou tentar', 'Preciso de ajuda'],
      pickFeedback: {
        'Obrigado, Cadu': 'Estou sempre aqui na sua jornada.',
        'Vou tentar': 'Tentar já é coragem — vamos juntos.',
        'Preciso de ajuda': 'Pedir ajuda faz parte da rotina de cuidar de si.',
      },
    },
  },

  /* ─── Cidade dos Amigos ─── */
  {
    id: 'cidade-bench',
    worldId: 'cidade',
    label: 'Banco da praça',
    emoji: '🪑',
    x: 20,
    y: 62,
    kind: 'choice',
    sheet: {
      sceneLine: 'O que você diria para um amigo?',
      prompt: 'Escolha uma forma gentil de começar:',
      options: ['Oi!', 'Quer brincar?', 'Tudo bem?', 'Espera comigo'],
      pickFeedback: 'Palavras gentis abrem portas para novas amizades.',
    },
  },
  {
    id: 'cidade-cafe',
    worldId: 'cidade',
    label: 'Café',
    emoji: '☕',
    x: 52,
    y: 48,
    kind: 'choice',
    sheet: {
      sceneLine: 'Hora de escolher no café.',
      prompt: 'O que você gostaria?',
      options: ['Suco', 'Água', 'Biscoito', 'Nada agora'],
      pickFeedback: 'Escolher o que queremos é uma forma de nos comunicarmos.',
    },
  },
  {
    id: 'cidade-playground',
    worldId: 'cidade',
    label: 'Parquinho',
    emoji: '🛝',
    x: 78,
    y: 58,
    kind: 'choice',
    sheet: {
      sceneLine: 'Uma criança quer brincar com você.',
      prompt: 'O que você faria?',
      options: ['Sim, vamos!', 'Espera um pouco', 'Prefiro brincar só', 'Chamo alguém'],
      pickFeedback: {
        'Sim, vamos!': 'Brincar junto pode ser divertido — no seu tempo.',
        'Espera um pouco': 'Está tudo bem precisar de um momento.',
        'Prefiro brincar só': 'Respeitar o que sentimos também é importante.',
        'Chamo alguém': 'Pedir apoio é uma habilidade valiosa.',
      },
    },
  },

]

export function getWorldInteractions(worldId: WorldId): WorldInteractionPoint[] {
  return worldInteractions.filter((p) => p.worldId === worldId)
}

export type HubPointOverride = Partial<Pick<WorldInteractionPoint, 'x' | 'y' | 'size'>>

export type HubPointOverrides = Record<string, HubPointOverride>

export function mergeHubPoints(
  worldId: WorldId,
  overrides: HubPointOverrides = {},
): WorldInteractionPoint[] {
  return getWorldInteractions(worldId).map((point) => ({
    ...point,
    ...overrides[point.id],
  }))
}

export function formatHubPointsExport(worldId: WorldId, points: WorldInteractionPoint[]): string {
  const rows = points.map((p) => {
    const size = p.size != null ? `, size: ${p.size}` : ''
    return `  { id: '${p.id}', worldId: '${p.worldId}', label: '${p.label}', emoji: '${p.emoji}', x: ${p.x.toFixed(1)}, y: ${p.y.toFixed(1)}${size}, kind: '${p.kind}', ... },`
  })
  return `// Cole posições em lib/worlds/worldInteractions.ts — ${worldId}\n${rows.join('\n')}`
}

export function getWorldInteraction(id: string): WorldInteractionPoint | undefined {
  return worldInteractions.find((p) => p.id === id)
}

export function resolveFeedback(
  sheet: WorldInteractionPoint['sheet'],
  choice: string,
): string {
  const fb = sheet.pickFeedback
  if (typeof fb === 'string') return fb
  return fb[choice] ?? 'Obrigado por compartilhar — cada momento conta na jornada.'
}
