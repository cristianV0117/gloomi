import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import type {
  ProductColor,
  ProductSize,
  ProductStyle,
} from '../data/products'
import { createProductWithImages } from '../lib/productsApi'

const COLORS: ProductColor[] = ['Negro', 'Gris', 'Hueso', 'Morado']
const STYLES: ProductStyle[] = ['Nocturno', 'Vintage', 'Glitter', 'Minimal']
const SIZES: ProductSize[] = ['S', 'M', 'L']

type FormState = {
  slug: string
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

const empty: FormState = {
  slug: '',
  name: '',
  editionNumber: 1,
  priceUsd: 15,
  priceCop: 63000,
  story: '',
  materials: '',
  sourceGarment: '',
  care: '',
  color: 'Negro',
  style: 'Nocturno',
  size: 'M',
}

export function AdminCreateGloomi() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(empty)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const urls = imageFiles.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [imageFiles])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (imageFiles.length === 0) {
      setError('Añade al menos una imagen (puedes elegir varias a la vez).')
      return
    }
    setSaving(true)
    try {
      const created = await createProductWithImages(imageFiles, {
        slug: form.slug.trim().toLowerCase(),
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
      })
      navigate(`/tienda/${encodeURIComponent(created.slug)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg py-8 lg:max-w-xl">
      <p className="font-display mb-1 text-[11px] uppercase tracking-[0.35em] text-zinc-600 dark:text-zinc-500">
        Panel
      </p>
      <h1 className="font-display mb-6 text-2xl tracking-wide text-zinc-900 dark:text-zinc-100">
        Nuevo Gloomi
      </h1>

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
            <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500" htmlFor="slug">
              Slug (URL, solo minúsculas y guiones)
            </label>
            <input
              id="slug"
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              value={form.slug}
              onChange={(ev) => set('slug', ev.target.value.toLowerCase())}
              placeholder="mi-gloomi"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[color:var(--color-gloom-violet)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
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

          <div className="sm:col-span-2">
            <span className="mb-1 block text-xs text-zinc-600 dark:text-zinc-500">
              Imágenes del producto (varias → carrusel en la ficha)
            </span>
            <label
              htmlFor="product-images"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-400 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 transition hover:border-[color:var(--color-gloom-violet)] hover:text-zinc-950 dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              {imageFiles.length
                ? `${imageFiles.length} archivo(s) seleccionados`
                : 'Elegir imágenes (JPEG, PNG, WebP, GIF)'}
            </label>
            <input
              id="product-images"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="sr-only"
              onChange={(ev) => {
                const list = ev.target.files ? Array.from(ev.target.files) : []
                setImageFiles(list)
              }}
            />
            {previews.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {previews.map((u) => (
                  <div
                    key={u}
                    className="h-20 w-20 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <img src={u} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
            <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-500">
              Máx. 6&nbsp;MB por imagen. Orden = orden del carrusel.
            </p>
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
            {saving ? 'Guardando…' : 'Publicar Gloomi'}
          </Button>
        </div>
      </form>
    </div>
  )
}
