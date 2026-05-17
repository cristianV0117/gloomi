import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CustomizerReadonlyPreview } from '../features/gloomi-customizer/preview/CustomizerReadonlyPreview'
import { CREATURES, EYES } from '../features/gloomi-customizer/constants'
import { parseSavedGloomiConfig } from '../features/gloomi-customizer/savedConfig'
import {
  fetchGloomiCustomizationById,
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

export function AdminCustomizationViewer() {
  const { id: idParam } = useParams<{ id: string }>()
  const id = idParam ? decodeURIComponent(idParam) : ''

  const [row, setRow] = useState<GloomiCustomizationRow | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!id) {
      setError('Falta el id del diseño')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await fetchGloomiCustomizationById(id)
      setRow(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el diseño')
      setRow(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  const config = row?.config ? parseSavedGloomiConfig(row.config) : null
  const creatureLabel =
    config && CREATURES.find((c) => c.id === config.creatureId)?.label
  const eyeLabel = config && EYES.find((e) => e.id === config.eyeId)?.label

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center text-sm text-zinc-500">
        Cargando modelo…
      </div>
    )
  }

  if (error || !row) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error ?? 'No encontrado'}
        </p>
        <Link
          to="/admin/personalizaciones"
          className="mt-4 inline-block text-sm text-[color:var(--color-gloom-violet)] hover:underline"
        >
          Volver al listado
        </Link>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <p className="text-sm text-zinc-400">
          El diseño está guardado pero la configuración no es válida o está incompleta.
        </p>
        <Link
          to="/admin/personalizaciones"
          className="mt-4 inline-block text-sm text-[color:var(--color-gloom-violet)] hover:underline"
        >
          Volver al listado
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display mb-1 text-[11px] uppercase tracking-[0.35em] text-zinc-600">
            Solo visualización
          </p>
          <h1 className="font-display text-2xl tracking-wide">
            Diseño guardado
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-600">{row.id}</p>
          <p className="mt-2 text-sm text-zinc-500">{formatWhen(row.createdAt)}</p>
        </div>
        <Link
          to="/admin/personalizaciones"
          className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900"
        >
          ← Listado
        </Link>
      </div>

      <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 text-sm">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-zinc-600">Nombre</dt>
            <dd className="text-zinc-200">{row.name || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-600">Correo</dt>
            <dd className="text-zinc-200">{row.email || '—'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-zinc-600">Nota</dt>
            <dd className="whitespace-pre-wrap text-zinc-300">{row.note || '—'}</dd>
          </div>
        </dl>
        <div className="mt-4 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
          <p>
            <span className="text-zinc-600">Criatura:</span>{' '}
            {creatureLabel ?? config.creatureId} ·{' '}
            <span className="text-zinc-600">Ojos:</span> {eyeLabel ?? config.eyeId}
            {' · '}
            <span className="text-zinc-600">Telas:</span> cabeza {config.fabricByZone.head},
            cuerpo {config.fabricByZone.body}, extremidades {config.fabricByZone.limbs}
            {' · '}
            <span className="text-zinc-600">Sombrero / dije / alas / cola:</span>{' '}
            {config.hatId}, {config.charmId}, {config.wingKind},{' '}
            {config.tailAccentKind}
          </p>
        </div>
      </div>

      <CustomizerReadonlyPreview config={config} />
    </div>
  )
}
