import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ROLES = ['Technology Builder', 'Digital Creator', 'Educator', 'Entrepreneur', 'Electronics Specialist']
const CATEGORIES = [
  { en: 'Technology', mm: 'နည်းပညာ', no: '01' },
  { en: 'Electronics', mm: 'အီလက်ထရွန်းနစ်', no: '02' },
  { en: 'Education', mm: 'ပညာရေး', no: '03' },
  { en: 'Digital Life', mm: 'ဒစ်ဂျစ်တယ်ဘဝ', no: '04' },
]

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('.home-page .reveal')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.12 })
    items.forEach(item => observer.observe(item))
    return () => observer.disconnect()
  }, [])
}

function RoleText() {
  const [role, setRole] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const current = ROLES[role]
    let timer
    if (!deleting && text.length < current.length) timer = setTimeout(() => setText(current.slice(0, text.length + 1)), 55)
    else if (!deleting) timer = setTimeout(() => setDeleting(true), 1700)
    else if (text.length) timer = setTimeout(() => setText(text.slice(0, -1)), 30)
    else { setDeleting(false); setRole(value => (value + 1) % ROLES.length) }
    return () => clearTimeout(timer)
  }, [role, text, deleting])
  return <span className="role-highlight">{text}<span className="cursor">|</span></span>
}

function SxopopMark() {
  return (
    <div className="hero-mark" aria-hidden="true">
      <div className="mark-ring ring-one" />
      <div className="mark-ring ring-two" />
      <div className="mark-core"><img src="/assets/icon.svg" alt="SXOPOP" /></div>
      <div className="mark-label">SXOPOP<br />INTELLIGENT HUB</div>
    </div>
  )
}

export default function Home() {
  useReveal()
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  useEffect(() => {
    supabase.from('posts').select('id,title,slug,excerpt,created_at,category').eq('status', 'published').order('created_at', { ascending: false }).limit(4).then(({ data }) => {
      setPosts(data || []); setLoadingPosts(false)
    })
  }, [])

  return (
    <main className="home-page">
      <section className="home-hero grid-bg">
        <div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" />
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow reveal"><span className="status-dot" /> SXOPOP Intelligent Hub · Myanmar</div>
            <h1 className="hero-title reveal">Aung Bo Bo Kyaw</h1>
            <div className="role-line reveal">I build as a <RoleText /></div>
            <p className="hero-description reveal">နည်းပညာကို လက်တွေ့အသုံးချပြီး အသုံးဝင်သော digital products, systems နှင့် knowledge များကို ဖန်တီးတည်ဆောက်နေသူ။ SXOPOP Intelligent Hub သည် လက်တွေ့အတွေ့အကြုံ၊ နည်းပညာနှင့် အတွေးအမြင်များကို စုစည်းမှတ်တမ်းတင်ထားသည့် personal platform ဖြစ်ပါတယ်။</p>
            <div className="hero-actions reveal"><Link to="/about" className="btn-primary">About Me <span>↗</span></Link><Link to="/blog" className="btn-ghost">Read the Journal <span>→</span></Link></div>
            <div className="scroll-note reveal"><span /> SCROLL TO EXPLORE</div>
          </div>
          <SxopopMark />
        </div>
      </section>

      <section className="section-shell intro-section"><div className="intro-grid reveal"><div className="section-kicker">01 / About</div><div><h2 className="section-lead">Technology is a tool.<br /><span className="muted">Creating useful things is the purpose.</span></h2><p className="section-copy">ကျွန်တော့်အတွက် နည်းပညာဆိုတာ အသုံးချဖို့အတွက်သာမက ပြဿနာတွေကို ပိုမိုကောင်းမွန်တဲ့နည်းလမ်းနဲ့ ဖြေရှင်းဖို့ အသုံးချနိုင်တဲ့ ကိရိယာတစ်ခုပါ။ Website, AI, electronics, automation နှင့် digital services တွေကို လေ့လာ၊ စမ်းသပ်၊ တည်ဆောက်ရင်း ရရှိလာတဲ့ လက်တွေ့အသိပညာတွေကို SXOPOP မှာ မျှဝေထားပါတယ်။</p><Link to="/about" className="text-link">Discover my story <span>↗</span></Link></div></div></section>
      <section className="section-shell category-section"><div className="section-heading reveal"><div><div className="section-kicker">02 / Focus</div><h2>What I build and explore.</h2></div><p>Practical technology, thoughtful learning and real-world experiments.</p></div><div className="category-list">{CATEGORIES.map(category => <Link key={category.en} to={`/blog?cat=${category.en.toLowerCase()}`} className="category-row reveal"><span className="cat-number">{category.no}</span><span className="cat-main"><strong>{category.en}</strong><small>{category.mm}</small></span><span className="cat-arrow">↗</span></Link>)}</div></section>
      <section className="posts-section"><div className="section-shell"><div className="section-heading reveal"><div><div className="section-kicker">03 / Journal</div><h2>Notes from the work.</h2></div><Link to="/blog" className="text-link">View all posts <span>→</span></Link></div>{loadingPosts ? <div className="empty-posts">Loading the latest notes…</div> : posts.length === 0 ? <div className="empty-posts">The journal is being prepared. New posts will appear here soon.</div> : <div className="post-list">{posts.map((post, index) => <Link key={post.id} to={`/blog/${post.slug}`} className="post-row reveal"><span className="post-index">0{index + 1}</span><span className="post-main"><small>{post.category || 'SXOPOP'} · {post.created_at ? new Date(post.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</small><strong>{post.title}</strong>{post.excerpt && <em>{post.excerpt}</em>}</span><span className="post-arrow">↗</span></Link>)}</div>}</div></section>
      <section className="section-shell cta-section"><div className="cta-inner reveal"><div><div className="section-kicker">04 / Connect</div><h2>Let’s create something meaningful.</h2><p>Have an idea, a project or a problem worth solving? Let’s talk.</p></div><Link to="/contact" className="circle-cta">Get in touch <span>↗</span></Link></div></section>
    </main>
  )
}
