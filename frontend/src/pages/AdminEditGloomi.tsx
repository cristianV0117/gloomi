import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import type {
  ProductColor,
  ProductSize,
  ProductStyle,
} from '../data/products'
import { resolveMediaUrl } from '../lib/api'
import {
  fetchProductBySlug,
  replaceProductImages,
  updateProduct,
} from '../lib/productsApi'

const COLORS: ProductColor[] = ['Negro', 'Gris', 'Hueso', 'Morado']
const STYLES: ProductStyle[] = ['Nocturno', 'Vintage', 'Glitter', 'Minimal']
const SIZES: ProductSize[] = ['S', 'M', 'L']

type FormState = {
  name: string
  editionNumber: number
  priceUsd: number
  priceCop: number
  story: string
  materials: string
  sourceGarment: string
  care: string
  color: ProductColor
  style: ProductStyle
  size: ProductSize
}

function productToForm(p: {
  name: string
  editionNumber: number
  priceUsd: number
  priceCop: number
  story: string
  materials: string
  sourceGarment: string
  care: string
  color: ProductColor
  style: ProductStyle
  size: ProductSize
}): FormState {
  return {
    name: p.name,
    editionNumber: p.editionNumber,
    priceUsd: p.priceUsd,
    priceCop: p.priceCop,
    story: p.story,
    materials: p.materials,
    sourceGarment: p.sourceGarment,
    care: p.care,
    color: p.color,
    style: p.style,
    size: p.size,
  }
}

export function AdminEditGloomi() {
  const { slug: slugParam } = useParams<{ slug: string }>()
  const slug = slugParam ? decodeURIComponent(slugParam) : ''
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState | null>(null)
  const [currentImages, setCurrentImages] = useState<string[]>([])
  /** Orden de la galería (mismo conjunto que currentImages tras cargar / reemplazar). */
  const [galleryOrder, setGalleryOrder] = useState<string[]>([])
  const [replaceFiles, setReplaceFiles] = useState<File[]>([])
  const [replacePreviews, setReplacePreviews] = useState<string[]>([])

  const [loadError, setLoadError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!slug) {
        setLoadError('Falta el slug en la URL')
        setLoading(false)
        return
      }
      setLoading(true)
      setLoadError(null)
      try {
        const p = await fetchProductBySlug(slug)
        if (cancelled) return
        if (!p) {
          setLoadError('No se encontró este Gloomi')
          setForm(null)
          return
        }
        setForm(productToForm(p))
        const imgs = p.images ?? []
        setCurrentImages(imgs)
        setGalleryOrder([...imgs])
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : 'No se pudo cargar el producto',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    const urls = replaceFiles.map((f) => URL.createObjectURL(f))
    setReplacePreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [replaceFiles])

  useEffect(() => {
    setGalleryOrder((prev) => {
      if (replaceFiles.length > 0) return prev
      if (currentImages.length === 0) return []
      const sameLen = prev.length === currentImages.length
      const stillValid =
        sameLen && prev.every((p) => currentImages.includes(p))
      if (stillValid) return prev
      return [...currentImages]
    })
  }, [currentImages, replaceFiles.length])

  function moveGalleryItem(index: number, delta: number) {
    setGalleryOrder((prev) => {
      const j = index + delta
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      const t = next[index]
      next[index] = next[j]!
      next[j] = t!
      return next
    })
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!slug || !form) return
    setError(null)
    setSaving(true)
    try {
      const orderChanged =
        replaceFiles.length === 0 &&
        galleryOrder.length > 0 &&
        (galleryOrder.length !== currentImages.length ||
          galleryOrder.some((path, i) => path !== currentImages[i]))

      await updateProduct(slug, {
        name: form.name.trim(),
        editionNumber: Number(form.editionNumber),
        priceUsd: Number(form.priceUsd),
        priceCop: Number(form.priceCop),
        story: form.story.trim(),
        materials: form.materials.trim(),
        sourceGarment: form.sourceGarment.trim(),
        care: form.care.trim(),
        color: form.color,
        style: form.style,
        size: form.size,
        ...(orderChanged ? { images: galleryOrder } : {}),
      })
      if (replaceFiles.length > 0) {
        const updated = await replaceProductImages(slug, replaceFiles)
        setCurrentImages(updated.images)
        setReplaceFiles([])
      }
      navigate(`/tienda/${encodeURIComponent(slug)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center text-sm text-zinc-600 dark:text-zinc-500">
        Cargando…
      </div>
    )
  }

  if (loadError || !form) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {loadError ?? 'No disponible'}
        </p>
        <Link
          to="/admin/dashboard"
          className="mt-4 inline-block text-sm text-[color:var(--color-gloom-violet)] hover:underline"
        >
          Volver al dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-lg py-8 lg:max-w-xl">
      <p className="font-display mb-1 text-[11px] uppercase tracking-[0.35em] text-zinc-600 dark:text-zinc-500">
        Panel
      </p>
      <h1 className="font-display mb-1 text-2xl tracking-wide text-zinc-900 dark:text-zinc-100">Editar Gloomi</h1>
      <p className="mb-6 font-mono text-sm text-zinc-600 dark:text-zinc-500">{slug}</p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 dark:shadow-none"
      >
        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(ev) => set('name', ev.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="edition">
              N.º edición
            </label>
            <input
              id="edition"
              type="number"
              min={1}
              required
              value={form.editionNumber}
              onChange={(ev) =>
                set('editionNumber', Number(ev.target.value) || 1)
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div className="sm:col-span-2 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="usd">
                Precio USD
              </label>
              <input
                id="usd"
                type="number"
                min={0}
                step="0.01"
                required
                value={form.priceUsd}
                onChange={(ev) => set('priceUsd', Number(ev.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="cop">
                Precio COP
              </label>
              <input
                id="cop"
                type="number"
                min={0}
                step="1"
                required
                value={form.priceCop}
                onChange={(ev) => set('priceCop', Number(ev.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {galleryOrder.length <= 1 || replaceFiles.length > 0 ? (
            <div className="sm:col-span-2">
              <span className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500">
                Galería actual
              </span>
              <div className="flex flex-wrap gap-2">
                {currentImages.length === 0 ? (
                  <span className="text-sm text-zinc-700 dark:text-zinc-400">Sin imágenes</span>
                ) : (
                  currentImages.map((rel) => (
                    <div
                      key={rel}
                      className="h-20 w-20 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      <img
                        src={resolveMediaUrl(rel)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}

          {galleryOrder.length > 1 && replaceFiles.length === 0 ? (
            <div className="sm:col-span-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="mb-1 text-xs font-medium text-zinc-700 dark:text-zinc-400">
                Orden en el carrusel (tienda y detalle)
              </p>
              <p className="mb-3 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-500">
                La primera foto es la portada en listados; el carrusel del producto sigue este orden de izquierda a derecha.
              </p>
              <ul className="space-y-2">
                {galleryOrder.map((rel, index) => (
                  <li
                    key={`${rel}-${index}`}
                    className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/60"
                  >
                    <span className="w-6 shrink-0 text-center text-[11px] tabular-nums text-zinc-600 dark:text-zinc-500">
                      {index + 1}
                    </span>
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                      <img
                        src={resolveMediaUrl(rel)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-zinc-700 dark:text-zinc-500">
                      {rel.replace(/^\/uploads\/products\//, '')}
                    </span>
                    <div className="flex shrink-0 flex-col gap-0.5">
                      <button
                        type="button"
                        aria-label={`Subir imagen ${index + 1}`}
                        disabled={index === 0}
                        onClick={() => moveGalleryItem(index, -1)}
                        className="rounded-md border border-zinc-300 p-1 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-30 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      >
                        <ChevronUp className="h-4 w-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label={`Bajar imagen ${index + 1}`}
                        disabled={index === galleryOrder.length - 1}
                        onClick={() => moveGalleryItem(index, 1)}
                        className="rounded-md border border-zinc-300 p-1 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-30 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      >
                        <ChevronDown className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="sm:col-span-2">
            <span className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500">
              Reemplazar todas las imágenes (opcional)
            </span>
            <label
              htmlFor="replace-images"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-400 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 transition hover:border-[color:var(--color-gloom-violet)] hover:text-zinc-950 dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              {replaceFiles.length
                ? `${replaceFiles.length} archivo(s) — sustituirán la galería`
                : 'Elegir nuevas fotos (borra las anteriores en servidor)'}
            </label>
            <input
              id="replace-images"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="sr-only"
              onChange={(ev) => {
                const list = ev.target.files ? Array.from(ev.target.files) : []
                setReplaceFiles(list)
              }}
            />
            {replacePreviews.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {replacePreviews.map((u) => (
                  <div
                    key={u}
                    className="h-20 w-20 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <img src={u} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="color">
              Color
            </label>
            <select
              id="color"
              value={form.color}
              onChange={(ev) => set('color', ev.target.value as ProductColor)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {COLORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="style">
              Estilo
            </label>
            <select
              id="style"
              value={form.style}
              onChange={(ev) => set('style', ev.target.value as ProductStyle)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="size">
              Tamaño
            </label>
            <select
              id="size"
              value={form.size}
              onChange={(ev) => set('size', ev.target.value as ProductSize)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="story">
              Historia
            </label>
            <textarea
              id="story"
              required
              minLength={10}
              rows={4}
              value={form.story}
              onChange={(ev) => set('story', ev.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="materials">
              Materiales
            </label>
            <textarea
              id="materials"
              required
              rows={2}
              value={form.materials}
              onChange={(ev) => set('materials', ev.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="garment">
              Prenda Origen / textil
            </label>
            <textarea
              id="garment"
              required
              rows={2}
              value={form.sourceGarment}
              onChange={(ev) => set('sourceGarment', ev.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="care">
              Cuidados
            </label>
            <textarea
              id="care"
              required
              rows={2}
              value={form.care}
              onChange={(ev) => set('care', ev.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-200 dark:shadow-none dark:hover:bg-zinc-900"
          >
            Cancelar
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  )
}
