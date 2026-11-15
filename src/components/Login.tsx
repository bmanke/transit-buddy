import { type SubmitEvent, useState } from 'react'
import { sendMagicLink } from '../lib/auth'

type Props = { redirectTo?: string }

export default function Login({ redirectTo }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { ok, error } = await sendMagicLink(email, redirectTo)

    setSent(ok)
    setMessage(ok ? 'Check your email for the sign-in link.' : error)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl w-full max-w-sm">
      <div className="card-body gap-4">
        <h2 className="card-title">Sign in</h2>
        <p className="text-sm opacity-70">Enter your email and we'll send you a magic link.</p>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Email</legend>
          <input
            id="email"
            type="email"
            className="input w-full"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </fieldset>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && <span className="loading loading-spinner loading-sm" />}
          {loading ? 'Sending…' : 'Send magic link'}
        </button>

        {message && (
          <div role="status" className={`alert ${sent ? 'alert-success' : 'alert-error'} alert-soft`}>
            <span>{message}</span>
          </div>
        )}
      </div>
    </form>
  )
}