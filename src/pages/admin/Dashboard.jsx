import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const CATEGORIES = ["နည်းပညာ", "ဘာသာရေး", "လူမှုရေး", "အီလက်ထရွန်းနစ်", "လူငယ်ရေးရာ", "မိသားစု"];

const NAV = [
  { id: "posts", label: "Posts", icon: "📝" },
  { id: "new", label: "New Post", icon: "✏️" },
  { id: "orders", label: "Orders", icon: "💳" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

// ── Tiny Rich Text (contentEditable) ──────────────────────────────────────────
function RichEditor({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, []);

  function exec(cmd, val = null) {
    document.execCommand(cmd, false, val);
    ref.current?.focus();
    if (onChange) onChange(ref.current?.innerHTML || "");
  }

  const toolbar = [
    { label: "B", cmd: "bold", title: "Bold" },
    { label: "I", cmd: "italic", title: "Italic" },
    { label: "U", cmd: "underline", title: "Underline" },
    { label: "H2", cmd: "formatBlock", val: "h2", title: "Heading 2" },
    { label: "H3", cmd: "formatBlock", val: "h3", title: "Heading 3" },
    { label: "¶", cmd: "formatBlock", val: "p", title: "Paragraph" },
    { label: "UL", cmd: "insertUnorderedList", title: "List" },
    { label: "OL", cmd: "insertOrderedList", title: "Numbered" },
    { label: "—", cmd: "insertHorizontalRule", title: "Divider" },
  ];

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-white/[0.03] border-b border-white/8">
        {toolbar.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.title}
            onClick={() => exec(t.cmd, t.val)}
            className="px-2.5 py-1 rounded text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all font-mono"
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange && onChange(ref.current?.innerHTML || "")}
        className="min-h-[280px] p-4 text-white/80 text-sm leading-relaxed focus:outline-none prose-content"
        style={{ fontFamily: "'Inter', sans-serif" }}
      />
    </div>
  );
}

// ── Image Upload ──────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange, bucket = "covers", label = "Cover Image" }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const inputRef = useRef(null);

  async function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, { cacheControl: "3600", upsert: false });

    if (!error && data) {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      setPreview(urlData.publicUrl);
      onChange(urlData.publicUrl);
    }
    setUploading(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }

  function handleRemove() {
    setPreview("");
    onChange("");
  }

  return (
    <div>
      <label className="block text-white/50 text-xs mb-1.5">{label}</label>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10 group">
          <img src={preview} alt="" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs hover:bg-white/30 transition-all"
            >
              ပြောင်းမည်
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-lg bg-red-500/40 text-white text-xs hover:bg-red-500/60 transition-all"
            >
              ဖျက်မည်
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-white/15 rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer hover:border-[#0EA5E9]/40 hover:bg-white/[0.02] transition-all"
        >
          {uploading ? (
            <>
              <div className="w-6 h-6 border-2 border-[#0EA5E9]/30 border-t-[#0EA5E9] rounded-full animate-spin mb-2" />
              <p className="text-white/40 text-xs">Upload လုပ်နေသည်...</p>
            </>
          ) : (
            <>
              <svg className="w-8 h-8 text-white/20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-white/40 text-xs">Click နှိပ်ပါ သို့မဟုတ် Drag & Drop</p>
              <p className="text-white/20 text-xs mt-1">JPG, PNG, WebP</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* URL input alternative */}
      <div className="mt-2">
        <input
          type="url"
          value={preview}
          onChange={(e) => {
            setPreview(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="သို့မဟုတ် Image URL ထည့်ပါ..."
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 placeholder-white/20 text-xs focus:outline-none focus:border-[#0EA5E9]/30 transition-colors"
        />
      </div>
    </div>
  );
}

// ── Post Form ─────────────────────────────────────────────────────────────────
const emptyPost = {
  title: "", slug: "", category: "နည်းပညာ", excerpt: "", content: "",
  cover_url: "", tags: "", read_time: "5", author_name: "Aung Bo Bo Kyaw", published: false,
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function PostForm({ editPost, onSaved, onCancel }) {
  const [form, setForm] = useState(editPost ? { ...editPost, tags: (editPost.tags || []).join(", ") } : { ...emptyPost });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function set(k, v) {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "title" && !editPost) next.slug = slugify(v);
      return next;
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title || !form.content) return;
    setSaving(true);

    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editPost?.id) {
      ({ error } = await supabase.from("posts").update(payload).eq("id", editPost.id));
    } else {
      payload.created_at = new Date().toISOString();
      ({ error } = await supabase.from("posts").insert(payload));
    }

    setSaving(false);
    if (error) {
      setMsg("❌ " + error.message);
    } else {
      setMsg(editPost ? "✅ ပြင်ဆင်မှု သိမ်းဆည်းပြီး" : "✅ Post တင်ပြီးပြီ");
      setTimeout(() => { setMsg(""); onSaved(); }, 1200);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {msg && (
        <div className={`px-4 py-2.5 rounded-xl text-sm ${msg.startsWith("✅") ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {msg}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-white/50 text-xs mb-1.5">ခေါင်းစဉ် *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Post ခေါင်းစဉ်..."
          required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
        />
      </div>

      {/* Slug + Category row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/50 text-xs mb-1.5">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors font-mono"
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0A1628] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Cover */}
      <ImageUpload
        value={form.cover_url}
        onChange={(v) => set("cover_url", v)}
        bucket="covers"
        label="Cover Image"
      />

      {/* Excerpt */}
      <div>
        <label className="block text-white/50 text-xs mb-1.5">အနှစ်ချုပ် (Excerpt)</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          rows={2}
          placeholder="Post အကြောင်း အတိုချုပ်..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors resize-none"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-white/50 text-xs mb-1.5">အကြောင်းအရာ *</label>
        <RichEditor value={form.content} onChange={(v) => set("content", v)} />
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-white/50 text-xs mb-1.5">Tags</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="react, myanmar, ..."
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs mb-1.5">ဖတ်ရန် မိနစ်</label>
          <input
            type="number"
            value={form.read_time}
            onChange={(e) => set("read_time", e.target.value)}
            min="1"
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs mb-1.5">Author</label>
          <input
            type="text"
            value={form.author_name}
            onChange={(e) => set("author_name", e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
          />
        </div>
      </div>

      {/* Publish toggle */}
      <div className="flex items-center justify-between py-3 px-4 bg-white/[0.03] rounded-xl border border-white/8">
        <div>
          <p className="text-white text-sm font-medium">Publish</p>
          <p className="text-white/40 text-xs">ဖွင့်ထားပါက Blog တွင် ပေါ်မည်</p>
        </div>
        <button
          type="button"
          onClick={() => set("published", !form.published)}
          className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.published ? "bg-[#10B981]" : "bg-white/15"}`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${form.published ? "left-7" : "left-1"}`}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {saving ? "သိမ်းနေသည်..." : editPost ? "ပြင်ဆင်မှု သိမ်းမည်" : "Post တင်မည်"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:text-white hover:bg-white/10 transition-all"
          >
            ဖျက်သိမ်း
          </button>
        )}
      </div>
    </form>
  );
}

// ── Posts Table ───────────────────────────────────────────────────────────────
function PostsTable({ onEdit }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data } = await supabase.from("posts").select("id, title, category, published, created_at, views").order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }

  async function togglePublish(post) {
    await supabase.from("posts").update({ published: !post.published }).eq("id", post.id);
    fetchPosts();
  }

  async function deletePost(id) {
    if (!confirm("ဤ post ကို ဖျက်မှာ သေချာပါသလား?")) return;
    setDeleting(id);
    await supabase.from("posts").delete().eq("id", id);
    setDeleting(null);
    fetchPosts();
  }

  if (loading) return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 bg-white/[0.03] rounded-xl animate-pulse" />
      ))}
    </div>
  );

  if (posts.length === 0) return (
    <div className="text-center py-16 text-white/30">
      <p className="text-4xl mb-3">📭</p>
      <p>Post မရှိသေးပါ</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/8 rounded-xl hover:border-white/15 transition-all group"
        >
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{post.title}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-white/30 text-xs">{post.category}</span>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-white/30 text-xs">
                {new Date(post.created_at).toLocaleDateString("my-MM")}
              </span>
              {post.views > 0 && (
                <>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/30 text-xs">{post.views} views</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Publish toggle */}
            <button
              onClick={() => togglePublish(post)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                post.published
                  ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20"
                  : "bg-white/5 text-white/30 border border-white/10"
              }`}
            >
              {post.published ? "Live" : "Draft"}
            </button>

            {/* Edit */}
            <button
              onClick={() => onEdit(post)}
              className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10 transition-all"
              title="ပြင်မည်"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Delete */}
            <button
              onClick={() => deletePost(post.id)}
              disabled={deleting === post.id}
              className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
              title="ဖျက်မည်"
            >
              {deleting === post.id ? (
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Orders Table ──────────────────────────────────────────────────────────────
function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setOrders(data || []); setLoading(false); });
  }, []);

  async function updateStatus(id, status) {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((o) => o.map((x) => x.id === id ? { ...x, status } : x));
  }

  const STATUS_COLOR = {
    pending: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20",
    approved: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20",
    rejected: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  if (loading) return <div className="text-center py-12 text-white/30">Loading...</div>;
  if (orders.length === 0) return <div className="text-center py-16 text-white/30"><p className="text-4xl mb-3">💳</p><p>Order မရှိသေးပါ</p></div>;

  return (
    <div className="space-y-2">
      {orders.map((o) => (
        <div key={o.id} className="p-4 bg-white/[0.03] border border-white/8 rounded-xl">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-white font-medium text-sm">{o.customer_name}</p>
              <p className="text-white/40 text-xs">{o.customer_email}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-sm">{(o.amount || 0).toLocaleString()} ks</p>
              <p className="text-white/40 text-xs">{o.plan_name} · {o.payment_method}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white/30 text-xs font-mono flex-1 truncate">
              TXN: {o.transaction_id}
            </p>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${STATUS_COLOR[o.status] || STATUS_COLOR.pending}`}>
              {o.status}
            </span>
            {o.status === "pending" && (
              <>
                <button onClick={() => updateStatus(o.id, "approved")} className="px-2.5 py-1 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs hover:bg-[#10B981] hover:text-white transition-all">✓</button>
                <button onClick={() => updateStatus(o.id, "rejected")} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500 hover:text-white transition-all">✕</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [tab, setTab] = useState("posts");
  const [editPost, setEditPost] = useState(null);
  const [stats, setStats] = useState({ posts: 0, orders: 0, views: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // Auth guard
    supabase.auth.getSession().then(({ data }) => {
      if (!data?.session) navigate("/admin/login", { replace: true });
    });
    fetchStats();
  }, []);

  async function fetchStats() {
    const [{ count: posts }, { count: orders }, { data: postData }] = await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("posts").select("views"),
    ]);
    const totalViews = (postData || []).reduce((s, p) => s + (p.views || 0), 0);
    setStats({ posts: posts || 0, orders: orders || 0, views: totalViews });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  function handleEdit(post) {
    setEditPost(post);
    setTab("new");
  }

  function handleSaved() {
    setEditPost(null);
    setTab("posts");
    fetchStats();
  }

  return (
    <div className="min-h-screen bg-[#020817] flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-white/8 flex flex-col bg-[#010d1a]">
        {/* Logo */}
        <div className="p-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#10B981] flex items-center justify-center font-black text-white text-sm">
              S
            </div>
            <div>
              <p className="font-space text-white text-sm font-bold">sxopop</p>
              <p className="text-white/30 text-xs">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setTab(n.id);
                if (n.id === "new") setEditPost(null);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                tab === n.id
                  ? "bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#020817]/80 backdrop-blur border-b border-white/5">
          <h2 className="font-space text-white font-semibold">
            {editPost ? `ပြင်ဆင်ရန် — ${editPost.title?.slice(0, 30)}...` : NAV.find((n) => n.tab === tab)?.label || NAV.find((n) => n.id === tab)?.label}
          </h2>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white text-xs transition-colors">
              Site ကြည့်မည် ↗
            </a>
          </div>
        </div>

        <div className="p-6">
          {/* Stats */}
          {tab === "posts" && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Posts", value: stats.posts, color: "text-[#0EA5E9]" },
                { label: "Orders", value: stats.orders, color: "text-[#10B981]" },
                { label: "Views", value: stats.views.toLocaleString(), color: "text-[#A78BFA]" },
              ].map((s) => (
                <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                  <p className={`font-space text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-white/40 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Posts tab */}
          {tab === "posts" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Posts အားလုံး</h3>
                <button
                  onClick={() => { setEditPost(null); setTab("new"); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0EA5E9] text-white text-sm font-medium hover:bg-[#0284C7] transition-colors"
                >
                  + Post အသစ်
                </button>
              </div>
              <PostsTable onEdit={handleEdit} />
            </div>
          )}

          {/* New/Edit Post */}
          {tab === "new" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-medium">{editPost ? "Post ပြင်ဆင်ရန်" : "Post အသစ်တင်ရန်"}</h3>
                {editPost && (
                  <button
                    onClick={() => { setEditPost(null); }}
                    className="text-white/40 text-sm hover:text-white transition-colors"
                  >
                    ← Post အသစ်
                  </button>
                )}
              </div>
              <PostForm
                editPost={editPost}
                onSaved={handleSaved}
                onCancel={editPost ? () => { setEditPost(null); setTab("posts"); } : null}
              />
            </div>
          )}

          {/* Orders */}
          {tab === "orders" && (
            <div>
              <h3 className="text-white font-medium mb-4">Payment Orders</h3>
              <OrdersTable />
            </div>
          )}

          {/* Settings */}
          {tab === "settings" && (
            <div className="max-w-md">
              <h3 className="text-white font-medium mb-5">Site Settings</h3>
              <div className="space-y-4">
                <div className="p-5 bg-white/[0.03] border border-white/8 rounded-xl">
                  <p className="text-white text-sm font-medium mb-1">KPay Number</p>
                  <input type="text" placeholder="09XXXXXXXXX" className="w-full mt-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 text-sm focus:outline-none focus:border-[#0EA5E9]/40 transition-colors" />
                </div>
                <div className="p-5 bg-white/[0.03] border border-white/8 rounded-xl">
                  <p className="text-white text-sm font-medium mb-1">Wave Number</p>
                  <input type="text" placeholder="09XXXXXXXXX" className="w-full mt-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 text-sm focus:outline-none focus:border-[#0EA5E9]/40 transition-colors" />
                </div>
                <button className="w-full py-2.5 rounded-xl bg-[#0EA5E9] text-white text-sm font-medium hover:bg-[#0284C7] transition-colors">
                  သိမ်းဆည်းမည်
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
