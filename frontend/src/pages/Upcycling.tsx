export function Upcycling() {
  return (
    <div className="w-full pb-14 pt-8 text-left">
      <h1 className="font-display mb-8 text-center text-2xl tracking-wide sm:text-3xl">
        Proceso Upcycling
      </h1>
      <p className="mx-auto mb-10 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
        Damos una segunda vida a prendas seleccionadas. De tela dormida en el armario a un compañero
        con alma nueva.
      </p>
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-2 lg:gap-12">
        <figure className="overflow-hidden rounded-2xl border border-zinc-800">
          <img
            src="https://picsum.photos/seed/upcycle-before/800/1000?grayscale"
            alt="Antes: prenda original"
            className="aspect-[4/5] w-full object-cover"
          />
          <figcaption className="border-t border-zinc-800 bg-zinc-950 px-3 py-2 text-center text-xs text-zinc-400">
            Antes
          </figcaption>
        </figure>
        <figure className="overflow-hidden rounded-2xl border border-zinc-800">
          <img
            src="https://picsum.photos/seed/upcycle-after/800/1000?grayscale"
            alt="Después: peluche terminado"
            className="aspect-[4/5] w-full object-cover"
          />
          <figcaption className="border-t border-zinc-800 bg-zinc-950 px-3 py-2 text-center text-xs text-zinc-400">
            Después
          </figcaption>
        </figure>
      </div>
      <div className="mx-auto max-w-3xl">
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Impacto sostenible
          </h2>
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
            Menos residuo textil encaminado al vertedero y más objetos queridos durante años — no
            temporadas.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Proceso artesanal
          </h2>
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
            Corte, relleno, detalle a detalle: fotografías del taller próximamente en esta página.
          </p>
        </section>
      </div>
    </div>
  )
}
