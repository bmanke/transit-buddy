import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useSession } from '../lib/useSession'
import { getFriendships, getProfile, sendFriendRequest, type Profile } from '../lib/friends'
import Login from './Login'
import Avatar from './Avatar'
import ThemeToggle from './ThemeToggle'

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-base-200 grid place-items-center p-4">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      {children}
    </main>
  )
}

export default function AddFriend() {
  const { id } = useParams()
  const { session, loading } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [existing, setExisting] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const userId = session?.user.id

  useEffect(() => {
    if (!userId || !id) return
    ;(async () => {
      const p = await getProfile(id)
      if (!p) return setNotFound(true)
      setProfile(p)
      const rows = await getFriendships()
      const match = rows.find((f) => f.requester.id === id || f.addressee.id === id)
      if (match) setExisting(match.status)
    })().catch((e) => setMessage(e instanceof Error ? e.message : 'Something went wrong'))
  }, [userId, id])

  if (loading) {
    return <Shell><span className="loading loading-spinner loading-lg" /></Shell>
  }

  if (!session) {
    return (
      <Shell>
        <div className="grid gap-4 justify-items-center w-full">
          <h1 className="text-xl font-bold">Sign in to add a friend</h1>
          <Login redirectTo={window.location.href} />
        </div>
      </Shell>
    )
  }

  if (notFound) {
    return (
      <Shell>
        <div className="alert alert-warning">
          <span>That profile doesn't exist.</span>
          <Link to="/" className="btn btn-sm">Go home</Link>
        </div>
      </Shell>
    )
  }

  if (!profile) {
    return (
      <Shell>
        {message
          ? <div className="alert alert-error"><span>{message}</span></div>
          : <span className="loading loading-spinner loading-lg" />}
      </Shell>
    )
  }

  const name = profile.display_name ?? profile.username ?? 'this user'

  if (profile.id === userId) {
    return (
      <Shell>
        <div className="alert alert-info">
          <span>This is your own QR code.</span>
          <Link to="/" className="btn btn-sm">Go home</Link>
        </div>
      </Shell>
    )
  }

  const handleAdd = async () => {
    const { ok, error } = await sendFriendRequest(profile.id)
    if (ok) setExisting('pending')
    setMessage(ok ? 'Friend request sent.' : error)
  }

  return (
    <Shell>
      <div className="card bg-base-100 shadow-xl w-full max-w-sm">
        <div className="card-body items-center text-center gap-3">
          <Avatar name={name} />
          <h1 className="card-title text-2xl">{name}</h1>
          {profile.username && <p className="opacity-70">@{profile.username}</p>}

          {existing === 'accepted' && <div className="badge badge-success">You're already friends</div>}
          {existing === 'pending' && <div className="badge badge-warning">Request pending</div>}
          {!existing && (
            <button className="btn btn-primary btn-wide" onClick={handleAdd}>
              Send friend request
            </button>
          )}

          {message && <div role="status" className="alert alert-info alert-soft w-full"><span>{message}</span></div>}

          <Link to="/" className="link link-hover text-sm">Back to my friends</Link>
        </div>
      </div>
    </Shell>
  )
}