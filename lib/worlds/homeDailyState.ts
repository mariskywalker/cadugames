const HOME_DAILY_KEY = 'cadu.home.daily'

export type HomeDailyVariant = 'flower' | 'lantern'

export interface HomeDailyState {
  date: string
  variant: HomeDailyVariant
  letter: string
  moodResponse?: string
}

const LETTERS = [
  'Hoje é um bom dia para praticar uma palavra de cada vez.',
  'O Cadu acordou pensando em você — vamos explorar juntos?',
  'Cada pequena escolha abre um caminho novo no vale.',
  'Respire fundo. Estamos aqui, no seu ritmo.',
]

const VARIANTS: HomeDailyVariant[] = ['flower', 'lantern']

function normalizeVariant(variant: string): HomeDailyVariant {
  return variant === 'lantern' ? 'lantern' : 'flower'
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function seedFromDate(date: string) {
  return date.split('-').reduce((acc, part) => acc + Number(part), 0)
}

export function getHomeDailyState(): HomeDailyState {
  const date = todayKey()

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(HOME_DAILY_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as HomeDailyState
        if (saved.date === date) {
          return { ...saved, variant: normalizeVariant(saved.variant) }
        }
      }
    } catch {
      // fall through
    }
  }

  const seed = seedFromDate(date)
  const state: HomeDailyState = {
    date,
    variant: VARIANTS[seed % VARIANTS.length],
    letter: LETTERS[seed % LETTERS.length],
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(HOME_DAILY_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }

  return state
}

export function saveHomeMoodResponse(mood: string) {
  const state = getHomeDailyState()
  const next = { ...state, moodResponse: mood }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(HOME_DAILY_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  }
  return next
}
