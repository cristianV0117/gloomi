import { apiFetch } from './api'
import type { Product } from '../data/products'
import { stripMeta, type ProductRow } from './productsApi'

export type HomePublicResponse = {
  heroImageUrl: string | null
  featuredProducts: (Product | null)[]
}

export async function fetchHomePublic(): Promise<HomePublicResponse> {
  const raw = await apiFetch<{
    heroImageUrl: string | null
    featuredProducts: (ProductRow | null)[]
  }>('/home', { skipAuth: true })
  return {
    heroImageUrl: raw.heroImageUrl,
    featuredProducts: raw.featuredProducts.map((p) =>
      p ? stripMeta(p) : null,
    ),
  }
}

export type HomeSettingsResponse = {
  heroSource: 'custom' | 'product'
  heroProductSlug: string | null
  heroCustomRelativeUrl: string | null
  featuredSlugs: [string, string, string]
}

export function fetchHomeSettings(): Promise<HomeSettingsResponse> {
  return apiFetch<HomeSettingsResponse>('/home/settings')
}

export function patchHomeSettings(body: Partial<{
  heroSource: 'custom' | 'product'
  heroProductSlug: string | null
  featuredSlugs: [string, string, string]
  clearCustomHero: boolean
}>): Promise<HomeSettingsResponse> {
  return apiFetch<HomeSettingsResponse>('/home/settings', {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function uploadHeroImage(file: File): Promise<HomeSettingsResponse> {
  const fd = new FormData()
  fd.append('file', file)
  return apiFetch<HomeSettingsResponse>('/home/hero-image', {
    method: 'POST',
    body: fd,
  })
}
