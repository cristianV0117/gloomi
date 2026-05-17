import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-display mb-4 text-5xl tracking-widest text-zinc-500 dark:text-zinc-600">
        404
      </p>
      <h1 className="mb-4 text-xl text-zinc-800 dark:text-zinc-200">{t('notFound.title')}</h1>
      <p className="mb-8 max-w-[28ch] text-sm text-zinc-600 dark:text-zinc-500">
        {t('notFound.body')}
      </p>
      <Link
        to="/"
        className="inline-flex w-full max-w-xs items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-gloom-violet)] dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
      >
        {t('notFound.linkHome')}
      </Link>
      <Link
        to="/tienda"
        className="mt-4 block text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200"
      >
        {t('notFound.linkShop')}
      </Link>
    </div>
  )
}
