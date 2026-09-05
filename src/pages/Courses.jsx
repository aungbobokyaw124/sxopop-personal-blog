import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const LEVELS = [
  { id: "all", label: "အားလုံး" },
  { id: "beginner", label: "အစသင်သူ" },
  { id: "intermediate", label: "အလယ်အလတ်" },
  { id: "advanced", label: "အဆင့်မြင့်" },
];

const LEVEL_CONFIG = {
  beginner: { label: "အစသင်သူ", color: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20" },
  intermediate: { label: "အလယ်အလတ်", color: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20" },
  advanced: { label: "အဆင့်မြင့်", color: "text-[#F472B6] bg-[#F472B6]/10 border-[#F472B6]/20" },
};

function CourseCard({ course, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${(index % 3) * 80}ms`;
          el.classList.add("revealed");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const level = LEVEL_CONFIG[course.level] || LEVEL_CONFIG.beginner;

  return (
    <div ref={ref} className="reveal group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-[#0EA5E9]/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-[#0EA5E9]/15 via-[#020817] to-[#10B981]/10 flex items-center justify-center">
            <svg className="w-12 h-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent" />

        {course.is_free && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#10B981] text-white text-xs font-semibold rounded-full">
            အခမဲ့
          </div>
        )}
        {!course.is_free && course.price && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#020817]/80 backdrop-blur text-[#0EA5E9] border border-[#0EA5E9]/30 text-xs font-semibold rounded-full">
            {course.price.toLocaleString()} ks
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${level.color}`}>
            {level.label}
          </span>
          {course.duration && (
            <span className="text-white/30 text-xs ml-auto flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration}
            </span>
          )}
        </div>

        <h3 className="font-space text-white font-semibold text-base leading-snug mb-2 group-hover:text-[#0EA5E9] transition-colors line-clamp-2">
          {course.title}
        </h3>

        <p className="text-white/45 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-white/30 mb-4">
          {course.lessons_count && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {course.lessons_count} သင်ခန်းစာ
            </span>
          )}
          {course.students_count && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {course.students_count} ဦး
            </span>
          )}
        </div>

        {/* CTA */}
        {course.is_free ? (
          <a
            href={course.course_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-2.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium hover:bg-[#10B981] hover:text-white transition-all duration-200"
          >
            ယခုပင် ဖတ်မည်
          </a>
        ) : (
          <Link
            to="/pricing"
            className="block text-center py-2.5 rounded-xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 text-[#0EA5E9] text-sm font-medium hover:bg-[#0EA5E9] hover:text-white transition-all duration-200"
          >
            အသေးစိတ် ကြည့်မည်
          </Link>
        )}
      </div>
    </div>
  );
}

// Static fallback courses for when Supabase has no data yet
const STATIC_COURSES = [
  {
    id: 1, title: "Arduino မိတ်ဆက် — ဒီဂျစ်တယ် အီလက်ထရွန်းနစ် အစပျိုး",
    description: "LED, Sensor, Motor တို့ကို Arduino Board ဖြင့် ချိတ်ဆက် control လုပ်တတ်အောင် လက်တွေ့ သင်ပေးသော course",
    level: "beginner", duration: "6 နာရီ", lessons_count: 12, students_count: 240,
    is_free: true, course_url: "#", thumbnail_url: null,
  },
  {
    id: 2, title: "ဖုန်း ပြင်ဆင်ခြင်း — Hardware Diagnosis အခြေခံ",
    description: "Smartphone hardware ချွတ်ယွင်းချက် စစ်ဆေးနည်း၊ motherboard diagram ဖတ်နည်းနှင့် repair workflow",
    level: "intermediate", duration: "10 နာရီ", lessons_count: 20, students_count: 180,
    is_free: false, price: 15000, thumbnail_url: null,
  },
  {
    id: 3, title: "React + Supabase — Full Stack Web App တည်ဆောက်ခြင်း",
    description: "Database, Auth, Storage ပါဝင်သော real-world web application တစ်ခု အဆုံးအထိ တည်ဆောက်ခြင်း",
    level: "advanced", duration: "15 နာရီ", lessons_count: 30, students_count: 95,
    is_free: false, price: 25000, thumbnail_url: null,
  },
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState("all");
  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => heroRef.current?.classList.add("revealed"), 100);
    fetchCourses();
  }, []);

  async function fetchCourses() {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    setCourses(data && data.length > 0 ? data : STATIC_COURSES);
    setLoading(false);
  }

  const filtered =
    activeLevel === "all"
      ? courses
      : courses.filter((c) => c.level === activeLevel);

  const freeCount = courses.filter((c) => c.is_free).length;

  return (
    <main className="min-h-screen bg-[#020817]">
      {/* Hero */}
      <section className="grid-bg pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-[#10B981]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-[#0EA5E9]/8 rounded-full blur-3xl pointer-events-none" />

        <div ref={heroRef} className="reveal max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#10B981]/20 bg-[#10B981]/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#10B981] text-xs font-medium tracking-wide">COURSES</span>
          </div>

          <h1 className="font-space text-4xl md:text-5xl font-bold text-white mb-4">
            သင်ကြားရေး ပရိုဂရမ်များ
          </h1>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            လက်တွေ့ကျသော skills များ၊ Myanmar context နဲ့ ဒီဇိုင်းဆွဲထားသော သင်ခန်းစာများ
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="font-space text-2xl font-bold text-white">{courses.length}+</p>
              <p className="text-white/40 text-xs mt-1">Courses</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="font-space text-2xl font-bold text-[#10B981]">{freeCount}</p>
              <p className="text-white/40 text-xs mt-1">အခမဲ့</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="font-space text-2xl font-bold text-white">500+</p>
              <p className="text-white/40 text-xs mt-1">ကျောင်းသားများ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <div className="sticky top-16 z-30 bg-[#020817]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-none">
            {LEVELS.map((lv) => (
              <button
                key={lv.id}
                onClick={() => setActiveLevel(lv.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeLevel === lv.id
                    ? "bg-[#10B981] text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {lv.label}
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
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-white/10 rounded" />
                  <div className="h-5 w-full bg-white/10 rounded" />
                  <div className="h-3 w-5/6 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-white/40">ဤအဆင့်တွင် course များ မတွေ့ပါ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="relative rounded-3xl border border-[#10B981]/20 bg-gradient-to-br from-[#10B981]/5 to-[#0EA5E9]/5 p-10 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="font-space text-2xl md:text-3xl font-bold text-white mb-3 relative">
            Custom Training လိုအပ်ပါသလား?
          </h3>
          <p className="text-white/50 text-base mb-6 relative">
            Team, Organization သို့မဟုတ် Individual အတွက် tailored သင်ကြားရေး စီစဉ်ပေးနိုင်သည်
          </p>
          <a
            href="mailto:contact@sxopop.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#10B981] text-white font-medium hover:bg-[#0ea572] transition-colors relative"
          >
            ဆက်သွယ်မည်
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  );
}
