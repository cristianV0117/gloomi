/** URL base de la API Nest (incluye `/api`). Ej: http://localhost:3000/api */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined
  if (raw?.trim()) return raw.trim().replace(/\/$/, '')
  return 'http://localhost:3000/api'
}

/** Origen público del backend (sin `/api`). Ej: http://localhost:3000 */
export function getPublicApiOrigin(): string {
  const apiRoot = getApiBaseUrl().replace(/\/$/, '')
  if (apiRoot.endsWith('/api')) {
    return apiRoot.slice(0, -4) || apiRoot
  }
  return apiRoot
}

/** Resuelve rutas `/uploads/...` o URLs absolutas para `<img src>`. */
export function resolveMediaUrl(pathOrUrl: string | null | undefined): string {
  if (pathOrUrl == null || pathOrUrl === '') return ''
  const s = pathOrUrl.trim()
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('/')) return `${getPublicApiOrigin()}${s}`
  return `${getPublicApiOrigin()}/${s}`
}

const TOKEN_KEY = 'gloomi_access_token'

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export type ApiRequestInit = RequestInit & { skipAuth?: boolean }

export async function apiFetch<T = unknown>(
  path: string,
  init?: ApiRequestInit,
): Promise<T> {
  const url = path.startsWith('http') ? path : `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(init?.headers)
  const body = init?.body
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData
  if (isFormData) {
    headers.delete('Content-Type')
  }
  if (
    body != null &&
    typeof body === 'string' &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }
  if (!init?.skipAuth) {
    const t = getStoredToken()
    if (t) headers.set('Authorization', `Bearer ${t}`)
  }

  const res = await fetch(url, { ...init, headers })
  if (!res.ok) {
    const text = await res.text()
    let message = text || res.statusText
    try {
      const j = JSON.parse(text) as { message?: string | string[] }
      if (Array.isArray(j.message)) message = j.message.join(', ')
      else if (typeof j.message === 'string') message = j.message
    } catch {
      /* usar texto bruto */
    }
    throw new Error(message)
  }

  if (res.status === 204) return undefined as T
  const ct = res.headers.get('content-type')
  if (ct?.includes('application/json')) return (await res.json()) as T
  return (await res.text()) as T
}
