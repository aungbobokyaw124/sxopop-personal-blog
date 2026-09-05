import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { supabase } from './lib/supabase'
import './App.css'

const BRAND = '#4F46E5'

function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(value))
}

function slugify(value) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || `post-${Date.now()}`
}

function excerptFrom(content) {
  return content.replace(/\s+/g, ' ').trim().slice(0, 180)
}

function AppShell({ session, onSignOut }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-600/20">S</span>
            <span>
              <span className="block text-lg font-black tracking-tight">SXOPOP</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[.2em] text-indigo-600">Intelligent Hub</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link className="rounded-lg px-3 py-2 transition hover:bg-indigo-50 hover:text-indigo-700" to="/">Blog</Link>
            {session ? (
              <>
                <Link className="rounded-lg px-3 py-2 transition hover:bg-indigo-50 hover:text-indigo-700" to="/admin">Dashboard</Link>
                <button onClick={onSignOut} className="rounded-lg bg-slate-900 px-3 py-2 text-white transition hover:bg-indigo-600">Sign out</button>
              </>
            ) : (
              <Link className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:bg-indigo-700" to="/admin">Dashboard</Link>
            )}
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="/admin" element={<Admin session={session} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
          <strong className="text-slate-700">SXOPOP</strong> · ဉာဏ်ရည်ထက်မြက်သော ဗဟိုစနစ်
        </div>
      </footer>
    </div>
  )
}

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true); setError('')
      const { data, error } = await supabase
        .from('posts').select('id,title,slug,content,excerpt,status,created_at,updated_at')
        .eq('status', 'published').order('created_at', { ascending: false })
      if (!active) return
      if (error) setError(error.message)
      else setPosts(data || [])
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [])

  return (
    <main>
      <section className="overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em]">Personal Blog</span>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Ideas, technology &amp; real-world experience.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">SXOPOP Intelligent Hub — ဉာဏ်ရည်ထက်မြက်သော ဗဟိုစနစ်။ Practical notes, projects and lessons from building with technology.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-sm font-bold text-indigo-600">LATEST</p><h2 className="text-3xl font-black tracking-tight">Published Posts</h2></div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{posts.length} posts</span>
        </div>
        {loading && <div className="grid gap-5 md:grid-cols-2"><PostSkeleton /><PostSkeleton /></div>}
        {!loading && error && <ErrorBox message={error} />}
        {!loading && !error && posts.length === 0 && <EmptyState />}
        {!loading && !error && posts.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map(post => <article key={post.id} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{formatDate(post.created_at)}</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight group-hover:text-indigo-600">{post.title}</h3>
              <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{post.excerpt || excerptFrom(post.content || '')}</p>
              <Link to={`/post/${post.slug}`} className="mt-5 inline-flex font-bold text-indigo-600 hover:text-indigo-800">Read article →</Link>
            </article>)}
          </div>
        )}
      </section>
    </main>
  )
}

function PostPage() {
  const { pathname } = useLocation()
  const slug = pathname.split('/').pop()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle()
      if (error) setError(error.message); else setPost(data)
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return <main className="mx-auto max-w-3xl px-4 py-20"><div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" /></main>
  if (error) return <main className="mx-auto max-w-3xl px-4 py-20"><ErrorBox message={error} /></main>
  if (!post) return <main className="mx-auto max-w-3xl px-4 py-20"><EmptyState title="Post not found" /></main>

  return <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
    <Link to="/" className="font-bold text-indigo-600 hover:text-indigo-800">← Back to blog</Link>
    <p className="mt-8 text-sm font-bold uppercase tracking-wider text-slate-400">{formatDate(post.created_at)}</p>
    <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{post.title}</h1>
    {post.excerpt && <p className="mt-5 text-xl leading-8 text-slate-500">{post.excerpt}</p>}
    <div className="mt-10 whitespace-pre-wrap border-t border-slate-200 pt-10 text-[17px] leading-8 text-slate-700">{post.content}</div>
  </main>
}

function Admin({ session }) {
  if (!session) return <Login />
  return <AdminDashboard session={session} />
}

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault(); setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message); else navigate('/admin')
    setLoading(false)
  }

  return <main className="grid min-h-[70vh] place-items-center px-4 py-12">
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
      <div className="mb-7"><p className="text-sm font-bold text-indigo-600">SXOPOP ADMIN</p><h1 className="mt-1 text-3xl font-black">Welcome back</h1><p className="mt-2 text-sm text-slate-500">Sign in to manage your posts.</p></div>
      {error && <ErrorBox message={error} />}
      <label className="mt-5 block text-sm font-bold">Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="field" placeholder="you@example.com" /></label>
      <label className="mt-4 block text-sm font-bold">Password<input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="field" placeholder="••••••••" /></label>
      <button disabled={loading} className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
    </form>
  </main>
}

function AdminDashboard({ session }) {
  const blank = useMemo(() => ({ id: null, title: '', content: '', status: 'draft' }), [])
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(blank)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadPosts() {
    setLoading(true); setError('')
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message); else setPosts(data || [])
    setLoading(false)
  }
  useEffect(() => { loadPosts() }, [])

  function edit(post) { setForm({ id: post.id, title: post.title, content: post.content, status: post.status }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function reset() { setForm(blank); setError(''); setNotice('') }

  async function save(e) {
    e.preventDefault(); setSaving(true); setError(''); setNotice('')
    const title = form.title.trim(); const content = form.content.trim()
    if (!title || !content) { setError('Title and content are required.'); setSaving(false); return }
    const base = { title, slug: slugify(title), content, excerpt: excerptFrom(content), status: form.status, updated_at: new Date().toISOString() }
    let result
    if (form.id) result = await supabase.from('posts').update(base).eq('id', form.id).eq('user_id', session.user.id).select().single()
    else result = await supabase.from('posts').insert({ ...base, user_id: session.user.id }).select().single()
    if (result.error) {
      if (result.error.code === '23505') setError('A post with this title/slug already exists. Choose another title.')
      else setError(result.error.message)
    } else { setNotice(form.id ? 'Post updated successfully.' : 'Post created successfully.'); reset(); setNotice(form.id ? 'Post updated successfully.' : 'Post created successfully.'); await loadPosts() }
    setSaving(false)
  }

  async function remove(post) {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return
    setError(''); setNotice('')
    const { error } = await supabase.from('posts').delete().eq('id', post.id).eq('user_id', session.user.id)
    if (error) setError(error.message); else { setNotice('Post deleted.'); if (form.id === post.id) reset(); await loadPosts() }
  }

  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-indigo-600">ADMIN DASHBOARD</p><h1 className="text-4xl font-black tracking-tight">Manage your blog</h1></div><span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">{session.user.email}</span></div>
    {error && <ErrorBox message={error} />}{notice && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</div>}
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_1.25fr]">
      <form onSubmit={save} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-black">{form.id ? 'Edit Post' : 'Create New Post'}</h2>{form.id && <button type="button" onClick={reset} className="text-sm font-bold text-slate-500 hover:text-indigo-600">Cancel</button>}</div>
        <label className="block text-sm font-bold">Title<input className="field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Your post title" /></label>
        <label className="mt-5 block text-sm font-bold">Content<textarea className="field min-h-64 resize-y" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your article…" /></label>
        <label className="mt-5 block text-sm font-bold">Status<select className="field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        <button disabled={saving} className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60">{saving ? 'Saving…' : form.id ? 'Update Post' : 'Publish / Save Post'}</button>
      </form>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black">Your Posts</h2><button onClick={loadPosts} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold transition hover:bg-indigo-50 hover:text-indigo-700">Refresh</button></div>
        {loading ? <div className="space-y-3"><div className="h-16 animate-pulse rounded-xl bg-slate-100" /><div className="h-16 animate-pulse rounded-xl bg-slate-100" /></div> : posts.length === 0 ? <EmptyState title="No posts yet" description="Create your first article using the form." /> : <div className="space-y-3">{posts.map(post => <div key={post.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><h3 className="truncate font-bold">{post.title}</h3><p className="mt-1 text-xs text-slate-400">{formatDate(post.created_at)}</p></div><div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${post.status === 'published' ? 'bg-emerald-50 text-emerald-700' : post.status === 'archived' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'}`}>{post.status}</span><button onClick={() => edit(post)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50">Edit</button><button onClick={() => remove(post)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">Delete</button></div></div></div>)}</div>}
      </section>
    </div>
  </main>
}

function PostSkeleton() { return <div className="h-56 animate-pulse rounded-2xl bg-slate-100" /> }
function ErrorBox({ message }) { return <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">Error: {message}</div> }
function EmptyState({ title = 'No published posts yet', description = 'New articles will appear here when they are published.' }) { return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><h3 className="text-lg font-black">{title}</h3><p className="mt-2 text-sm text-slate-500">{description}</p></div> }

export default function App() {
  const [session, setSession] = useState(undefined)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])
  async function signOut() { await supabase.auth.signOut() }
  if (session === undefined) return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" /></div>
  return <BrowserRouter><AppShell session={session} onSignOut={signOut} /></BrowserRouter>
}
