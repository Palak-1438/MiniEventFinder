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
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <p className="mt-2 text-gray-700">{event.description}</p>
        <div className="mt-4 text-sm text-gray-600">
          <div><span className="font-medium">When:</span> {new Date(event.date).toLocaleString()}</div>
          <div><span className="font-medium">Where:</span> {event.location}</div>
          <div><span className="font-medium">Participants:</span> {event.currentParticipants}/{event.maxParticipants}</div>
        </div>
      </div>
    </div>
  )
}
