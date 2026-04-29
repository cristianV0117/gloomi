import { Button } from '../components/ui/Button'

export function Community() {
  const photos = Array.from({ length: 15 }, (_, i) => ({
    seed: `gloo-g-${i}`,
  }))

  return (
    <div className="w-full pt-6 lg:pt-10">
      <p className="mb-2 text-center text-xs uppercase tracking-[0.32em] text-[color:var(--color-gloom-accent)]">
        #AdoptaTuGloomi
      </p>
      <h1 className="font-display mx-auto mb-3 max-w-3xl text-center text-2xl leading-snug tracking-wide sm:text-3xl lg:mb-4">
        Galería comunitaria
      </h1>
      <p className="mx-auto mb-10 max-w-lg text-center text-sm text-zinc-500 lg:mb-12">
        Fotos de quienes ya adoptaron. Comparte el tuyo y suma tu historia.
      </p>

      <div className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6">
        {photos.map(({ seed }) => (
          <div
            key={seed}
            className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40 shadow-md ring-1 ring-[color:var(--color-gloom-violet-soft)]"
          >
            <img
              src={`https://picsum.photos/seed/${seed}/400/400?grayscale`}
              alt=""
              width={400}
              height={400}
              className="aspect-square w-full object-cover transition duration-300 hover:brightness-110"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-md pb-12 lg:max-w-sm">
        <Button variant="outline">Comparte el tuyo</Button>
      </div>
    </div>
  )
}
