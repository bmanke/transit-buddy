import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import Login from './components/Login'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token_hash = params.get('token_hash')
    const type = params.get('type')

    if (token_hash && type === 'email') {
      supabase.auth.verifyOtp({ token_hash, type: 'email' }).then(({ error }) => {
        if (!error) window.history.replaceState({}, '', window.location.pathname)
      })
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))

    return () => subscription.unsubscribe()
  }, [])

  if (!session) return <Login />

  return (
    <div>
      <p>Signed in as {session.user.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  )
}