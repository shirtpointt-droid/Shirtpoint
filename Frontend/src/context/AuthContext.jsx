import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tp_user')) || null } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('tp_token') || null)

  const login = (userData, tok) => {
    setUser(userData)
    localStorage.setItem('tp_user', JSON.stringify(userData))
    if (tok !== undefined) {
      setToken(tok)
      localStorage.setItem('tp_token', tok)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('tp_user')
    localStorage.removeItem('tp_token')
  }

  const buyMembership = () => {
    const updated = { ...user, isPro: true }
    setUser(updated)
    localStorage.setItem('tp_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, buyMembership }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
