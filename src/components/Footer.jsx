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
    <footer style={{borderTop:'1px solid rgba(255,255,255,.08)',background:'#000',padding:'54px 24px 32px',color:'#fff'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',alignItems:'flex-start',gap:40,marginBottom:44}}>
          <div style={{maxWidth:330}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
              <img src="/assets/profile.png" alt="Aung Bo Bo Kyaw" style={{width:40,height:40,borderRadius:'50%',objectFit:'cover',border:'1px solid rgba(255,255,255,.18)',background:'#111'}} />
              <div>
                <div style={{fontWeight:800,fontSize:15,color:'#fff',fontFamily:'Manrope,Noto Sans Myanmar,sans-serif'}}>Aung Bo Bo Kyaw</div>
                <div style={{fontSize:9,color:'#a1a1aa',letterSpacing:'.15em',textTransform:'uppercase',marginTop:3}}>SXOPOP Founder</div>
              </div>
            </div>
            <p style={{fontSize:13,color:'#666',lineHeight:1.75}}>SXOPOP Intelligent Hub — ဉာဏ်ရည်ထက်မြက်သော ဗဟိုစနစ်။ Technology, education & digital innovation from Myanmar.</p>
          </div>

          <div>
            <div style={{fontSize:11,fontWeight:800,color:'#d4d4d8',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:16}}>Navigation</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {LINKS.map(l => <Link key={l.to} to={l.to} style={{fontSize:14,color:'#666',textDecoration:'none',transition:'color .2s'}} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='#666'}>{l.label}</Link>)}
            </div>
          </div>

          <div>
            <div style={{fontSize:11,fontWeight:800,color:'#d4d4d8',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:16}}>Connect</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {[
                {label:'Facebook',href:'#'},{label:'YouTube',href:'#'},{label:'Telegram',href:'#'},{label:'GitHub',href:'https://github.com/aungbobokyaw124'},
              ].map(s=><a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{fontSize:14,color:'#666',textDecoration:'none',transition:'color .2s'}} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='#666'}>{s.label}</a>)}
            </div>
          </div>
        </div>

        <div style={{borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:24,display:'flex',flexWrap:'wrap',justifyContent:'space-between',alignItems:'center',gap:12}}>
          <p style={{fontSize:12,color:'#4d4d4d'}}>© 2026 Aung Bo Bo Kyaw · SXOPOP. All rights reserved.</p>
          <p style={{fontSize:12,color:'#4d4d4d'}}>Built with ♥ in Myanmar</p>
        </div>
      </div>
    </footer>
  )
}
