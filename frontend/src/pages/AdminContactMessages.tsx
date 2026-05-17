import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ContactMessageRow } from '../lib/inquiriesApi'
import { fetchContactMessages } from '../lib/inquiriesApi'

function formatWhen(iso?: string) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export function AdminContactMessages() {
  const [rows, setRows] = useState<ContactMessageRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await fetchContactMessages()
      setRows(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar los mensajes')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display mb-1 text-[11px] uppercase tracking-[0.35em] text-zinc-600 dark:text-zinc-500">
            Panel
          </p>
          <h1 className="font-display text-2xl tracking-wide text-zinc-900 dark:text-zinc-100">
            Mensajes de contacto
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-500">
            Formulario «Contáctanos»: correos y mensajes que envían desde la web.
          </p>
        </div>
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-200 dark:shadow-none dark:hover:bg-zinc-900"
        >
          Volver al dashboard
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-500">Cargando…</p>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
          <button
            type="button"
            onClick={() => void load()}
            className="mt-3 block text-[color:var(--color-gloom-violet)] underline"
          >
            Reintentar
          </button>
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-500">Aún no hay mensajes.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((m) => (
            <li
              key={m.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 dark:shadow-none"
            >
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-500">
                <span>{formatWhen(m.createdAt)}</span>
                <span className="font-mono text-zinc-500 dark:text-zinc-600">{m.id}</span>
              </div>
              <p className="mb-1 text-zinc-900 dark:text-zinc-100">
                <span className="text-zinc-800 dark:text-zinc-300">{m.email}</span>
                {m.name ? (
                  <>
                    {' '}
                    <span className="text-zinc-600 dark:text-zinc-400">· {m.name}</span>
                  </>
                ) : null}
              </p>
              {m.subject ? (
                <p className="mb-2 font-medium text-zinc-900 dark:text-zinc-200">{m.subject}</p>
              ) : null}
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-400">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
