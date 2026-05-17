import { ChevronLeft, ChevronRight, Droplets, Feather, WashingMachine } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import type { Product } from '../data/products'
import { resolveMediaUrl } from '../lib/api'
import { formatCop, formatUsd } from '../lib/productUtils'
import { fetchProductBySlug } from '../lib/productsApi'

export function ProductDetail() {
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
            e instanceof Error ? e.message : 'No se pudo cargar el producto',
          )
          setProduct(null)
        }
      })
    return () => {
      cancelled = true
    }
  }, [slug])

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
      <div className="py-12 text-center text-sm text-zinc-500">
        Cargando…
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="py-12 text-center">
        <p className="mb-6 text-zinc-400">
          {error ?? 'Este Gloomi no existe (aún).'}
        </p>
        <div className="mx-auto max-w-xs">
          <Button onClick={() => navigate('/tienda')}>Ir a la tienda</Button>
        </div>
      </div>
    )
  }

  const editionLabel = `Gloomi No. ${String(product.editionNumber).padStart(2, '0')}`

  const cta = (
    <div id="adoptar">
      <div className="mb-1 text-center text-lg font-semibold tabular-nums text-zinc-100 lg:text-left lg:text-2xl">
        <p>{formatUsd(product.priceUsd)}</p>
        <p className="text-sm font-medium text-zinc-400">{formatCop(product.priceCop)}</p>
      </div>
      <Button variant="cta" className="mt-2 lg:max-w-none" onClick={handleAdoptarClick}>
        Adoptar
      </Button>
      <Link
        to="/tienda"
        className="mt-4 block text-center text-sm font-medium text-zinc-500 hover:text-zinc-200 lg:text-left"
      >
        ← Volver a la tienda
      </Link>
    </div>
  )

  return (
    <div className="w-full pb-40 pt-4 sm:pt-6 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,480px)] lg:items-start lg:gap-12 lg:pb-12 xl:gap-16">
      <div className="mb-6 lg:sticky lg:top-24 lg:mb-0">
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/40 ring-1 ring-[color:var(--color-gloom-violet-soft)]">
          <div className="relative aspect-square max-h-[min(90vw,44rem)] bg-zinc-900 lg:max-h-none">
            {activeSrc ? (
              <img
                src={activeSrc}
                alt=""
                width={800}
                height={800}
                className="h-full w-full object-cover contrast-[1.03]"
              />
            ) : null}
            {slides.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Imagen anterior"
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white backdrop-blur hover:bg-black/75"
                  onClick={() =>
                    setImgIndex((i) => (i - 1 + slides.length) % slides.length)
                  }
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Imagen siguiente"
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
                      aria-label={`Ver foto ${i + 1}`}
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
        <h1 className="font-display mb-6 text-center text-3xl font-semibold tracking-wide sm:text-4xl lg:text-left">
          {product.name}
        </h1>

        <section className="mb-8 text-left">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            La historia
          </h2>
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
            {product.story}
          </p>
        </section>

        <section className="mb-8 text-left lg:mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Material y origen
          </h2>
          <ul className="space-y-3 text-sm sm:text-base">
            <li className="flex gap-3 text-zinc-300">
              <Feather className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
              <span>{product.materials}</span>
            </li>
            <li className="flex gap-3 border-l-2 border-[color:var(--color-gloom-accent-soft)] pl-4 text-zinc-300">
              <span className="font-medium text-zinc-400">Prenda / upcycling:</span>
              <span>{product.sourceGarment}</span>
            </li>
            <li className="flex gap-3 text-zinc-300">
              <WashingMachine className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
              <span>{product.care}</span>
            </li>
            <li className="flex gap-3 text-zinc-300">
              <Droplets className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
              <span>Evita perfumes fuertes cerca del relleno.</span>
            </li>
          </ul>
        </section>

        <div className="hidden lg:block lg:max-w-md">{cta}</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-[#0a0a0b]/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <div className="mx-auto w-full max-w-7xl px-0 sm:px-2">{cta}</div>
      </div>
    </div>
  )
}
