// src/components/Friend.tsx

import { useCallback, useEffect, useState, type SubmitEvent } from 'react'
import {
  acceptRequest, getFriendships, removeFriendship, searchProfiles, sendFriendRequest,
  type Friendship, type Profile,
} from '../lib/friends'

type Props = { userId: number }

const displayName = (p: Profile) => p.display_name ?? p.username ?? 'Unknown'

export default function Friends({ userId }: Props) {
  const [rows, setRows] = useState<Friendship[]>([])
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [message, setMessage] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setRows(await getFriendships())
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed to load friends')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const other = (f: Friendship) => (f.requester.id === userId ? f.addressee : f.requester)

  const friends = rows.filter((f) => f.status === 'accepted')
  const incoming = rows.filter((f) => f.status === 'pending' && f.addressee.id === userId)
  const outgoing = rows.filter((f) => f.status === 'pending' && f.requester.id === userId)

  const handleSearch = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setResults(term.trim() ? await searchProfiles(term.trim()) : [])
  }

  const handleAdd = async (id: number) => {
    const { ok, error } = await sendFriendRequest(id)
    setMessage(ok ? 'Request sent.' : error)
    if (ok) load()
  }

  const run = async (fn: () => Promise<{ ok: boolean; error: string | null }>) => {
    const { ok, error } = await fn()
    if (!ok) setMessage(error)
    load()
  }

  return (
    <section>
      <h2>Friends ({friends.length})</h2>
      {message && <p role="status">{message}</p>}

      <ul>
        {friends.map((f) => (
          <li key={f.id}>
            {displayName(other(f))}{' '}
            <button onClick={() => run(() => removeFriendship(f.id))}>Remove</button>
          </li>
        ))}
        {friends.length === 0 && <li>No friends yet.</li>}
      </ul>

      <h3>Requests</h3>
      <ul>
        {incoming.map((f) => (
          <li key={f.id}>
            {displayName(f.requester)}{' '}
            <button onClick={() => run(() => acceptRequest(f.id))}>Accept</button>{' '}
            <button onClick={() => run(() => removeFriendship(f.id))}>Decline</button>
          </li>
        ))}
        {outgoing.map((f) => (
          <li key={f.id}>
            {displayName(f.addressee)} (pending){' '}
            <button onClick={() => run(() => removeFriendship(f.id))}>Cancel</button>
          </li>
        ))}
      </ul>

      <h3>Add a friend</h3>
      <form onSubmit={handleSearch}>
        <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search username" />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results
          .filter((p) => p.id !== userId)
          .map((p) => (
            <li key={p.id}>
              {displayName(p)} <button onClick={() => handleAdd(p.id)}>Add</button>
            </li>
          ))}
      </ul>
    </section>
  )
}