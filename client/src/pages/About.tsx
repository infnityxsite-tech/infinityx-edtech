import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Check, Loader2, ScanLine, ShieldCheck, Workflow } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { trpc } from "@/lib/trpc";

const principles = [
  ["Operating context before model selection.", "سياق التشغيل قبل اختيار النموذج."],
  ["A deployable system, not an isolated prototype.", "نظام قابل للنشر، وليس نموذجاً أولياً معزولاً."],
  ["Knowledge transfer designed into the engagement.", "نقل المعرفة مصمم داخل التعاون."],
  ["Clear ownership after launch.", "ملكية واضحة بعد الإطلاق."],
];

export default function About() {
  const { t, isRTL } = useLanguage();
  const { data: pageContent, isLoading } = trpc.admin.getPageContent.useQuery({ pageKey: "about" });
  const founderName = (pageContent as any)?.founderName || "Ahmed Farahat";
  const copy = (en: string, ar: string) => t(en, ar, en);
  useSEO({
    title: "Company | Infinity X Solutions",
    description: "Infinity X Solutions is an AI engineering company that builds, transfers, and supports production systems for real operations.",
    canonical: "https://infx.space/about",
    robots: "index, follow",
  });

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F5F4EF] text-[#1F2925]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6453C2]" />
      </div>
    );
  }

  return (
    <div className={`ix-page ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />
      <main>
        {/* ── Hero Section ─────────────────────────────────────────────────── */}
        <section className="bg-[#F5F4EF] text-[#1F2925] border-b border-[#D8DDD8]/60">
          <div className="ix-shell grid min-h-[600px] gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="ix-eyebrow text-[#6453C2]">{copy("Infinity X / company", "إنفينيتي إكس / الشركة")}</p>
              <h1 className="ix-display mt-6 max-w-4xl text-5xl font-bold text-[#1F2925] sm:text-7xl">
                {copy("We build the capability behind the system.", "نبني القدرة خلف النظام.")}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5E6862]">
                {copy(
                  "Infinity X is an AI engineering company for teams that need production systems—not presentation-ready experiments. We build the intelligence, the workflow, and the ownership around the work.",
                  "إنفينيتي إكس شركة هندسة ذكاء اصطناعي للفرق التي تحتاج إلى أنظمة إنتاج، وليس تجارب جاهزة للعرض. نبني الذكاء وسير العمل والملكية حول العمل."
                )}
              </p>
              <Link href="/consultation" className="ix-button ix-button-primary mt-9 w-fit">
                {copy("Work with us", "اعمل معنا")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {/* 4-Box Pillars */}
            <div className="grid w-full max-w-md grid-cols-2 border border-[#D8DDD8] bg-white shadow-sm">
              <div className="border-e border-b border-[#D8DDD8] p-6">
                <ScanLine className="h-5 w-5 text-[#6453C2]" />
                <p className="mt-10 text-xl font-bold text-[#1F2925]">{copy("Build", "ابنِ")}</p>
                <p className="mt-2 text-sm leading-6 text-[#5E6862]">{copy("The system around the operation.", "النظام حول العملية.")}</p>
              </div>
              <div className="border-b border-[#D8DDD8] bg-[#EAEDEA]/60 p-6">
                <Workflow className="h-5 w-5 text-[#6453C2]" />
                <p className="mt-10 text-xl font-bold text-[#1F2925]">{copy("Embed", "رسّخ")}</p>
                <p className="mt-2 text-sm leading-6 text-[#5E6862]">{copy("The workflow people actually use.", "سير العمل الذي يستخدمه الناس فعلاً.")}</p>
              </div>
              <div className="border-e border-[#D8DDD8] bg-[#EAEDEA]/60 p-6">
                <ShieldCheck className="h-5 w-5 text-[#6453C2]" />
                <p className="mt-10 text-xl font-bold text-[#1F2925]">{copy("Transfer", "انقل")}</p>
                <p className="mt-2 text-sm leading-6 text-[#5E6862]">{copy("The capability that remains after launch.", "القدرة التي تبقى بعد الإطلاق.")}</p>
              </div>
              <div className="p-6">
                <p className="text-3xl font-bold text-[#6453C2]">∞</p>
                <p className="mt-10 text-xl font-bold text-[#1F2925]">{copy("Improve", "حسّن")}</p>
                <p className="mt-2 text-sm leading-6 text-[#5E6862]">{copy("The room to keep making it better.", "المساحة لمواصلة التحسين.")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── One Sentence Philosophy ──────────────────────────────────────── */}
        <section className="border-b bg-white" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell grid gap-10 py-16 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div>
              <p className="ix-kicker">{copy("The company in one sentence", "الشركة في جملة واحدة")}</p>
              <h2 className="ix-display mt-4 text-4xl font-bold text-[#1F2925] sm:text-5xl">
                {copy("The model is one layer. The operating system is the product.", "النموذج طبقة واحدة. النظام التشغيلي هو المنتج.")}
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8" style={{ color: "var(--ix-text-secondary)" }}>
              {copy(
                "That is why we work across computer vision, automation, predictive intelligence, software, and technical education: the lasting outcome is the capability to see, decide, and run better.",
                "لهذا نعمل عبر الرؤية الحاسوبية والأتمتة والذكاء التنبؤي والبرمجيات والتعليم التقني: النتيجة المستمرة هي القدرة على الرؤية والقرار والتشغيل بشكل أفضل."
              )}
            </p>
          </div>
        </section>

        {/* ── How We Work ──────────────────────────────────────────────────── */}
        <section className="ix-section bg-[#EAEDEA] border-b border-[#D8DDD8]">
          <div className="ix-shell">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="ix-kicker">{copy("How we work", "كيف نعمل")}</p>
                <h2 className="ix-display mt-4 text-4xl font-bold text-[#1F2925] sm:text-5xl">
                  {copy("A practical operating model for complex technology.", "نموذج تشغيلي عملي للتقنية المعقدة.")}
                </h2>
              </div>
              <Link href="/solutions" className="ix-link inline-flex items-center gap-2">
                {copy("See the systems", "شاهد الأنظمة")}
                <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
              </Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="bg-white border border-[#D8DDD8] p-8 shadow-sm">
                <p className="text-4xl font-bold text-[#6453C2]">01</p>
                <h3 className="mt-10 text-2xl font-bold text-[#1F2925]">{copy("Understand", "افهم")}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5E6862]">
                  {copy("Map the workflow, decision points, data conditions, and constraints that define useful technology.", "نرسم سير العمل ونقاط القرار وحالة البيانات والقيود التي تحدد التقنية المفيدة.")}
                </p>
              </div>
              <div className="bg-white border border-[#D8DDD8] p-8 shadow-sm">
                <p className="text-4xl font-bold text-[#6453C2]">02</p>
                <h3 className="mt-10 text-2xl font-bold text-[#1F2925]">{copy("Engineer", "اهندس")}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5E6862]">
                  {copy("Build the intelligence, interface, integration, and controls required for a system to operate.", "نبني الذكاء والواجهة والتكامل والضوابط المطلوبة لكي يعمل النظام.")}
                </p>
              </div>
              <div className="bg-white border border-[#D8DDD8] p-8 shadow-sm">
                <p className="text-4xl font-bold text-[#6453C2]">03</p>
                <h3 className="mt-10 text-2xl font-bold text-[#1F2925]">{copy("Embed", "رسّخ")}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5E6862]">
                  {copy("Help the organisation operate and evolve the system, with capability transfer built in.", "نساعد المؤسسة على تشغيل النظام وتطويره مع نقل القدرة ضمن العملية.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Engineering Principles ───────────────────────────────────────── */}
        <section className="border-b bg-[#F5F4EF]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell grid gap-10 py-16 lg:grid-cols-[.7fr_1.3fr] lg:py-20">
            <div>
              <p className="ix-kicker">{copy("Engineering principles", "مبادئ هندسية")}</p>
              <h2 className="ix-display mt-4 text-4xl font-bold text-[#1F2925]">{copy("What teams can expect from the work.", "ما يمكن للفرق توقعه من العمل.")}</h2>
            </div>
            <div className="grid border border-[#D8DDD8] bg-white shadow-sm" style={{ borderColor: "var(--ix-border)" }}>
              {principles.map(([en, ar], index) => (
                <div key={en} className="grid grid-cols-[52px_1fr] gap-4 border-b p-6 last:border-b-0 sm:p-8" style={{ borderColor: "var(--ix-border)" }}>
                  <span className="text-sm font-bold text-[#6453C2]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-xl font-bold leading-8 text-[#1F2925]">{t(en, ar, en)}</p>
                    <Check className="mt-4 h-4 w-4 text-[#6453C2]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Technical Leadership ─────────────────────────────────────────── */}
        <section className="ix-section bg-[#F5F4EF]">
          <div className="ix-shell grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div className="overflow-hidden border border-[#D8DDD8] bg-white shadow-md">
              <img src="/uploads/poster.webp" alt={founderName} className="aspect-[4/5] w-full max-w-sm object-cover" />
            </div>
            <div>
              <p className="ix-kicker">{copy("Technical leadership", "قيادة تقنية")}</p>
              <h2 className="ix-display mt-5 text-4xl font-bold text-[#1F2925] sm:text-5xl">{founderName}</h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#5E6862]">
                {copy(
                  "Infinity X is led by an AI engineer and technical architect specialising in computer vision, deep learning, and production MLOps across enterprise systems and project-based technical education.",
                  "يقود إنفينيتي إكس مهندس ذكاء اصطناعي ومعماري تقني متخصص في الرؤية الحاسوبية والتعلم العميق وعمليات تعلم الآلة الإنتاجية عبر أنظمة المؤسسات والتعليم التقني القائم على المشاريع."
                )}
              </p>
              <a href="https://linkedin.com/in/ahmed-s-farahat" target="_blank" rel="noreferrer" className="ix-button ix-button-secondary mt-7 w-fit">
                {copy("Professional profile", "الملف المهني")}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ── Bottom Consultation CTA ────────────────────────────────────── */}
        <section className="border-t bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell grid gap-8 py-16 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
            <div>
              <p className="ix-eyebrow text-[#6453C2]">{copy("Work with us", "اعمل معنا")}</p>
              <h2 className="ix-display mt-5 max-w-3xl text-4xl font-bold text-[#1F2925] sm:text-6xl">
                {copy("Bring the operating problem. We’ll bring the engineering plan.", "أحضر المشكلة التشغيلية. وسنقدم خطة الهندسة.")}
              </h2>
            </div>
            <Link href="/consultation" className="ix-button ix-button-primary lg:justify-self-end">
              {copy("Start an AI project", "ابدأ مشروع ذكاء اصطناعي")}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
