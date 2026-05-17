import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'
import { resolveMediaUrl } from '../lib/api'
import { formatCop, formatUsd, getPrimaryImage } from '../lib/productUtils'
import type { Product } from '../data/products'

type Props = {
  slug: string
  name: string
  product: Pick<Product, 'images' | 'priceUsd' | 'priceCop'>
  showFavorite?: boolean
  compact?: boolean
  shopActions?: boolean
}

export function ProductCard({
  slug,
  name,
  product,
  showFavorite = true,
  compact = false,
  shopActions = false,
}: Props) {
  const { t } = useTranslation()
  const detailPath = `/tienda/${slug}`
  const img = getPrimaryImage(product)

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 dark:shadow-none ${compact ? 'min-w-[8.75rem] shrink-0 snap-start lg:min-w-0 lg:w-full lg:shrink lg:snap-none' : ''}`}
    >
      <Link to={detailPath} className="block">
        <div className="aspect-square bg-zinc-100 dark:bg-zinc-900">
          <img
            src={resolveMediaUrl(img)}
            alt=""
            width={400}
            height={400}
            className="h-full w-full object-cover transition duration-300 hover:brightness-110"
          />
        </div>
      </Link>

      <div className="flex flex-col gap-2 p-3 lg:p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 text-left">
            <Link to={detailPath}>
              <h3 className="truncate font-medium text-zinc-900 hover:text-zinc-950 dark:text-zinc-100 dark:hover:text-white">
                {name}
              </h3>
            </Link>
            {!compact && (
              <div className="mt-0.5 space-y-0.5 text-sm tabular-nums text-zinc-600 dark:text-zinc-400">
                <p>{formatUsd(product.priceUsd)}</p>
                <p className="text-xs text-zinc-500">{formatCop(product.priceCop)}</p>
              </div>
            )}
          </div>
          {compact && (
            <div className="shrink-0 text-right text-sm tabular-nums text-zinc-600 dark:text-zinc-400">
              <p>{formatUsd(product.priceUsd)}</p>
              <p className="text-[11px] text-zinc-500">{formatCop(product.priceCop)}</p>
            </div>
          )}
        </div>

        {shopActions && !compact && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to={detailPath}
              className="flex flex-1 items-center justify-center rounded-xl border border-zinc-300 bg-transparent px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-zinc-700 transition hover:border-zinc-500 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:border-zinc-400 dark:hover:bg-zinc-900/80"
            >
              {t('productCard.story')}
            </Link>
            <Link
              to={`${detailPath}#adoptar`}
              className="flex flex-1 items-center justify-center rounded-xl px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.12)] transition hover:brightness-110"
              style={{
                background:
                  'linear-gradient(145deg, rgb(139 92 246 / 0.95), rgb(201 38 74 / 0.92))',
              }}
            >
              {t('productCard.adopt')}
            </Link>
          </div>
        )}
      </div>

      {showFavorite && (
        <button
          type="button"
          className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-zinc-300 backdrop-blur hover:text-[color:var(--color-gloom-accent)]"
          aria-label={t('productCard.favoriteAria')}
        >
          <Heart className="h-4 w-4" />
        </button>
      )}
    </article>
  )
}
