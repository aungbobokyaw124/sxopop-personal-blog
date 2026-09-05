import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const TYPES = [
  { id: "all", label: "အားလုံး" },
  { id: "webapp", label: "Web App" },
  { id: "tool", label: "Tool" },
  { id: "template", label: "Template" },
  { id: "opensource", label: "Open Source" },
];

const TYPE_CONFIG = {
  webapp: { label: "Web App", color: "text-[#0EA5E9] bg-[#0EA5E9]/10 border-[#0EA5E9]/20" },
  tool: { label: "Tool", color: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20" },
  template: { label: "Template", color: "text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/20" },
  opensource: { label: "Open Source", color: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20" },
};

const STATIC_APPS = [
  {
    id: 1,
    name: "Ohm's Law Calculator",
    description: "V = IR — Voltage, Current, Resistance တွက်ချက်ရန် Electronics technician tool",
    type: "tool",
    status: "live",
    app_url: "#",
    github_url: null,
    icon: "⚡",
    tech_stack: ["React", "Vite"],
  },
  {
    id: 2,
    name: "Myanmar Font Converter",
    description: "Zawgyi ↔ Unicode conversion tool — Myanmar text format ပြောင်းရန်",
    type: "webapp",
    status: "live",
    app_url: "#",
    github_url: "https://github.com",
    icon: "🔤",
    tech_stack: ["JavaScript", "Rabbit Converter"],
  },
  {
    id: 3,
    name: "Blog Starter Template",
    description: "React + Tailwind + Supabase ဖြင့် blog site တည်ဆောက်ရန် production-ready template",
    type: "template",
    status: "live",
    app_url: "#",
    github_url: "https://github.com",
    icon: "📝",
    tech_stack: ["React", "Supabase", "Tailwind"],
  },
  {
    id: 4,
    name: "SMS Budget Tracker",
    description: "ငွေကြေး မှတ်တမ်း ရိုးရှင်းစွာ ထိန်းချုပ်ရန် local-first PWA app",
    type: "webapp",
    status: "beta",
    app_url: "#",
    github_url: null,
    icon: "💰",
    tech_stack: ["React", "IndexedDB", "PWA"],
  },
];

function AppCard({ app, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${(index % 3) * 70}ms`;
          el.classList.add("revealed");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const typeConfig = TYPE_CONFIG[app.type] || TYPE_CONFIG.tool;

  return (
    <div
      ref={ref}
      className="reveal group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-[#0EA5E9]/30 hover:bg-white/[0.05] transition-all duration-300 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
          {app.icon || "🔧"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-space text-white font-semibold text-base group-hover:text-[#0EA5E9] transition-colors">
              {app.name}
            </h3>
            {app.status === "beta" && (
              <span className="text-xs px-2 py-0.5 bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] rounded-full">
                Beta
              </span>
            )}
            {app.status === "wip" && (
              <span className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 text-white/40 rounded-full">
                WIP
              </span>
            )}
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${typeConfig.color}`}>
            {typeConfig.label}
          </span>
        </div>
      </div>

      <p className="text-white/50 text-sm leading-relaxed flex-1 mb-5">
        {app.description}
      </p>

      {/* Tech Stack */}
      {app.tech_stack && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {app.tech_stack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 bg-white/5 text-white/40 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {app.app_url && app.status !== "wip" && (
          <a
            href={app.app_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 rounded-lg bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 text-[#0EA5E9] text-sm font-medium hover:bg-[#0EA5E9] hover:text-white transition-all"
          >
            ဖွင့်မည်
          </a>
        )}
        {app.status === "wip" && (
          <span className="flex-1 text-center py-2 rounded-lg bg-white/5 border border-white/10 text-white/30 text-sm cursor-not-allowed">
            မကြာမီ
          </span>
        )}
        {app.github_url && (
          <a
            href={app.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
            title="GitHub"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export default function Apps() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");
  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => heroRef.current?.classList.add("revealed"), 100);
    fetchApps();
  }, []);

  async function fetchApps() {
    const { data } = await supabase
      .from("apps")
      .select("*")
      .order("created_at", { ascending: false });

    setApps(data && data.length > 0 ? data : STATIC_APPS);
    setLoading(false);
  }

  const filtered =
    activeType === "all" ? apps : apps.filter((a) => a.type === activeType);

  return (
    <main className="min-h-screen bg-[#020817]">
      {/* Hero */}
      <section className="grid-bg pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-16 right-1/3 w-64 h-64 bg-[#A78BFA]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#0EA5E9]/8 rounded-full blur-3xl pointer-events-none" />

        <div ref={heroRef} className="reveal max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#A78BFA]/20 bg-[#A78BFA]/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-pulse" />
            <span className="text-[#A78BFA] text-xs font-medium tracking-wide">APPS & TOOLS</span>
          </div>

          <h1 className="font-space text-4xl md:text-5xl font-bold text-white mb-4">
            တည်ဆောက်ထားသော ထုတ်ကုန်များ
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            လက်တွေ့ ပြဿနာများကို ဖြေရှင်းရန် build လုပ်ခဲ့သော tools, apps နှင့် templates
          </p>
        </div>
      </section>

      {/* Filter */}
      <div className="sticky top-16 z-30 bg-[#020817]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-none">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeType === t.id
                    ? "bg-[#A78BFA] text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-white/[0.03] border border-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔧</p>
            <p className="text-white/40">ဤ category တွင် app များ မတွေ့ပါ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((app, i) => (
              <AppCard key={app.id} app={app} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Build in public notice */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h4 className="font-space text-white font-semibold text-lg mb-2">
              Build in Public 🌐
            </h4>
            <p className="text-white/45 text-sm leading-relaxed">
              Project အသစ်များ၊ update များကို social media တွင် တိုက်ရိုက် share လုပ်သည်။
              ကြိုက်နှစ်သက်သော project ရှိပါက feedback ပေးနိုင်ပါသည်။
            </p>
          </div>
          <a
            href="https://t.me/sxopop"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0EA5E9]/30 text-[#0EA5E9] text-sm font-medium hover:bg-[#0EA5E9] hover:text-white hover:border-[#0EA5E9] transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.012 9.489c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.042 14.6l-2.95-.924c-.641-.2-.654-.641.136-.953l11.52-4.443c.537-.194 1.006.131.814.968z" />
            </svg>
            Telegram ကြည့်မည်
          </a>
        </div>
      </section>
    </main>
  );
}
