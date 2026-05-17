import { apiFetch } from './api'
import type { SavedGloomiConfig } from '../features/gloomi-customizer/savedConfig'

export type ContactMessageRow = {
  id: string
  email: string
  message: string
  name?: string
  subject?: string
  createdAt?: string
  updatedAt?: string
}

export function fetchContactMessages(): Promise<ContactMessageRow[]> {
  return apiFetch<ContactMessageRow[]>('/contact/messages')
}

export type SubmitCustomizationBody = {
  email?: string
  name?: string
  note?: string
  config: SavedGloomiConfig
}

export function submitGloomiCustomization(
  body: SubmitCustomizationBody,
): Promise<{ id: string }> {
  return apiFetch<{ id: string }>('/customizations', {
    method: 'POST',
    body: JSON.stringify(body),
    skipAuth: true,
  })
}

export type GloomiCustomizationRow = {
  id: string
  email?: string
  name?: string
  note?: string
  config: Record<string, unknown>
  createdAt?: string
  updatedAt?: string
}

export function fetchGloomiCustomizations(): Promise<GloomiCustomizationRow[]> {
  return apiFetch<GloomiCustomizationRow[]>('/customizations')
}

export function fetchGloomiCustomizationById(
  id: string,
): Promise<GloomiCustomizationRow> {
  return apiFetch<GloomiCustomizationRow>(
    `/customizations/${encodeURIComponent(id)}`,
  )
}
