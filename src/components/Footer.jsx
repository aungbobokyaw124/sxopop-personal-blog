import { Link } from 'react-router-dom'

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/courses', label: 'Courses' },
  { to: '/apps', label: 'Apps' },
  { to: '/pricing', label: 'Pricing' },
]

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(14,165,233,0.1)',
      background: '#0F172A',
      padding: '48px 24px 32px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32, marginBottom: 40 }}>

          {/* Brand */}
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 18, color: '#fff',
              }}>A</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#E2E8F0', fontFamily: 'Space Grotesk, sans-serif' }}>Aung Bo Bo Kyaw</div>
                <div style={{ fontSize: 10, color: '#0EA5E9', letterSpacing: '0.15em', textTransform: 'uppercase' }}>SXOPOP Founder</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
              SXOPOP Intelligent Hub — ဉာဏ်ရည်ထက်မြက်သော ဗဟိုစနစ်။ Technology, education & digital innovation from Myanmar.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0EA5E9', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Navigation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LINKS.map(l => (
                <Link key={l.to} to={l.to} style={{ fontSize: 14, color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#E2E8F0'}
                  onMouseLeave={e => e.target.style.color = '#64748B'}
                >{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0EA5E9', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Connect</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Facebook', href: '#' },
                { label: 'YouTube', href: '#' },
                { label: 'Telegram', href: '#' },
                { label: 'GitHub', href: 'https://github.com/aungbobokyaw124' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  style={{ fontSize: 14, color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#E2E8F0'}
                  onMouseLeave={e => e.target.style.color = '#64748B'}
                >{s.label}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <p style={{ fontSize: 13, color: '#334155' }}>© 2026 Aung Bo Bo Kyaw · SXOPOP. All rights reserved.</p>
          <p style={{ fontSize: 13, color: '#334155' }}>Built with ♥ in Myanmar</p>
        </div>
      </div>
    </footer>
  )
                  }
