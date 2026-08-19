import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSEO } from "@/hooks/useSEO";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function IndustryLanding() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [, params] = useRoute("/industries/:slug");
  const slug = params?.slug || "";
  const { data: industry, isLoading } = trpc.admin.getIndustryBySlug.useQuery({ slug }, { staleTime: 1000 * 60 * 5 });
  useSEO({
    title: industry?.title ? `${industry.title} AI Systems | Infinity X` : "Industry AI Systems | Infinity X",
    description: industry?.overview || "AI systems designed around real operational environments.",
    canonical: `https://infx.space/industries/${slug}`,
    robots: isLoading ? undefined : industry ? "index, follow" : "noindex, follow",
  });

  if (isLoading) {
    return (
      <div className={`grid min-h-screen place-items-center ${isLight ? "bg-[#F5F4EF]" : "bg-[#07111b]"}`}>
        <Loader2 className="h-8 w-8 animate-spin text-[#52735F]" />
      </div>
    );
  }

  if (!industry) {
    return (
      <div className={`grid min-h-screen place-items-center px-6 text-center ${isLight ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`}>
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-.05em]">{t("Industry not found.", "القطاع غير موجود.", "Industry not found.")}</h1>
          <Link href="/industries">
            <Button className="mt-7 rounded-md bg-[#52735F] text-white hover:bg-[#43614F]">
              {t("View industries", "عرض القطاعات", "View industries")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  let painPoints: string[] = [];
  let painPointsAr: string[] = [];
  try { painPoints = JSON.parse(industry.painPointsJson || "[]"); } catch { painPoints = []; }
  try { painPointsAr = JSON.parse(industry.painPointsArJson || "[]"); } catch { painPointsAr = []; }
  const services = industry.services || [];
  const caseStudies: any[] = [];
  const rule = isLight ? "border-[#D8DDD8]" : "border-white/10";
  const muted = isLight ? "text-[#5E6862]" : "text-slate-300";
  const text = (en: string | undefined, ar: string | undefined, fallback = "") => t(en, ar, fallback || en || "");

  return (
    <div
      className={`ix-page ${isRTL ? "rtl" : "ltr"} ${isLight ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navigation />
      <main>
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <section className={`border-b pt-12 sm:pt-16 ${rule}`}>
          <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:pb-24">
            <div className="max-w-3xl self-end">
              <Link href="/industries" className={`inline-flex items-center gap-2 text-sm font-bold ${isLight ? "text-[#5E6862] hover:text-[#1F2925]" : "text-slate-400 hover:text-white"}`}>
                <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                {t("All industries", "كل القطاعات", "All industries")}
              </Link>
              <p className="mt-8 text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">
                {t("Industry operating context", "سياق تشغيل القطاع", "Industry operating context")}
              </p>
              <h1 className="mt-6 text-5xl font-extrabold tracking-[-.06em] text-[#1F2925] sm:text-6xl lg:text-7xl">
                {text(industry.title, industry.titleAr, industry.title)}
              </h1>
              <p className={`mt-7 max-w-2xl text-lg leading-8 ${muted}`}>
                {text(industry.overview, industry.overviewAr, industry.overview)}
              </p>
            </div>
            <div className={`self-end overflow-hidden border ${rule} bg-white shadow-sm rounded-lg`}>
              {industry.heroImageUrl ? (
                <img src={industry.heroImageUrl} alt={text(industry.title, industry.titleAr, industry.title)} className="h-[270px] w-full object-cover sm:h-[360px]" />
              ) : (
                <div className={`flex min-h-[270px] flex-col justify-between p-7 sm:min-h-[360px] ${isLight ? "bg-[#EAEDEA]" : "bg-white/[.03]"}`}>
                  <span className="text-xs font-bold text-[#52735F]">{t("INDUSTRY / SYSTEMS", "قطاع / أنظمة", "INDUSTRY / SYSTEMS")}</span>
                  <p className="max-w-sm text-3xl font-extrabold tracking-[-.04em] text-[#1F2925]">
                    {t("Technology shaped by the conditions of the operation.", "تقنية تتشكل وفق ظروف العملية.", "Technology shaped by operating conditions.")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Operational Challenges ───────────────────────────────────────── */}
        {painPoints.length > 0 && (
          <section className={`border-b ${isLight ? "border-[#D8DDD8] bg-[#EAEDEA]" : "border-white/10 bg-white/[.03]"}`}>
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.8fr_2fr] lg:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">
                  {t("Operational challenges", "تحديات تشغيلية", "Operational challenges")}
                </p>
                <h2 className="mt-5 text-4xl font-extrabold tracking-[-.05em] text-[#1F2925]">
                  {t("The constraints a useful system needs to respect.", "القيود التي يجب أن يحترمها النظام المفيد.", "The constraints a useful system needs to respect.")}
                </h2>
              </div>
              <div className="grid gap-x-12 sm:grid-cols-2">
                {painPoints.map((pain, index) => (
                  <div key={`${pain}-${index}`} className={`border-t py-7 ${rule}`}>
                    <span className="text-sm font-bold text-[#52735F]">{String(index + 1).padStart(2, "0")}</span>
                    <p className="mt-7 text-xl font-bold leading-8 tracking-[-.025em] text-[#1F2925]">
                      {text(pain, painPointsAr[index] || pain, pain)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Applied Systems ──────────────────────────────────────────────── */}
        {services.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[.8fr_2fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">
                  {t("Applied systems", "أنظمة مطبقة", "Applied systems")}
                </p>
                <h2 className="mt-5 text-4xl font-extrabold tracking-[-.05em] text-[#1F2925]">
                  {t("Capabilities relevant to this environment.", "قدرات مناسبة لهذه البيئة.", "Capabilities relevant to this environment.")}
                </h2>
              </div>
              <div className={`border-t ${rule}`}>
                {services.map((service: any, index: number) => (
                  <article key={service.id} className={`grid gap-5 border-b py-8 sm:grid-cols-[70px_1fr_auto] sm:items-start ${rule}`}>
                    <span className="text-sm font-bold text-[#52735F]">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-2xl font-bold tracking-[-.035em] text-[#1F2925]">{text(service.title, service.title_ar, service.title)}</h3>
                      <p className={`mt-3 max-w-xl text-sm leading-7 ${muted}`}>{text(service.description, service.description_ar, service.description)}</p>
                    </div>
                    <Link href={`/solutions/${service.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#52735F] sm:mt-1 hover:text-[#43614F]">
                      {t("Explore", "استكشف", "Explore")}
                      <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Next Step ────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className={`grid gap-8 border-y py-12 md:grid-cols-[1.5fr_1fr] ${rule}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{t("Next step", "الخطوة التالية", "Next step")}</p>
              <h2 className="mt-5 text-4xl font-extrabold tracking-[-.05em] text-[#1F2925]">
                {t("Start with your operation. We’ll map the system around it.", "ابدأ بعمليتك. وسنرسم النظام حولها.", "Start with your operation. We’ll map the system around it.")}
              </h2>
            </div>
            <div className="flex items-end">
              <Link href="/consultation">
                <Button className="h-12 rounded-md bg-[#52735F] px-5 font-bold text-white hover:bg-[#43614F]">
                  {t("Discuss your operation", "ناقش عملياتك", "Discuss your operation")}
                  <ArrowUpRight className="ms-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
