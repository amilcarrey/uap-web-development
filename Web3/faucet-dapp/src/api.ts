const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function setToken(token: string | null) {
  if (token) localStorage.setItem('jwt', token)
  else localStorage.removeItem('jwt')
}
export function getToken() {
  return localStorage.getItem('jwt') || ''
}

export async function postJSON(path: string, body: any, auth = false) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${getToken()}` } : {})
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getJSON(path: string, auth = false) {
  const res = await fetch(`${API}${path}`, {
    headers: {
      ...(auth ? { Authorization: `Bearer ${getToken()}` } : {})
    }
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
