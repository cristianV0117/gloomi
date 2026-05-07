/** URL base de la API Nest (incluye `/api`). Ej: http://localhost:3000/api */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  if (raw?.trim()) return raw.trim().replace(/\/$/, '');
  return 'http://localhost:3000/api';
}
