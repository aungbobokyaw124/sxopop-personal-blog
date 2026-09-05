import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Preloader from './components/Preloader'

// Pages (ပြီးရင် တစ်ခုချင်း ဆောက်မယ်)
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import Post from './pages/Post'
import Courses from './pages/Courses'
import Apps from './pages/Apps'
import Pricing from './pages/Pricing'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'

function PrivateRoute({ session, children }) {
  if (!session) return <Navigate to="/admin/login" replace />
  return children
}

function Layout({ session, onSignOut, children }) {
  return (
    <div className="min-h-screen" style={{ background: '#020817' }}>
      <Navbar session={session} onSignOut={onSignOut} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(undefined)
  const [preloaderDone, setPreloaderDone] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  const handlePreloaderDone = useCallback(() => setPreloaderDone(true), [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  // Session loading
  if (session === undefined) return null

  return (
    <>
      {!preloaderDone && <Preloader onDone={handlePreloaderDone} />}

      <div style={{
        opacity: preloaderDone ? 1 : 0,
        transition: 'opacity 0.6s ease',
        visibility: preloaderDone ? 'visible' : 'hidden',
      }}>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Layout session={session} onSignOut={signOut}><Home /></Layout>} />
            <Route path="/about" element={<Layout session={session} onSignOut={signOut}><About /></Layout>} />
            <Route path="/blog" element={<Layout session={session} onSignOut={signOut}><Blog /></Layout>} />
            <Route path="/blog/:slug" element={<Layout session={session} onSignOut={signOut}><Post /></Layout>} />
            <Route path="/courses" element={<Layout session={session} onSignOut={signOut}><Courses /></Layout>} />
            <Route path="/apps" element={<Layout session={session} onSignOut={signOut}><Apps /></Layout>} />
            <Route path="/pricing" element={<Layout session={session} onSignOut={signOut}><Pricing /></Layout>} />

            {/* Admin */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={
              <PrivateRoute session={session}>
                <Dashboard session={session} onSignOut={signOut} />
              </PrivateRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}
