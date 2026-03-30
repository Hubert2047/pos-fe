import {useState, useEffect, type ReactNode } from 'react'
import { TOKEN_STORAGE_KEY } from '@/constance'
import { AuthContext } from '@/hooks/auth'

export type UserRole = 'SuperAdmin' | 'Admin' | 'Employee' | 'Guest'
export interface AuthUser {
    id: string | number
    name: string
    role: UserRole
    [key: string]: string | number
}
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  })

  const [user, setUser] = useState<AuthUser | null>(() => {
    const t = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!t) return null
    try {
      const payload = JSON.parse(atob(t.split('.')[1]))
      return {
        id: payload.sub,
        name: payload.name,
        role: payload.role,
      }
    } catch {
      return null
    }
  })

  const isAuthenticated = !!token

  const setAuth = ({ user, token }: { user: AuthUser; token: string }) => {
    setUser(user)
    setToken(token)
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  }

  const clearAuth = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  )
}