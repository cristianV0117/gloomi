import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

type Props = {
  slug: string
  name: string
  price: number
  image: string
  showFavorite?: boolean
  compact?: boolean
  /** Catálogo tienda: botones Ver historia / Adoptar */
  shopActions?: boolean
}

export function ProductCard({
  slug,
  name,
  price,
  image,
  showFavorite = true,
  compact = false,
  shopActions = false,
}: Props) {
  const detailPath = `/tienda/${slug}`

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 ${compact ? 'min-w-[8.75rem] shrink-0 snap-start lg:min-w-0 lg:w-full lg:shrink lg:snap-none' : ''}`}
    >
      <Link to={detailPath} className="block">
        <div className="aspect-square bg-zinc-900">
          <img
            src={image}
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
              <h3 className="truncate font-medium text-zinc-100 hover:text-white">{name}</h3>
            </Link>
            {!compact && (
              <p className="text-sm tabular-nums text-zinc-400">${price.toFixed(2)}</p>
            )}
          </div>
          {compact && (
            <span className="shrink-0 text-sm tabular-nums text-zinc-400">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        {shopActions && !compact && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to={detailPath}
              className="flex flex-1 items-center justify-center rounded-xl border border-zinc-600 bg-transparent px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-zinc-200 transition hover:border-zinc-400 hover:bg-zinc-900/80"
            >
              Ver historia
            </Link>
            <Link
              to={`${detailPath}#adoptar`}
              className="flex flex-1 items-center justify-center rounded-xl px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.12)] transition hover:brightness-110"
              style={{
                background:
                  'linear-gradient(145deg, rgb(139 92 246 / 0.95), rgb(201 38 74 / 0.92))',
              }}
            >
              Adoptar
            </Link>
          </div>
        )}
      </div>

      {showFavorite && (
        <button
          type="button"
          className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-zinc-300 backdrop-blur hover:text-[color:var(--color-gloom-accent)]"
          aria-label="Favorito"
        >
          <Heart className="h-4 w-4" />
        </button>
      )}
    </article>
  )
}
