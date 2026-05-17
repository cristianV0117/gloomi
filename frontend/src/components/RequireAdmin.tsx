import { Link, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const { token, isAdmin } = useAuth()
  const location = useLocation()

  if (!token) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    )
  }

  if (!isAdmin) {
    return (
      <div className="py-16 text-center">
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">{t('requireAdmin.title')}</p>
        <Link
          to="/admin/login"
          className="text-sm font-medium text-[color:var(--color-gloom-violet)] hover:underline"
        >
          {t('requireAdmin.login')}
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
