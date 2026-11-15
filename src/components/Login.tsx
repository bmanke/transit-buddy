// src/components/Login.tsx
import { type SubmitEvent, useState} from 'react'
import { sendMagicLink } from '../lib/auth'

type Props = { redirectTo?: string }

export default function Login({ redirectTo }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { ok, error } = await sendMagicLink(email, redirectTo)

    setMessage(ok ? 'Check your email for the sign-in link.' : error)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send magic link'}
      </button>
      {message && <p role="status">{message}</p>}
    </form>
  )
}