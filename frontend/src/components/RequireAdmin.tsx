import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { token, isAdmin } = useAuth()
  const location = useLocation()

  if (!token) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    )
  }

  if (!isAdmin) {
    return (
      <div className="py-16 text-center">
        <p className="text-zinc-400">
          Necesitas una cuenta administrador para acceder aquí.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
