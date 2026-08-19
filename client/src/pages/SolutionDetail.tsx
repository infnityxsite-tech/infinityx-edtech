import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceImage from "@/components/ServiceImage";
import ProposalGenerator from "@/components/solutions/ProposalGenerator";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Compass, Eye, Layers, Loader2, ShieldCheck, Sparkles, X } from "lucide-react";

type DetailTab = "problem" | "system" | "ownership";

export default function SolutionDetail() {
  const [, params] = useRoute("/solutions/:slug");
  const slug = params?.slug || "";
  const { t, isRTL } = useLanguage();
  const [tab, setTab] = useState<DetailTab>("problem");
  const [proposalOpen, setProposalOpen] = useState(false);
  const copy = (en: string, ar: string) => t(en, ar, en);
  const text = (en?: string, ar?: string, fallback = "") => t(en || fallback, ar || en || fallback, fallback || en || "");

  const { data: solutionData, isLoading } = trpc.admin.getSolutionBySlug.useQuery({ slug }, { enabled: Boolean(slug) });
  const { data: hubData } = trpc.admin.getSolutionsHub.useQuery(undefined, { staleTime: 1000 * 60 * 5 });

  const solution = solutionData?.service as any;
  const techStack = (solutionData?.techStack || []) as any[];
  const deliverables = (solutionData?.deliverables || []) as any[];
  const useCases = (solutionData?.useCases || []) as any[];
  const relatedServices = (solutionData?.relatedServices || []) as any[];

  useSEO({
    title: solution?.title ? `${solution.title} | Infinity X Solutions` : "Solution Profile | Infinity X",
    description: solution?.description || "Production-grade enterprise AI capability designed around operational constraints.",
    canonical: `https://infx.space/solutions/${slug}`,
    robots: isLoading ? undefined : solution ? "index, follow" : "noindex, follow",
  });

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F5F4EF] text-[#1F2925]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6453C2]" />
      </div>
    );
  }

  if (!solution) {
    return (
      <div className={`ix-page grid min-h-screen place-items-center px-6 text-center ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        <div>
          <Compass className="mx-auto h-10 w-10 text-[#6453C2]" />
          <h1 className="ix-display mt-6 text-4xl font-bold">{copy("System profile not found.", "ملف النظام غير موجود.")}</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7" style={{ color: "var(--ix-text-secondary)" }}>
            {copy("This capability profile may have moved. Explore all enterprise systems.", "قد يكون تم نقل هذا الملف. استكشف جميع أنظمة المؤسسات.")}
          </p>
          <Link href="/solutions" className="ix-button ix-button-primary mt-8">
            {copy("Explore solutions", "استكشف الحلول")}
            <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </div>
    );
  }

  const tabs: Array<{ id: DetailTab; label: string }> = [
    { id: "problem", label: copy("01 · The Constraint", "01 · القيد") },
    { id: "system", label: copy("02 · The System Shape", "02 · شكل النظام") },
    { id: "ownership", label: copy("03 · Handover & Operations", "03 · التسليم والتشغيل") },
  ];

  const activeTabContent = {
    problem: {
      title: copy("Operating challenge", "التحدي التشغيلي"),
      detail: text(
        solution.problem_statement,
        solution.problem_statement_ar,
        copy("Where the current operation slows down, creates risk, or loses signal.", "أين يتباطأ التشغيل الحالي أو تنشأ المخاطر أو تُفقد الإشارات.")
      ),
    },
    system: {
      title: copy("System focus", "تركيز النظام"),
      detail: text(
        solution.target_audience,
        solution.target_audience_ar,
        copy("How the system ingests signal, applies logic, and interfaces with the team.", "كيف يستقبل النظام الإشارات ويطبق المنطق ويتكامل مع الفريق.")
      ),
    },
    ownership: {
      title: copy("Handover & monitoring", "التسليم والمراقبة"),
      detail: text(
        solution.integration_details,
        solution.integration_details_ar,
        copy("What the engineering team provides to verify, monitor, and transfer ownership.", "ما يقدمه الفريق الهندسي للتحقق والمراقبة ونقل الملكية.")
      ),
    },
  };

  const systemSteps = [
    {
      icon: Eye,
      title: copy("Map the constraint", "تحديد القيد"),
      detail: copy("Identify the signal, decision, or manual bottleneck that needs to change.", "تحديد الإشارة أو القرار أو عنق الزجاجة اليدوي الذي يحتاج إلى تغيير."),
    },
    {
      icon: Layers,
      title: copy("Structure the system", "هيكلة النظام"),
      detail: copy("Deploy the models, interfaces, and controls required for production.", "نشر النماذج والواجهات والضوابط المطلوبة لبيئة الإنتاج."),
    },
    {
      icon: ShieldCheck,
      title: copy("Transfer ownership", "نقل الملكية"),
      detail: copy("Equip internal teams with documentation, pipelines, and operating controls.", "تزويد الفرق الداخلية بالتوثيق وخطوط العمل وضوابط التشغيل."),
    },
  ];

  return (
    <div className={`ix-page ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />
      <main>
        {/* ── Hero Section ─────────────────────────────────────────────────── */}
        <section className="bg-[#F5F4EF] text-[#1F2925] border-b border-[#D8DDD8]/60">
          <div className="ix-shell py-12 sm:py-16">
            <Link href="/solutions" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5E6862] hover:text-[#1F2925] transition-colors">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
              {copy("All solutions", "كل الحلول")}
            </Link>
            <div className="mt-8 grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
              <div>
                <p className="ix-eyebrow text-[#6453C2]">
                  {text(solution.category_name, solution.category_name, copy("Enterprise capability", "قدرة للمؤسسات"))}
                </p>
                <h1 className="ix-display mt-6 max-w-3xl text-5xl font-bold text-[#1F2925] sm:text-7xl">
                  {text(solution.title, solution.title_ar, solution.title)}
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5E6862]">
                  {text(
                    solution.description,
                    solution.description_ar,
                    copy("A production-oriented system designed around the operational work it needs to support.", "نظام إنتاجي مصمم حول العمل التشغيلي الذي يحتاج إلى دعمه.")
                  )}
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => setProposalOpen(true)} className="ix-button ix-button-primary h-12">
                    {copy("Request a project proposal", "اطلب مقترح مشروع")}
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <a href="#system" className="ix-button ix-button-secondary h-12 bg-white">
                    {copy("See the system shape", "شاهد شكل النظام")}
                    <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                  </a>
                </div>
              </div>

              {/* Service Hero Image */}
              <div className="relative overflow-hidden rounded-lg border border-[#D8DDD8] bg-white shadow-lg">
                <ServiceImage key={solution.id || solution.slug} service={solution} className="aspect-[4/3] h-full w-full object-cover" loading="eager" fetchPriority="high" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2925]/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#C8BFF5]">{copy("System profile", "ملف النظام")}</p>
                    <p className="mt-1 text-xl font-bold">{copy("Signal → decision → action", "إشارة ← قرار ← إجراء")}</p>
                  </div>
                  <span className="hidden border border-white/30 px-3 py-1.5 text-xs font-bold sm:block">LIVE / 01</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── System Steps ─────────────────────────────────────────────────── */}
        <section className="border-b bg-white" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell grid gap-0 sm:grid-cols-3">
            {systemSteps.map(({ icon: Icon, title, detail }, index) => (
              <div key={title} className="border-b p-6 sm:border-b-0 sm:border-e sm:last:border-e-0 sm:p-8" style={{ borderColor: "var(--ix-border)" }}>
                <Icon className="h-5 w-5 text-[#6453C2]" />
                <p className="mt-8 text-xs font-bold text-[#6453C2]">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-bold text-[#1F2925]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5E6862]">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── System Profile Tabs ──────────────────────────────────────────── */}
        <section id="system" className="ix-section bg-[#F5F4EF]">
          <div className="ix-shell grid gap-10 lg:grid-cols-[.65fr_1.35fr]">
            <div>
              <p className="ix-kicker">{copy("System profile", "ملف النظام")}</p>
              <h2 className="ix-display mt-5 text-4xl font-bold text-[#1F2925] sm:text-5xl">
                {copy("The technology is only useful when the work changes.", "تكون التقنية مفيدة فقط عندما يتغير العمل.")}
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8" style={{ color: "var(--ix-text-secondary)" }}>
                {copy(
                  "Use the three views to understand the constraint, the system shape, and the ownership plan behind this capability.",
                  "استخدم الرؤى الثلاث لفهم القيد وشكل النظام وخطة الملكية خلف هذه القدرة."
                )}
              </p>
            </div>
            <div className="border border-[#D8DDD8] bg-white shadow-sm">
              <div className="grid grid-cols-3 border-b bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
                {tabs.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`border-e px-4 py-4 text-sm font-bold last:border-e-0 sm:px-6 transition-all ${
                      tab === item.id ? "bg-[#6453C2] text-white shadow-sm" : "text-[#5E6862] hover:bg-white/80 hover:text-[#1F2925]"
                    }`}
                    style={{ borderColor: "var(--ix-border)" }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="ix-kicker">{tabs.find((item) => item.id === tab)?.label}</p>
                  <h3 className="mt-4 text-3xl font-bold text-[#1F2925]">{activeTabContent[tab].title}</h3>
                  <p className="mt-4 max-w-xl text-lg leading-8 text-[#5E6862]">{activeTabContent[tab].detail}</p>
                </div>
                <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-[#EFEBFA] bg-[#F5F4EF] text-center text-xs font-bold text-[#6453C2]">
                  <span>
                    {tab === "problem" ? "01" : tab === "system" ? "02" : "03"}
                    <br />/ 03
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Implementation Layers ────────────────────────────────────────── */}
        <section className="border-y bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                <p className="ix-kicker">{copy("Implementation layers", "طبقات التنفيذ")}</p>
                <h2 className="ix-display mt-5 text-4xl font-bold text-[#1F2925]">
                  {copy("A usable system has to hold together.", "يجب أن يتماسك النظام القابل للاستخدام.")}
                </h2>
              </div>
              <div className="grid gap-0 border-t sm:grid-cols-2 bg-white" style={{ borderColor: "var(--ix-border)" }}>
                {[
                  [copy("Signals", "الإشارات"), copy("What is available, trustworthy, timely, and permitted to inform the work.", "ما هو متاح وموثوق وفي الوقت المناسب ومسموح به لدعم العمل.")],
                  [copy("Human decisions", "القرارات البشرية"), copy("Who needs the output, how they will use it, and where review belongs.", "من يحتاج إلى المخرج وكيف سيستخدمه وأين تنتمي المراجعة.")],
                  [copy("Controls", "الضوابط"), copy("How the system fits existing tools, approvals, access, and safeguards.", "كيف ينسجم النظام مع الأدوات والموافقات والوصول والضمانات.")],
                  [copy("Ownership", "الملكية"), copy("What the team needs to operate, monitor, improve, and govern over time.", "ما يحتاجه الفريق لتشغيل النظام ومراقبته وتحسينه وحوكمته.")],
                ].map(([title, detail], index) => (
                  <article key={title} className="border-b p-6 sm:p-8 sm:[&:nth-child(odd)]:border-e" style={{ borderColor: "var(--ix-border)" }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#6453C2]">0{index + 1}</span>
                      <Check className="h-4 w-4 text-[#6453C2]" />
                    </div>
                    <h3 className="mt-8 text-xl font-bold text-[#1F2925]">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5E6862]">{detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Related Systems ──────────────────────────────────────────────── */}
        {relatedServices.length > 0 && (
          <section className="ix-section bg-[#F5F4EF]">
            <div className="ix-shell">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="ix-kicker">{copy("Related systems", "أنظمة ذات صلة")}</p>
                  <h2 className="ix-display mt-4 text-4xl font-bold text-[#1F2925]">{copy("Keep exploring the operating map.", "واصل استكشاف خريطة التشغيل.")}</h2>
                </div>
                <Link href="/solutions" className="ix-link inline-flex items-center gap-2">
                  {copy("All solutions", "كل الحلول")}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </div>
              <div className="mt-10 grid border-t sm:grid-cols-3 bg-white" style={{ borderColor: "var(--ix-border)" }}>
                {relatedServices.map((item: any, index: number) => (
                  <Link
                    key={item.id}
                    href={`/solutions/${item.slug}`}
                    className="group border-b p-6 sm:border-e sm:p-8 sm:last:border-e-0 transition-colors hover:bg-[#EAEDEA]/60"
                    style={{ borderColor: "var(--ix-border)" }}
                  >
                    <p className="text-xs font-bold text-[#6453C2]">0{index + 1}</p>
                    <h3 className="mt-8 text-xl font-bold text-[#1F2925] group-hover:text-[#6453C2]">{text(item.title, item.title_ar, item.title)}</h3>
                    <ArrowRight className={`mt-6 h-4 w-4 text-[#6453C2] transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Next Step Consultation CTA ───────────────────────────────────── */}
        <section className="border-t bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell grid gap-8 py-16 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
            <div>
              <p className="ix-eyebrow text-[#6453C2]">{copy("Next step", "الخطوة التالية")}</p>
              <h2 className="ix-display mt-5 max-w-3xl text-4xl font-bold text-[#1F2925] sm:text-6xl">
                {copy("Bring the operating problem. We’ll define the engineering plan.", "أحضر المشكلة التشغيلية. وسنحدد خطة الهندسة.")}
              </h2>
            </div>
            <Button onClick={() => setProposalOpen(true)} className="ix-button ix-button-primary lg:justify-self-end">
              {copy("Request a proposal", "اطلب مقترحاً")}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      {proposalOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <button
              type="button"
              onClick={() => setProposalOpen(false)}
              className="absolute end-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-800 shadow-sm"
              aria-label={copy("Close", "إغلاق")}
            >
              <X className="h-4 w-4" />
            </button>
            <ProposalGenerator services={hubData?.allServices || []} preSelectedServiceId={solution.id} onClose={() => setProposalOpen(false)} />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
