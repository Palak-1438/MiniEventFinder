import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Event } from '../api'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTitle, setSearchTitle] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [searchDate, setSearchDate] = useState('')

  const debouncedTitle = useDebounce(searchTitle, 500)
  const debouncedLocation = useDebounce(searchLocation, 500)

  useEffect(() => {
    setLoading(true)
    const filters = {
      title: debouncedTitle || undefined,
      location: debouncedLocation || undefined,
      category: searchCategory || undefined,
      date: searchDate || undefined
    }
    api.listEvents(filters)
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [debouncedTitle, debouncedLocation, searchCategory, searchDate])

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg space-y-3">
        <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Search & Filter Events</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Search by title..."
            className="rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-primary"
          />
          <input
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Search by location..."
            className="rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-primary"
          />
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            <option value="social">Social</option>
            <option value="sports">Sports</option>
            <option value="music">Music</option>
            <option value="tech">Tech</option>
            <option value="food">Food</option>
            <option value="other">Other</option>
          </select>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {loading && <p className="text-gray-600 dark:text-gray-400">Loading events...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <li key={e.id} className="rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-slate-700">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold flex-1 text-gray-900 dark:text-white">{e.title}</h3>
              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">{e.category}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{e.description}</p>
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>📅 {new Date(e.date).toLocaleDateString()}</div>
              <div>📍 {e.location}</div>
              <div>👥 {e.currentParticipants}/{e.maxParticipants} going</div>
            </div>
            <Link to={`/events/${e.id}`} className="mt-3 inline-block text-primary dark:text-secondary hover:underline font-medium">View details →</Link>
          </li>
        ))}
      </ul>

      {!loading && !error && events.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">No events found. Try adjusting your filters.</p>
      )}
    </div>
  )
}
