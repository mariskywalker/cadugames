import type { UserMode } from './types'

export interface NavItem {
  id: string
  label: string
  icon: string
  href: string
  enabled: boolean
}

export const childNavigation: NavItem[] = [
  { id: 'life', label: 'Jornada', icon: '🌈', href: '/child/life', enabled: true },
  { id: 'diary', label: 'Diário', icon: '📔', href: '/child/diary', enabled: true },
  { id: 'home', label: 'Início', icon: '🏠', href: '/', enabled: true },
  { id: 'family', label: 'Família', icon: '💛', href: '/child/family', enabled: true },
  { id: 'growth', label: 'Crescimento', icon: '🌱', href: '/child/growth', enabled: true },
]

export const parentNavigation: NavItem[] = [
  { id: 'journey', label: 'Jornada', icon: '🌈', href: '/parent/journey', enabled: true },
  { id: 'dashboard', label: 'Início', icon: '🏠', href: '/parent/dashboard', enabled: true },
  { id: 'report', label: 'Relatório', icon: '📊', href: '/parent/report', enabled: true },
  { id: 'therapist', label: 'Terapeuta', icon: '💬', href: '/parent/therapist', enabled: true },
  { id: 'home', label: 'Trocar', icon: '👤', href: '/', enabled: true },
]

export const parentTopNavigation = [
  { id: 'journey', label: 'Jornada', href: '/parent/journey', icon: '🌈' },
  { id: 'dashboard', label: 'Início', href: '/parent/dashboard', icon: '🏠' },
  { id: 'report', label: 'Relatórios', href: '/parent/report', icon: null },
  { id: 'therapist', label: 'Conexões', href: '/parent/therapist', icon: null },
] as const

export function getNavigation(mode: UserMode | null): NavItem[] {
  if (mode === 'parent') return parentNavigation
  if (mode === 'child') return childNavigation
  return []
}
