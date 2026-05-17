import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ImagePlus, LogIn, LogOut, Menu, Search, ShoppingCart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  fetchBrandingLogoAbsolute,
  uploadBrandLogo,
} from '../lib/brandingApi'
import { resolveMediaUrl } from '../lib/api'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/tienda', label: 'Adopta', matchPrefix: '/tienda' as const },
  { to: '/personalizar', label: 'Personaliza' },
  { to: '/comunidad', label: 'Comunidad' },
  { to: '/quienes-somos', label: 'Quiénes somos' },
  { to: '/upcycling', label: 'Upcycling' },
  { to: '/contacto', label: 'Contacto' },
] as const

function linkActive(pathname: string, to: string, matchPrefix?: string): boolean {
  if (matchPrefix) return pathname === to || pathname.startsWith(`${matchPrefix}/`)
  return pathname === to
}

export function Header() {
  const location = useLocation()
  const { token, isAdmin, logout } = useAuth()
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
    <header className="sticky top-0 z-50 border-b border-[rgb(201_38_74_/0.22)] bg-[rgb(7_7_8_/0.85)] shadow-[0_12px_40px_-12px_rgb(120_18_38_/0.35)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8 xl:max-w-[90rem] xl:px-10">
        <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className="font-display flex min-w-0 items-center gap-2 text-base font-semibold tracking-[0.2em] text-zinc-100 sm:text-lg"
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
                className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-[color:var(--color-gloom-violet)]"
                aria-label="Subir logo de marca"
                title="Subir logo de marca"
              >
                <ImagePlus className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" />
              </button>
            </>
          ) : null}
        </div>

        <nav className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-6 xl:gap-8" aria-label="Principal">
          {links.map((item) => {
            const active = linkActive(
              location.pathname,
              item.to,
              'matchPrefix' in item ? item.matchPrefix : undefined,
            )
            return (
              <Link
                key={`${item.to}-${item.label}`}
                to={item.to}
                className={`whitespace-nowrap text-sm transition hover:text-white ${active ? 'font-medium text-white' : 'text-zinc-500'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
          {isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="hidden whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-500 hover:text-[color:var(--color-gloom-violet)] sm:block"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/mensajes"
                className="hidden whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-500 hover:text-[color:var(--color-gloom-violet)] md:block"
              >
                Mensajes
              </Link>
              <Link
                to="/admin/personalizaciones"
                className="hidden whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-500 hover:text-[color:var(--color-gloom-violet)] md:block"
              >
                Diseños
              </Link>
              <Link
                to="/admin/gloomis/nuevo"
                className="hidden whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-500 hover:text-[color:var(--color-gloom-violet)] sm:block"
              >
                Nuevo Gloomi
              </Link>
            </>
          ) : null}
          {token ? (
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" />
            </button>
          ) : (
            <Link
              to="/admin/login"
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              aria-label="Iniciar sesión admin"
              title="Admin"
            >
              <LogIn className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" />
            </Link>
          )}
          <button
            type="button"
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Carrito"
          >
            <ShoppingCart className="h-5 w-5 sm:h-[1.375rem] sm:w-[1.375rem]" />
          </button>

          <details className="group relative lg:hidden">
            <summary className="list-none cursor-pointer rounded-lg p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white [&::-webkit-details-marker]:hidden">
              <Menu className="h-5 w-5" aria-hidden />
              <span className="sr-only">Abrir menú</span>
            </summary>
            <nav
              className="absolute right-0 top-full z-20 mt-1 max-h-[min(70vh,28rem)] w-[min(calc(100vw-2rem),16rem)] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 py-2 shadow-xl"
              onClick={(e) => {
                const el = e.currentTarget.closest('details')
                if (el && (e.target as HTMLElement).closest('a')) {
                  ;(el as HTMLDetailsElement).open = false
                }
              }}
            >
              {links.map((item) => {
                const active = linkActive(
                  location.pathname,
                  item.to,
                  'matchPrefix' in item ? item.matchPrefix : undefined,
                )
                return (
                  <Link
                    key={`m-${item.to}`}
                    to={item.to}
                    className={`block px-4 py-2.5 text-sm hover:bg-zinc-900 ${active ? 'font-medium text-white' : 'text-zinc-400'}`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              {isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2.5 text-sm text-[color:var(--color-gloom-violet)] hover:bg-zinc-900"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/mensajes"
                    className="block px-4 py-2.5 text-sm text-[color:var(--color-gloom-violet)] hover:bg-zinc-900"
                  >
                    Mensajes (contacto)
                  </Link>
                  <Link
                    to="/admin/personalizaciones"
                    className="block px-4 py-2.5 text-sm text-[color:var(--color-gloom-violet)] hover:bg-zinc-900"
                  >
                    Diseños personalizados
                  </Link>
                  <Link
                    to="/admin/gloomis/nuevo"
                    className="block px-4 py-2.5 text-sm text-[color:var(--color-gloom-violet)] hover:bg-zinc-900"
                  >
                    Nuevo Gloomi
                  </Link>
                  <button
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-sm text-zinc-400 hover:bg-zinc-900"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    Subir logo marca
                  </button>
                </>
              ) : null}
              <Link
                to="/admin/login"
                className="block px-4 py-2.5 text-sm text-zinc-500 hover:bg-zinc-900"
              >
                {token ? 'Sesión admin' : 'Entrar (admin)'}
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
