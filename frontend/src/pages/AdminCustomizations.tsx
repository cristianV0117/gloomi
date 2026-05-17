import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchGloomiCustomizations,
  type GloomiCustomizationRow,
} from '../lib/inquiriesApi'

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

export function AdminCustomizations() {
  const [rows, setRows] = useState<GloomiCustomizationRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await fetchGloomiCustomizations()
      setRows(data)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'No se pudieron cargar los diseños',
      )
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
            Diseños personalizados
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-500">
            Lo que la gente guardó desde «Personaliza»: mismo modelo en 3D y vector (solo
            visualización en el detalle).
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
        <p className="text-sm text-zinc-600 dark:text-zinc-500">Aún no hay diseños guardados.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-transparent dark:shadow-none">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wider text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-500">
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Nota</th>
                <th className="px-4 py-3 text-right">Vista</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-zinc-200 dark:border-zinc-800/80">
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-500">
                    {formatWhen(r.createdAt)}
                  </td>
                  <td className="max-w-[12rem] px-4 py-3">
                    <span className="block truncate text-zinc-900 dark:text-zinc-200">
                      {r.name || '—'}
                    </span>
                    <span className="block truncate text-xs text-zinc-600 dark:text-zinc-500">
                      {r.email || '—'}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <span className="line-clamp-2 text-zinc-700 dark:text-zinc-400">{r.note || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/personalizaciones/${encodeURIComponent(r.id)}`}
                      className="text-[color:var(--color-gloom-violet)] hover:underline"
                    >
                      Ver 3D / vector
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
