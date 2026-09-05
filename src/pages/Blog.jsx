import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const CATEGORIES = [
  { id: "all", label: "အားလုံး" },
  { id: "နည်းပညာ", label: "နည်းပညာ" },
  { id: "ဘာသာရေး", label: "ဘာသာရေး" },
  { id: "လူမှုရေး", label: "လူမှုရေး" },
  { id: "အီလက်ထရွန်းနစ်", label: "အီလက်ထရွန်းနစ်" },
  { id: "လူငယ်ရေးရာ", label: "လူငယ်ရေးရာ" },
  { id: "မိသားစု", label: "မိသားစု" },
];

const CATEGORY_COLORS = {
  "နည်းပညာ": "text-[#0EA5E9] border-[#0EA5E9]/30 bg-[#0EA5E9]/10",
  "ဘာသာရေး": "text-[#A78BFA] border-[#A78BFA]/30 bg-[#A78BFA]/10",
  "လူမှုရေး": "text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10",
  "အီလက်ထရွန်းနစ": "text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10",
  "အီလက်ထရွန်းနစ်": "text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10",
  "လူငယ်ရေးရာ": "text-[#F472B6] border-[#F472B6]/30 bg-[#F472B6]/10",
  "မိသားစု": "text-[#FB923C] border-[#FB923C]/30 bg-[#FB923C]/10",
};

function PostCard({ post, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${(index % 3) * 80}ms`;
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const catColor =
    CATEGORY_COLORS[post.category] ||
    "text-[#0EA5E9] border-[#0EA5E9]/30 bg-[#0EA5E9]/10";

  return (
    <Link to={`/blog/${post.slug}`} ref={ref} className="reveal group block">
      <article className="h-full bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-[#0EA5E9]/40 hover:bg-white/[0.06] transition-all duration-300">
        {post.cover_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.cover_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent" />
          </div>
        )}
        {!post.cover_url && (
          <div className="h-48 bg-gradient-to-br from-[#0EA5E9]/10 to-[#10B981]/5 flex items-center justify-center">
            <span className="text-4xl opacity-30">✍️</span>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full border ${catColor}`}
            >
              {post.category}
            </span>
            <span className="text-white/30 text-xs ml-auto">
              {post.read_time || "5"} မိနစ်
            </span>
          </div>

          <h2 className="font-semibold text-white text-lg leading-snug mb-3 group-hover:text-[#0EA5E9] transition-colors line-clamp-2">
            {post.title}
          </h2>

          <p className="text-white/50 text-sm leading-relaxed line-clamp-3 mb-4">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#10B981] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {post.author_name?.[0] || "A"}
            </div>
            <span className="text-white/40 text-xs">{post.author_name || "Aung"}</span>
            <span className="text-white/20 text-xs ml-auto">
              {new Date(post.created_at).toLocaleDateString("my-MM", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-white/5" />
      <div className="p-6 space-y-3">
        <div className="h-4 w-24 bg-white/10 rounded-full" />
        <div className="h-5 w-full bg-white/10 rounded" />
        <div className="h-5 w-3/4 bg-white/10 rounded" />
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full bg-white/5 rounded" />
          <div className="h-3 w-5/6 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PER_PAGE = 9;

  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      heroRef.current?.classList.add("revealed");
    }, 100);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, search, page]);

  async function fetchPosts() {
    setLoading(true);
    let query = supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("published", true)
      .order("created_at", { ascending: false })
      .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);

    if (activeCategory !== "all") query = query.eq("category", activeCategory);
    if (search.trim()) query = query.ilike("title", `%${search.trim()}%`);

    const { data, count, error } = await query;
    if (!error) {
      setPosts(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }

  const totalPages = Math.ceil(totalCount / PER_PAGE);

  return (
    <main className="min-h-screen bg-[#020817]">
      {/* Hero */}
      <section className="grid-bg pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-[#0EA5E9]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-[#10B981]/8 rounded-full blur-3xl pointer-events-none" />

        <div ref={heroRef} className="reveal max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
            <span className="text-[#0EA5E9] text-xs font-medium tracking-wide">BLOG</span>
          </div>
          <h1 className="font-space text-4xl md:text-5xl font-bold text-white mb-4">
            အတွေးများ၊ သင်ခန်းစာများ
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            နည်းပညာ၊ ဘဝ၊ လူ့အဖွဲ့အစည်း — တစ်ကြောင်းချင်း ရေးသားထားသော မှတ်တမ်းများ
          </p>

          {/* Search */}
          <div className="mt-8 relative max-w-md mx-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="ဆောင်းပါးရှာမည်..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#0EA5E9]/50 focus:bg-white/8 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-30 bg-[#020817]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setPage(1);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-[#0EA5E9] text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-white/40 text-lg">ဆောင်းပါးများ မတွေ့ပါ</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-[#0EA5E9] text-sm hover:underline"
              >
                ရှာဖွေမှု ရှင်းလင်းမည်
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                  ← အရင်
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      page === p
                        ? "bg-[#0EA5E9] text-white"
                        : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                  နောက် →
                </button>
              </div>
            )}

            <p className="text-center text-white/30 text-xs mt-4">
              စုစုပေါင်း {totalCount} ဆောင်းပါး
            </p>
          </>
        )}
      </section>
    </main>
  );
}
