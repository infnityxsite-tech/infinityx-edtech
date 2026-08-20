import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceImage, { getServiceImageAlt, resolveServiceImageUrl } from "@/components/ServiceImage";
import ProposalGenerator from "@/components/solutions/ProposalGenerator";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { isSolutionCategorySlug, solutionCategoryPresentation } from "@/lib/solutionCategories";
import { ArrowLeft, ArrowRight, ArrowUpRight, Compass, Loader2, X } from "lucide-react";

type MethodologyStep = {
  step?: number;
  title?: string;
  titleAr?: string;
  desc?: string;
  descAr?: string;
};

const fallbackMethodology: MethodologyStep[] = [
  {
    step: 1,
    title: "Frame the operating need",
    titleAr: "تحديد الحاجة التشغيلية",
    desc: "Clarify the decision, evidence, and working constraint before selecting technology.",
    descAr: "توضيح القرار والدليل والقيد التشغيلي قبل اختيار التقنية.",
  },
  {
    step: 2,
    title: "Shape the system",
    titleAr: "تصميم النظام",
    desc: "Define the data, interfaces, controls, and human handoffs required for the work.",
    descAr: "تحديد البيانات والواجهات والضوابط وتسليمات العمل البشرية اللازمة.",
  },
  {
    step: 3,
    title: "Deploy with the team",
    titleAr: "النشر مع الفريق",
    desc: "Test the system in context, integrate it into the workflow, and hand over a usable operating model.",
    descAr: "اختبار النظام في سياقه ودمجه في سير العمل وتسليم نموذج تشغيلي قابل للاستخدام.",
  },
];

function parseMethodology(value: unknown): MethodologyStep[] {
  if (Array.isArray(value)) return value as MethodologyStep[];
  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as MethodologyStep[]) : [];
  } catch {
    return [];
  }
}

export default function SolutionDetail() {
  const [, params] = useRoute("/solutions/:slug");
  const slug = params?.slug || "";
  const { t, isRTL } = useLanguage();
  const [proposalOpen, setProposalOpen] = useState(false);
  const copy = (en: string, ar: string) => t(en, ar, en);
  const text = (en?: string | null, ar?: string | null, fallback = "") => t(en || fallback, ar || en || fallback, fallback || en || "");

  const { data: solutionData, isLoading, isError } = trpc.admin.getSolutionBySlug.useQuery(
    { slug },
    { enabled: Boolean(slug), staleTime: 1000 * 60 * 5 }
  );
  const { data: hubData } = trpc.admin.getSolutionsHub.useQuery(undefined, { staleTime: 1000 * 60 * 5 });
  const solution = (solutionData ?? null) as any;
  const methodology = useMemo(
    () => parseMethodology(solution?.process_methodology_json),
    [solution?.process_methodology_json]
  );
  const overview = text(solution?.overview_long, solution?.overview_long_ar, solution?.description || "");
  const overviewParagraphs = useMemo(
    () => overview.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
    [overview]
  );
  const categorySlug = typeof solution?.category_slug === "string" ? solution.category_slug : "";
  const category = isSolutionCategorySlug(categorySlug)
    ? solutionCategoryPresentation[categorySlug]
    : null;
  const categoryName = category
    ? copy(category.name.en, category.name.ar)
    : text(solution?.category_name, solution?.category_name, copy("Enterprise capability", "قدرة للمؤسسات"));
  const flowSteps = methodology.length ? methodology : fallbackMethodology;
  const deliverables = (solution?.deliverables || []) as any[];
  const useCases = (solution?.useCases || []) as any[];
  const techStack = (solution?.techStack || []) as any[];
  const relatedServices = (solution?.relatedServices || []) as any[];

  useSEO({
    title: solution?.title ? `${solution.title} | Infinity X Solutions` : "Solution Profile | Infinity X",
    description: solution?.description || "Production-grade enterprise AI capability designed around operational constraints.",
    canonical: `https://infx.space/solutions/${slug}`,
    image: solution ? resolveServiceImageUrl(solution) : null,
    robots: isLoading || isError ? undefined : solution ? "index, follow" : "noindex, follow",
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
      <div className={`ix-page min-h-screen bg-[#F5F4EF] ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        <Navigation />
        <main className="grid min-h-[68vh] place-items-center px-6 text-center">
          <div>
            <Compass className="mx-auto h-10 w-10 text-[#6453C2]" />
            <h1 className="ix-display mt-6 text-4xl font-bold">{copy("System profile not found.", "ملف النظام غير موجود.")}</h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7" style={{ color: "var(--ix-text-secondary)" }}>
              {copy(
                "This URL does not match a published Infinity X system. Explore the verified solution map.",
                "لا يتطابق هذا الرابط مع نظام منشور من إنفينيتي إكس. استكشف خريطة الحلول المعتمدة."
              )}
            </p>
            <Link href="/solutions" className="ix-button ix-button-primary mt-8">
              {copy("Explore solutions", "استكشف الحلول")}
              <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`ix-page ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />
      <main>
        <section className="border-b border-[#D8DDD8]/60 bg-[#F5F4EF] text-[#1F2925]">
          <div className="ix-shell py-12 sm:py-16">
            <Link href="/solutions" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5E6862] transition-colors hover:text-[#1F2925]">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
              {copy("All solutions", "كل الحلول")}
            </Link>
            <div className="mt-8 grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
              <div>
                <p className="ix-eyebrow text-[#6453C2]">{categoryName}</p>
                <h1 className="ix-display mt-6 max-w-3xl text-5xl font-bold text-[#1F2925] sm:text-7xl">
                  {text(solution.title, solution.title_ar, solution.title)}
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5E6862]">
                  {text(solution.description, solution.description_ar, copy("A production-ready system shaped around the operational work it needs to support.", "نظام إنتاجي مصمم حول العمل التشغيلي الذي يحتاج إلى دعمه."))}
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => setProposalOpen(true)} className="ix-button ix-button-primary h-12">
                    {copy("Discuss this system", "ناقش هذا النظام")}
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <a href="#how-it-works" className="ix-button ix-button-secondary h-12 bg-white">
                    {copy("See how it works", "شاهد كيف يعمل")}
                    <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                  </a>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-[#D8DDD8] bg-white shadow-lg">
                <ServiceImage
                  service={solution}
                  alt={getServiceImageAlt(solution)}
                  className="aspect-[4/3] h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2925]/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#C8BFF5]">{copy("System profile", "ملف النظام")}</p>
                    <p className="mt-1 text-xl font-bold">{copy("Signal → intelligence → action", "إشارة ← ذكاء ← إجراء")}</p>
                  </div>
                  <span className="hidden border border-white/30 px-3 py-1.5 text-xs font-bold sm:block">{categoryName}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b bg-white" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell grid gap-0 sm:grid-cols-3">
            <article className="border-b p-6 sm:border-b-0 sm:border-e sm:p-8" style={{ borderColor: "var(--ix-border)" }}>
              <p className="text-xs font-bold text-[#6453C2]">01</p>
              <h2 className="mt-3 text-xl font-bold text-[#1F2925]">{copy("The business problem", "مشكلة العمل")}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5E6862]">{text(solution.problem_statement, solution.problem_statement_ar, solution.description)}</p>
            </article>
            <article className="border-b p-6 sm:border-b-0 sm:border-e sm:p-8" style={{ borderColor: "var(--ix-border)" }}>
              <p className="text-xs font-bold text-[#6453C2]">02</p>
              <h2 className="mt-3 text-xl font-bold text-[#1F2925]">{copy("What the system changes", "ما الذي يغيره النظام")}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5E6862]">{text(solution.description, solution.description_ar, solution.overview_long)}</p>
            </article>
            <article className="p-6 sm:p-8">
              <p className="text-xs font-bold text-[#6453C2]">03</p>
              <h2 className="mt-3 text-xl font-bold text-[#1F2925]">{copy("Built for ownership", "مصمم للملكية")}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5E6862]">{copy("The delivery is structured around your working context, integrations, controls, and team handover.", "يتم تنظيم التسليم حول سياق العمل والتكاملات والضوابط وتسليم المعرفة لفريقك.")}</p>
            </article>
          </div>
        </section>

        <section className="ix-section bg-[#F5F4EF]">
          <div className="ix-shell grid gap-10 lg:grid-cols-[.65fr_1.35fr]">
            <div>
              <p className="ix-kicker">{copy("What the system does", "ما الذي يفعله النظام")}</p>
              <h2 className="ix-display mt-5 text-4xl font-bold text-[#1F2925] sm:text-5xl">
                {copy("A system is useful only when it fits the work.", "يكون النظام مفيداً فقط عندما يناسب العمل.")}
              </h2>
            </div>
            <div className="space-y-5 text-lg leading-8 text-[#5E6862]">
              {overviewParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          </div>
        </section>

        {deliverables.length > 0 && (
          <section className="border-y bg-white" style={{ borderColor: "var(--ix-border)" }}>
            <div className="ix-shell py-16 lg:py-20">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="ix-kicker">{copy("Capabilities", "القدرات")}</p>
                  <h2 className="ix-display mt-4 text-4xl font-bold text-[#1F2925]">{copy("What the delivery can include.", "ما الذي يمكن أن يشمله التسليم.")}</h2>
                </div>
                <p className="max-w-md text-sm leading-7 text-[#5E6862]">{copy("The scope is shaped after discovery, with the system components chosen for the operating need.", "يتم تحديد النطاق بعد الاستكشاف، مع اختيار مكونات النظام بما يلائم الحاجة التشغيلية.")}</p>
              </div>
              <div className="mt-10 grid border-t sm:grid-cols-2" style={{ borderColor: "var(--ix-border)" }}>
                {deliverables.map((item, index) => (
                  <article key={item.id || item.title} className="border-b p-6 sm:p-8 sm:[&:nth-child(odd)]:border-e" style={{ borderColor: "var(--ix-border)" }}>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm font-bold text-[#6453C2]">{String(index + 1).padStart(2, "0")}</span>
                      {item.expected_timeline && <span className="border border-[#D8DDD8] bg-[#F5F4EF] px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#5E6862]">{item.expected_timeline}</span>}
                    </div>
                    <h3 className="mt-8 text-xl font-bold text-[#1F2925]">{text(item.title, item.title_ar, item.title)}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5E6862]">{copy("A representative operating context to scope during discovery.", "سياق تشغيلي تمثيلي يُحدَّد نطاقه أثناء مرحلة الاكتشاف.")}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="how-it-works" className="ix-section bg-[#EAEDEA]">
          <div className="ix-shell">
            <div className="max-w-3xl">
              <p className="ix-kicker">{copy("How it works", "كيف يعمل")}</p>
              <h2 className="ix-display mt-5 text-4xl font-bold text-[#1F2925] sm:text-5xl">{copy("A delivery path designed for this system.", "مسار تسليم مصمم لهذا النظام.")}</h2>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden border border-[#D8DDD8] bg-[#D8DDD8] sm:grid-cols-2 lg:grid-cols-4">
              {flowSteps.map((step, index) => (
                <article key={`${step.title}-${index}`} className="bg-white p-6 sm:p-8">
                  <p className="text-sm font-bold text-[#6453C2]">{String(step.step || index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-8 text-xl font-bold text-[#1F2925]">{text(step.title, step.titleAr, step.title || "")}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5E6862]">{text(step.desc, step.descAr, "")}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {useCases.length > 0 && (
          <section className="ix-section bg-[#F5F4EF]">
            <div className="ix-shell">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="ix-kicker">{copy("Use cases", "حالات الاستخدام")}</p>
                  <h2 className="ix-display mt-4 text-4xl font-bold text-[#1F2925]">{copy("Where this system earns its place.", "أين يثبت هذا النظام قيمته.")}</h2>
                </div>
                <p className="max-w-md text-sm leading-7 text-[#5E6862]">{copy("These are representative operating contexts, not claims about client deployments.", "هذه سياقات تشغيلية تمثيلية وليست ادعاءات حول عمليات نشر لدى العملاء.")}</p>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {useCases.map((item) => (
                  <article key={item.id || item.title} className="border border-[#D8DDD8] bg-white p-6 shadow-sm">
                    {item.industry && <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#6453C2]">{item.industry}</p>}
                    <h3 className="mt-5 text-xl font-bold text-[#1F2925]">{text(item.title, item.title_ar, item.title)}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5E6862]">{text(item.description, item.description_ar, "")}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {techStack.length > 0 && (
          <section className="border-y bg-white" style={{ borderColor: "var(--ix-border)" }}>
            <div className="ix-shell grid gap-8 py-14 lg:grid-cols-[.65fr_1.35fr] lg:items-center">
              <div>
                <p className="ix-kicker">{copy("Technology foundations", "الأسس التقنية")}</p>
                <h2 className="ix-display mt-4 text-4xl font-bold text-[#1F2925]">{copy("Chosen to support the operating context.", "مختارة لدعم السياق التشغيلي.")}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((item) => <span key={item.id || item.name} className="border border-[#D8DDD8] bg-[#F5F4EF] px-3 py-2 text-sm font-semibold text-[#1F2925]">{item.name}</span>)}
              </div>
            </div>
          </section>
        )}

        {relatedServices.length > 0 && (
          <section className="ix-section bg-[#F5F4EF]">
            <div className="ix-shell">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="ix-kicker">{copy("Related systems", "أنظمة ذات صلة")}</p>
                  <h2 className="ix-display mt-4 text-4xl font-bold text-[#1F2925]">{copy("Keep exploring this area of work.", "واصل استكشاف هذا المجال من العمل.")}</h2>
                </div>
                <Link href="/solutions" className="ix-link inline-flex items-center gap-2">
                  {copy("All solutions", "كل الحلول")}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </div>
              <div className="mt-10 grid border-t bg-white sm:grid-cols-3" style={{ borderColor: "var(--ix-border)" }}>
                {relatedServices.map((item, index) => (
                  <Link key={item.id} href={`/solutions/${item.slug}`} className="group border-b p-6 transition-colors hover:bg-[#EAEDEA]/60 sm:border-e sm:p-8 sm:last:border-e-0" style={{ borderColor: "var(--ix-border)" }}>
                    <p className="text-xs font-bold text-[#6453C2]">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-8 text-xl font-bold text-[#1F2925] transition-colors group-hover:text-[#6453C2]">{text(item.title, item.title_ar, item.title)}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#5E6862]">{text(item.description, item.description_ar, "")}</p>
                    <ArrowRight className={`mt-6 h-4 w-4 text-[#6453C2] transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t bg-[#EAEDEA]" style={{ borderColor: "var(--ix-border)" }}>
          <div className="ix-shell grid gap-8 py-16 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
            <div>
              <p className="ix-eyebrow text-[#6453C2]">{copy("Next step", "الخطوة التالية")}</p>
              <h2 className="ix-display mt-5 max-w-3xl text-4xl font-bold text-[#1F2925] sm:text-6xl">{copy("Bring the operating problem. We’ll define the engineering plan.", "أحضر المشكلة التشغيلية. وسنحدد خطة الهندسة.")}</h2>
            </div>
            <Button onClick={() => setProposalOpen(true)} className="ix-button ix-button-primary lg:justify-self-end">
              {copy("Discuss this system", "ناقش هذا النظام")}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      {proposalOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <button type="button" onClick={() => setProposalOpen(false)} className="absolute end-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-800 shadow-sm" aria-label={copy("Close", "إغلاق")}>
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
