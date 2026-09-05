import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/courses', label: 'Learn' },
  { to: '/apps', label: 'Apps' },
]

export default function Navbar({ session, onSignOut }) {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setMenuOpen(false), [pathname])
  useEffect(() => {
    const close = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <header className="site-header">
      <div ref={menuRef} className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            <img src="/assets/profile.png" alt="Aung Bo Bo Kyaw" className="nav-profile" />
            <div className="nav-brand-copy">
              <div className="nav-name">Aung Bo Bo Kyaw</div>
              <div className="nav-tagline">SXOPOP · Intelligent Hub</div>
            </div>
          </Link>

          <nav className="desktop-nav">
            {NAV_LINKS.map(link => {
              const active = pathname === link.to || (link.to === '/blog' && pathname.startsWith('/blog/'))
              return <Link key={link.to} to={link.to} className={`nav-link ${active ? 'active' : ''}`}>{link.label}</Link>
            })}
            <Link to="/pricing" className="nav-explore">Explore</Link>
            {session && <Link to="/admin" className="nav-dashboard">Dashboard</Link>}
          </nav>

          <button onClick={() => setMenuOpen(v => !v)} className="mobile-menu-button" aria-label="Menu" aria-expanded={menuOpen}>
            {[0,1,2].map(i => <span key={i} className={menuOpen ? `bar-${i + 1}` : ''} />)}
          </button>
        </div>

        <div className={`mobile-panel ${menuOpen ? 'open' : ''}`}>
          <div className="mobile-panel-inner">
            {NAV_LINKS.map(link => <Link key={link.to} to={link.to} className={pathname === link.to ? 'active' : ''}>{link.label}</Link>)}
            <Link to="/pricing" className="mobile-explore">Explore SXOPOP</Link>
            {session && <button onClick={onSignOut}>Sign out</button>}
          </div>
        </div>
      </div>
    </header>
  )
}
