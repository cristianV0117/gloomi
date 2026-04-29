import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { ProductCard } from '../components/ProductCard'
import { products } from '../data/products'

/** Editorial / dramático: plush oscuro, alto contraste */
const heroBg =
  'https://picsum.photos/seed/gloomi-hero-editorial/1400/900?grayscale'

export function Home() {
  const featured = products.slice(0, 3)

  return (
    <div className="w-full">
      <section className="relative pb-10 pt-2 lg:grid lg:grid-cols-[minmax(260px,1.1fr)_minmax(260px,0.95fr)] lg:items-center lg:gap-10 xl:gap-14">
        <div className="relative min-h-[18rem] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 sm:min-h-[22rem] lg:aspect-square lg:min-h-[min(520px,calc(100vh-10rem))]">
          <img
            src={heroBg}
            alt=""
            width={1400}
            height={900}
            className="absolute inset-0 h-full w-full object-cover brightness-[0.38] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20 lg:bg-gradient-to-r lg:from-black/50 lg:via-transparent lg:to-transparent" />
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 text-[10px] uppercase tracking-[0.35em] text-zinc-500 lg:bottom-8 lg:left-8">
            Editorial · Peluche oscuro
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-center text-left lg:mt-0">
          <p className="font-display mb-2 bg-gradient-to-r from-white via-zinc-100 to-[color:var(--color-gloom-violet)] bg-clip-text text-2xl font-semibold tracking-wide text-transparent sm:text-3xl xl:text-[2rem]">
            Adopta tu Gloomi
          </p>
          <p className="mb-8 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            Impacto y cariño: piezas con historia, materiales conscientes y estética dramática.
          </p>
          <Link
            to="/tienda"
            className="inline-flex w-full max-w-xs items-center justify-center rounded-2xl px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.14)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-gloom-violet)] lg:w-auto"
            style={{
              background:
                'linear-gradient(155deg, rgb(139 92 246 / 0.95), rgb(201 38 74 / 0.88))',
            }}
          >
            Adoptar ahora
          </Link>
        </div>
      </section>

      <section className="pb-10 pt-6 lg:pt-10">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-xl tracking-wide text-zinc-100 sm:text-2xl">
            Destacados
          </h2>
          <Link
            to="/tienda"
            className="text-xs font-medium uppercase tracking-wider text-zinc-500 hover:text-[color:var(--color-gloom-accent)]"
          >
            Ver todos →
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible xl:gap-8 [&::-webkit-scrollbar]:hidden">
          {featured.map((p) => (
            <ProductCard
              key={p.slug}
              slug={p.slug}
              name={p.name}
              price={p.price}
              image={p.image}
              compact
            />
          ))}
        </div>
      </section>

      <section className="pb-6 lg:pb-10">
        <h2 className="font-display mb-5 text-center text-xl tracking-wide text-zinc-100 sm:text-2xl">
          Preview comunidad
        </h2>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 px-5 py-6 sm:px-8 lg:px-12">
          <div className="mb-5 flex flex-wrap justify-center gap-3 sm:gap-4 lg:justify-center lg:gap-5">
            {['a', 'b', 'c', 'd', 'e'].map((seed) => (
              <span
                key={seed}
                className="h-12 w-12 overflow-hidden rounded-full border border-zinc-700 ring-1 ring-[color:var(--color-gloom-violet-soft)] sm:h-14 sm:w-14"
              >
                <img
                  src={`https://picsum.photos/seed/cm-${seed}/128/128?grayscale`}
                  alt=""
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </span>
            ))}
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-zinc-600 text-zinc-500 hover:border-[color:var(--color-gloom-accent)] hover:text-zinc-200 sm:h-14 sm:w-14"
              aria-label="Unirse a la comunidad"
            >
              <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          <p className="font-display text-center text-sm tracking-[0.2em] text-zinc-400 sm:text-base">
            <span className="text-[color:var(--color-gloom-accent)]">#AdoptaTuGloomi</span>
            <span className="mx-2 text-zinc-600">·</span>
            <span className="text-zinc-500">#GloomiGang</span>
          </p>
        </div>
      </section>
    </div>
  )
}
