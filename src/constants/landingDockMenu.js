/**
 * Menu inferior da landing — troque `icon` por chave em LandingDockIcons.jsx
 * ou substitua por componente customizado depois.
 */
export const LANDING_DOCK_ITEMS = [
  { id: 'home', label: 'Início', icon: 'home', defaultActive: true },
  { id: 'calendar', label: 'Agenda', icon: 'calendar' },
  { id: 'journal', label: 'Registros', icon: 'document' },
  { id: 'explore', label: 'Explorar sala', icon: 'mascot', action: 'enterRoom' },
  { id: 'media', label: 'Mídia', icon: 'video' },
]
