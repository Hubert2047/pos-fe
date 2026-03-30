import { useAuth } from '@/hooks/auth'
import { Navigate } from 'react-router-dom'

export default function RootRedirect() {
  const { isAuthenticated } = useAuth()

  return <Navigate to={isAuthenticated ? '/pos' : '/login'} replace />
}