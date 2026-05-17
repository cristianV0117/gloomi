import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/Button'

export function Community() {
  const { t } = useTranslation()
  const photos = Array.from({ length: 15 }, (_, i) => ({
    seed: `gloo-g-${i}`,
  }))

  return (
    <div className="w-full pt-6 lg:pt-10">
      <p className="mb-2 text-center text-xs uppercase tracking-[0.32em] text-[color:var(--color-gloom-accent)]">
        {t('community.hashtag')}
      </p>
      <h1 className="font-display mx-auto mb-3 max-w-3xl text-center text-2xl leading-snug tracking-wide text-zinc-900 dark:text-zinc-100 sm:text-3xl lg:mb-4">
        {t('community.title')}
      </h1>
      <p className="mx-auto mb-10 max-w-lg text-center text-sm text-zinc-600 dark:text-zinc-500 lg:mb-12">
        {t('community.subtitle')}
      </p>

      <div className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6">
        {photos.map(({ seed }) => (
          <div
            key={seed}
            className="overflow-hidden rounded-lg border border-zinc-200 bg-white/50 shadow-md ring-1 ring-[color:var(--color-gloom-violet-soft)] dark:border-zinc-800 dark:bg-zinc-950/40"
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
        <Button variant="outline">{t('community.share')}</Button>
      </div>
    </div>
  )
}
