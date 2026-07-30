import React, { createContext, useContext, useEffect, useState } from 'react'

const AUTH_KEY = 'apst_logged_in'

type AuthContextType = {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(AUTH_KEY) === 'true'
  )

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, String(isLoggedIn))
  }, [isLoggedIn])

  function login() {
    setIsLoggedIn(true)
  }

  function logout() {
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}