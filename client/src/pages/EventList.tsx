import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Event } from '../api'

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => events, [events])

  useEffect(() => {
    setLoading(true)
    api.listEvents(filter)
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by location..."
          className="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <button onClick={() => setFilter(query)} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Search</button>
      </div>

      {loading && <p className="text-gray-600">Loading events...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="grid gap-4 md:grid-cols-2">
        {filtered.map((e) => (
          <li key={e.id} className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-lg font-semibold">{e.title}</h3>
            <p className="text-sm text-gray-700">{e.description}</p>
            <div className="mt-2 text-sm text-gray-600">
              <span>{new Date(e.date).toLocaleString()}</span>
              <span className="mx-2">•</span>
              <span>{e.location}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {e.currentParticipants}/{e.maxParticipants} going
            </div>
            <Link to={`/events/${e.id}`} className="mt-3 inline-block text-blue-600 hover:underline">View details</Link>
          </li>
        ))}
      </ul>

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-600">No events found.</p>
      )}
    </div>
  )
}
