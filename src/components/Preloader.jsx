import { useEffect, useState, useRef } from 'react'

export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const canvasRef = useRef(null)

  // Loading progress animation
  useEffect(() => {
    const started = performance.now()
    let frame
    const tick = now => {
      const value = Math.min((now - started) / 4000, 1)
      setProgress(value)
      if (value < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    const done = setTimeout(onDone, 4000)
    return () => { cancelAnimationFrame(frame); clearTimeout(done) }
  }, [onDone])

  // Snow particles animation
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create snow particles
    const createParticles = () => {
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          speedY: Math.random() * 0.5 + 0.2,
          speedX: Math.random() * 0.3 - 0.15,
          opacity: Math.random() * 0.5 + 0.3
        })
      }
    }
    createParticles()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(p => {
        p.y += p.speedY
        p.x += p.speedX
        
        // Reset particle if it goes off screen
        if (p.y > canvas.height + 10) {
          p.y = -10
          p.x = Math.random() * canvas.width
        }
        if (p.x > canvas.width + 10) p.x = -10
        if (p.x < -10) p.x = canvas.width + 10
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.fill()
      })
      
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: progress >= 1 ? 0 : 1,
      transition: 'opacity .45s ease',
      pointerEvents: progress >= 1 ? 'none' : 'all'
    }} aria-label="Loading Aung Bo Bo Kyaw">
      
      {/* Snow canvas */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }} 
      />

      {/* Content */}
      <div style={{
        width: 'min(420px, 80vw)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Name */}
        <div style={{
          fontFamily: 'Manrope, Noto Sans Myanmar, sans-serif',
          fontSize: 'clamp(15px, 3.5vw, 21px)',
          fontWeight: 600,
          letterSpacing: '.12em',
          color: '#fff',
          whiteSpace: 'nowrap',
          marginBottom: 16
        }}>
          Aung Bo Bo Kyaw
        </div>

        {/* Blog Tagline instead of loading bar */}
        <div style={{
          marginTop: 8,
          padding: '10px 20px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '4px',
          display: 'inline-block',
          background: 'rgba(255, 255, 255, 0.03)'
        }}>
          <span style={{
            fontFamily: 'Manrope, Noto Sans Myanmar, sans-serif',
            fontSize: 'clamp(11px, 2vw, 13px)',
            fontWeight: 400,
            letterSpacing: '.08em',
            color: 'rgba(255, 255, 255, 0.75)',
            textTransform: 'uppercase'
          }}>
            ✦ Thoughts & Stories ✦
          </span>
        </div>

        {/* Subtle progress indicator */}
        <div style={{
          width: '100%',
          height: 1,
          background: 'rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          marginTop: 16
        }}>
          <span style={{
            display: 'block',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.6)',
            width: `${progress * 100}%`,
            transition: 'width .08s linear'
          }} />
        </div>
      </div>
    </div>
  )
      }
