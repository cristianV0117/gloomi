import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { WelcomeGloomiWave } from '../components/WelcomeGloomiWave'
import { resolveMediaUrl } from '../lib/api'
import type { Product } from '../data/products'
import { fetchHomePublic } from '../lib/homeApi'

const fallbackHero =
  'https://picsum.photos/seed/gloomi-hero-editorial/1400/900?grayscale'

const WELCOME_STORAGE_KEY = 'gloomi-home-welcome-v1'

export function Home() {
  const { t } = useTranslation()
  const [heroUrl, setHeroUrl] = useState<string | null>(null)
  const [featured, setFeatured] = useState<(Product | null)[]>([])
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      return !localStorage.getItem(WELCOME_STORAGE_KEY)
    } catch {
      return true
    }
  })

  /** Si cierran el modal en otra pestaña, ocultar aquí también. */
  useEffect(() => {
    function onStorage(ev: StorageEvent) {
      if (ev.key === WELCOME_STORAGE_KEY && ev.newValue) {
        setShowWelcome(false)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchHomePublic()
      .then((data) => {
        if (!cancelled) {
          setHeroUrl(
            data.heroImageUrl ? resolveMediaUrl(data.heroImageUrl) : null,
          )
          setFeatured(data.featuredProducts)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHeroUrl(null)
          setFeatured([])
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const heroBg = heroUrl || fallbackHero

  function dismissWelcome() {
    try {
      localStorage.setItem(WELCOME_STORAGE_KEY, '1')
    } catch {
      /* ignore quota / private mode */
    }
    setShowWelcome(false)
  }

  return (
    <div className="w-full">
      {showWelcome ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gloomi-welcome-title"
        >
          <div className="gloomi-welcome-card relative max-w-md rounded-3xl border border-zinc-200 bg-white/95 p-8 shadow-xl dark:border-zinc-700/80 dark:bg-[#0c0c0e]/95 dark:shadow-[0_0_0_1px_rgb(255_255_255_/_0.06),0_24px_80px_rgb(0_0_0_/_0.65)]">
            <WelcomeGloomiWave className="mb-5" aria-hidden />
            <p className="font-display mb-2 text-center text-[11px] uppercase tracking-[0.38em] text-[color:var(--color-gloom-violet)]">
              {t('home.welcomeBrand')}
            </p>
            <h2
              id="gloomi-welcome-title"
              className="font-display mb-3 text-center text-2xl font-semibold tracking-wide text-zinc-900 dark:bg-gradient-to-r dark:from-white dark:via-zinc-100 dark:to-[color:var(--color-gloom-violet)] dark:bg-clip-text dark:text-transparent sm:text-3xl"
            >
              {t('home.welcomeTitle')}
            </h2>
            <p className="mb-8 text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t('home.welcomeBody')}
            </p>
            <button
              type="button"
              onClick={dismissWelcome}
              className="w-full rounded-2xl px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.14)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-gloom-violet)]"
              style={{
                background:
                  'linear-gradient(155deg, rgb(139 92 246 / 0.95), rgb(201 38 74 / 0.88))',
              }}
            >
              {t('home.welcomeEnter')}
            </button>
          </div>
        </div>
      ) : null}

      <section className="relative pb-10 pt-2 lg:grid lg:grid-cols-[minmax(260px,1.1fr)_minmax(260px,0.95fr)] lg:items-center lg:gap-10 xl:gap-14">
        <div className="relative min-h-[18rem] overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 sm:min-h-[22rem] lg:aspect-square lg:min-h-[min(520px,calc(100vh-10rem))]">
          <img
            src={heroBg}
            alt=""
            width={1400}
            height={900}
            className="absolute inset-0 h-full w-full object-cover brightness-[0.38] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20 lg:bg-gradient-to-r lg:from-black/50 lg:via-transparent lg:to-transparent" />
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 text-[10px] uppercase tracking-[0.35em] text-zinc-600 dark:text-zinc-500 lg:bottom-8 lg:left-8">
            {t('home.heroBadge')}
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-center text-left lg:mt-0">
          <p className="font-display mb-2 bg-gradient-to-r from-zinc-900 via-zinc-800 to-[color:var(--color-gloom-violet)] bg-clip-text text-2xl font-semibold tracking-wide text-transparent dark:from-white dark:via-zinc-100 sm:text-3xl xl:text-[2rem]">
            {t('home.heroTitle')}
          </p>
          <p className="mb-8 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-base">
            {t('home.heroSubtitle')}
          </p>
          <Link
            to="/tienda"
            className="inline-flex w-full max-w-xs items-center justify-center rounded-2xl px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.14)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-gloom-violet)] lg:w-auto"
            style={{
              background:
                'linear-gradient(155deg, rgb(139 92 246 / 0.95), rgb(201 38 74 / 0.88))',
            }}
          >
            {t('home.heroCta')}
          </Link>
        </div>
      </section>

      <section className="pb-10 pt-6 lg:pt-10">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-xl tracking-wide text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            {t('home.featuredTitle')}
          </h2>
          <Link
            to="/tienda"
            className="text-xs font-medium uppercase tracking-wider text-zinc-600 hover:text-[color:var(--color-gloom-accent)] dark:text-zinc-500"
          >
            {t('home.featuredSeeAll')}
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible xl:gap-8 [&::-webkit-scrollbar]:hidden">
          {featured.length === 0
            ? [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-64 min-w-[220px] animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-900 lg:min-w-0"
                />
              ))
            : featured.map((p, i) =>
                p ? (
                  <ProductCard
                    key={p.slug}
                    slug={p.slug}
                    name={p.name}
                    product={p}
                    compact
                  />
                ) : (
                  <div
                    key={`empty-${i}`}
                    className="flex h-64 min-w-[220px] items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-600 lg:min-w-0"
                  >
                    {t('home.featuredSlotEmpty')}
                  </div>
                ),
              )}
        </div>
      </section>

      <section className="pb-6 lg:pb-10">
        <h2 className="font-display mb-5 text-center text-xl tracking-wide text-zinc-900 dark:text-zinc-100 sm:text-2xl">
          {t('home.communityPreviewTitle')}
        </h2>
        <div className="rounded-3xl border border-zinc-200 bg-white/70 px-5 py-6 dark:border-zinc-800 dark:bg-zinc-950/60 sm:px-8 lg:px-12">
          <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t('home.communityPreviewBody')}
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              to="/personalizar"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:border-[color:var(--color-gloom-violet)] hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-white"
            >
              <Plus className="h-4 w-4" aria-hidden />
              {t('home.communityCustomize')}
            </Link>
            <Link
              to="/comunidad"
              className="text-sm text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              {t('home.communityGo')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
