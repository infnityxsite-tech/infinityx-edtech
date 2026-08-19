import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, BrainCircuit, Code2, Rocket, ShieldCheck, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";

const schools = [
  { name: "AI & Data Science", arabic: "الذكاء الاصطناعي وعلوم البيانات", slug: "ai-and-data-science", detail: "Systems, data, vision, and machine learning.", icon: BrainCircuit, signal: "Build models that see and decide." },
  { name: "Cybersecurity", arabic: "الأمن السيبراني", slug: "cybersecurity", detail: "Security operations, testing, and resilient systems.", icon: ShieldCheck, signal: "Build systems people can trust." },
  { name: "Full Stack Solutions", arabic: "تطوير النظم المتكاملة", slug: "full-stack-solutions", detail: "Software products from interface to infrastructure.", icon: Code2, signal: "Build products that hold together." },
  { name: "Space Solutions", arabic: "تكنولوجيا الفضاء", slug: "space-solutions", detail: "Geospatial data, Earth observation, and aerospace systems.", icon: Rocket, signal: "Build with a wider view." },
];

export default function AcademyHub() {
  const { isRTL, t } = useLanguage();
  const [selected, setSelected] = useState(0);
  const school = schools[selected];
  const copy = (en: string, ar: string) => t(en, ar, en);
  useSEO({
    title: "Academy | Project-based Technology Programs",
    description: "Explore Infinity X Academy's practical technology programs in AI, cybersecurity, full-stack engineering, and space technology.",
    canonical: "https://infx.space/academy",
    robots: "index, follow",
  });

  return (
    <div className={`ix-page ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />
      <main>
        {/* ── Hero Section ─────────────────────────────────────────────────── */}
        <section className="bg-[#F5F4EF] text-[#1F2925] border-b border-[#D8DDD8]/60">
          <div className="ix-shell grid min-h-[600px] gap-10 py-12 sm:py-16 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <div>
              <p className="ix-eyebrow text-[#52735F]">{copy("Infinity X / Academy", "إنفينيتي إكس / الأكاديمية")}</p>
              <h1 className="ix-display mt-6 max-w-3xl text-5xl font-bold text-[#1F2925] sm:text-7xl">
                {copy("Learn by building the system.", "تعلم من خلال بناء النظام.")}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#5E6862]">
                {copy(
                  "A practical learning product for people who want more than a certificate: a body of work, a technical discipline, and the confidence to operate what they deploy.",
                  "منتج تعليمي عملي لمن يريد أكثر من شهادة: أعمالاً ملموسة وانضباطاً تقنياً وثقة في تشغيل ما ينشره."
                )}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/courses" className="ix-button ix-button-primary">
                  {copy("Explore courses", "استكشف الدورات")}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/programs" className="ix-button ix-button-secondary">
                  {copy("Compare programs", "قارن البرامج")}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </div>
              <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-[#D8DDD8]">
                <div className="py-4">
                  <p className="text-2xl font-bold text-[#52735F]">04</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[.15em] text-[#7B847F]">{copy("Disciplines", "تخصصات")}</p>
                </div>
                <div className="border-s border-[#D8DDD8] py-4 ps-4">
                  <p className="text-2xl font-bold text-[#52735F]">02</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[.15em] text-[#7B847F]">{copy("Formats", "أنماط")}</p>
                </div>
                <div className="border-s border-[#D8DDD8] py-4 ps-4">
                  <p className="text-2xl font-bold text-[#52735F]">01</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[.15em] text-[#7B847F]">{copy("Student portal", "بوابة طالب")}</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative overflow-hidden rounded-lg border border-[#D8DDD8] bg-white shadow-lg">
              <img
                src="/uploads/ix-academy-lab.webp"
                alt={copy("Engineers learning around a robotics prototype", "مهندسون يتعلمون حول نموذج أولي للروبوتات")}
                className="aspect-[4/3] w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F2925]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-5 text-white">
                <div>
                  <p className="ix-eyebrow text-[#B8D4C2]">{copy("The learning loop", "حلقة التعلم")}</p>
                  <p className="mt-1 text-2xl font-bold">{copy("Study → build → review → ship", "ادرس ← ابنِ ← راجع ← انشر")}</p>
                </div>
                <span className="hidden border border-white/30 px-3 py-1.5 text-xs font-bold sm:block">LAB / 01</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4-Step Learning Loop ─────────────────────────────────────────── */}
        <section className="border-b bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell grid gap-0 md:grid-cols-4">
            <div className="border-b py-7 md:border-b-0 md:border-e md:pe-6" style={{ borderColor: "var(--ix-border)" }}>
              <p className="text-xs font-bold text-[#52735F]">01</p>
              <p className="mt-3 font-bold text-[#1F2925]">{copy("Choose a discipline", "اختر تخصصاً")}</p>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--ix-text-secondary)" }}>{copy("Start with the work you want to do.", "ابدأ بالعمل الذي تريد إنجازه.")}</p>
            </div>
            <div className="border-b py-7 md:border-b-0 md:border-e md:px-6" style={{ borderColor: "var(--ix-border)" }}>
              <p className="text-xs font-bold text-[#52735F]">02</p>
              <p className="mt-3 font-bold text-[#1F2925]">{copy("Compare programs", "قارن البرامج")}</p>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--ix-text-secondary)" }}>{copy("See format, duration, and outcomes.", "اطلع على النمط والمدة والمخرجات.")}</p>
            </div>
            <div className="border-b py-7 md:border-b-0 md:border-e md:px-6" style={{ borderColor: "var(--ix-border)" }}>
              <p className="text-xs font-bold text-[#52735F]">03</p>
              <p className="mt-3 font-bold text-[#1F2925]">{copy("Apply", "قدم طلبك")}</p>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--ix-text-secondary)" }}>{copy("Submit the information needed for admission.", "قدم المعلومات المطلوبة للالتحاق.")}</p>
            </div>
            <div className="py-7 md:ps-6">
              <p className="text-xs font-bold text-[#52735F]">04</p>
              <p className="mt-3 font-bold text-[#1F2925]">{copy("Learn", "تعلم")}</p>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--ix-text-secondary)" }}>{copy("Continue the work in your Student Portal.", "واصل العمل في بوابة الطالب.")}</p>
            </div>
          </div>
        </section>

        {/* ── Discipline Selector ──────────────────────────────────────────── */}
        <section className="ix-section bg-[#F5F4EF]">
          <div className="ix-shell">
            <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
              <div>
                <p className="ix-kicker">{copy("Choose your discipline", "اختر تخصصك")}</p>
                <h2 className="ix-display mt-4 text-4xl font-bold text-[#1F2925] sm:text-5xl">{copy("A route into technical practice.", "طريق إلى الممارسة التقنية.")}</h2>
              </div>
              <p className="max-w-md text-lg leading-8" style={{ color: "var(--ix-text-secondary)" }}>{copy("Select a discipline to see the kind of system work it is designed to unlock.", "اختر تخصصاً لترى نوع العمل على الأنظمة الذي يفتحه.")}</p>
            </div>
            <div className="mt-12 grid gap-0 border border-[#D8DDD8] bg-white shadow-sm" style={{ borderColor: "var(--ix-border)" }}>
              <div className="grid grid-cols-2 border-b sm:grid-cols-4 bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
                {schools.map((item, index) => {
                  const Icon = item.icon;
                  const active = selected === index;
                  return (
                    <button
                      type="button"
                      key={item.slug}
                      onClick={() => setSelected(index)}
                      className={`border-e p-5 text-start transition-all last:border-e-0 sm:p-6 ${
                        active ? "bg-[#52735F] text-white shadow-sm" : "text-[#1F2925] hover:bg-white/80"
                      }`}
                      style={{ borderColor: "var(--ix-border)" }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Icon className={`h-5 w-5 ${active ? "text-[#B8D4C2]" : "text-[#52735F]"}`} />
                        <span className={`text-xs font-bold ${active ? "text-white/80" : "text-[#7B847F]"}`}>0{index + 1}</span>
                      </div>
                      <p className={`mt-8 text-sm font-bold leading-5 ${active ? "text-white" : "text-[#1F2925]"}`}>{t(item.name, item.arabic, item.name)}</p>
                    </button>
                  );
                })}
              </div>
              <div className="grid gap-8 bg-white p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="ix-kicker">{copy("Selected discipline", "التخصص المحدد")}</p>
                  <h3 className="ix-display mt-4 text-4xl font-bold text-[#1F2925]">{t(school.name, school.arabic, school.name)}</h3>
                  <p className="mt-4 max-w-xl text-lg leading-8" style={{ color: "var(--ix-text-secondary)" }}>{t(school.detail, school.detail, school.detail)}</p>
                  <p className="mt-4 flex items-center gap-2 text-sm font-bold text-[#1F2925]"><Check className="h-4 w-4 text-[#52735F]" />{t(school.signal, school.signal, school.signal)}</p>
                </div>
                <Link href={`/academy/${school.slug}`} className="ix-button ix-button-primary">
                  {copy("Explore discipline", "استكشف التخصص")}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Choose How You Learn ─────────────────────────────────────────── */}
        <section className="border-y bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell py-16 lg:py-20">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="ix-kicker">{copy("Choose how you learn", "اختر طريقة التعلم")}</p>
                <h2 className="ix-display mt-4 text-4xl font-bold text-[#1F2925]">{copy("The right format for the work ahead.", "النمط المناسب للعمل القادم.")}</h2>
              </div>
              <Link href="/programs" className="ix-link inline-flex items-center gap-2">
                {copy("Compare all programs", "قارن كل البرامج")}
                <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
              </Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <Link href="/courses/live" className="group bg-white border border-[#D8DDD8] p-8 shadow-sm transition-all hover:border-[#52735F] hover:shadow-md sm:p-10">
                <p className="text-xs font-bold text-[#52735F]">LIVE / 01</p>
                <h3 className="mt-12 text-3xl font-bold text-[#1F2925] group-hover:text-[#52735F] transition-colors">{copy("Build with a cohort.", "ابنِ ضمن دفعة.")}</h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-[#5E6862]">{copy("Interactive sessions, instructor guidance, and a pace that keeps the work moving.", "جلسات تفاعلية وتوجيه من المدرب وإيقاع يحافظ على تقدم العمل.")}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#52735F]">{copy("Explore live courses", "استكشف الدورات المباشرة")}<ArrowUpRight className="h-4 w-4" /></span>
              </Link>
              <Link href="/courses/recorded" className="group bg-white border border-[#D8DDD8] p-8 shadow-sm transition-all hover:border-[#52735F] hover:shadow-md sm:p-10">
                <p className="text-xs font-bold text-[#52735F]">ON DEMAND / 02</p>
                <h3 className="mt-12 text-3xl font-bold text-[#1F2925] group-hover:text-[#52735F] transition-colors">{copy("Build on your schedule.", "ابنِ وفق جدولك.")}</h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-[#5E6862]">{copy("Structured recorded courses for focused practice when the timing needs to be yours.", "دورات مسجلة منظمة للممارسة المركزة عندما يكون التوقيت ملكاً لك.")}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#52735F]">{copy("Explore recorded courses", "استكشف الدورات المسجلة")}<ArrowUpRight className="h-4 w-4" /></span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
