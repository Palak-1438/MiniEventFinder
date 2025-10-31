import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, type Event } from '../api'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.getEvent(id)
      .then(setEvent)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleJoin = async () => {
    if (!id || !event) return
    setJoining(true)
    setError(null)
    try {
      const updated = await api.joinEvent(id)
      setEvent(updated)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setJoining(false)
    }
  }

  if (loading) return <p className="text-gray-600 dark:text-gray-400">Loading...</p>
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>
  if (!event) return <p className="text-gray-600 dark:text-gray-400">Event not found.</p>

  return (
    <div className="space-y-4">
      <Link to="/" className="text-primary dark:text-secondary hover:underline">← Back to events</Link>
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-gray-100 dark:border-slate-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
            <span className="inline-block mt-2 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">{event.category}</span>
          </div>
          {event.currentParticipants < event.maxParticipants && (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {joining ? 'Joining...' : 'Join Event'}
            </button>
          )}
        </div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">{event.description}</p>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div><span className="font-medium">When:</span> {new Date(event.date).toLocaleString()}</div>
          <div><span className="font-medium">Where:</span> {event.location}</div>
          <div><span className="font-medium">Participants:</span> {event.currentParticipants}/{event.maxParticipants}</div>
          {event.currentParticipants >= event.maxParticipants && (
            <div className="text-red-600 dark:text-red-400 font-medium">Event is full</div>
          )}
        </div>
      </div>
    </div>
  )
}
