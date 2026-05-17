import { ChevronLeft, ChevronRight, Droplets, Feather, WashingMachine } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import type { Product } from '../data/products'
import { resolveMediaUrl } from '../lib/api'
import { formatCop, formatUsd } from '../lib/productUtils'
import { fetchProductBySlug } from '../lib/productsApi'

function ProductImageLens({
  src,
  alt,
}: {
  src: string
  alt: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })
  const [finePointer, setFinePointer] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    function upd() {
      setFinePointer(mq.matches)
    }
    upd()
    mq.addEventListener('change', upd)
    return () => mq.removeEventListener('change', upd)
  }, [])

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const w = r.width || 1
    const h = r.height || 1
    const x = ((e.clientX - r.left) / w) * 100
    const y = ((e.clientY - r.top) / h) * 100
    setOrigin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    })
  }

  const zoomOn = finePointer && hover
  const scale = zoomOn ? 1.62 : 1

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false)
        setOrigin({ x: 50, y: 50 })
      }}
      onMouseMove={onMove}
    >
      <img
        src={src}
        alt={alt}
        width={800}
        height={800}
        draggable={false}
        className="h-full w-full object-cover contrast-[1.03] will-change-transform"
        style={{
          transformOrigin: `${origin.x}% ${origin.y}%`,
          transform: `scale(${scale})`,
          transition: zoomOn
            ? 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), filter 220ms ease-out'
            : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 320ms ease-out',
          filter: zoomOn ? 'brightness(1.06) saturate(1.03)' : 'brightness(1)',
        }}
      />
    </div>
  )
}

export function ProductDetail() {
  const { t } = useTranslation()
  const instagramProfileUrl = 'https://www.instagram.com/gl0omi__/'
  const instagramDirectUrl = 'https://ig.me/m/gl0omi__'
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    if (!slug) {
      setProduct(null)
      return
    }
    let cancelled = false
    setProduct(undefined)
    setError(null)
    setImgIndex(0)
    fetchProductBySlug(slug)
      .then((p) => {
        if (!cancelled) setProduct(p)
      })
      .catch((e) => {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : t('product.loadError'),
          )
          setProduct(null)
        }
      })
    return () => {
      cancelled = true
    }
  }, [slug, t])

  useEffect(() => {
    setImgIndex(0)
  }, [product?.slug])

  const slides = product?.images?.length ? product.images : []
  const activeSrc =
    slides.length > 0
      ? resolveMediaUrl(slides[Math.min(imgIndex, slides.length - 1)])
      : ''

  function handleAdoptarClick() {
    const opened = window.open(instagramDirectUrl, '_blank', 'noopener,noreferrer')
    if (!opened) {
      window.location.assign(instagramProfileUrl)
    }
  }

  if (product === undefined) {
    return (
      <div className="py-12 text-center text-sm text-zinc-600 dark:text-zinc-500">
        {t('product.loading')}
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="py-12 text-center">
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          {error ?? t('product.notFound')}
        </p>
        <div className="mx-auto max-w-xs">
          <Button onClick={() => navigate('/tienda')}>{t('product.shopButton')}</Button>
        </div>
      </div>
    )
  }

  const editionLabel = t('product.edition', {
    n: String(product.editionNumber).padStart(2, '0'),
  })

  const cta = (
    <div id="adoptar">
      <div className="mb-1 text-center text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 lg:text-left lg:text-2xl">
        <p>{formatUsd(product.priceUsd)}</p>
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{formatCop(product.priceCop)}</p>
      </div>
      <Button variant="cta" className="mt-2 lg:max-w-none" onClick={handleAdoptarClick}>
        {t('product.adopt')}
      </Button>
      <Link
        to="/tienda"
        className="mt-4 block text-center text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 lg:text-left"
      >
        {t('product.shopLink')}
      </Link>
    </div>
  )

  return (
    <div className="w-full pb-40 pt-4 sm:pt-6 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,480px)] lg:items-start lg:gap-12 lg:pb-12 xl:gap-16">
      <div className="mb-6 lg:sticky lg:top-24 lg:mb-0">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/70 ring-1 ring-[color:var(--color-gloom-violet-soft)] dark:border-zinc-800 dark:bg-zinc-950/40">
          <div className="relative aspect-square max-h-[min(90vw,44rem)] bg-zinc-100 dark:bg-zinc-900 lg:max-h-none">
            {activeSrc ? (
              <ProductImageLens
                key={`${product.slug}-${imgIndex}`}
                src={activeSrc}
                alt={product.name}
              />
            ) : null}
            {slides.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label={t('product.prevImg')}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white backdrop-blur hover:bg-black/75"
                  onClick={() =>
                    setImgIndex((i) => (i - 1 + slides.length) % slides.length)
                  }
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label={t('product.nextImg')}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white backdrop-blur hover:bg-black/75"
                  onClick={() => setImgIndex((i) => (i + 1) % slides.length)}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={t('product.dotAria', { n: i + 1 })}
                      className={`h-2 w-2 rounded-full transition ${i === imgIndex ? 'bg-white' : 'bg-white/35 hover:bg-white/55'}`}
                      onClick={() => setImgIndex(i)}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <p className="mb-1 text-center text-xs uppercase tracking-[0.28em] text-[color:var(--color-gloom-violet)] lg:text-left">
          {editionLabel}
        </p>
        <h1 className="font-display mb-6 text-center text-3xl font-semibold tracking-wide text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-left">
          {product.name}
        </h1>

        <section className="mb-8 text-left">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-500">
            {t('product.storyHeading')}
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
            {product.story}
          </p>
        </section>

        <section className="mb-8 text-left lg:mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-500">
            {t('product.materialHeading')}
          </h2>
          <ul className="space-y-3 text-sm sm:text-base">
            <li className="flex gap-3 text-zinc-700 dark:text-zinc-300">
              <Feather className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
              <span>{product.materials}</span>
            </li>
            <li className="flex gap-3 border-l-2 border-[color:var(--color-gloom-accent-soft)] pl-4 text-zinc-700 dark:text-zinc-300">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">{t('product.garmentLabel')}</span>
              <span>{product.sourceGarment}</span>
            </li>
            <li className="flex gap-3 text-zinc-700 dark:text-zinc-300">
              <WashingMachine className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
              <span>{product.care}</span>
            </li>
            <li className="flex gap-3 text-zinc-700 dark:text-zinc-300">
              <Droplets className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
              <span>{t('product.perfumeHint')}</span>
            </li>
          </ul>
        </section>

        <div className="hidden lg:block lg:max-w-md">{cta}</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md dark:border-zinc-800 dark:bg-[#0a0a0b]/95 lg:hidden">
        <div className="mx-auto w-full max-w-7xl px-0 sm:px-2">{cta}</div>
      </div>
    </div>
  )
}
