import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getStoredToken, setStoredToken } from '../lib/api'
import { loginRequest } from '../lib/authApi'

function parseJwtPayload(
  token: string,
): { email?: string; role?: string } | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const json = JSON.parse(
      atob(part.replace(/-/g, '+').replace(/_/g, '/')),
    ) as { email?: string; role?: string }
    return { email: json.email, role: json.role }
  } catch {
    return null
  }
}

type AuthContextValue = {
  token: string | null
  email: string | null
  role: string | null
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const initial = token ? parseJwtPayload(token) : null
  const [email, setEmail] = useState<string | null>(initial?.email ?? null)
  const [role, setRole] = useState<string | null>(initial?.role ?? null)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (e: string, password: string) => {
    setLoading(true)
    try {
      const res = await loginRequest(e, password)
      setToken(res.access_token)
      setStoredToken(res.access_token)
      setEmail(res.user.email)
      setRole(res.user.role)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setEmail(null)
    setRole(null)
    setStoredToken(null)
  }, [])

  const isAdmin = role === 'admin'

  const value = useMemo(
    () => ({
      token,
      email,
      role,
      isAdmin,
      loading,
      login,
      logout,
    }),
    [token, email, role, isAdmin, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return ctx
}
