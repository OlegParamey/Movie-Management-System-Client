import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { loginRequest, meRequest, registerRequest } from '../api/auth'
import { TOKEN_KEY } from '../api/client'
import type { AuthResponse, User } from '../types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY))

  // restore session from a saved token
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    meRequest()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  const startSession = ({ token, user }: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, token)
    setUser(user)
  }

  const value = {
    user,
    loading,
    login: async (email: string, password: string) =>
      startSession(await loginRequest(email, password)),
    register: async (username: string, email: string, password: string) =>
      startSession(await registerRequest(username, email, password)),
    logout: () => {
      localStorage.removeItem(TOKEN_KEY)
      setUser(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
