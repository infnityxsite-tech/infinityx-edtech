import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceImage from "@/components/ServiceImage";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Loader2, Play, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";

export default function Solutions() {
  const { t, isRTL } = useLanguage();
  const copy = (en: string, ar: string) => t(en, ar, en);
  const { data: hubData, isLoading } = trpc.admin.getSolutionsHub.useQuery(undefined, { staleTime: 1000 * 60 * 5 });
  const services = (hubData?.allServices || []) as any[];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => services.find((service) => service.id === selectedId) || services[0],
    [services, selectedId]
  );
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
        {/* Hero */}
        <section className="bg-[#07131f] pb-10 pt-28 text-white sm:pt-32">
          <div className="ix-shell">
            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
              <div>
                <p className="ix-eyebrow text-[#a5d9c2]">{copy("Infinity X / solution desk", "إنفينيتي إكس / مكتب الحلول")}</p>
                <h1 className="ix-display mt-6 max-w-3xl text-5xl font-bold sm:text-7xl">
                  {copy("Find the system behind the problem.", "اعثر على النظام خلف المشكلة.")}
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-[#c0cdd3]">
                  {copy(
                    "Choose the constraint. We'll show you the capability, operating shape, and next step—not a generic technology list.",
                    "اختر القيد. وسنوضح لك القدرة وشكل التشغيل والخطوة التالية، وليس قائمة تقنية عامة."
                  )}
                </p>
              </div>
              <div className="grid grid-cols-3 border border-white/15">
                <div className="border-e border-white/15 p-5">
                  <p className="text-3xl font-bold text-[#7db2ff]">{services.length || "—"}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#9aaab4]">{copy("Capabilities", "قدرات")}</p>
                </div>
                <div className="border-e border-white/15 bg-[#13304d] p-5">
                  <p className="text-3xl font-bold text-[#a5d9c2]">04</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#c0cdd3]">{copy("System layers", "طبقات النظام")}</p>
                </div>
                <div className="p-5">
                  <p className="text-3xl font-bold text-[#7db2ff]">01</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[.15em] text-[#9aaab4]">{copy("Operating partner", "شريك تشغيلي")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Constraint bar */}
        <section className="border-b bg-[#f0f3f1]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell flex flex-wrap items-center justify-between gap-4 py-4">
            <p className="ix-kicker">{copy("Start with a constraint", "ابدأ بقيد")}</p>
            <div className="flex flex-wrap gap-2">
              <span className="border border-[#c7d2d8] bg-white px-3 py-2 text-xs font-bold text-[#52606b]">{copy("Manual work", "عمل يدوي")}</span>
              <span className="border border-[#c7d2d8] bg-white px-3 py-2 text-xs font-bold text-[#52606b]">{copy("Poor visibility", "رؤية ضعيفة")}</span>
              <span className="border border-[#c7d2d8] bg-white px-3 py-2 text-xs font-bold text-[#52606b]">{copy("Slow decisions", "قرارات بطيئة")}</span>
              <span className="border border-[#c7d2d8] bg-white px-3 py-2 text-xs font-bold text-[#52606b]">{copy("Disconnected systems", "أنظمة منفصلة")}</span>
            </div>
          </div>
        </section>

        {/* Capability finder */}
        <section id="capabilities" className="ix-section">
          <div className="ix-shell">
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="ix-kicker">{copy("Capability finder", "مكتشف القدرات")}</p>
                <h2 className="ix-display mt-4 text-4xl font-bold sm:text-5xl">
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

            {isLoading ? (
              <div className="grid min-h-[420px] place-items-center">
                <Loader2 className="h-7 w-7 animate-spin text-[#1268e5]" />
              </div>
            ) : (
              <div className="grid overflow-hidden border lg:grid-cols-[.38fr_1fr]" style={{ borderColor: "var(--ix-border)" }}>
                {/* Service selector list */}
                <div className="bg-[#102033] p-3 text-white">
                  <p className="px-4 pb-3 pt-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#7db2ff]">
                    {copy("Select a system", "اختر نظاماً")}
                  </p>
                  <div className="grid gap-1">
                    {services.map((service: any, index: number) => {
                      const active = selected?.id === service.id;
                      return (
                        <button
                          type="button"
                          key={service.id}
                          onClick={() => setSelectedId(service.id)}
                          className={`group grid grid-cols-[36px_1fr_20px] items-center gap-3 px-4 py-4 text-start transition-all ${active ? "bg-[#1a4f7b] text-white" : "text-[#b9c8d1] hover:bg-white/10"}`}
                        >
                          <span className={`text-xs font-bold ${active ? "text-[#a5d9c2]" : "text-[#7db2ff]"}`}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm font-bold leading-5">{t(service.title, service.title_ar, service.title)}</span>
                          <ChevronDown className={`h-4 w-4 -rotate-90 transition-transform ${active ? "text-[#a5d9c2]" : "text-[#82949f]"} ${isRTL ? "rotate-90" : ""}`} />
                        </button>
                      );
                    })}
                  </div>
                  <Link
                    href="/consultation"
                    className="mt-5 flex items-center justify-between border-t border-white/15 px-4 py-5 text-sm font-bold text-[#a5d9c2]"
                  >
                    {copy("Not sure where to start?", "لست متأكداً من أين تبدأ؟")}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Detail panel */}
                <div className="grid gap-0 lg:grid-cols-[.92fr_1.08fr]">
                  {/* Hero image — uses ServiceImage for DB-first resolution */}
                  <div className="relative min-h-[320px] overflow-hidden bg-[#dfe8ec]">
                    {selected && (
                      <ServiceImage
                        service={selected}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07131f]/75 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#a5d9c2]">
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
                      <h3 className="mt-4 text-2xl font-bold leading-8">
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
                          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#71808b]">{copy("Focus", "التركيز")}</p>
                          <p className="mt-3 text-sm leading-7" style={{ color: "var(--ix-text-secondary)" }}>
                            {selected ? t(selected.description, selected.description_ar, selected.description) : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#71808b]">
                            {copy("What changes", "ما الذي يتغير")}
                          </p>
                          <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--ix-text-secondary)" }}>
                            <li className="flex gap-2">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1268e5]" />
                              {selected?.deliverableCount || 0} {copy("defined deliverables", "مخرجات محددة")}
                            </li>
                            <li className="flex gap-2">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1268e5]" />
                              {selected?.useCaseCount || 0} {copy("operational use cases", "حالات استخدام تشغيلية")}
                            </li>
                            <li className="flex gap-2">
                              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1268e5]" />
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

        {/* Process */}
        <section className="border-y" style={{ borderColor: "var(--ix-border)", background: "var(--ix-surface-muted)" }}>
          <div className="ix-shell py-16 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div>
                <p className="ix-kicker">{copy("Every system has a path", "لكل نظام مسار")}</p>
                <h2 className="ix-display mt-4 text-4xl font-bold sm:text-5xl">
                  {copy("The model is one layer. The work is the product.", "النموذج طبقة واحدة. العمل هو المنتج.")}
                </h2>
              </div>
              <Link href="/consultation" className="ix-button ix-button-secondary w-fit">
                {copy("Talk through the use case", "ناقش حالة الاستخدام")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-12 grid gap-px border border-[#c7d2d8] bg-[#c7d2d8] md:grid-cols-4">
              <div className="bg-[#f0f3f1] p-6">
                <Play className="h-5 w-5 text-[#1268e5]" />
                <p className="mt-10 text-lg font-bold">{copy("Frame", "حدد")}</p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--ix-text-secondary)" }}>{copy("Decision, constraint, evidence.", "القرار والقيد والدليل.")}</p>
              </div>
              <div className="bg-white p-6">
                <Play className="h-5 w-5 text-[#1268e5]" />
                <p className="mt-10 text-lg font-bold">{copy("Shape", "صمم")}</p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--ix-text-secondary)" }}>{copy("Data, model, experience.", "البيانات والنموذج والتجربة.")}</p>
              </div>
              <div className="bg-white p-6">
                <Play className="h-5 w-5 text-[#1268e5]" />
                <p className="mt-10 text-lg font-bold">{copy("Deploy", "انشر")}</p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--ix-text-secondary)" }}>{copy("Controls, integration, adoption.", "الضوابط والتكامل والتبني.")}</p>
              </div>
              <div className="bg-[#13304d] p-6 text-white">
                <Play className="h-5 w-5 text-[#a5d9c2]" />
                <p className="mt-10 text-lg font-bold">{copy("Transfer", "انقل")}</p>
                <p className="mt-2 text-sm leading-6 text-[#c0cdd3]">{copy("Ownership, monitoring, improvement.", "الملكية والمراقبة والتحسين.")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
