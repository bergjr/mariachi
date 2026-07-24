import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  // On load: if a token exists, re-fetch fresh user from server to avoid stale localStorage
  useEffect(() => {
    if (!token) return
    authApi.getMe()
      .then((freshUser) => {
        setUser(freshUser)
        localStorage.setItem('user', JSON.stringify(freshUser))
      })
      .catch(() => {
        // Token expired / invalid — clear everything
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
      })
  }, [token])

  const _persist = (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user',  JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password)   // throws on failure
    _persist(data.token, data.user)
    return data.user
  }, [])

  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register(name, email, password)  // throws on failure
    _persist(data.token, data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback(async (body) => {
    const updated = await authApi.updateMe(body)   // throws on failure
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
    return updated
  }, [])

  const openLoginModal  = useCallback(() => setLoginModalOpen(true),  [])
  const closeLoginModal = useCallback(() => setLoginModalOpen(false), [])

  return (
    <AuthContext.Provider value={{
      user, token,
      login, register, logout, updateUser,
      loginModalOpen, openLoginModal, closeLoginModal,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
