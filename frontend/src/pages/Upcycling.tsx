import { useTranslation } from 'react-i18next'

export function Upcycling() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto w-full max-w-3xl pb-14 pt-8">
      <h1 className="font-display mb-6 text-center text-2xl tracking-wide text-zinc-900 dark:text-zinc-100 sm:text-3xl">
        {t('upcycling.title')}
      </h1>
      <p className="mx-auto mb-10 max-w-xl text-center text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {t('upcycling.lead')}
      </p>

      <div className="mb-12 grid gap-6 sm:grid-cols-2">
        <figure className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/40">
          <img
            src="https://picsum.photos/seed/gloomi-before/600/420?grayscale"
            alt={t('upcycling.beforeAlt')}
            width={600}
            height={420}
            className="aspect-[10/7] w-full object-cover"
          />
          <figcaption className="px-3 py-2 text-center text-xs text-zinc-600 dark:text-zinc-400">
            {t('upcycling.beforeCap')}
          </figcaption>
        </figure>
        <figure className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/40">
          <img
            src="https://picsum.photos/seed/gloomi-after/600/420"
            alt={t('upcycling.afterAlt')}
            width={600}
            height={420}
            className="aspect-[10/7] w-full object-cover"
          />
          <figcaption className="px-3 py-2 text-center text-xs text-zinc-600 dark:text-zinc-400">
            {t('upcycling.afterCap')}
          </figcaption>
        </figure>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 font-display text-lg tracking-wide text-zinc-900 dark:text-zinc-100">
          {t('upcycling.impactTitle')}
        </h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {t('upcycling.impactBody')}
        </p>
      </section>
      <section>
        <h2 className="mb-3 font-display text-lg tracking-wide text-zinc-900 dark:text-zinc-100">
          {t('upcycling.atelierTitle')}
        </h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {t('upcycling.atelierBody')}
        </p>
      </section>
    </div>
  )
}
