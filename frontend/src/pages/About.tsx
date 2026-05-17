import { Trans, useTranslation } from 'react-i18next'

export function About() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto w-full max-w-3xl pb-14 pt-8 text-left lg:max-w-4xl">
      <h1 className="font-display mb-8 text-center text-2xl tracking-wide text-zinc-900 dark:text-zinc-100">
        {t('about.title')}
      </h1>
      <section className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-500">
          {t('about.brandStoryTitle')}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {t('about.p1')}
        </p>
      </section>
      <section className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-500">
          {t('about.collabTitle')}
        </h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {t('about.collabBody')}
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-500">
          {t('about.communityTitle')}
        </h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <Trans
            i18nKey="about.communityP"
            components={{
              tag: <span className="font-medium text-zinc-900 dark:text-zinc-100" />,
            }}
          />
        </p>
      </section>
    </div>
  )
}
