import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  username: string
  full_name: string
  role: 'admin' | 'guest'
  face_registered?: boolean
  membership_type?: string
  guest_id?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAdmin: boolean
  isGuest: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAdmin: false,
  isGuest: false,
  isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('ea_user')
    if (!stored) return null
    try {
      return JSON.parse(stored) as User
    } catch {
      localStorage.removeItem('ea_user')
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ea_token'))

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('ea_token', newToken)
    localStorage.setItem('ea_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ea_token')
    localStorage.removeItem('ea_user')
    setToken(null)
    setUser(null)
  }, [])

  // Check token expiry on mount
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          logout()
        }
      } catch {
        // If token can't be decoded, keep it (mock tokens won't decode)
      }
    }
  }, [token, logout])

  // Keep token/user pair consistent in storage and state.
  useEffect(() => {
    if ((token && !user) || (!token && user)) {
      localStorage.removeItem('ea_token')
      localStorage.removeItem('ea_user')
      setToken(null)
      setUser(null)
    }
  }, [token, user])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isGuest: user?.role === 'guest',
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
