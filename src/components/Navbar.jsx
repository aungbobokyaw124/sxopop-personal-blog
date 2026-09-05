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
    <header style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,padding:'10px 14px',pointerEvents:'none' }}>
      <div ref={menuRef} style={{ maxWidth:1180,margin:'0 auto',pointerEvents:'auto',borderRadius:18,border:'1px solid rgba(148,163,184,.12)',background:scrolled?'rgba(5,8,22,.82)':'rgba(5,8,22,.48)',backdropFilter:'blur(22px)',WebkitBackdropFilter:'blur(22px)',boxShadow:scrolled?'0 14px 50px rgba(0,0,0,.28)':'none',transition:'all .3s ease' }}>
        <div style={{ height:58,padding:'0 14px 0 16px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link to="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:10,minWidth:0}}>
            <div style={{width:36,height:36,borderRadius:11,background:'linear-gradient(135deg,#38BDF8,#34D399)',display:'grid',placeItems:'center',fontWeight:900,fontSize:17,color:'#03111f',boxShadow:'0 0 24px rgba(56,189,248,.22)',fontFamily:'Space Grotesk,sans-serif'}}>A</div>
            <div style={{minWidth:0}}>
              <div style={{fontWeight:800,fontSize:14,color:'#F8FAFC',fontFamily:'Space Grotesk,sans-serif',lineHeight:1.15,whiteSpace:'nowrap'}}>Aung Bo Bo Kyaw</div>
              <div style={{fontSize:8.5,fontWeight:800,color:'#38BDF8',letterSpacing:'.14em',textTransform:'uppercase',marginTop:3}}>SXOPOP · Intelligent Hub</div>
            </div>
          </Link>

          <nav className="desktop-nav" style={{display:'flex',alignItems:'center',gap:3}}>
            {NAV_LINKS.map(link => {
              const active = pathname === link.to || (link.to === '/blog' && pathname.startsWith('/blog/'))
              return <Link key={link.to} to={link.to} style={{padding:'8px 12px',borderRadius:10,fontSize:13,fontWeight:650,textDecoration:'none',color:active?'#F8FAFC':'#94A3B8',background:active?'rgba(56,189,248,.10)':'transparent',border:active?'1px solid rgba(56,189,248,.16)':'1px solid transparent',transition:'all .2s'}}>{link.label}</Link>
            })}
            <Link to="/pricing" style={{marginLeft:5,padding:'8px 15px',borderRadius:10,fontSize:13,fontWeight:750,textDecoration:'none',color:'#06121d',background:'linear-gradient(135deg,#38BDF8,#34D399)',boxShadow:'0 5px 22px rgba(56,189,248,.18)'}}>Explore</Link>
            {session && <Link to="/admin" style={{marginLeft:4,padding:'8px 12px',borderRadius:10,fontSize:12,fontWeight:700,textDecoration:'none',color:'#34D399',border:'1px solid rgba(52,211,153,.2)',background:'rgba(52,211,153,.06)'}}>Dashboard</Link>}
          </nav>

          <button onClick={()=>setMenuOpen(v=>!v)} className="mobile-menu-button" aria-label="Menu" style={{display:'none',width:40,height:40,borderRadius:11,border:'1px solid rgba(148,163,184,.14)',background:'rgba(255,255,255,.04)',cursor:'pointer',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:4}}>
            {[0,1,2].map(i=><span key={i} style={{width:18,height:2,borderRadius:2,background:'#E2E8F0',transition:'all .2s',transform:menuOpen?(i===0?'translateY(6px) rotate(45deg)':i===2?'translateY(-6px) rotate(-45deg)':'scaleX(0)'):'none'}}/>) }
          </button>
        </div>

        <div style={{maxHeight:menuOpen?420:0,overflow:'hidden',transition:'max-height .3s ease',display:'none'}} className="mobile-panel">
          <div style={{padding:'4px 12px 14px',display:'flex',flexDirection:'column',gap:4}}>
            {NAV_LINKS.map(link=><Link key={link.to} to={link.to} style={{padding:'12px 14px',borderRadius:10,fontSize:15,fontWeight:650,textDecoration:'none',color:pathname===link.to?'#38BDF8':'#CBD5E1',background:pathname===link.to?'rgba(56,189,248,.08)':'transparent'}}>{link.label}</Link>)}
            <Link to="/pricing" style={{marginTop:5,padding:'12px 14px',borderRadius:10,textAlign:'center',fontWeight:750,textDecoration:'none',color:'#06121d',background:'linear-gradient(135deg,#38BDF8,#34D399)'}}>Explore SXOPOP</Link>
            {session && <button onClick={onSignOut} style={{marginTop:3,padding:'12px 14px',borderRadius:10,textAlign:'left',fontWeight:650,color:'#94A3B8',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.06)'}}>Sign out</button>}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:820px){.desktop-nav{display:none!important}.mobile-menu-button{display:flex!important}.mobile-panel{display:block!important}}@media(min-width:821px){.mobile-panel{display:none!important}}`}</style>
    </header>
  )
}
