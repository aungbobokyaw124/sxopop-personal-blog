import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const ROLES = [
  { icon: '🔧', title: 'Electronics Technician', desc: 'ဖုန်း၊ laptop၊ circuit board ပြင်ဆင်ခြင်း နှင့် service လုပ်ငန်း' },
  { icon: '💻', title: 'Technology Creator', desc: 'Web app၊ digital tool နှင့် platform များ တည်ဆောက်သူ' },
  { icon: '🎓', title: 'Educator', desc: 'နည်းပညာ နှင့် life skills သင်ကြားပေးသော ဆရာ' },
  { icon: '📱', title: 'Content Creator', desc: 'Myanmar audience အတွက် practical content ဖန်တီးသူ' },
  { icon: '🚀', title: 'Entrepreneur', desc: 'SXOPOP brand ကို တည်ထောင်သော လုပ်ငန်းရှင်' },
  { icon: '🌐', title: 'Platform Builder', desc: 'Digital ecosystem နှင့် product တည်ဆောက်သူ' },
]

const SKILLS = [
  { category: 'Frontend', items: ['React', 'Vite', 'Tailwind CSS', 'HTML/CSS'] },
  { category: 'Backend', items: ['Supabase', 'Node.js', 'REST API'] },
  { category: 'Tools', items: ['Figma', 'GitHub', 'Vercel', 'VS Code'] },
  { category: 'AI Tools', items: ['Claude', 'ChatGPT', 'Gemini', 'Midjourney'] },
  { category: 'Electronics', items: ['Circuit Repair', 'PCB Design', 'Soldering', 'Diagnostics'] },
  { category: 'Content', items: ['Video Editing', 'Scripting', 'Podcast', 'Copywriting'] },
]

const JOURNEY = [
  { year: '2018', title: 'Electronics Technician', desc: 'ဖုန်းနှင့် electronics ပြင်ဆင်ရေး လုပ်ငန်း စတင်' },
  { year: '2020', title: 'Content Creator', desc: 'Myanmar audience အတွက် နည်းပညာ content ဖန်တီးစ' },
  { year: '2022', title: 'Digital Builder', desc: 'Web development နှင့် digital tools လေ့လာစတင်' },
  { year: '2024', title: 'SXOPOP Founded', desc: 'Personal brand နှင့် digital platform တည်ထောင်' },
  { year: '2026', title: 'Platform Builder', desc: 'neXa ecosystem နှင့် online courses launch' },
]

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function About() {
  useReveal()

  return (
    <div style={{ paddingTop: 68 }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '70vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: '#020817', padding: '80px 24px',
      }} className="grid-bg">

        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
          top: -100, right: -50, pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 64 }}>

            {/* Text */}
            <div style={{ flex: '1 1 400px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 100,
                border: '1px solid rgba(16,185,129,0.3)',
                background: 'rgba(16,185,129,0.08)',
                marginBottom: 32,
                animation: 'fadeUp 0.6s ease both',
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  SXOPOP Founder · Myanmar
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif',
                color: '#E2E8F0', lineHeight: 1.1, marginBottom: 24,
                animation: 'fadeUp 0.6s 0.1s ease both',
              }}>
                Aung Bo Bo Kyaw
              </h1>

              <p style={{
                fontSize: 17, lineHeight: 1.9, color: '#64748B',
                maxWidth: 520, marginBottom: 16,
                animation: 'fadeUp 0.6s 0.2s ease both',
              }}>
                Myanmar မှ နည်းပညာဖန်တီးသူ၊ ပညာပေးသူ၊ နှင့် digital entrepreneur တစ်ဦး။ SXOPOP Intelligent Hub ကို တည်ထောင်ပြီး နည်းပညာ၊ ပညာရေး၊ နှင့် လူမှုရေး နယ်ပယ်တွင် ဝန်ဆောင်မှုပေးနေသည်။
              </p>

              <p style={{
                fontSize: 15, lineHeight: 1.8, color: '#475569',
                maxWidth: 520, marginBottom: 40,
                animation: 'fadeUp 0.6s 0.3s ease both',
              }}>
                "Build → Test → Fix → Understand → Improve" ဆိုသော philosophy ဖြင့် တစ်နေ့တစ်နေ့ တည်ဆောက်နေသူ။
              </p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.4s ease both' }}>
                <Link to="/courses" style={{
                  padding: '13px 28px', borderRadius: 12,
                  fontWeight: 700, fontSize: 14, textDecoration: 'none',
                  color: '#020817',
                  background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
                  boxShadow: '0 0 25px rgba(14,165,233,0.3)',
                }}>My Courses</Link>
                <Link to="/blog" style={{
                  padding: '13px 28px', borderRadius: 12,
                  fontWeight: 700, fontSize: 14, textDecoration: 'none',
                  color: '#E2E8F0',
                  border: '1px solid rgba(14,165,233,0.3)',
                  background: 'rgba(14,165,233,0.05)',
                }}>Read Blog</Link>
              </div>
            </div>

            {/* Avatar card */}
            <div style={{ flex: '0 0 auto', animation: 'fadeIn 0.8s 0.3s ease both' }}>
              <div style={{
                width: 280, height: 280, borderRadius: 32,
                background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(16,185,129,0.15))',
                border: '1px solid rgba(14,165,233,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', animation: 'float 5s ease-in-out infinite',
              }}>
                <div style={{
                  width: 120, height: 120, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 48, fontWeight: 900, color: '#fff',
                  fontFamily: 'Space Grotesk, sans-serif',
                  boxShadow: '0 0 40px rgba(14,165,233,0.4)',
                }}>A</div>

                {/* Floating badges */}
                {[
                  { label: 'Myanmar 🇲🇲', top: -16, left: -16 },
                  { label: 'SXOPOP ✦', bottom: -16, right: -16 },
                ].map((b, i) => (
                  <div key={i} style={{
                    position: 'absolute', ...b,
                    padding: '8px 14px', borderRadius: 10,
                    background: '#0F172A',
                    border: '1px solid rgba(14,165,233,0.2)',
                    fontSize: 12, fontWeight: 700, color: '#E2E8F0',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 0 20px rgba(14,165,233,0.15)',
                  }}>{b.label}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section style={{ background: '#0F172A', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0EA5E9', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>What I Do</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#E2E8F0', fontFamily: 'Space Grotesk, sans-serif' }}>My Roles</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {ROLES.map((role, i) => (
              <div key={i} className="reveal" style={{
                padding: '28px', borderRadius: 16,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{role.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#E2E8F0', marginBottom: 8, fontFamily: 'Space Grotesk, sans-serif' }}>{role.title}</h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Journey Timeline ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div className="reveal" style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#10B981', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>My Story</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#E2E8F0', fontFamily: 'Space Grotesk, sans-serif' }}>Journey</h2>
        </div>

        <div style={{ position: 'relative', paddingLeft: 40 }}>
          {/* Line */}
          <div style={{
            position: 'absolute', left: 12, top: 8, bottom: 8, width: 2,
            background: 'linear-gradient(180deg, #0EA5E9, #10B981)',
            borderRadius: 1,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {JOURNEY.map((item, i) => (
              <div key={i} className="reveal" style={{ position: 'relative' }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: -34, top: 4,
                  width: 14, height: 14, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
                  boxShadow: '0 0 12px rgba(14,165,233,0.5)',
                }} />
                <div style={{
                  display: 'inline-block', fontSize: 11, fontWeight: 800,
                  color: '#0EA5E9', letterSpacing: '0.1em',
                  marginBottom: 8,
                }}>{item.year}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#E2E8F0', marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section style={{ background: '#0F172A', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#8B5CF6', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Tech Stack</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#E2E8F0', fontFamily: 'Space Grotesk, sans-serif' }}>Skills & Tools</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {SKILLS.map((group, i) => (
              <div key={i} className="reveal" style={{
                padding: '24px', borderRadius: 16,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#0EA5E9', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>{group.category}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {group.items.map((item, j) => (
                    <span key={j} style={{
                      padding: '6px 12px', borderRadius: 8,
                      fontSize: 13, fontWeight: 600,
                      color: '#94A3B8',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div className="reveal" style={{
          padding: 'clamp(40px, 6vw, 72px)',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(16,185,129,0.08))',
          border: '1px solid rgba(14,165,233,0.15)',
        }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, color: '#E2E8F0', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 16 }}>
            အတူတကွ တည်ဆောက်ကြမယ်
          </h2>
          <p style={{ fontSize: 16, color: '#64748B', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Web တည်ဆောက်ရန်၊ သင်တန်းတက်ရောက်ရန်၊ သို့မဟုတ် collaborate လုပ်ရန် ဆက်သွယ်ပါ။
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/pricing" style={{
              padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 15,
              textDecoration: 'none', color: '#020817',
              background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
              boxShadow: '0 0 30px rgba(14,165,233,0.3)',
            }}>Work with Me</Link>
            <Link to="/courses" style={{
              padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 15,
              textDecoration: 'none', color: '#E2E8F0',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
            }}>View Courses</Link>
          </div>
        </div>
      </section>

    </div>
  )
        }
