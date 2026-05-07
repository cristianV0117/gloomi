export function About() {
  return (
    <div className="mx-auto w-full max-w-3xl pb-14 pt-8 text-left lg:max-w-4xl">
      <h1 className="font-display mb-8 text-center text-2xl tracking-wide">
        ¿Quiénes somos?
      </h1>
      <section className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Historia de la marca
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-300">
          Gloomi nace de la nostalgia gótica y el cariño por lo hecho a mano. Piezas únicas con
          personalidad, pensadas para quienes encuentran belleza en lo extraño.
        </p>
      </section>
      <section className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Colaboración
        </h2>
        <p className="text-sm leading-relaxed text-zinc-300">
          Trabajamos con artesanos y talleres locales. Próximamente: colecciones cápsula y drops
          limitados — aquí contaremos cada historia.
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Comunidad
        </h2>
        <p className="text-sm leading-relaxed text-zinc-300">
          Lo que tejes en casa importa tanto como lo que hacemos en el taller.
          Etiquétanos — el hashtag oficial es <span className="text-zinc-100">#GloomiGang</span>.
        </p>
      </section>
    </div>
  )
}
