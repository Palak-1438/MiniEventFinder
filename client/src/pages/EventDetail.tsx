import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, type Event } from '../api'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.getEvent(id)
      .then(setEvent)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-gray-600">Loading...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!event) return <p className="text-gray-600">Event not found.</p>

  return (
    <div className="space-y-4">
      <Link to="/" className="text-blue-600 hover:underline">← Back to events</Link>
      <div className="rounded bg-white p-6 shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <span className="inline-block mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{event.category}</span>
          </div>
          {event.currentParticipants < event.maxParticipants && (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {joining ? 'Joining...' : 'Join Event'}
            </button>
          )}
        </div>
        <p className="mt-4 text-gray-700">{event.description}</p>
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <div><span className="font-medium">When:</span> {new Date(event.date).toLocaleString()}</div>
          <div><span className="font-medium">Where:</span> {event.location}</div>
          <div><span className="font-medium">Participants:</span> {event.currentParticipants}/{event.maxParticipants}</div>
          {event.currentParticipants >= event.maxParticipants && (
            <div className="text-red-600 font-medium">Event is full</div>
          )}
        </div>
      </div>
    </div>
  )
}
