import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/courses', label: 'Courses' },
  { to: '/apps', label: 'Apps' },
  { to: '/pricing', label: 'Pricing' },
]

export default function Navbar({ session, onSignOut }) {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(2,8,23,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(14,165,233,0.1)' : '1px solid transparent',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px',
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 18, color: '#fff',
            boxShadow: '0 0 20px rgba(14,165,233,0.3)',
            fontFamily: 'Space Grotesk, sans-serif',
          }}>A</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#E2E8F0', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.2 }}>
              Aung Bo Bo Kyaw
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#0EA5E9', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              SXOPOP Founder
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
          {NAV_LINKS.map(link => {
            const active = pathname === link.to
            return (
              <Link key={link.to} to={link.to} style={{
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: 14, fontWeight: 600,
                textDecoration: 'none',
                color: active ? '#0EA5E9' : '#94A3B8',
                background: active ? 'rgba(14,165,233,0.1)' : 'transparent',
                border: active ? '1px solid rgba(14,165,233,0.2)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { if (!active) { e.target.style.color = '#E2E8F0'; e.target.style.background = 'rgba(255,255,255,0.05)' } }}
                onMouseLeave={e => { if (!active) { e.target.style.color = '#94A3B8'; e.target.style.background = 'transparent' } }}
              >
                {link.label}
              </Link>
            )
          })}

          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
              <Link to="/admin" style={{
                padding: '8px 16px', borderRadius: 10,
                fontSize: 14, fontWeight: 700,
                textDecoration: 'none',
                color: '#10B981',
                border: '1px solid rgba(16,185,129,0.3)',
                background: 'rgba(16,185,129,0.08)',
                transition: 'all 0.2s ease',
              }}>Dashboard</Link>
              <button onClick={onSignOut} style={{
                padding: '8px 16px', borderRadius: 10,
                fontSize: 14, fontWeight: 700,
                color: '#94A3B8', background: 'transparent',
                border: '1px solid rgba(148,163,184,0.2)',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}>Sign out</button>
            </div>
          ) : (
            <Link to="/admin" style={{
              marginLeft: 8, padding: '8px 20px', borderRadius: 10,
              fontSize: 14, fontWeight: 700,
              textDecoration: 'none', color: '#020817',
              background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
              boxShadow: '0 0 20px rgba(14,165,233,0.3)',
              transition: 'all 0.2s ease',
            }}>Admin</Link>
          )}
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: 'none', flexDirection: 'column', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
          }}
          className="show-mobile"
          aria-label="Menu"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 24, height: 2,
              background: '#E2E8F0', borderRadius: 2,
              transition: 'all 0.3s ease',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                  : i === 1 ? 'scaleX(0)'
                  : 'rotate(-45deg) translate(5px, -5px)'
                : 'none',
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <div style={{
        overflow: 'hidden',
        maxHeight: menuOpen ? 400 : 0,
        transition: 'max-height 0.4s ease',
        background: 'rgba(2,8,23,0.97)',
        borderBottom: menuOpen ? '1px solid rgba(14,165,233,0.1)' : 'none',
      }}>
        <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} style={{
              padding: '12px 16px', borderRadius: 10,
              fontSize: 15, fontWeight: 600,
              textDecoration: 'none',
              color: pathname === link.to ? '#0EA5E9' : '#94A3B8',
              background: pathname === link.to ? 'rgba(14,165,233,0.08)' : 'transparent',
              transition: 'all 0.2s ease',
            }}>{link.label}</Link>
          ))}
          {session
            ? <button onClick={onSignOut} style={{ marginTop: 8, padding: '12px 16px', borderRadius: 10, fontSize: 15, fontWeight: 700, color: '#94A3B8', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Sign out</button>
            : <Link to="/admin" style={{ marginTop: 8, padding: '12px 16px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', color: '#020817', background: 'linear-gradient(135deg, #0EA5E9, #10B981)', textAlign: 'center' }}>Admin</Link>
          }
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  )
      }
