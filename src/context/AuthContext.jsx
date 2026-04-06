import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  getSession,
  getUsers,
  saveSession,
  saveUsers,
} from '../services/storage'

const AuthContext = createContext(null)

function makeToken(email) {
  return `token_${email.length}_${Date.now().toString(36)}`
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession())

  const user = session?.user ?? null
  const token = session?.token ?? null

  const login = useCallback((email, password) => {
    const users = getUsers()
    const found = users.find(
      (u) => u.email === email && u.password === password
    )
    if (!found) return { ok: false, error: 'Invalid email or password.' }
    const tok = makeToken(email)
    const u = { email: found.email, name: found.name }
    const next = { token: tok, user: u }
    saveSession(next)
    setSession(next)
    return { ok: true }
  }, [])

  const register = useCallback((name, email, password) => {
    const users = getUsers()
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: 'This email is already registered.' }
    }
    users.push({ name, email, password })
    saveUsers(users)
    const tok = makeToken(email)
    const u = { email, name }
    const next = { token: tok, user: u }
    saveSession(next)
    setSession(next)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    saveSession(null)
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [user, token, login, register, logout]
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
