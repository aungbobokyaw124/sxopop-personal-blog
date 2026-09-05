import { useEffect, useState } from 'react'

export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0)

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

  return (
    <div className="preloader" aria-label="Loading Aung Bo Bo Kyaw">
      <div className="preloader-content">
        <div className="preloader-name">Aung Bo Bo Kyaw</div>
        <div className="preloader-line"><span style={{width:`${progress * 100}%`}} /></div>
      </div>
    </div>
  )
}
