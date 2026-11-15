import { Route, Routes } from 'react-router'
import { supabase } from './lib/supabaseClient'
import { useSession } from './lib/useSession'
import Login from './components/Login'
import Friends from './components/Friends'
import MyQrCode from './components/MyQrCode'
import AddFriend from './components/AddFriend'
import ThemeToggle from './components/ThemeToggle'

function Home() {
  const { session, loading } = useSession()

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <span className="loading loading-spinner loading-lg" />
      </main>
    )
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-base-200 grid place-items-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Login />
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm px-4">
        <div className="flex-1 text-lg font-bold">Friends</div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-sm opacity-70">{session.user.email}</span>
          <ThemeToggle />
          <button className="btn btn-sm btn-outline" onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-4xl p-4 grid gap-4 md:grid-cols-[auto_1fr] items-start">
        <MyQrCode userId={session.user.id} />
        <Friends userId={session.user.id} />
      </main>
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