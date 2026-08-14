import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { watchAuthState, signInAsGuest, signInWithGoogle, signOut as firebaseSignOut } from '../lib/firebase'

type AuthContextType = {
  isLoggedIn: boolean
  loading: boolean
  user: User | null
  loginAsGuest: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = watchAuthState((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function loginAsGuest() {
    await signInAsGuest()
  }

  async function loginWithGoogle() {
    await signInWithGoogle()
  }

  async function logout() {
    await firebaseSignOut()
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        loading,
        user,
        loginAsGuest,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}