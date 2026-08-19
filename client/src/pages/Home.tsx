import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Loader2, ScanLine, Sparkles, Workflow } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";

const lenses = [
  { id: "operate", label: "Run a better operation", short: "Operations", detail: "Make repetitive work visible, reliable, and easier to act on.", icon: Workflow },
  { id: "see", label: "See what is happening", short: "Computer vision", detail: "Turn visual signals into quality, safety, and production decisions.", icon: ScanLine },
  { id: "build", label: "Build an intelligent product", short: "Product systems", detail: "Move from an isolated model to a software experience people can own.", icon: Sparkles },
];

export default function Home() {
  const { isRTL, t } = useLanguage();
  const { data: hubData, isLoading } = trpc.admin.getSolutionsHub.useQuery(undefined, { staleTime: 1000 * 60 * 5 });
  const services = (hubData?.allServices || []) as any[];
  const [activeLens, setActiveLens] = useState("operate");
  const active = lenses.find((lens) => lens.id === activeLens) || lenses[0];
  const copy = (en: string, ar: string) => t(en, ar, en);
  useSEO({ title: "Enterprise AI & Software Engineering", description: "Infinity X engineers production-ready AI, computer vision, automation, and software systems for organisations that need the work to move.", canonical: "https://infx.space/", robots: "index, follow" });

  return (
    <div className={`ix-page ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />
      <main>
        {/* ── Hero Section (Light Warm Palette) ───────────────────────────── */}
        <section className="relative overflow-hidden bg-[#F5F4EF] text-[#1F2925] border-b border-[#D8DDD8]/60">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(82,115,95,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(82,115,95,.07) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "linear-gradient(to bottom, black 60%, transparent 95%)",
            }}
          />
          <div className="ix-shell relative grid min-h-[640px] gap-12 py-10 sm:py-16 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:py-20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[.18em] text-[#52735F]">
                <span className="h-2 w-2 rounded-full bg-[#52735F] shadow-[0_0_0_4px_rgba(82,115,95,.15)]" />
                {copy("Infinity X / Systems studio", "إنفينيتي إكس / استوديو الأنظمة")}
              </div>
              <h1 className="ix-display mt-6 text-5xl font-bold leading-[.94] tracking-[-.065em] text-[#1F2925] sm:text-7xl lg:text-[6.8rem]">
                {copy("Make the work move.", "اجعل العمل يتحرك.")}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#5E6862]">
                {copy(
                  "Infinity X builds AI systems that turn operational signals into decisions, interfaces, and actions your team can own.",
                  "تبني إنفينيتي إكس أنظمة ذكاء اصطناعي تحول الإشارات التشغيلية إلى قرارات وواجهات وإجراءات يمكن لفريقك امتلاكها."
                )}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/consultation" className="ix-button ix-button-primary">
                  {copy("Start a project", "ابدأ مشروعاً")}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/solutions" className="ix-button ix-button-secondary">
                  {copy("See what we build", "شاهد ما نبنيه")}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </div>
              <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-[#D8DDD8]">
                <div className="py-4">
                  <p className="text-2xl font-bold text-[#52735F]">04</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[.15em] text-[#7B847F]">{copy("Core systems", "أنظمة أساسية")}</p>
                </div>
                <div className="border-s border-[#D8DDD8] py-4 ps-4">
                  <p className="text-2xl font-bold text-[#52735F]">01</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[.15em] text-[#7B847F]">{copy("Operating partner", "شريك تشغيلي")}</p>
                </div>
                <div className="border-s border-[#D8DDD8] py-4 ps-4">
                  <p className="text-2xl font-bold text-[#52735F]">∞</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[.15em] text-[#7B847F]">{copy("Room to improve", "مساحة للتحسين")}</p>
                </div>
              </div>
            </div>

            {/* Hero Image Container */}
            <div className="relative lg:translate-y-4">
              <div className="absolute -inset-4 rounded-xl border border-[#52735F]/15 pointer-events-none" />
              <div className="relative overflow-hidden rounded-lg border border-[#D8DDD8] bg-white shadow-xl shadow-black/5">
                <img
                  src="/uploads/ix-hero-command-center.webp"
                  alt={copy("Engineers operating an industrial computer-vision system", "مهندسون يشغلون نظام رؤية حاسوبية صناعية")}
                  className="aspect-[4/3] h-full w-full object-cover"
                  fetchPriority="high"
                  loading="eager"
                />
                <div className="absolute left-4 top-4 flex items-center gap-2 border border-[#D8DDD8] bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#1F2925] shadow-sm backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#52735F]" />
                  {copy("Live system view", "عرض النظام المباشر")}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1F2925]/85 via-[#1F2925]/40 to-transparent p-5 text-white flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#B8D4C2]">{copy("Built for the operation", "مصمم للعملية")}</p>
                    <p className="mt-1 max-w-sm text-base sm:text-lg font-bold">{copy("From signal to action, inside the workflow.", "من الإشارة إلى الإجراء، داخل سير العمل.")}</p>
                  </div>
                  <span className="hidden border border-white/30 px-2.5 py-1 text-xs font-bold sm:block">01 / 04</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Lenses Selector ──────────────────────────────────────────────── */}
        <section className="border-b bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell grid gap-5 py-5 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
            <p className="ix-kicker">{copy("Choose the work", "اختر العمل")}</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {lenses.map((lens) => {
                const Icon = lens.icon;
                const selected = activeLens === lens.id;
                return (
                  <button
                    key={lens.id}
                    type="button"
                    onClick={() => setActiveLens(lens.id)}
                    className={`group flex items-center gap-3 border px-4 py-3 text-start transition-all ${
                      selected
                        ? "border-[#52735F] bg-white shadow-[0_4px_16px_rgba(82,115,95,.08)]"
                        : "border-transparent hover:border-[#D8DDD8] bg-transparent"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${selected ? "text-[#52735F]" : "text-[#7B847F]"}`} />
                    <span className={`text-sm font-bold ${selected ? "text-[#1F2925]" : "text-[#5E6862]"}`}>{copy(lens.short, lens.short)}</span>
                    <ChevronRight className={`ms-auto h-4 w-4 ${selected ? "text-[#52735F]" : "text-[#7B847F]"} ${isRTL ? "rotate-180" : ""}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Solutions Preview List ───────────────────────────────────────── */}
        <section className="ix-section bg-[#F5F4EF]">
          <div className="ix-shell grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
            <div>
              <p className="ix-kicker">{copy("The system behind the outcome", "النظام خلف النتيجة")}</p>
              <h2 className="ix-display mt-5 text-4xl font-bold text-[#1F2925] sm:text-5xl">{copy(active.label, active.label)}</h2>
              <p className="mt-5 max-w-md text-lg leading-8" style={{ color: "var(--ix-text-secondary)" }}>
                {copy(active.detail, active.detail)}
              </p>
              <Link href="/solutions" className="ix-button ix-button-secondary mt-8">
                {copy("Explore the solution map", "استكشف خريطة الحلول")}
                <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
              </Link>
            </div>
            <div className="grid gap-0 border-t" style={{ borderColor: "var(--ix-border)" }}>
              {isLoading ? (
                <div className="py-14">
                  <Loader2 className="h-7 w-7 animate-spin text-[#52735F]" />
                </div>
              ) : (
                services.slice(0, 4).map((service: any, index: number) => (
                  <Link
                    key={service.id}
                    href={`/solutions/${service.slug}`}
                    className="group grid gap-4 border-b py-6 transition-colors hover:bg-[#EAEDEA]/70 sm:grid-cols-[48px_1fr_36px] sm:items-center"
                    style={{ borderColor: "var(--ix-border)" }}
                  >
                    <span className="text-xs font-bold text-[#52735F]">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold tracking-[-.025em] text-[#1F2925] group-hover:text-[#52735F]">
                          {t(service.title, service.title_ar, service.title)}
                        </h3>
                        <span className="border border-[#D8DDD8] bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-[.14em] text-[#7B847F]">
                          {copy("System", "نظام")}
                        </span>
                      </div>
                      <p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: "var(--ix-text-secondary)" }}>
                        {t(service.description, service.description_ar, service.description)}
                      </p>
                    </div>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-[#D8DDD8] bg-white transition-all group-hover:border-[#52735F] group-hover:bg-[#52735F] group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── How We Work (Light Neutral with White Cards) ────────────────── */}
        <section className="bg-[#EAEDEA] text-[#1F2925] border-y border-[#D8DDD8]">
          <div className="ix-shell py-16 lg:py-24">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="ix-eyebrow text-[#52735F]">{copy("How we work", "كيف نعمل")}</p>
                <h2 className="ix-display mt-5 max-w-3xl text-4xl font-bold sm:text-6xl">{copy("A production path, not a pitch deck.", "مسار إنتاج، وليس عرضاً تقديمياً.")}</h2>
              </div>
              <Link href="/about" className="ix-button ix-button-secondary bg-white">
                {copy("Meet the company", "تعرّف على الشركة")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              <div className="bg-white border border-[#D8DDD8] p-8 shadow-sm">
                <p className="text-4xl font-bold text-[#52735F]">01</p>
                <h3 className="mt-8 text-xl font-bold text-[#1F2925]">{copy("Frame the work", "حدد العمل")}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5E6862]">
                  {copy("We start with the decision, constraint, and evidence the operation needs.", "نبدأ بالقرار والقيد والأدلة التي تحتاجها العملية.")}
                </p>
              </div>
              <div className="bg-white border border-[#D8DDD8] p-8 shadow-sm">
                <p className="text-4xl font-bold text-[#52735F]">02</p>
                <h3 className="mt-8 text-xl font-bold text-[#1F2925]">{copy("Build the system", "ابنِ النظام")}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5E6862]">
                  {copy("Data, model, interface, workflow, and controls are designed as one product.", "نصمم البيانات والنموذج والواجهة وسير العمل والضوابط كمنتج واحد.")}
                </p>
              </div>
              <div className="bg-white border border-[#D8DDD8] p-8 shadow-sm">
                <p className="text-4xl font-bold text-[#52735F]">03</p>
                <h3 className="mt-8 text-xl font-bold text-[#1F2925]">{copy("Transfer ownership", "انقل الملكية")}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5E6862]">
                  {copy("The team receives the operating model, documentation, and room to improve.", "يتلقى الفريق نموذج التشغيل والتوثيق ومساحة للتحسين.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Academy Spotlight ───────────────────────────────────────────── */}
        <section className="ix-section bg-[#F5F4EF]">
          <div className="ix-shell grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div className="overflow-hidden border border-[#D8DDD8] bg-white shadow-md">
              <img
                src="/uploads/ix-academy-lab.webp"
                alt={copy("Engineers learning around a robotics prototype", "مهندسون يتعلمون حول نموذج أولي للروبوتات")}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="ix-kicker">{copy("Infinity X Academy", "أكاديمية إنفينيتي إكس")}</p>
              <h2 className="ix-display mt-5 text-4xl font-bold text-[#1F2925] sm:text-5xl">
                {copy("The people who run the system matter as much as the system.", "الأشخاص الذين يشغلون النظام مهمون بقدر أهمية النظام.")}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8" style={{ color: "var(--ix-text-secondary)" }}>
                {copy(
                  "Project-based programs across AI, cybersecurity, software engineering, and space technology. Learn by building the same kinds of systems that move real work forward.",
                  "برامج قائمة على المشاريع في الذكاء الاصطناعي والأمن السيبراني وهندسة البرمجيات وتكنولوجيا الفضاء. تعلم من خلال بناء الأنظمة التي تحرك العمل الحقيقي."
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/academy" className="ix-button ix-button-primary">
                  {copy("Explore the Academy", "استكشف الأكاديمية")}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/courses" className="ix-button ix-button-secondary">
                  {copy("Browse courses", "تصفح الدورات")}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom Consultation CTA ────────────────────────────────────── */}
        <section className="border-t bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell grid gap-8 py-16 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
            <div>
              <p className="ix-kicker">{copy("Your next system", "نظامك القادم")}</p>
              <h2 className="ix-display mt-5 max-w-3xl text-4xl font-bold text-[#1F2925] sm:text-6xl">
                {copy("Bring the operational problem. Leave with an engineering plan.", "أحضر المشكلة التشغيلية. وغادر بخطة هندسية.")}
              </h2>
            </div>
            <div>
              <Link href="/consultation" className="ix-button ix-button-primary">
                {copy("Request a consultation", "اطلب استشارة")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <p className="mt-4 flex items-center gap-2 text-sm" style={{ color: "var(--ix-text-secondary)" }}>
                <Check className="h-4 w-4 text-[#52735F]" />
                {copy("No generic stack before the problem is understood.", "لا حزمة تقنية عامة قبل فهم المشكلة.")}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
