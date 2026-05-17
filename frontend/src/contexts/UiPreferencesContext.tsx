import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import i18n from '../i18n'

export type ThemePreference = 'light' | 'dark'
export type LangPreference = 'es' | 'en'

type UiPreferencesContextValue = {
  theme: ThemePreference
  setTheme: (t: ThemePreference) => void
  toggleTheme: () => void
  language: LangPreference
  setLanguage: (lng: LangPreference) => void
}

const UiPreferencesContext = createContext<UiPreferencesContextValue | null>(
  null,
)

function readStoredTheme(): ThemePreference {
  try {
    return localStorage.getItem('gloomi-theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function readStoredLang(): LangPreference {
  try {
    return localStorage.getItem('gloomi-lang') === 'en' ? 'en' : 'es'
  } catch {
    return 'es'
  }
}

function applyThemeClass(theme: ThemePreference) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function UiPreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(readStoredTheme)
  const [language, setLangState] = useState<LangPreference>(readStoredLang)

  const setTheme = useCallback((t: ThemePreference) => {
    setThemeState(t)
    applyThemeClass(t)
    try {
      localStorage.setItem('gloomi-theme', t)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const setLanguage = useCallback((lng: LangPreference) => {
    setLangState(lng)
    document.documentElement.lang = lng
    try {
      localStorage.setItem('gloomi-lang', lng)
    } catch {
      /* ignore */
    }
    void i18n.changeLanguage(lng)
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      language,
      setLanguage,
    }),
    [theme, setTheme, toggleTheme, language, setLanguage],
  )

  return (
    <UiPreferencesContext.Provider value={value}>
      {children}
    </UiPreferencesContext.Provider>
  )
}

export function useUiPreferences(): UiPreferencesContextValue {
  const ctx = useContext(UiPreferencesContext)
  if (!ctx) {
    throw new Error('useUiPreferences must be used within UiPreferencesProvider')
  }
  return ctx
}
