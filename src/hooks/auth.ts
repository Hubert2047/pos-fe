import type { AuthUser } from '@/stores/auth-store'
import { createContext, useContext } from 'react'

interface AuthContextValue {
    user: AuthUser | null
    token: string | null
    isAuthenticated: boolean
    setAuth: (payload: { user: AuthUser; token: string }) => void
    clearAuth: () => void
}
export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
    return ctx
}
