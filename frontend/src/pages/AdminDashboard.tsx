import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import type { Product } from '../data/products'
import { resolveMediaUrl } from '../lib/api'
import {
  fetchHomeSettings,
  patchHomeSettings,
  uploadHeroImage,
  type HomeSettingsResponse,
} from '../lib/homeApi'
import { formatCop, formatUsd, getPrimaryImage } from '../lib/productUtils'
import { deleteProduct, fetchProducts } from '../lib/productsApi'

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<HomeSettingsResponse | null>(null)
  const [heroSource, setHeroSource] = useState<'custom' | 'product'>('product')
  const [heroProductSlug, setHeroProductSlug] = useState<string | null>(null)
  const [featuredSlugs, setFeaturedSlugs] = useState<[string, string, string]>([
    '',
    '',
    '',
  ])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [homeError, setHomeError] = useState<string | null>(null)
  const [homeSaving, setHomeSaving] = useState(false)
  const [heroUploading, setHeroUploading] = useState(false)
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  const applySettings = useCallback((s: HomeSettingsResponse) => {
    setSettings(s)
    setHeroSource(s.heroSource)
    setHeroProductSlug(s.heroProductSlug)
    setFeaturedSlugs([...s.featuredSlugs] as [string, string, string])
  }, [])

  const refresh = useCallback(async () => {
    setLoadError(null)
    try {
      const [plist, s] = await Promise.all([
        fetchProducts(),
        fetchHomeSettings(),
      ])
      setProducts(plist.sort((a, b) => a.name.localeCompare(b.name, 'es')))
      applySettings(s)
    } catch (e) {
      setLoadError(
        e instanceof Error ? e.message : 'No se pudo cargar el panel',
      )
    }
  }, [applySettings])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function saveHomeSettings() {
    setHomeError(null)
    setHomeSaving(true)
    try {
      const s = await patchHomeSettings({
        heroSource,
        heroProductSlug:
          heroSource === 'product' ? heroProductSlug?.trim() || null : null,
        featuredSlugs: featuredSlugs.map((x) => x.trim()) as [
          string,
          string,
          string,
        ],
      })
      applySettings(s)
    } catch (e) {
      setHomeError(
        e instanceof Error ? e.message : 'No se pudo guardar la portada',
      )
    } finally {
      setHomeSaving(false)
    }
  }

  async function onHeroFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0]
    ev.target.value = ''
    if (!file) return
    setHomeError(null)
    setHeroUploading(true)
    try {
      const s = await uploadHeroImage(file)
      applySettings(s)
      setHeroSource('custom')
    } catch (e) {
      setHomeError(
        e instanceof Error ? e.message : 'No se pudo subir la imagen hero',
      )
    } finally {
      setHeroUploading(false)
    }
  }

  async function clearCustomHero() {
    setHomeError(null)
    setHomeSaving(true)
    try {
      const s = await patchHomeSettings({
        clearCustomHero: true,
        heroSource: 'product',
      })
      applySettings(s)
      setHeroSource('product')
    } catch (e) {
      setHomeError(
        e instanceof Error ? e.message : 'No se pudo quitar el hero',
      )
    } finally {
      setHomeSaving(false)
    }
  }

  async function onDelete(slug: string, name: string) {
    if (
      !window.confirm(
        `¿Eliminar «${name}» (${slug})? Esta acción no se puede deshacer.`,
      )
    ) {
      return
    }
    setDeletingSlug(slug)
    setLoadError(null)
    try {
      await deleteProduct(slug)
      await refresh()
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'No se pudo eliminar')
    } finally {
      setDeletingSlug(null)
    }
  }

  const heroPreviewUrl = settings?.heroCustomRelativeUrl
    ? resolveMediaUrl(settings.heroCustomRelativeUrl)
    : ''

  const productOptions = products.map((p) => (
    <option key={p.slug} value={p.slug}>
      {p.name} ({p.slug})
    </option>
  ))

  if (loadError && !settings) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {loadError}
        </p>
        <Button type="button" className="mt-4" onClick={() => void refresh()}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display mb-1 text-[11px] uppercase tracking-[0.35em] text-zinc-600 dark:text-zinc-500">
            Panel
          </p>
          <h1 className="font-display text-2xl tracking-wide text-zinc-900 dark:text-zinc-100">
            Dashboard Gloomi
          </h1>
        </div>
        <Link
          to="/admin/gloomis/nuevo"
          className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-200 dark:shadow-none dark:hover:bg-zinc-900"
        >
          Nuevo Gloomi
        </Link>
      </div>

      <section className="mb-10 rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 dark:shadow-none">
        <h2 className="font-display mb-4 text-lg tracking-wide text-zinc-900 dark:text-zinc-100">
          Portada (inicio)
        </h2>

        {homeError ? (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {homeError}
          </p>
        ) : null}

        <div className="mb-6 space-y-3">
          <span className="block text-xs text-zinc-600 dark:text-zinc-500">Imagen principal</span>
          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
              <input
                type="radio"
                name="heroSource"
                checked={heroSource === 'product'}
                onChange={() => setHeroSource('product')}
              />
              Primera foto de un producto
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
              <input
                type="radio"
                name="heroSource"
                checked={heroSource === 'custom'}
                onChange={() => setHeroSource('custom')}
              />
              Imagen subida (custom)
            </label>
          </div>

          {heroSource === 'product' ? (
            <div>
              <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="hero-product">
                Producto para el hero
              </label>
              <select
                id="hero-product"
                value={heroProductSlug ?? ''}
                onChange={(ev) =>
                  setHeroProductSlug(ev.target.value || null)
                }
                className="w-full max-w-md rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                <option value="">— Elige —</option>
                {productOptions}
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              {heroPreviewUrl ? (
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                  <img
                    src={heroPreviewUrl}
                    alt="Hero actual"
                    className="max-h-48 w-full object-cover opacity-90"
                  />
                </div>
              ) : (
                <p className="text-sm text-zinc-600 dark:text-zinc-500">
                  Aún no hay imagen personalizada. Sube una abajo.
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-400 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 transition hover:border-[color:var(--color-gloom-violet)] dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-300">
                  {heroUploading ? 'Subiendo…' : 'Subir imagen hero'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    disabled={heroUploading}
                    onChange={(ev) => void onHeroFile(ev)}
                  />
                </label>
                {settings?.heroCustomRelativeUrl ? (
                  <button
                    type="button"
                    onClick={() => void clearCustomHero()}
                    disabled={homeSaving}
                    className="text-sm text-zinc-600 underline-offset-2 hover:text-red-600 hover:underline disabled:opacity-50 dark:text-zinc-500 dark:hover:text-red-300"
                  >
                    Quitar imagen custom y usar producto
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <span className="mb-2 block text-xs text-zinc-600 dark:text-zinc-500">
            Tres destacados en la home (cada casilla puede quedar vacía)
          </span>
          <div className="grid gap-3 sm:grid-cols-3">
            {([0, 1, 2] as const).map((i) => (
              <div key={i}>
                <label
                  className="mb-1 block text-[11px] text-zinc-600 dark:text-zinc-500"
                  htmlFor={`feat-${i}`}
                >
                  Slot {i + 1}
                </label>
                <select
                  id={`feat-${i}`}
                  value={featuredSlugs[i]}
                  onChange={(ev) => {
                    const next = [...featuredSlugs] as [string, string, string]
                    next[i] = ev.target.value
                    setFeaturedSlugs(next)
                  }}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="">— Vacío —</option>
                  {productOptions}
                </select>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="button"
          disabled={homeSaving}
          onClick={() => void saveHomeSettings()}
        >
          {homeSaving ? 'Guardando…' : 'Guardar portada'}
        </Button>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 dark:shadow-none">
        <h2 className="font-display mb-4 text-lg tracking-wide text-zinc-900 dark:text-zinc-100">
          Todos los Gloomis
        </h2>
        {loadError ? (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            {loadError}
          </p>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-600 dark:border-zinc-800 dark:text-zinc-500">
                <th className="pb-3 pr-4">Vista</th>
                <th className="pb-3 pr-4">Nombre</th>
                <th className="pb-3 pr-4">Slug</th>
                <th className="pb-3 pr-4">Precios</th>
                <th className="pb-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = getPrimaryImage(p)
                return (
                  <tr key={p.slug} className="border-b border-zinc-200 dark:border-zinc-800/80">
                    <td className="py-3 pr-4">
                      <div className="h-12 w-12 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                        {img ? (
                          <img
                            src={resolveMediaUrl(img)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100">
                      {p.name}
                    </td>
                    <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-500">{p.slug}</td>
                    <td className="py-3 pr-4 text-zinc-700 dark:text-zinc-400">
                      {formatUsd(p.priceUsd)} · {formatCop(p.priceCop)}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/gloomis/${encodeURIComponent(p.slug)}/edit`}
                        className="mr-3 text-[color:var(--color-gloom-violet)] hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        disabled={deletingSlug === p.slug}
                        onClick={() => void onDelete(p.slug, p.name)}
                        className="text-red-600 hover:underline disabled:opacity-50 dark:text-red-400/90"
                      >
                        {deletingSlug === p.slug ? '…' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {products.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-500">
            No hay productos.{' '}
            <Link
              to="/admin/gloomis/nuevo"
              className="text-[color:var(--color-gloom-violet)] hover:underline"
            >
              Crear el primero
            </Link>
            .
          </p>
        ) : null}
      </section>
    </div>
  )
}
