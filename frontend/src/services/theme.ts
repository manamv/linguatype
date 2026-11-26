export type ThemeId = 'cyber-sky' | 'emerald-matrix' | 'amber-noir' | 'sakura-dusk' | 'nordic-light'

export interface ThemePreset {
  id: ThemeId
  name: string
  swatch: string
  bgStyle: string
  isLight?: boolean
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'cyber-sky',
    name: 'Cyber Sky',
    swatch: '#38bdf8',
    bgStyle:
      'radial-gradient(ellipse 85% 55% at 50% -10%, rgba(56,189,248,0.16), rgba(6,9,17,0)), radial-gradient(ellipse 60% 40% at 85% 95%, rgba(99,102,241,0.07), rgba(6,9,17,0)), #060911'
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    swatch: '#34d399',
    bgStyle:
      'radial-gradient(ellipse 85% 55% at 50% -10%, rgba(16,185,129,0.16), rgba(5,12,10,0)), radial-gradient(ellipse 60% 40% at 85% 95%, rgba(6,182,212,0.08), rgba(5,12,10,0)), #050c0a'
  },
  {
    id: 'amber-noir',
    name: 'Amber Noir',
    swatch: '#fbbf24',
    bgStyle:
      'radial-gradient(ellipse 85% 55% at 50% -10%, rgba(245,158,11,0.15), rgba(14,10,6,0)), radial-gradient(ellipse 60% 40% at 85% 95%, rgba(244,63,94,0.08), rgba(14,10,6,0)), #0c0907'
  },
  {
    id: 'sakura-dusk',
    name: 'Sakura Dusk',
    swatch: '#f472b6',
    bgStyle:
      'radial-gradient(ellipse 85% 55% at 50% -10%, rgba(244,114,182,0.15), rgba(13,8,16,0)), radial-gradient(ellipse 60% 40% at 85% 95%, rgba(168,85,247,0.09), rgba(13,8,16,0)), #0c0710'
  },
  {
    id: 'nordic-light',
    name: 'Nordic Daylight',
    swatch: '#0284c7',
    bgStyle:
      'radial-gradient(ellipse 85% 55% at 50% -10%, rgba(56,189,248,0.14), rgba(241,245,249,0)), #f1f5f9',
    isLight: true
  }
]

const STORAGE_KEY = 'linguatype_theme_v1'

export const themeService = {
  getTheme(): ThemeId {
    if (typeof window === 'undefined') return 'cyber-sky'
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null
      if (saved && THEME_PRESETS.some(t => t.id === saved)) return saved
    } catch {
      // ignore
    }
    return 'cyber-sky'
  },

  setTheme(id: ThemeId) {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', id)
    }
  },

  getPreset(id: ThemeId): ThemePreset {
    return THEME_PRESETS.find(t => t.id === id) || THEME_PRESETS[0]
  }
}
