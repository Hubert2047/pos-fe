import {  useState, type ReactNode } from 'react'
import { TOKEN_STORAGE_KEY } from '@/constance'
import { AuthContext } from '@/hooks/auth'
export type UserRole = 'SuperAdmin' | 'Admin' | 'Employee' | 'Guest'
export interface AuthUser {
    id: string | number
    name: string
    role: UserRole
    [key: string]: string | number
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY))

    const setAuth = ({ user, token }: { user: AuthUser; token: string }) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, token)
        setUser(user)
        setToken(token)
    }

    const clearAuth = () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        setUser(null)
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, setAuth, clearAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

