/** Ejecutar antes del primer paint (import al inicio de main.tsx). */
export function applyStoredPrefsToDocument() {
  try {
    const theme = localStorage.getItem('gloomi-theme')
    document.documentElement.classList.toggle('dark', theme !== 'light')
    const lng = localStorage.getItem('gloomi-lang')
    if (lng === 'en' || lng === 'es') {
      document.documentElement.lang = lng
    }
  } catch {
    document.documentElement.classList.add('dark')
  }
}
