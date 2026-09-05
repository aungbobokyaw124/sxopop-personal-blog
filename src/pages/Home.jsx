import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// ---- Data ----
const ROLES = ['Technology Creator', 'Digital Builder', 'Educator', 'Entrepreneur', 'Electronics Expert']

const PLATFORMS = [
  { name: 'Facebook', icon: '📘', color: '#1877F2' },
  { name: 'YouTube', icon: '▶️', color: '#FF0000' },
  { name: 'Telegram', icon: '✈️', color: '#26A5E4' },
  { name: 'GitHub', icon: '🐙', color: '#E2E8F0' },
  { name: 'Vercel', icon: '▲', color: '#E2E8F0' },
  { name: 'Supabase', icon: '⚡', color: '#10B981' },
  { name: 'ChatGPT', icon: '🤖', color: '#10A37F' },
  { name: 'Claude', icon: '✦', color: '#D97706' },
  { name: 'Gemini', icon: '♊', color: '#4285F4' },
  { name: 'Figma', icon: '🎨', color: '#F24E1E' },
]

const CATEGORIES = [
  { label: 'နည်းပညာ', en: 'Technology', icon: '💻', color: '#0EA5E9' },
  { label: 'ဘာသာရေး', en: 'Religion', icon: '🕌', color: '#F59E0B' },
  { label: 'လူမှုရေး', en: 'Social', icon: '🤝', color: '#10B981' },
  { label: 'အီလက်ထရွန်းနစ်', en: 'Electronics', icon: '⚡', color: '#8B5CF6' },
  { label: 'လူငယ်ရေးရာ', en: 'Youth', icon: '🌟', color: '#EC4899' },
  { label: 'မိသားစု', en: 'Family', icon: '👨‍👩‍👧', color: '#F97316' },
]

// ---- Scroll reveal hook ----
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.15 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ---- Role Typewriter ----
function RoleText() {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = ROLES[index]
    let timeout

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setIndex(i => (i + 1) % ROLES.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, index])

  return (
    <span style={{
      background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    }}>
      {displayed}
      <span style={{ WebkitTextFillColor: '#0EA5E9', animation: 'blink 1s step-end infinite' }}>|</span>
    </span>
  )
}

// ---- Platform Slider ----
function PlatformSlider() {
  const trackRef = useRef(null)
  const doubled = [...PLATFORMS, ...PLATFORMS]

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 80,
        background: 'linear-gradient(90deg, #020817, transparent)', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
        background: 'linear-gradient(270deg, #020817, transparent)', zIndex: 1,
      }} />
      <div ref={trackRef} style={{
        display: 'flex', gap: 16,
        animation: 'slideTrack 25s linear infinite',
        width: 'max-content',
      }}>
        {doubled.map((p, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 20px', borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            <span style={{ fontSize: 20 }}>{p.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: p.color }}>{p.name}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideTrack {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

// ---- Main ----
export default function Home() {
  useReveal()
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  useEffect(() => {
    supabase.from('posts')
      .select('id,title,slug,excerpt,content,status,created_at,category')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => { setPosts(data || []); setLoadingPosts(false) })
  }, [])

  return (
    <div style={{ paddingTop: 68 }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: '#020817',
      }} className="grid-bg">

        {/* Orbs */}
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)',
          top: -100, right: -100, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          bottom: 0, left: -100, pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          <div style={{ maxWidth: 750 }}>

            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 100,
              border: '1px solid rgba(14,165,233,0.3)',
              background: 'rgba(14,165,233,0.08)',
              marginBottom: 32,
              animation: 'fadeUp 0.6s ease forwards',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', animation: 'pulse-glow 2s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0EA5E9', letterSpacing: '0.05em' }}>
                SXOPOP Intelligent Hub · Myanmar
              </span>
            </div>

            {/* Heading */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900, lineHeight: 1.1,
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#E2E8F0', marginBottom: 24,
              animation: 'fadeUp 0.6s 0.1s ease both',
            }}>
              Aung Bo Bo Kyaw
            </h1>

            <h2 style={{
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              fontWeight: 600, color: '#94A3B8',
              marginBottom: 32, minHeight: '2.5rem',
              animation: 'fadeUp 0.6s 0.2s ease both',
            }}>
              <RoleText />
            </h2>

            <p style={{
              fontSize: 17, lineHeight: 1.8, color: '#64748B',
              maxWidth: 580, marginBottom: 48,
              animation: 'fadeUp 0.6s 0.3s ease both',
            }}>
              နည်းပညာ၊ ပညာရေး၊ နှင့် ဒစ်ဂျစ်တယ်ဆန်းသစ်တီထွင်မှုများကို Myanmar မှ ကမ္ဘာသို့ ဖန်တီးဆောင်ရွက်နေသူ။
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 16,
              animation: 'fadeUp 0.6s 0.4s ease both',
            }}>
              <Link to="/about" style={{
                padding: '14px 32px', borderRadius: 12,
                fontWeight: 700, fontSize: 15,
                textDecoration: 'none', color: '#020817',
                background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
                boxShadow: '0 0 30px rgba(14,165,233,0.3)',
                transition: 'all 0.3s ease',
              }}>About Me →</Link>
              <Link to="/blog" style={{
                padding: '14px 32px', borderRadius: 12,
                fontWeight: 700, fontSize: 15,
                textDecoration: 'none', color: '#E2E8F0',
                border: '1px solid rgba(14,165,233,0.3)',
                background: 'rgba(14,165,233,0.05)',
                transition: 'all 0.3s ease',
              }}>Read Blog</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platforms Slider ── */}
      <section style={{ padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#334155', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>
          Tools & Platforms I Use
        </p>
        <PlatformSlider />
      </section>

      {/* ── Blog Categories ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div className="reveal" style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0EA5E9', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
            Art Of IT · Art Of Family
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#E2E8F0', fontFamily: 'Space Grotesk, sans-serif' }}>
            Topics I Write About
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          {CATEGORIES.map((cat, i) => (
            <Link key={cat.en} to={`/blog?cat=${cat.en.toLowerCase()}`}
              className="reveal"
              style={{
                textDecoration: 'none',
                padding: '28px 20px', borderRadius: 16,
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid rgba(255,255,255,0.08)`,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                animationDelay: `${i * 0.08}s`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `rgba(${cat.color === '#0EA5E9' ? '14,165,233' : cat.color === '#10B981' ? '16,185,129' : '139,92,246'},0.08)`
                e.currentTarget.style.borderColor = cat.color
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{cat.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginBottom: 4 }}>{cat.label}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{cat.en}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Latest Posts ── */}
      <section style={{ background: '#0F172A', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0EA5E9', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Latest</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#E2E8F0', fontFamily: 'Space Grotesk, sans-serif' }}>Recent Posts</h2>
            </div>
            <Link to="/blog" style={{ fontSize: 14, fontWeight: 700, color: '#0EA5E9', textDecoration: 'none' }}>View all →</Link>
          </div>

          {loadingPosts ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {[1, 2].map(i => <div key={i} style={{ height: 200, borderRadius: 16, background: 'rgba(255,255,255,0.05)', animation: 'pulse 2s infinite' }} />)}
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#334155' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
              <p style={{ fontSize: 16, fontWeight: 600 }}>Posts များ မကြာမီ ရောက်ရှိမည်</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {posts.map((post, i) => (
                <Link key={post.id} to={`/blog/${post.slug}`}
                  className="reveal"
                  style={{
                    textDecoration: 'none', display: 'block',
                    padding: '28px', borderRadius: 16,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#0EA5E9', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                    {new Date(post.created_at).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#E2E8F0', marginBottom: 12, lineHeight: 1.4, fontFamily: 'Space Grotesk, sans-serif' }}>{post.title}</h3>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.excerpt || post.content?.slice(0, 120)}
                  </p>
                  <span style={{ display: 'inline-block', marginTop: 16, fontSize: 13, fontWeight: 700, color: '#0EA5E9' }}>Read more →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Course Teaser ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div className="reveal" style={{
          borderRadius: 24, overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(16,185,129,0.1))',
          border: '1px solid rgba(14,165,233,0.2)',
          padding: 'clamp(32px, 5vw, 64px)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 32,
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#10B981', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Online Courses</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, color: '#E2E8F0', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 16 }}>
              Learn with Aung Bo Bo Kyaw
            </h2>
            <p style={{ fontSize: 15, color: '#64748B', maxWidth: 480, lineHeight: 1.7 }}>
              Free နှင့် Premium သင်တန်းများ — နည်းပညာ၊ အီလက်ထရွန်းနစ်၊ နှင့် Digital Skills များ Myanmar လူငယ်များအတွက်။
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/courses" style={{
              padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15,
              textDecoration: 'none', color: '#020817',
              background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
              boxShadow: '0 0 30px rgba(14,165,233,0.3)',
            }}>View Courses</Link>
            <Link to="/pricing" style={{
              padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15,
              textDecoration: 'none', color: '#E2E8F0',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.08)',
