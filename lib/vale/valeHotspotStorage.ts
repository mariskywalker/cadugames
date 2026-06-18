export const VALE_LAST_HOTSPOT_STORAGE_KEY = 'cadu.vale.lastBearHotspot'

export function loadLastBearHotspot(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(VALE_LAST_HOTSPOT_STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveLastBearHotspot(id: string) {
  try {
    localStorage.setItem(VALE_LAST_HOTSPOT_STORAGE_KEY, id)
  } catch {
    // ignore
  }
}
