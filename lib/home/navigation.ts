export type HomeTabId = 'jornada' | 'diario' | 'inicio' | 'familia' | 'crescimento'

export const HOME_TABS: { id: HomeTabId; label: string }[] = [
  { id: 'jornada', label: 'Jornada' },
  { id: 'diario', label: 'Diário' },
  { id: 'inicio', label: 'Início' },
  { id: 'familia', label: 'Família' },
  { id: 'crescimento', label: 'Crescimento' },
]

export function homeTabRoute(tab: HomeTabId): string | null {
  switch (tab) {
    case 'jornada':
      return '/child/life'
    case 'diario':
      return '/child/diary'
    case 'inicio':
      return '/'
    case 'familia':
      return '/child/family'
    case 'crescimento':
      return '/child/growth'
    default:
      return null
  }
}
