import { apiFetch, resolveMediaUrl } from './api'

export type BrandingLogoResponse = {
  url: string | null
}

export async function fetchBrandingLogo(): Promise<string | null> {
  const r = await apiFetch<BrandingLogoResponse>('/branding/logo', {
    skipAuth: true,
  })
  return r.url
}

/** URL absoluta lista para usar en `src` del logo (o null). */
export async function fetchBrandingLogoAbsolute(): Promise<string | null> {
  const rel = await fetchBrandingLogo()
  if (rel == null || rel === '') return null
  return resolveMediaUrl(rel)
}

export async function uploadBrandLogo(
  file: File,
): Promise<BrandingLogoResponse> {
  const fd = new FormData()
  fd.append('logo', file)
  return apiFetch<BrandingLogoResponse>('/branding/logo', {
    method: 'POST',
    body: fd,
  })
}
