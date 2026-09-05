import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const CATEGORY_COLORS = {
  "နည်းပညာ": "text-[#0EA5E9] border-[#0EA5E9]/30 bg-[#0EA5E9]/10",
  "ဘာသာရေး": "text-[#A78BFA] border-[#A78BFA]/30 bg-[#A78BFA]/10",
  "လူမှုရေး": "text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10",
  "အီလက်ထရွန်းနစ်": "text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10",
  "လူငယ်ရေးရာ": "text-[#F472B6] border-[#F472B6]/30 bg-[#F472B6]/10",
  "မိသားစု": "text-[#FB923C] border-[#FB923C]/30 bg-[#FB923C]/10",
};

export default function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPost();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(100, (scrolled / total) * 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post]);

  async function fetchPost() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) {
      navigate("/blog", { replace: true });
      return;
    }

    setPost(data);
    setTimeout(() => heroRef.current?.classList.add("revealed"), 100);

    // increment view count
    await supabase
      .from("posts")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", data.id);

    // fetch related
    const { data: rel } = await supabase
      .from("posts")
      .select("id, title, slug, cover_url, category, created_at, excerpt")
      .eq("published", true)
      .eq("category", data.category)
      .neq("id", data.id)
      .limit(3);

    setRelated(rel || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020817] pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#0EA5E9]/30 border-t-[#0EA5E9] rounded-full animate-spin" />
          <p className="text-white/30 text-sm">ဖတ်ရန် ပြင်ဆင်နေသည်...</p>
        </div>
      </main>
    );
  }

  if (!post) return null;

  const catColor =
    CATEGORY_COLORS[post.category] ||
    "text-[#0EA5E9] border-[#0EA5E9]/30 bg-[#0EA5E9]/10";

  return (
    <main className="min-h-screen bg-[#020817]">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#10B981] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Hero */}
      <section className="pt-28 pb-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-[#0EA5E9]/5 via-transparent to-transparent pointer-events-none" />

        {post.cover_url && (
          <div className="absolute inset-0 h-[50vh]">
            <img
              src={post.cover_url}
              alt=""
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/60 to-[#020817]" />
          </div>
        )}

        <div ref={heroRef} className="reveal relative max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/30 text-sm mb-8">
            <Link to="/" className="hover:text-white transition-colors">ပင်မ</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/60 truncate max-w-[200px]">{post.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${catColor}`}>
              {post.category}
            </span>
            {post.read_time && (
              <span className="text-white/40 text-xs flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.read_time} မိနစ်
              </span>
            )}
            {post.views && (
              <span className="text-white/40 text-xs flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.views}
              </span>
            )}
          </div>

          <h1 className="font-space text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-white/60 text-lg leading-relaxed mb-8">{post.excerpt}</p>
          )}

          {/* Author + Date */}
          <div className="flex items-center gap-4 py-5 border-t border-b border-white/8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#10B981] flex items-center justify-center font-bold text-white flex-shrink-0">
              {post.author_name?.[0] || "A"}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{post.author_name || "Aung Bo Bo Kyaw"}</p>
              <p className="text-white/40 text-xs">
                {new Date(post.created_at).toLocaleDateString("my-MM", {
                  year: "numeric", month: "long", day: "numeric",
                })}
                {post.updated_at && post.updated_at !== post.created_at && (
                  <span className="ml-2 text-white/25">
                    (ပြင်ဆင်ခဲ့: {new Date(post.updated_at).toLocaleDateString("my-MM", { month: "short", day: "numeric" })})
                  </span>
                )}
              </p>
            </div>
            {/* Share */}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                title="Link ကူး"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.cover_url && (
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <img
            src={post.cover_url}
            alt={post.title}
            className="w-full rounded-2xl object-cover max-h-96 border border-white/10"
          />
        </div>
      )}

      {/* Content */}
      <section ref={contentRef} className="max-w-3xl mx-auto px-4 pb-20">
        <div
          className="prose-custom text-white/75 leading-[1.9] text-[1.0625rem]"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/8">
            <p className="text-white/30 text-xs mb-3">TAGS</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-white/50 hover:border-[#0EA5E9]/30 hover:text-[#0EA5E9] transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="border-t border-white/5 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="font-space text-xl font-semibold text-white mb-8">
              ဆက်စပ် ဆောင်းပါးများ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-[#0EA5E9]/30 transition-all"
                >
                  {rel.cover_url ? (
                    <img
                      src={rel.cover_url}
                      alt={rel.title}
                      className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-36 bg-gradient-to-br from-[#0EA5E9]/10 to-[#10B981]/5" />
                  )}
                  <div className="p-4">
                    <p className="text-white/30 text-xs mb-2">{rel.category}</p>
                    <h4 className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#0EA5E9] transition-colors">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <div className="text-center pb-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[#0EA5E9] hover:gap-3 transition-all text-sm"
        >
          ← Blog သို့ ပြန်သွားမည်
        </Link>
      </div>
    </main>
  );
}
