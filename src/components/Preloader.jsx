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
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'#000',display:'flex',alignItems:'center',justifyContent:'center',opacity:progress>=1?0:1,transition:'opacity .45s ease',pointerEvents:progress>=1?'none':'all'}} aria-label="Loading Aung Bo Bo Kyaw">
      <div style={{width:'min(360px,72vw)',textAlign:'center'}}>
        <div style={{fontFamily:'Manrope,Noto Sans Myanmar,sans-serif',fontSize:'clamp(15px,3.5vw,21px)',fontWeight:600,letterSpacing:'.12em',color:'#fff',whiteSpace:'nowrap',marginBottom:22}}>Aung Bo Bo Kyaw</div>
        <div style={{width:'100%',height:1,background:'rgba(255,255,255,.14)',overflow:'hidden'}}><span style={{display:'block',height:'100%',background:'#fff',width:`${progress*100}%`,transition:'width .08s linear'}} /></div>
      </div>
    </div>
  )
}
