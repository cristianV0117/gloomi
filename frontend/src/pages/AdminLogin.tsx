import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

export function AdminLogin() {
  const { t } = useTranslation()
  const { login, loading, token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fromRaw = (location.state as { from?: string } | null)?.from
  const from =
    fromRaw && fromRaw.startsWith('/') && !fromRaw.startsWith('//')
      ? fromRaw
      : '/admin/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      navigate(from, { replace: true })
    }
  }, [token, from, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminLogin.error'))
    }
  }

  return (
    <div className="mx-auto w-full max-w-md py-12">
      <h1 className="font-display mb-2 text-center text-2xl tracking-wide">
        {t('adminLogin.title')}
      </h1>
      <p className="mb-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t('adminLogin.subtitle')}
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-zinc-200 bg-white/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/60"
      >
        {error ? (
          <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}
        <div>
          <label htmlFor="admin-email" className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
            {t('adminLogin.email')}
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
            {t('adminLogin.password')}
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t('adminLogin.submitLoading') : t('adminLogin.submit')}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-600 dark:text-zinc-500">
        <Link to="/" className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300">
          {t('adminLogin.back')}
        </Link>
      </p>
    </div>
  )
}
