import { apiFetch } from './api'

export type LoginResponse = {
  access_token: string
  user: { email: string; role: string }
}

export function loginRequest(email: string, password: string) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  })
}
