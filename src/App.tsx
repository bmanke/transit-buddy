import { Route, Routes } from 'react-router'
import { supabase } from './lib/supabaseClient'
import { useSession } from './lib/useSession'
import Login from './components/Login'
import Friends from './components/Friends'
import MyQrCode from './components/MyQrCode'
import AddFriend from './components/AddFriend'

function Home() {
  const { session, loading } = useSession()
  if (loading) return <p>Loading…</p>
  if (!session) return <Login />

  return (
    <div>
      <p>Signed in as {session.user.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
      <MyQrCode userId={session.user.id} />
      <Friends userId={session.user.id} />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add/:id" element={<AddFriend />} />
    </Routes>
  )
}