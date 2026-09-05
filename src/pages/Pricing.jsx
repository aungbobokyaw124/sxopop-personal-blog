import { useState, useEffect, useRef } from "react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "",
    tagline: "စမ်းကြည့်ရန်",
    color: "border-white/15",
    accentColor: "text-white",
    btnClass: "bg-white/10 text-white hover:bg-white/15 border border-white/10",
    features: [
      { text: "Blog ဆောင်းပါးများ အကန့်အသတ်မရှိ ဖတ်နိုင်သည်", ok: true },
      { text: "Free Course များ access ရသည်", ok: true },
      { text: "Free Tools သုံးနိုင်သည်", ok: true },
      { text: "Premium Course များ", ok: false },
      { text: "Priority Support", ok: false },
      { text: "Downloadable Resources", ok: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 15000,
    period: "/ လ",
    tagline: "အကောင်းဆုံး",
    badge: "Popular",
    color: "border-[#0EA5E9]/50",
    accentColor: "text-[#0EA5E9]",
    highlight: true,
    btnClass: "bg-[#0EA5E9] text-white hover:bg-[#0284C7]",
    features: [
      { text: "Blog ဆောင်းပါးများ အကန့်အသတ်မရှိ", ok: true },
      { text: "Course အားလုံး access", ok: true },
      { text: "Premium Tools & Apps", ok: true },
      { text: "Downloadable Resources (PDF, Code)", ok: true },
      { text: "Priority Support (24h response)", ok: true },
      { text: "Private Community Access", ok: false },
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 99000,
    period: "တစ်ကြိမ်တည်း",
    tagline: "အမြဲတမ်း access",
    color: "border-[#10B981]/40",
    accentColor: "text-[#10B981]",
    btnClass: "bg-[#10B981] text-white hover:bg-[#059669]",
    features: [
      { text: "Pro plan ပါဝင်သည့် အရာအားလုံး", ok: true },
      { text: "Future Course များ အကုန် access", ok: true },
      { text: "Private Community Access", ok: true },
      { text: "Direct Q&A Session (လ/တစ်ကြိမ်)", ok: true },
      { text: "Priority Support (12h response)", ok: true },
      { text: "Beta feature early access", ok: true },
    ],
  },
];

const PAYMENT_METHODS = [
  {
    id: "kpay",
    name: "KBZPay",
    short: "KPay",
    number: "09XXXXXXXXX",
    icon: "💳",
    color: "#2563EB",
    instructions: [
      "KBZPay app ဖွင့်ပါ",
      "Transfer / ငွေလွှဲ ကိုနှိပ်ပါ",
      "Phone number ထည့်ပါ: 09XXXXXXXXX",
      "Amount ထည့်ပြီး Transfer လုပ်ပါ",
      "Screenshot ရိုက်ပြီး WhatsApp / Telegram ပို့ပါ",
    ],
  },
  {
    id: "wave",
    name: "Wave Money",
    short: "Wave",
    number: "09XXXXXXXXX",
    icon: "🌊",
    color: "#F59E0B",
    instructions: [
      "Wave Money app ဖွင့်ပါ",
      "Send Money ကိုနှိပ်ပါ",
      "Phone number ထည့်ပါ: 09XXXXXXXXX",
      "Amount ထည့်ပြီး Send လုပ်ပါ",
      "Transaction ID / Screenshot ပို့ပါ",
    ],
  },
];

function PlanCard({ plan, index, onSelect }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${index * 100}ms`;
          el.classList.add("revealed");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`reveal relative flex flex-col rounded-2xl border p-7 transition-all duration-300 ${plan.color} ${
        plan.highlight
          ? "bg-[#0EA5E9]/[0.06] shadow-[0_0_40px_rgba(14,165,233,0.1)]"
          : "bg-white/[0.025]"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0EA5E9] text-white text-xs font-semibold rounded-full">
          {plan.badge}
        </div>
      )}

      <div className="mb-6">
        <p className="text-white/40 text-xs mb-1">{plan.tagline}</p>
        <h3 className={`font-space text-2xl font-bold mb-4 ${plan.accentColor}`}>
          {plan.name}
        </h3>

        <div className="flex items-baseline gap-1">
          <span className="font-space text-4xl font-bold text-white">
            {plan.price === 0 ? "ဖရီး" : plan.price.toLocaleString()}
          </span>
          {plan.price > 0 && <span className="text-white/40 text-sm">ks</span>}
          {plan.period && (
            <span className="text-white/40 text-sm ml-1">{plan.period}</span>
          )}
        </div>
      </div>

      <ul className="space-y-3 flex-1 mb-7">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5 ${
                f.ok
                  ? "bg-[#10B981]/20 text-[#10B981]"
                  : "bg-white/5 text-white/20"
              }`}
            >
              {f.ok ? "✓" : "✕"}
            </span>
            <span
              className={`text-sm leading-relaxed ${
                f.ok ? "text-white/70" : "text-white/25"
              }`}
            >
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      {plan.price === 0 ? (
        <a
          href="/blog"
          className={`block text-center py-3 rounded-xl text-sm font-medium transition-all ${plan.btnClass}`}
        >
          အခမဲ့ စတင်မည်
        </a>
      ) : (
        <button
          onClick={() => onSelect(plan)}
          className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${plan.btnClass}`}
        >
          ဝယ်ယူမည်
        </button>
      )}
    </div>
  );
}

function PaymentModal({ plan, onClose }) {
  const [activeMethod, setActiveMethod] = useState("kpay");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [txnId, setTxnId] = useState("");
  const [step, setStep] = useState(1); // 1: info, 2: payment, 3: confirm
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const method = PAYMENT_METHODS.find((m) => m.id === activeMethod);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !txnId) return;
    setSubmitting(true);

    // Save to Supabase orders table
    try {
      const { supabase } = await import("../lib/supabase");
      await supabase.from("orders").insert({
        plan_id: plan.id,
        plan_name: plan.name,
        amount: plan.price,
        payment_method: activeMethod,
        customer_name: name,
        customer_email: email,
        transaction_id: txnId,
        status: "pending",
      });
    } catch (_) {
      // continue even if supabase fails
    }

    setSubmitting(false);
    setDone(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-[#0A1628] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div>
            <p className="text-white/40 text-xs">ဝယ်ယူရန်</p>
            <h3 className="font-space text-white font-semibold">
              {plan.name} Plan — {plan.price.toLocaleString()} ks
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {done ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h4 className="font-space text-white font-semibold text-lg mb-2">
                ကျေးဇူးတင်ပါသည်!
              </h4>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                သင်၏ ငွေပေးချေမှုကို လက်ခံရရှိပါသည်။
                စစ်ဆေးပြီးနောက် 24 နာရီအတွင်း email ဖြင့် access ပေးပါမည်။
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#0EA5E9] text-white text-sm font-medium hover:bg-[#0284C7] transition-colors"
              >
                ပိတ်မည်
              </button>
            </div>
          ) : step === 1 ? (
            <>
              <p className="text-white/60 text-sm mb-5">သင်၏ အချက်အလက်ထည့်ပါ</p>
              <div className="space-y-3 mb-5">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="အမည်"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
                />
              </div>
              <button
                onClick={() => name && email && setStep(2)}
                disabled={!name || !email}
                className="w-full py-3 rounded-xl bg-[#0EA5E9] text-white text-sm font-medium hover:bg-[#0284C7] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ဆက်မည် →
              </button>
            </>
          ) : step === 2 ? (
            <>
              {/* Payment method selector */}
              <div className="flex gap-2 mb-5">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMethod(m.id)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                      activeMethod === m.id
                        ? "border-[#0EA5E9]/50 bg-[#0EA5E9]/10 text-[#0EA5E9]"
                        : "border-white/10 bg-white/5 text-white/50 hover:text-white"
                    }`}
                  >
                    {m.icon} {m.short}
                  </button>
                ))}
              </div>

              {/* Payment details */}
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 mb-4">
                <p className="text-white/40 text-xs mb-3">ငွေလွှဲရမည့် ဖုန်းနံပါတ်</p>
                <div className="flex items-center justify-between">
                  <span className="font-space text-white font-bold text-xl tracking-wider">
                    {method.number}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(method.number)}
                    className="text-xs text-[#0EA5E9] hover:underline"
                  >
                    ကူးယူ
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex justify-between">
                  <span className="text-white/40 text-xs">ပမာဏ</span>
                  <span className="text-white font-semibold text-sm">
                    {plan.price.toLocaleString()} ks
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <ol className="space-y-2 mb-5">
                {method.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 text-white/40 flex items-center justify-center text-[10px] mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>

              <button
                onClick={() => setStep(3)}
                className="w-full py-3 rounded-xl bg-[#0EA5E9] text-white text-sm font-medium hover:bg-[#0284C7] transition-all"
              >
                ငွေပေးချေပြီး → အတည်ပြုမည်
              </button>
            </>
          ) : (
            <>
              <p className="text-white/60 text-sm mb-4">Transaction ID ထည့်ပြီး အတည်ပြုပါ</p>
              <input
                type="text"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                placeholder="Transaction ID / Reference No."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#0EA5E9]/50 transition-colors mb-4"
              />
              <p className="text-white/30 text-xs mb-5">
                * Screenshot ကိုလည်း{" "}
                <a href="https://t.me/sxopop" target="_blank" rel="noopener noreferrer" className="text-[#0EA5E9] underline">
                  Telegram
                </a>{" "}
                သို့ ပို့နိုင်သည်
              </p>
              <button
                onClick={handleSubmit}
                disabled={!txnId || submitting}
                className="w-full py-3 rounded-xl bg-[#10B981] text-white text-sm font-medium hover:bg-[#059669] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? "ပေးပို့နေသည်..." : "✓ အတည်ပြုပြီး ပေးပို့မည်"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => heroRef.current?.classList.add("revealed"), 100);
  }, []);

  return (
    <main className="min-h-screen bg-[#020817]">
      {selectedPlan && (
        <PaymentModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}

      {/* Hero */}
      <section className="grid-bg pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-20 left-1/3 w-80 h-80 bg-[#0EA5E9]/6 rounded-full blur-3xl pointer-events-none" />

        <div ref={heroRef} className="reveal max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0EA5E9]/20 bg-[#0EA5E9]/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
            <span className="text-[#0EA5E9] text-xs font-medium tracking-wide">PRICING</span>
          </div>

          <h1 className="font-space text-4xl md:text-5xl font-bold text-white mb-4">
            သင့်အတွက် Plan ရွေးပါ
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            Myanmar-friendly ငွေပေးချေမှု (KPay / Wave) ဖြင့် လွယ်ကူစွာ ဝယ်ယူနိုင်သည်
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={i}
              onSelect={setSelectedPlan}
            />
          ))}
        </div>
      </section>

      {/* Payment Methods */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="reveal text-center mb-8">
          <h3 className="font-space text-xl font-semibold text-white mb-2">
            ငွေပေးချေမှု နည်းလမ်းများ
          </h3>
          <p className="text-white/40 text-sm">Myanmar local payment ဖြင့် တိုက်ရိုက် လွှဲနိုင်သည်</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAYMENT_METHODS.map((m) => (
            <div
              key={m.id}
              className="reveal bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex items-center gap-5"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/5">
                {m.icon}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{m.name}</p>
                <p className="text-white/40 text-xs mt-1">
                  <span className="font-mono">{m.number}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <h3 className="font-space text-xl font-semibold text-white text-center mb-8">
          မကြာခဏ မေးသောမေးခွန်းများ
        </h3>
        <div className="space-y-4">
          {[
            {
              q: "ငွေပေးချေပြီးနောက် Access ဘယ်တော့ ရမှာလဲ?",
              a: "ငွေပေးချေမှု အတည်ပြုပြီးနောက် 24 နာရီအတွင်း email ဖြင့် access ပေးပါမည်။",
            },
            {
              q: "Refund ရပါသလား?",
              a: "Course ဖွင့်ပြီး 7 ရက်အတွင်း မကျေနပ်ပါက ငွေပြန်ကောက်ပေးမည်။",
            },
            {
              q: "Account မရှိဘဲ ဝယ်ယူနိုင်ပါသလား?",
              a: "Email ဖြင့် ဝယ်ယူ၍ ရပါသည်။ ဝယ်ယူပြီးနောက် Account ဖန်တီးနိုင်သည်။",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/8 rounded-xl p-5"
            >
              <p className="text-white font-medium text-sm mb-2">{faq.q}</p>
              <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
