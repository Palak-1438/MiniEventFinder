export type Event = {
  id: string
  title: string
  description: string
  location: string
  date: string
  category: string
  maxParticipants: number
  currentParticipants: number
  createdBy?: string
  coordinates?: { lat: number; lng: number }
}

export type User = {
  id: string
  email: string
  username: string
}

export type AuthResponse = {
  token: string
  user: User
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

export const api = {
  // Auth
  register: (data: { email: string; username: string; password: string }) =>
    fetchJson<AuthResponse>(`/api/auth/register`, { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    fetchJson<AuthResponse>(`/api/auth/login`, { method: 'POST', body: JSON.stringify(data) }),

  // Events
  listEvents: (filters?: { location?: string; category?: string; title?: string; date?: string }) => {
    const params = new URLSearchParams()
    if (filters?.location) params.set('location', filters.location)
    if (filters?.category) params.set('category', filters.category)
    if (filters?.title) params.set('title', filters.title)
    if (filters?.date) params.set('date', filters.date)
    const q = params.toString()
    return fetchJson<Event[]>(`/api/events${q ? `?${q}` : ''}`)
  },
  getEvent: (id: string) => fetchJson<Event>(`/api/events/${id}`),
  createEvent: (data: Omit<Event, 'id' | 'currentParticipants' | 'createdBy'> & { currentParticipants?: number }) =>
    fetchJson<Event>(`/api/events`, { method: 'POST', body: JSON.stringify(data) }),
  joinEvent: (id: string) => fetchJson<Event>(`/api/events/${id}/join`, { method: 'POST' }),
}
