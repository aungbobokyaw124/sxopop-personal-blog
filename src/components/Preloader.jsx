import { useEffect, useRef, useState } from 'react'

const NAME = ['A', 'u', 'n', 'g', ' ', 'B', 'o', ' ', 'B', 'o', ' ', 'K', 'y', 'a', 'w']
const ROLES = ['Technology Creator', 'Digital Builder', 'Educator', 'Entrepreneur']

export default function Preloader({ onDone }) {
  const canvasRef = useRef(null)
  const [phase, setPhase] = useState('particles') // particles → name → roles → exit
  const [visibleLetters, setVisibleLetters] = useState(0)
  const [roleIndex, setRoleIndex] = useState(0)
  const [roleFade, setRoleFade] = useState(true)

  // Canvas particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let raf

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      color: Math.random() > 0.5 ? '#0EA5E9' : '#10B981',
      opacity: Math.random() * 0.7 + 0.3,
    }))

    function draw() {
      ctx.clearRect(0, 0, W, H)

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(14,165,233,${0.15 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      })

      raf = requestAnimationFrame(draw)
    }

    draw()

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  // Phase timeline
  useEffect(() => {
    // Phase 1: particles alone (800ms)
    const t1 = setTimeout(() => setPhase('name'), 800)
    return () => clearTimeout(t1)
  }, [])

  // Letter reveal
  useEffect(() => {
    if (phase !== 'name') return
    if (visibleLetters >= NAME.length) {
      setTimeout(() => setPhase('roles'), 400)
      return
    }
    const t = setTimeout(() => setVisibleLetters(v => v + 1), 80)
    return () => clearTimeout(t)
  }, [phase, visibleLetters])

  // Role cycling
  useEffect(() => {
    if (phase !== 'roles') return
    const cycle = setInterval(() => {
      setRoleFade(false)
      setTimeout(() => {
        setRoleIndex(i => {
          if (i >= ROLES.length - 1) {
            clearInterval(cycle)
            setTimeout(() => setPhase('exit'), 600)
            return i
          }
          return i + 1
        })
        setRoleFade(true)
      }, 300)
    }, 700)
    return () => clearInterval(cycle)
  }, [phase])

  // Exit
  useEffect(() => {
    if (phase !== 'exit') return
    const t = setTimeout(onDone, 800)
    return () => clearTimeout(t)
  }, [phase, onDone])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#020817',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Scan line */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', width: '100%', height: '2px',
          background: 'linear-gradient(90deg, transparent, #0EA5E9, transparent)',
          animation: 'scan 3s linear infinite',
          opacity: 0.3,
        }} />
      </div>

      {/* Center content */}
      <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>

        {/* Logo mark */}
        <div style={{
          width: 64, height: 64, margin: '0 auto 32px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 900, color: '#fff',
          boxShadow: '0 0 40px rgba(14,165,233,0.4)',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}>A</div>

        {/* Name */}
        {(phase === 'name' || phase === 'roles' || phase === 'exit') && (
          <div style={{
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: 900,
            fontFamily: 'Space Grotesk, sans-serif',
            letterSpacing: '-0.02em',
            marginBottom: 16,
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {NAME.map((letter, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  background: i < 4
                    ? 'linear-gradient(135deg, #0EA5E9, #10B981)'
                    : 'linear-gradient(135deg, #E2E8F0, #94A3B8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  opacity: i < visibleLetters ? 1 : 0,
                  transform: i < visibleLetters ? 'translateY(0) rotateX(0)' : 'translateY(20px) rotateX(-90deg)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  whiteSpace: letter === ' ' ? 'pre' : 'normal',
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>
        )}

        {/* Role */}
        {(phase === 'roles' || phase === 'exit') && (
          <div style={{
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            fontWeight: 600,
            letterSpacing: '0.15em',
            color: '#0EA5E9',
            textTransform: 'uppercase',
            opacity: roleFade ? 1 : 0,
            transform: roleFade ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}>
            {ROLES[roleIndex]}
          </div>
        )}

        {/* Progress bar */}
        <div style={{
          marginTop: 48, width: 200, height: 2,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 1, overflow: 'hidden',
          margin: '48px auto 0',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #0EA5E9, #10B981)',
            borderRadius: 1,
            width: phase === 'particles' ? '20%'
              : phase === 'name' ? '60%'
              : phase === 'roles' ? '90%'
              : '100%',
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>
    </div>
  )
                       }
