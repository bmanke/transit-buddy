import { type SubmitEvent, useState } from 'react'
import { Link } from 'react-router'
import { sendFormData } from '../lib/formData'

const STATIONS = [
  { value: 'A1', label: 'Metro Line - Station A1' },
  { value: 'A2', label: 'Metro Line - Station A2' },
]

export default function Form() {
  const [meetspot, setMeetspot] = useState('')
  const [meettime, setMeettime] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (meetspot === destination) {
      setSuccess(false)
      setMessage('Meet up spot and destination can not be the same!')
      setLoading(false)
      return
    }

    const { ok, error } = await sendFormData(meetspot, meettime, destination)

    setSuccess(ok)
    setMessage(ok ? 'SUCCESS!' : error)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl w-full max-w-md">
      <div className="card-body gap-4">
        <h2 className="card-title text-2xl">Transit Buddy setup</h2>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Meet-up Spot</legend>
          <select
            id="meetspot"
            className="select w-full"
            value={meetspot}
            onChange={(e) => setMeetspot(e.target.value)}
            required
          >
            <option value="" disabled>Choose Meetup location</option>
            {STATIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Meet-up Time</legend>
          <input
            id="meettime"
            type="time"
            className="input w-full"
            value={meettime}
            onChange={(e) => setMeettime(e.target.value)}
            required
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Destination</legend>
          <select
            id="destination"
            className="select w-full"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          >
            <option value="" disabled>Choose a destination</option>
            {STATIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </fieldset>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && <span className="loading loading-spinner loading-sm" />}
          {loading ? 'Saving…' : 'Confirm details'}
        </button>

        {message && (
          <div role="status" className={`alert alert-soft ${success ? 'alert-success' : 'alert-error'}`}>
            <span>{message}</span>
          </div>
        )}

        <Link to="/" className="link link-hover text-sm text-center">Back to my friends</Link>
      </div>
    </form>
  )
}