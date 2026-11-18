// src/components/Login.tsx
import { type SubmitEvent, useState } from 'react'
import { sendMagicLink } from '../lib/auth'
import TransitLogo from './TransitLogo'

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
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <TransitLogo />

      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl w-full">
        <div className="card-body gap-4">
          <h2 className="card-title">Sign in</h2>
          <p className="text-sm opacity-70">
            Enter your email and we'll send you a magic link.
          </p>

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
            <div
              role="status"
              className={`alert alert-soft ${sent ? 'alert-success' : 'alert-error'}`}
            >
              <span>{message}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}