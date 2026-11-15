// src/components/AddFriend.tsx

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useSession } from '../lib/useSession'
import { getFriendships, getProfile, sendFriendRequest, type Profile } from '../lib/friends'
import Login from './Login'

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

  if (loading) return <p>Loading…</p>

  if (!session) {
    return (
      <div>
        <h1>Sign in to add a friend</h1>
        <Login redirectTo={window.location.href} />
      </div>
    )
  }

  if (notFound) return <p>That profile doesn't exist. <Link to="/">Go home</Link></p>
  if (!profile) return <p>{message ?? 'Loading profile…'}</p>

  const name = profile.display_name ?? profile.username ?? 'this user'

  if (profile.id === userId) {
    return <p>This is your own QR code. <Link to="/">Go home</Link></p>
  }

  const handleAdd = async () => {
    const { ok, error } = await sendFriendRequest(profile.id)
    if (ok) setExisting('pending')
    setMessage(ok ? 'Friend request sent.' : error)
  }

  return (
    <div>
      <h1>{name}</h1>
      {profile.username && <p>@{profile.username}</p>}

      {existing === 'accepted' && <p>You're already friends.</p>}
      {existing === 'pending' && <p>A friend request is already pending.</p>}
      {!existing && <button onClick={handleAdd}>Send friend request</button>}

      {message && <p role="status">{message}</p>}
      <p><Link to="/">Back to my friends</Link></p>
    </div>
  )
}