import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import {
  ImagePlus,
  Languages,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useUiPreferences } from '../contexts/UiPreferencesContext'
import {
  fetchBrandingLogoAbsolute,
  uploadBrandLogo,
} from '../lib/brandingApi'
import { resolveMediaUrl } from '../lib/api'

const ROUTES = [
  { to: '/', navKey: 'nav.home' as const, matchPrefix: undefined },
  {
    to: '/tienda',
    navKey: 'nav.shop' as const,
    matchPrefix: '/tienda' as const,
  },
  { to: '/personalizar', navKey: 'nav.customize' as const, matchPrefix: undefined },
  { to: '/comunidad', navKey: 'nav.community' as const, matchPrefix: undefined },
  { to: '/quienes-somos', navKey: 'nav.about' as const, matchPrefix: undefined },
  { to: '/upcycling', navKey: 'nav.upcycling' as const, matchPrefix: undefined },
  { to: '/contacto', navKey: 'nav.contact' as const, matchPrefix: undefined },
] as const

function linkActive(pathname: string, to: string, matchPrefix?: string): boolean {
  if (matchPrefix) return pathname === to || pathname.startsWith(`${matchPrefix}/`)
  return pathname === to
}

export function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const { token, isAdmin, logout } = useAuth()
  const { theme, toggleTheme, language, setLanguage } = useUiPreferences()
  const [logoSrc, setLogoSrc] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    fetchBrandingLogoAbsolute()
      .then((u) => {
        if (!cancelled) setLogoSrc(u)
      })
      .catch(() => {
        if (!cancelled) setLogoSrc(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function onLogoSelected(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0]
    ev.target.value = ''
    if (!file || !isAdmin) return
    try {
      const r = await uploadBrandLogo(file)
      setLogoSrc(r.url ? resolveMediaUrl(r.url) : null)
    } catch {
      /* el usuario puede reintentar */
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 shadow-sm backdrop-blur-md dark:border-[rgb(201_38_74_/0.22)] dark:bg-[rgb(7_7_8_/0.85)] dark:shadow-[0_12px_40px_-12px_rgb(120_18_38_/0.35)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8 xl:max-w-[90rem] xl:px-10">
        <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className="font-display flex min-w-0 items-center gap-2 text-base font-semibold tracking-[0.2em] text-zinc-900 dark:text-zinc-100 sm:text-lg"
          >
            {logoSrc ? (
              <img
                src={logoSrc}
                alt="Gloomi"
                className="h-7 max-h-7 w-auto max-w-[min(140px,28vw)] object-contain sm:h-8 sm:max-h-8"
              />
            ) : (
              <span className="truncate">GLOOMI</span>
            )}
          </Link>
          {isAdmin ? (
            <>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={onLogoSelected}
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-[color:var(--color-gloom-violet)]"
                aria-label={t('layout.uploadLogo')}
                title={t('layout.uploadLogo')}
              >
                <ImagePlus className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" />
              </button>
            </>
          ) : null}
        </div>

        <nav className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-6 xl:gap-8" aria-label="Principal">
          {ROUTES.map((item) => {
            const active = linkActive(
              location.pathname,
              item.to,
              item.matchPrefix,
            )
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`whitespace-nowrap text-sm transition hover:text-zinc-900 dark:hover:text-white ${active ? 'font-medium text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-500'}`}
              >
                {t(item.navKey)}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2">
          <div className="hidden items-center rounded-xl border border-zinc-200 bg-zinc-50/90 p-0.5 dark:border-zinc-700 dark:bg-zinc-950/60 sm:flex">
            <button
              type="button"
              onClick={() => setLanguage('es')}
              className={`rounded-lg px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${language === 'es' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
              aria-pressed={language === 'es'}
              aria-label={`${t('prefs.langAria')}: ${t('prefs.langEs')}`}
            >
              {t('prefs.langEs')}
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`rounded-lg px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${language === 'en' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
              aria-pressed={language === 'en'}
              aria-label={`${t('prefs.langAria')}: ${t('prefs.langEn')}`}
            >
              {t('prefs.langEn')}
            </button>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label={t('prefs.themeAria')}
            title={theme === 'dark' ? t('prefs.themeLight') : t('prefs.themeDark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" aria-hidden />
            ) : (
              <Moon className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" aria-hidden />
            )}
          </button>

          {isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="hidden whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-600 hover:text-[color:var(--color-gloom-violet)] dark:text-zinc-500 sm:block"
              >
                {t('layout.dashboard')}
              </Link>
              <Link
                to="/admin/mensajes"
                className="hidden whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-600 hover:text-[color:var(--color-gloom-violet)] dark:text-zinc-500 md:block"
              >
                {t('layout.messages')}
              </Link>
              <Link
                to="/admin/personalizaciones"
                className="hidden whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-600 hover:text-[color:var(--color-gloom-violet)] dark:text-zinc-500 md:block"
              >
                {t('layout.designs')}
              </Link>
              <Link
                to="/admin/gloomis/nuevo"
                className="hidden whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-600 hover:text-[color:var(--color-gloom-violet)] dark:text-zinc-500 sm:block"
              >
                {t('layout.newGloomi')}
              </Link>
            </>
          ) : null}
          {token ? (
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              aria-label={t('layout.logout')}
              title={t('layout.logout')}
            >
              <LogOut className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" />
            </button>
          ) : (
            <Link
              to="/admin/login"
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              aria-label={t('layout.adminLoginAria')}
              title="Admin"
            >
              <LogIn className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" />
            </Link>
          )}
          <button
            type="button"
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label={t('layout.search')}
          >
            <Search className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label={t('layout.cart')}
          >
            <ShoppingCart className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" />
          </button>

          <details className="group relative lg:hidden">
            <summary className="list-none cursor-pointer rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white [&::-webkit-details-marker]:hidden">
              <Menu className="h-5 w-5" aria-hidden />
              <span className="sr-only">{t('layout.openMenu')}</span>
            </summary>
            <nav
              className="absolute right-0 top-full z-20 mt-1 max-h-[min(70vh,28rem)] w-[min(calc(100vw-2rem),16rem)] overflow-y-auto rounded-xl border border-zinc-200 bg-white py-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
              onClick={(e) => {
                const el = e.currentTarget.closest('details')
                if (el && (e.target as HTMLElement).closest('a,button')) {
                  ;(el as HTMLDetailsElement).open = false
                }
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-4 pb-2 dark:border-zinc-800">
                <span className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  <Languages className="size-3.5" aria-hidden />
                  {t('prefs.langAria')}
                </span>
                <div className="flex rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-700">
                  <button
                    type="button"
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold ${language === 'es' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
                    onClick={() => setLanguage('es')}
                  >
                    {t('prefs.langEs')}
                  </button>
                  <button
                    type="button"
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold ${language === 'en' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
                    onClick={() => setLanguage('en')}
                  >
                    {t('prefs.langEn')}
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                onClick={() => {
                  toggleTheme()
                }}
              >
                {theme === 'dark' ? (
                  <Sun className="size-4 shrink-0" aria-hidden />
                ) : (
                  <Moon className="size-4 shrink-0" aria-hidden />
                )}
                {theme === 'dark' ? t('prefs.themeLight') : t('prefs.themeDark')}
              </button>
              {ROUTES.map((item) => {
                const active = linkActive(
                  location.pathname,
                  item.to,
                  item.matchPrefix,
                )
                return (
                  <Link
                    key={`m-${item.to}`}
                    to={item.to}
                    className={`block px-4 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 ${active ? 'font-medium text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}
                  >
                    {t(item.navKey)}
                  </Link>
                )
              })}
              {isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2.5 text-sm text-[color:var(--color-gloom-violet)] hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    {t('layout.dashboard')}
                  </Link>
                  <Link
                    to="/admin/mensajes"
                    className="block px-4 py-2.5 text-sm text-[color:var(--color-gloom-violet)] hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    {t('layout.designsContact')}
                  </Link>
                  <Link
                    to="/admin/personalizaciones"
                    className="block px-4 py-2.5 text-sm text-[color:var(--color-gloom-violet)] hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    {t('layout.designsSaved')}
                  </Link>
                  <Link
                    to="/admin/gloomis/nuevo"
                    className="block px-4 py-2.5 text-sm text-[color:var(--color-gloom-violet)] hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    {t('layout.newGloomi')}
                  </Link>
                  <button
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {t('layout.uploadLogo')}
                  </button>
                </>
              ) : null}
              <Link
                to="/admin/login"
                className="block px-4 py-2.5 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {token ? t('layout.sessionAdmin') : t('layout.enterAdmin')}
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
