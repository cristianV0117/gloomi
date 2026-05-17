import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

export function AdminLogin() {
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
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
    }
  }

  return (
    <div className="mx-auto w-full max-w-md py-12">
      <h1 className="font-display mb-2 text-center text-2xl tracking-wide">
        Admin Gloomi
      </h1>
      <p className="mb-8 text-center text-sm text-zinc-500">
        Inicia sesión para crear productos en la tienda.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6"
      >
        {error ? (
          <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}
        <div>
          <label htmlFor="admin-email" className="mb-1 block text-xs text-zinc-500">
            Correo
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[color:var(--color-gloom-violet)]"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="mb-1 block text-xs text-zinc-500">
            Contraseña
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[color:var(--color-gloom-violet)]"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-600">
        <Link to="/" className="text-zinc-500 hover:text-zinc-300">
          ← Volver al sitio
        </Link>
      </p>
    </div>
  )
}
