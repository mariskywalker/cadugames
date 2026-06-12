export type ValeActionState = 'active' | 'locked' | 'completed' | 'current'
export type ValePlacement = 'top' | 'left' | 'right' | 'bottom'

export interface ValeAction {
  id: string
  label: string
  whisper?: string
  emoji: string
  state: ValeActionState
  placement: ValePlacement
  sheet: {
    title: string
    sceneLine: string
    prompt: string
    options: string[]
    pickFeedback: string
    lockedMessage?: string
  }
}

export const valeHubActions: ValeAction[] = [
  {
    id: 'iniciar-conversa',
    label: 'Iniciar conversa',
    whisper: 'um oi gentil',
    emoji: '👋',
    state: 'active',
    placement: 'top',
    sheet: {
      title: 'Iniciar conversa',
      sceneLine: 'O vento traz uma voz suave da porta da casa…',
      prompt: 'Vamos começar uma conversa?',
      options: ['Oi', 'Tudo bem?', 'Brincar?', 'Eu quero falar'],
      pickFeedback: 'Que bom começar assim — cada palavra abre um caminho!',
    },
  },
  {
    id: 'pedir-ajuda',
    label: 'Pedir ajuda',
    whisper: 'mãozinha erguida',
    emoji: '🙋',
    state: 'active',
    placement: 'left',
    sheet: {
      title: 'Pedir ajuda',
      sceneLine: 'O Tato encontrou algo difícil, olhando para você…',
      prompt: 'Como podemos pedir ajuda?',
      options: ['Ajuda', 'Abre', 'Espera', 'De novo'],
      pickFeedback: 'Pedir ajuda é coragem — o vale ouviu você.',
    },
  },
  {
    id: 'escolher',
    label: 'Escolher',
    whisper: 'já floresceu',
    emoji: '✋',
    state: 'completed',
    placement: 'right',
    sheet: {
      title: 'Escolher',
      sceneLine: 'Uma florzinha brilha onde você já escolheu antes…',
      prompt: 'Vamos escolher uma palavra nova?',
      options: ['Quero', 'Mais', 'Parar', 'Sim', 'Não'],
      pickFeedback: 'Você escolheu com coragem!',
    },
  },
  {
    id: 'nomear-emocao',
    label: 'Nomear emoção',
    whisper: 'ainda adormecida',
    emoji: '💗',
    state: 'locked',
    placement: 'bottom',
    sheet: {
      title: 'Nomear emoção',
      sceneLine: 'Uma luz tímida pulsa bem devagar no chão do vale…',
      prompt: 'Como o Tato está se sentindo?',
      options: ['Feliz', 'Triste', 'Bravo', 'Com medo'],
      pickFeedback: 'Nomear o que sentimos é um presente para o coração.',
      lockedMessage: 'Esta luz ainda está dormindo. Quando florescer, o Tato vai te chamar.',
    },
  },
]

export const CASA_URSO_ACTION_ID = 'escolher'

export const casaUrsoIntro = 'Você tocou na Casa do Urso. Vamos escolher uma palavra?'

export function getValeAction(id: string): ValeAction | undefined {
  return valeHubActions.find((a) => a.id === id)
}
