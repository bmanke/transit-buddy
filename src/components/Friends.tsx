import { useCallback, useEffect, useState, type SubmitEvent } from 'react'
import {
  acceptRequest, getFriendships, removeFriendship, searchProfiles, sendFriendRequest,
  type Friendship, type Profile,
} from '../lib/friends'
import Avatar from './Avatar'

type Props = { userId: string }

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

  const handleAdd = async (id: string) => {
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
    <section className="grid gap-4">
      {message && (
        <div role="status" className="alert alert-info alert-soft">
          <span>{message}</span>
          <button className="btn btn-xs btn-ghost" onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">
            Friends <span className="badge badge-primary">{friends.length}</span>
          </h2>
          <ul className="list">
            {friends.map((f) => (
              <li key={f.id} className="list-row items-center">
                <Avatar name={displayName(other(f))} />
                <div className="list-col-grow font-medium">{displayName(other(f))}</div>
                <button className="btn btn-sm btn-ghost text-error" onClick={() => run(() => removeFriendship(f.id))}>
                  Remove
                </button>
              </li>
            ))}
            {friends.length === 0 && <li className="list-row opacity-60">No friends yet.</li>}
          </ul>
        </div>
      </div>

      {(incoming.length > 0 || outgoing.length > 0) && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Requests</h2>
            <ul className="list">
              {incoming.map((f) => (
                <li key={f.id} className="list-row items-center">
                  <Avatar name={displayName(f.requester)} />
                  <div className="list-col-grow font-medium">{displayName(f.requester)}</div>
                  <button className="btn btn-sm btn-success" onClick={() => run(() => acceptRequest(f.id))}>
                    Accept
                  </button>
                  <button className="btn btn-sm btn-ghost" onClick={() => run(() => removeFriendship(f.id))}>
                    Decline
                  </button>
                </li>
              ))}
              {outgoing.map((f) => (
                <li key={f.id} className="list-row items-center">
                  <Avatar name={displayName(f.addressee)} />
                  <div className="list-col-grow">
                    <span className="font-medium">{displayName(f.addressee)}</span>{' '}
                    <span className="badge badge-warning badge-sm">pending</span>
                  </div>
                  <button className="btn btn-sm btn-ghost" onClick={() => run(() => removeFriendship(f.id))}>
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Add a friend</h2>
          <form onSubmit={handleSearch} className="join w-full">
            <input
              className="input join-item w-full"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search username"
            />
            <button type="submit" className="btn btn-primary join-item">Search</button>
          </form>
          <ul className="list">
            {results
              .filter((p) => p.id !== userId)
              .map((p) => (
                <li key={p.id} className="list-row items-center">
                  <Avatar name={displayName(p)} />
                  <div className="list-col-grow font-medium">{displayName(p)}</div>
                  <button className="btn btn-sm btn-primary" onClick={() => handleAdd(p.id)}>Add</button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  )
}