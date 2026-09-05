import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Preloader from './components/Preloader'
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
  return session ? children : <Navigate to="/admin/login" replace />
}

function Layout({ session, onSignOut, children }) {
  return <div className="min-h-screen" style={{ background: '#020817', color: '#E2E8F0' }}><Navbar session={session} onSignOut={onSignOut} /><main>{children}</main><Footer /></div>
}

export default function App() {
  const [session, setSession] = useState(null)
  const [preloaderDone, setPreloaderDone] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (mounted) setSession(data?.session ?? null)
      } catch (error) {
        console.error('Supabase auth init failed:', error)
        if (mounted) setSession(null)
      }
    }
    loadSession()
    let subscription
    try {
      const result = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (mounted) setSession(nextSession ?? null)
      })
      subscription = result?.data?.subscription
    } catch (error) {
      console.error('Supabase auth listener failed:', error)
    }
    return () => { mounted = false; subscription?.unsubscribe() }
  }, [])

  const handlePreloaderDone = useCallback(() => setPreloaderDone(true), [])

  useEffect(() => {
    const timer = setTimeout(() => setPreloaderDone(true), 4500)
    return () => clearTimeout(timer)
  }, [])

  const signOut = async () => {
    try { await supabase.auth.signOut() } catch (error) { console.error('Sign out failed:', error) }
    finally { setSession(null) }
  }

  return <>
    {!preloaderDone && <Preloader onDone={handlePreloaderDone} />}
    <div style={{ minHeight: '100vh', opacity: preloaderDone ? 1 : 0, transition: 'opacity .35s ease', visibility: preloaderDone ? 'visible' : 'hidden' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout session={session} onSignOut={signOut}><Home /></Layout>} />
          <Route path="/about" element={<Layout session={session} onSignOut={signOut}><About /></Layout>} />
          <Route path="/blog" element={<Layout session={session} onSignOut={signOut}><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout session={session} onSignOut={signOut}><Post /></Layout>} />
          <Route path="/courses" element={<Layout session={session} onSignOut={signOut}><Courses /></Layout>} />
          <Route path="/apps" element={<Layout session={session} onSignOut={signOut}><Apps /></Layout>} />
          <Route path="/pricing" element={<Layout session={session} onSignOut={signOut}><Pricing /></Layout>} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute session={session}><Dashboard session={session} onSignOut={signOut} /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  </>
}
