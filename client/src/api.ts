export type Event = {
  id: string
  title: string
  description: string
  location: string
  date: string
  maxParticipants: number
  currentParticipants: number
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

export const api = {
  listEvents: (location?: string) => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    const q = params.toString()
    return fetchJson<Event[]>(`/api/events${q ? `?${q}` : ''}`)
  },
  getEvent: (id: string) => fetchJson<Event>(`/api/events/${id}`),
  createEvent: (data: Omit<Event, 'id' | 'currentParticipants'> & { currentParticipants?: number }) =>
    fetchJson<Event>(`/api/events`, { method: 'POST', body: JSON.stringify(data) }),
}
