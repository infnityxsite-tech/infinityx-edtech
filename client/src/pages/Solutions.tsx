import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceImage from "@/components/ServiceImage";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Loader2, Play, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { SOLUTION_CATEGORY_ORDER, solutionCategoryPresentation } from "@/lib/solutionCategories";

export default function Solutions() {
  const { t, isRTL } = useLanguage();
  const copy = (en: string, ar: string) => t(en, ar, en);
  const { data: hubData, isLoading } = trpc.admin.getSolutionsHub.useQuery(undefined, { staleTime: 1000 * 60 * 5 });
  const services = (hubData?.allServices || []) as any[];
  const [selectedCategory, setSelectedCategory] = useState<(typeof SOLUTION_CATEGORY_ORDER)[number]>("operations");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const categoryServices = useMemo(
    () => services.filter((service) => service.category_slug === selectedCategory),
    [services, selectedCategory]
  );
  const selected = useMemo(
    () => categoryServices.find((service) => service.id === selectedId) || categoryServices[0],
    [categoryServices, selectedId]
  );
  const activeCategory = solutionCategoryPresentation[selectedCategory];
  useSEO({
    title: "Enterprise AI Systems",
    description: "Production-grade computer vision, automation, predictive intelligence, custom AI, and software systems for enterprise operations.",
    canonical: "https://infx.space/solutions",
    robots: "index, follow",
  });

  return (
    <div className={`ix-page ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />
      <main>
        {/* ── Hero Section (Light Warm Palette) ───────────────────────────── */}
        <section className="bg-[#F5F4EF] pb-12 pt-10 text-[#1F2925] sm:pt-16 sm:pb-16 border-b border-[#D8DDD8]/60">
          <div className="ix-shell">
            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
              <div>
                <p className="ix-eyebrow text-[#6453C2]">{copy("Infinity X / solution desk", "إنفينيتي إكس / مكتب الحلول")}</p>
                <h1 className="ix-display mt-6 max-w-3xl text-5xl font-bold text-[#1F2925] sm:text-7xl">
                  {copy("Find the system behind the problem.", "اعثر على النظام خلف المشكلة.")}
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-[#5E6862]">
                  {copy(
                    "Choose the constraint. We'll show you the capability, operating shape, and next step—not a generic technology list.",
                    "اختر القيد. وسنوضح لك القدرة وشكل التشغيل والخطوة التالية، وليس قائمة تقنية عامة."
                  )}
                </p>
              </div>
              <div className="grid grid-cols-3 border border-[#D8DDD8] bg-white shadow-sm">
                <div className="border-e border-[#D8DDD8] p-5">
                  <p className="text-3xl font-bold text-[#6453C2]">{services.length || "—"}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#7B847F]">{copy("Capabilities", "قدرات")}</p>
                </div>
                <div className="border-e border-[#D8DDD8] bg-[#EAEDEA] p-5">
                  <p className="text-3xl font-bold text-[#6453C2]">04</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#5E6862]">{copy("System layers", "طبقات النظام")}</p>
                </div>
                <div className="p-5">
                  <p className="text-3xl font-bold text-[#6453C2]">01</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#7B847F]">{copy("Operating partner", "شريك تشغيلي")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Constraint Bar ──────────────────────────────────────────────── */}
        <section className="border-b bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell flex flex-wrap items-center justify-between gap-4 py-4">
            <p className="ix-kicker">{copy("Start with a constraint", "ابدأ بقيد")}</p>
            <div className="flex flex-wrap gap-2">
              <span className="border border-[#D8DDD8] bg-white px-3 py-1.5 text-xs font-semibold text-[#5E6862]">{copy("Manual work", "عمل يدوي")}</span>
              <span className="border border-[#D8DDD8] bg-white px-3 py-1.5 text-xs font-semibold text-[#5E6862]">{copy("Poor visibility", "رؤية ضعيفة")}</span>
              <span className="border border-[#D8DDD8] bg-white px-3 py-1.5 text-xs font-semibold text-[#5E6862]">{copy("Slow decisions", "قرارات بطيئة")}</span>
              <span className="border border-[#D8DDD8] bg-white px-3 py-1.5 text-xs font-semibold text-[#5E6862]">{copy("Disconnected systems", "أنظمة منفصلة")}</span>
            </div>
          </div>
        </section>

        {/* ── Capability Finder ───────────────────────────────────────────── */}
        <section id="capabilities" className="ix-section bg-[#F5F4EF]">
          <div className="ix-shell">
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="ix-kicker">{copy("Capability finder", "مكتشف القدرات")}</p>
                <h2 className="ix-display mt-4 text-4xl font-bold text-[#1F2925] sm:text-5xl">
                  {copy("What needs to move?", "ما الذي يحتاج إلى التحرك؟")}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7" style={{ color: "var(--ix-text-secondary)" }}>
                {copy(
                  "Select a capability to preview the business problem, system focus, and implementation path.",
                  "اختر قدرة لمعاينة مشكلة العمل وتركيز النظام ومسار التنفيذ."
                )}
              </p>
            </div>

            <div className="mb-6 grid gap-2 sm:grid-cols-3">
              {SOLUTION_CATEGORY_ORDER.map((categorySlug) => {
                const category = solutionCategoryPresentation[categorySlug];
                const Icon = category.icon;
                const isActive = selectedCategory === categorySlug;
                return (
                  <button
                    type="button"
                    key={categorySlug}
                    onClick={() => {
                      setSelectedCategory(categorySlug);
                      setSelectedId(null);
                    }}
                    className={`flex min-h-16 items-center gap-3 border px-4 py-3 text-start transition-colors ${
                      isActive ? "border-[#6453C2] bg-[#6453C2] text-white shadow-sm" : "border-[#D8DDD8] bg-white text-[#1F2925] hover:border-[#6453C2]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#C8BFF5]" : "text-[#6453C2]"}`} />
                    <span>
                      <span className="block text-sm font-bold">{copy(category.name.en, category.name.ar)}</span>
                      <span className={`mt-1 block text-xs leading-5 ${isActive ? "text-white/75" : "text-[#5E6862]"}`}>
                        {copy(category.homeDetail.en, category.homeDetail.ar)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {isLoading ? (
              <div className="grid min-h-[420px] place-items-center">
                <Loader2 className="h-7 w-7 animate-spin text-[#6453C2]" />
              </div>
            ) : (
              <div className="grid overflow-hidden border border-[#D8DDD8] bg-white shadow-sm lg:grid-cols-[.38fr_1fr]" style={{ borderColor: "var(--ix-border)" }}>
                {/* Service selector list */}
                <div className="bg-[#EAEDEA] p-3 text-[#1F2925] border-b lg:border-b-0 lg:border-e border-[#D8DDD8]">
                  <p className="px-4 pb-3 pt-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#6453C2]">
                    {copy("Select a system", "اختر نظاماً")} · {copy(activeCategory.name.en, activeCategory.name.ar)}
                  </p>
                  <div className="grid gap-1">
                    {categoryServices.map((service: any, index: number) => {
                      const active = selected?.id === service.id;
                      return (
                        <button
                          type="button"
                          key={service.id}
                          onClick={() => setSelectedId(service.id)}
                          className={`group grid grid-cols-[36px_1fr_20px] items-center gap-3 rounded-md px-4 py-3.5 text-start transition-all ${
                            active
                              ? "bg-[#6453C2] text-white shadow-sm"
                              : "text-[#5E6862] hover:bg-white hover:text-[#1F2925]"
                          }`}
                        >
                          <span className={`text-xs font-bold ${active ? "text-[#C8BFF5]" : "text-[#7B847F]"}`}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm font-bold leading-5">{t(service.title, service.title_ar, service.title)}</span>
                          <ChevronDown className={`h-4 w-4 -rotate-90 transition-transform ${active ? "text-[#C8BFF5]" : "text-[#7B847F]"} ${isRTL ? "rotate-90" : ""}`} />
                        </button>
                      );
                    })}
                    {categoryServices.length === 0 && (
                      <p className="px-4 py-6 text-sm leading-7 text-[#5E6862]">
                        {copy("No published systems are available in this family yet.", "لا توجد أنظمة منشورة في هذه الفئة بعد.")}
                      </p>
                    )}
                  </div>
                  <Link
                    href="/consultation"
                    className="mt-5 flex items-center justify-between border-t border-[#D8DDD8] px-4 py-4 text-sm font-bold text-[#6453C2] hover:text-[#5342AE]"
                  >
                    {copy("Not sure where to start?", "لست متأكداً من أين تبدأ؟")}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Detail panel */}
                <div className="grid gap-0 lg:grid-cols-[.92fr_1.08fr]">
                  {/* Hero image — uses ServiceImage with unique key for instant re-render */}
                  <div className="relative min-h-[320px] overflow-hidden bg-[#EAEDEA]">
                    {selected && (
                      <ServiceImage
                        key={selected.id || selected.slug}
                        service={selected}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F2925]/85 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#C8BFF5]">
                        {copy("System profile", "ملف النظام")}
                      </p>
                      <p className="mt-2 text-2xl font-bold">
                        {selected
                          ? t(selected.title, selected.title_ar, selected.title)
                          : copy("Select a capability", "اختر قدرة")}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-between bg-white p-7 sm:p-9">
                    <div>
                      <p className="ix-kicker">{copy("Business problem", "مشكلة العمل")}</p>
                      <h3 className="mt-4 text-2xl font-bold leading-8 text-[#1F2925]">
                        {selected
                          ? t(
                              selected.problem_statement || selected.description,
                              selected.problem_statement_ar || selected.description_ar,
                              selected.description
                            )
                          : copy("Choose a system to see its operating problem.", "اختر نظاماً لرؤية مشكلته التشغيلية.")}
                      </h3>
                      <div
                        className="mt-8 grid gap-6 border-t pt-6 sm:grid-cols-2"
                        style={{ borderColor: "var(--ix-border)" }}
                      >
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#7B847F]">{copy("Focus", "التركيز")}</p>
                          <p className="mt-3 text-sm leading-7" style={{ color: "var(--ix-text-secondary)" }}>
                            {selected ? t(selected.description, selected.description_ar, selected.description) : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#7B847F]">
                            {copy("What changes", "ما الذي يتغير")}
                          </p>
                          <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--ix-text-secondary)" }}>
                            <li className="flex gap-2">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6453C2]" />
                              {selected?.deliverableCount || 0} {copy("defined deliverables", "مخرجات محددة")}
                            </li>
                            <li className="flex gap-2">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6453C2]" />
                              {selected?.useCaseCount || 0} {copy("operational use cases", "حالات استخدام تشغيلية")}
                            </li>
                            <li className="flex gap-2">
                              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6453C2]" />
                              {copy("Designed for ownership", "مصمم للملكية")}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    {selected && (
                      <Link href={`/solutions/${selected.slug}`} className="ix-button ix-button-primary mt-10 w-fit">
                        {copy("Open system profile", "افتح ملف النظام")}
                        <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Process Section ─────────────────────────────────────────────── */}
        <section className="border-y bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell py-16 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div>
                <p className="ix-kicker">{copy("Every system has a path", "لكل نظام مسار")}</p>
                <h2 className="ix-display mt-4 text-4xl font-bold text-[#1F2925] sm:text-5xl">
                  {copy("The model is one layer. The work is the product.", "النموذج طبقة واحدة. العمل هو المنتج.")}
                </h2>
              </div>
              <Link href="/consultation" className="ix-button ix-button-secondary bg-white w-fit">
                {copy("Talk through the use case", "ناقش حالة الاستخدام")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-4">
              <div className="bg-white border border-[#D8DDD8] p-6 shadow-sm">
                <Play className="h-5 w-5 text-[#6453C2]" />
                <p className="mt-8 text-lg font-bold text-[#1F2925]">{copy("Frame", "حدد")}</p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--ix-text-secondary)" }}>{copy("Decision, constraint, evidence.", "القرار والقيد والدليل.")}</p>
              </div>
              <div className="bg-white border border-[#D8DDD8] p-6 shadow-sm">
                <Play className="h-5 w-5 text-[#6453C2]" />
                <p className="mt-8 text-lg font-bold text-[#1F2925]">{copy("Shape", "صمم")}</p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--ix-text-secondary)" }}>{copy("Data, model, experience.", "البيانات والنموذج والتجربة.")}</p>
              </div>
              <div className="bg-white border border-[#D8DDD8] p-6 shadow-sm">
                <Play className="h-5 w-5 text-[#6453C2]" />
                <p className="mt-8 text-lg font-bold text-[#1F2925]">{copy("Deploy", "انشر")}</p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--ix-text-secondary)" }}>{copy("Controls, integration, adoption.", "الضوابط والتكامل والتبني.")}</p>
              </div>
              <div className="bg-white border border-[#D8DDD8] p-6 shadow-sm">
                <Play className="h-5 w-5 text-[#6453C2]" />
                <p className="mt-8 text-lg font-bold text-[#1F2925]">{copy("Transfer", "انقل")}</p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--ix-text-secondary)" }}>{copy("Ownership, monitoring, improvement.", "الملكية والمراقبة والتحسين.")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
