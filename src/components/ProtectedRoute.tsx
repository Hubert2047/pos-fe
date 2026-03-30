import { useAuth } from '@/hooks/auth'
import type { UserRole } from '@/stores/auth-store'
import { Navigate, Outlet } from 'react-router-dom'

interface ProtectedRouteProps {
  /** Roles allowed to access this route. Leave empty to allow any authenticated user. */
  allowedRoles?: UserRole[]
  /** Where to redirect if not authenticated (default: /login) */
  redirectTo?: string
}

/**
 * Wraps routes that require authentication (and optionally a specific role).
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/pos" element={<POSPage />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
 *     <Route path="/admin" element={<AdminPage />} />
 *   </Route>
 */
export default function ProtectedRoute({
  allowedRoles = [],
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()

  // Not logged in at all → go to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Role check — if allowedRoles is specified and user's role is not included
  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    // Redirect to the first page the user IS allowed on (or a 403 page)
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}