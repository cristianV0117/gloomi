import { apiFetch } from './api'
import type { Product } from '../data/products'

export type ProductRow = Product & {
  id?: string
  createdAt?: string
  updatedAt?: string
  image?: string
  price?: number
}

export function stripMeta(p: ProductRow): Product {
  const images =
    p.images?.length > 0
      ? p.images
      : p.image
        ? [p.image]
        : []
  const legacyPrice = p.price
  const priceUsd = p.priceUsd ?? legacyPrice ?? 0
  const priceCop = p.priceCop ?? Math.round(priceUsd * 4200)
  return {
    slug: p.slug,
    name: p.name,
    editionNumber: p.editionNumber,
    priceUsd,
    priceCop,
    images,
    story: p.story,
    materials: p.materials,
    sourceGarment: p.sourceGarment,
    care: p.care,
    color: p.color,
    style: p.style,
    size: p.size,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const rows = await apiFetch<ProductRow[]>('/products', { skipAuth: true })
  return rows.map(stripMeta)
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const row = await apiFetch<ProductRow>(
      `/products/${encodeURIComponent(slug)}`,
      { skipAuth: true },
    )
    return stripMeta(row)
  } catch (e) {
    if (e instanceof Error && /no encontrado/i.test(e.message)) {
      return null
    }
    throw e
  }
}

function appendFormFields(
  fd: FormData,
  fields: Omit<Product, 'images'> & { slug: string },
) {
  fd.append('slug', fields.slug)
  fd.append('name', fields.name)
  fd.append('editionNumber', String(fields.editionNumber))
  fd.append('priceUsd', String(fields.priceUsd))
  fd.append('priceCop', String(fields.priceCop))
  fd.append('story', fields.story)
  fd.append('materials', fields.materials)
  fd.append('sourceGarment', fields.sourceGarment)
  fd.append('care', fields.care)
  fd.append('color', fields.color)
  fd.append('style', fields.style)
  fd.append('size', fields.size)
}

export async function createProductWithImages(
  imageFiles: File[],
  fields: Omit<Product, 'images'> & { slug: string },
): Promise<Product> {
  const fd = new FormData()
  for (const f of imageFiles) {
    fd.append('images', f)
  }
  appendFormFields(fd, fields)
  const row = await apiFetch<ProductRow>('/products', {
    method: 'POST',
    body: fd,
  })
  return stripMeta(row)
}

export async function updateProduct(
  slug: string,
  patch: Partial<Omit<Product, 'images' | 'slug'>>,
): Promise<Product> {
  const row = await apiFetch<ProductRow>(
    `/products/${encodeURIComponent(slug)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(patch),
    },
  )
  return stripMeta(row)
}

export async function replaceProductImages(
  slug: string,
  imageFiles: File[],
): Promise<Product> {
  const fd = new FormData()
  for (const f of imageFiles) {
    fd.append('images', f)
  }
  const row = await apiFetch<ProductRow>(
    `/products/${encodeURIComponent(slug)}/images`,
    { method: 'PUT', body: fd },
  )
  return stripMeta(row)
}

export async function deleteProduct(slug: string): Promise<void> {
  await apiFetch(`/products/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
  })
}
