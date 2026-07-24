import { get, post, patch } from './client'

export const login    = (email, password)       => post('/auth/login',    { email, password })
export const register = (name, email, password) => post('/auth/register', { name, email, password })
export const getMe    = ()                      => get('/auth/me')
export const updateMe = (body)                  => patch('/auth/me', body)
