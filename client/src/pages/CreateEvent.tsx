import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function CreateEvent() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('social')
  const [maxParticipants, setMaxParticipants] = useState(10)
  const [currentParticipants, setCurrentParticipants] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const created = await api.createEvent({
        title,
        description,
        location,
        date,
        category,
        maxParticipants,
        currentParticipants,
      })
      navigate(`/events/${created.id}`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Create a new event</h2>
      <form onSubmit={onSubmit} className="space-y-3 rounded bg-white p-4 shadow">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full rounded border border-gray-300 px-3 py-2" required />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full rounded border border-gray-300 px-3 py-2" required />
        <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" className="w-full rounded border border-gray-300 px-3 py-2" required />
        <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2" required />
        <div>
          <label className="block text-sm text-gray-600 mb-1">Category</label>
          <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2">
            <option value="social">Social</option>
            <option value="sports">Sports</option>
            <option value="music">Music</option>
            <option value="tech">Tech</option>
            <option value="food">Food</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600">Max participants</label>
            <input type="number" min={1} value={maxParticipants} onChange={e=>setMaxParticipants(Number(e.target.value))} className="w-full rounded border border-gray-300 px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Current participants</label>
            <input type="number" min={0} value={currentParticipants} onChange={e=>setCurrentParticipants(Number(e.target.value))} className="w-full rounded border border-gray-300 px-3 py-2" />
          </div>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button disabled={loading} className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50">{loading ? 'Creating...' : 'Create Event'}</button>
      </form>
    </div>
  )
}
