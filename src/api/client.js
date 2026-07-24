const BASE = '/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, { body, ...options } = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`)
    err.status = res.status
    throw err
  }

  return data
}

export const get  = (path, params) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return request(`${path}${qs}`, { method: 'GET' })
}
export const post  = (path, body) => request(path, { method: 'POST',   body })
export const patch = (path, body) => request(path, { method: 'PATCH',  body })
export const del   = (path)       => request(path, { method: 'DELETE' })
