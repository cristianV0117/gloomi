import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { ProductCard } from '../components/ProductCard'
import { Button } from '../components/ui/Button'
import type {
  Product,
  ProductColor,
  ProductSize,
  ProductStyle,
} from '../data/products'
import { fetchProducts } from '../lib/productsApi'

const COLOR_OPTS: Array<ProductColor | 'Todos'> = [
  'Todos',
  'Negro',
  'Gris',
  'Hueso',
  'Morado',
]
const STYLE_OPTS: Array<ProductStyle | 'Todos'> = [
  'Todos',
  'Nocturno',
  'Vintage',
  'Glitter',
  'Minimal',
]
const SIZE_OPTS: Array<ProductSize | 'Todos'> = ['Todos', 'S', 'M', 'L']

function catalogOptionLabel(
  t: TFunction,
  filterKey: 'color' | 'style' | 'size',
  opt: string,
) {
  if (opt === 'Todos') return t('shop.all')
  const ns =
    filterKey === 'color'
      ? 'productColor'
      : filterKey === 'style'
        ? 'productStyle'
        : 'productSize'
  return t(`catalog.${ns}.${opt}`)
}

export function Shop() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [colorF, setColor] = useState<ProductColor | 'Todos'>('Todos')
  const [styleF, setStyle] = useState<ProductStyle | 'Todos'>('Todos')
  const [sizeF, setSize] = useState<ProductSize | 'Todos'>('Todos')
  const [visibleCount, setVisibleCount] = useState(8)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(data)
          setLoadError(null)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : t('shop.loadError'),
          )
          setProducts([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const okColor = colorF === 'Todos' || p.color === colorF
        const okStyle = styleF === 'Todos' || p.style === styleF
        const okSize = sizeF === 'Todos' || p.size === sizeF
        return okColor && okStyle && okSize
      }),
    [products, colorF, styleF, sizeF],
  )

  const list = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  )

  const FILTERS = [
    {
      key: 'color' as const,
      label: t('shop.labels.color'),
      value: colorF,
      options: COLOR_OPTS,
      set: (v: string) => setColor(v as ProductColor | 'Todos'),
    },
    {
      key: 'style' as const,
      label: t('shop.labels.style'),
      value: styleF,
      options: STYLE_OPTS,
      set: (v: string) => setStyle(v as ProductStyle | 'Todos'),
    },
    {
      key: 'size' as const,
      label: t('shop.labels.size'),
      value: sizeF,
      options: SIZE_OPTS,
      set: (v: string) => setSize(v as ProductSize | 'Todos'),
    },
  ] as const

  return (
    <div className="w-full pt-4 lg:pt-8">
      <p className="font-display mb-1 text-center text-[11px] uppercase tracking-[0.35em] text-zinc-600 dark:text-zinc-600">
        {t('shop.tagline')}
      </p>
      <h1 className="font-display mb-2 text-center text-2xl tracking-wide text-zinc-900 dark:text-zinc-100 sm:text-3xl">
        {t('shop.title')}
      </h1>
      <p className="mx-auto mb-8 max-w-lg text-center text-sm text-zinc-600 dark:text-zinc-500">
        {t('shop.subtitle')}
      </p>

      {loadError ? (
        <p className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {loadError}
        </p>
      ) : null}

      <div className="mb-8 flex flex-wrap gap-2 sm:gap-3">
        {FILTERS.map((f) => (
          <label
            key={f.key}
            className="relative inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-300 bg-white/90 px-3 py-2 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-300 sm:text-sm"
          >
            <span className="whitespace-nowrap">{f.label}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
            <select
              aria-label={t('shop.filterAria', { label: f.label })}
              className="absolute inset-0 cursor-pointer rounded-full opacity-0"
              value={f.value}
              disabled={loading}
              onChange={(e) => {
                f.set(e.target.value)
                setVisibleCount(8)
              }}
            >
              {f.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Todos'
                    ? t('shop.allOption', { label: f.label })
                    : catalogOptionLabel(t, f.key, opt)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {loading ? (
        <p className="rounded-2xl border border-zinc-200 bg-white/70 py-12 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-500">
          {t('shop.loading')}
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-zinc-200 bg-white/70 py-12 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-500">
          {t('shop.empty')}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 xl:gap-8">
          {list.map((p) => (
            <ProductCard
              key={p.slug}
              slug={p.slug}
              name={p.name}
              product={p}
              showFavorite={false}
              shopActions
            />
          ))}
        </div>
      )}

      <div className="mx-auto mt-10 max-w-md pb-8 pt-2 lg:mt-12 lg:max-w-sm">
        <Button
          variant="outline"
          disabled={
            loading || visibleCount >= filtered.length || filtered.length === 0
          }
          onClick={() =>
            setVisibleCount((n) => Math.min(n + 4, filtered.length))
          }
        >
          {t('shop.loadMore')}
        </Button>
      </div>
    </div>
  )
}
