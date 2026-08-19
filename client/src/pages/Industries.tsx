import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSEO } from "@/hooks/useSEO";
import { trpc } from "@/lib/trpc";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Industries() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { data: industries = [], isLoading } = trpc.admin.getIndustries.useQuery(undefined, { staleTime: 1000 * 60 * 5 });
  useSEO({
    title: "AI Systems by Industry",
    description: "Operational AI systems for manufacturing, logistics, infrastructure and enterprise operations.",
    canonical: "https://infx.space/industries",
    robots: "index, follow",
  });

  return (
    <div
      className={`ix-page ${isRTL ? "rtl" : "ltr"} ${isLight ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navigation />
      <main>
        <section className={`border-b pt-12 sm:pt-16 ${isLight ? "border-[#D8DDD8]" : "border-white/10"}`}>
          <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:pb-24">
            <div className="max-w-3xl self-end">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#6453C2]">
                {t("Operational context", "السياق التشغيلي", "Operational context")}
              </p>
              <h1 className="mt-6 text-5xl font-extrabold tracking-[-.06em] text-[#1F2925] sm:text-6xl lg:text-7xl">
                {t("AI systems for the environments where work happens.", "أنظمة ذكاء اصطناعي للبيئات التي يحدث فيها العمل.", "AI systems for real operating environments.")}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5E6862]">
                {t(
                  "The right solution starts with the realities of the operation—physical workflows, human decisions, data quality, controls, and deployment conditions.",
                  "يبدأ الحل الصحيح بواقع العملية: سير العمل المادي وقرارات البشر وجودة البيانات والضوابط وظروف النشر.",
                  "The right solution starts with operational reality."
                )}
              </p>
            </div>
            <div className={`grid content-end gap-px overflow-hidden border border-[#D8DDD8] bg-white shadow-sm`}>
              <div className="p-7 bg-[#EAEDEA]">
                <span className="text-xs font-bold text-[#6453C2]">01</span>
                <p className="mt-8 text-2xl font-bold tracking-[-.035em] text-[#1F2925]">
                  {t("Understand the operating environment.", "فهم بيئة التشغيل.", "Understand the operating environment.")}
                </p>
              </div>
              <div className="p-7 bg-white">
                <span className="text-xs font-bold text-[#6453C2]">02</span>
                <p className="mt-8 text-2xl font-bold tracking-[-.035em] text-[#1F2925]">
                  {t("Apply the system that fits it.", "تطبيق النظام المناسب لها.", "Apply the system that fits it.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-5 border-t border-[#D8DDD8]">
            {isLoading ? (
              <div className="py-16">
                <Loader2 className="h-8 w-8 animate-spin text-[#6453C2]" />
              </div>
            ) : (
              industries.map((industry: any, index: number) => (
                <article
                  key={industry.id}
                  className="grid gap-8 border-b border-[#D8DDD8] py-10 lg:grid-cols-[105px_1.15fr_.85fr] lg:gap-14 lg:py-14"
                >
                  <span className="text-sm font-bold text-[#6453C2]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#7B847F]">{t("Industry", "القطاع", "Industry")}</p>
                    <h2 className="mt-4 text-3xl font-extrabold tracking-[-.045em] text-[#1F2925] sm:text-4xl">
                      {t(industry.title, industry.titleAr, industry.title)}
                    </h2>
                    <p className="mt-5 max-w-xl text-base leading-7 text-[#5E6862]">
                      {t(industry.overview, industry.overviewAr, industry.overview)}
                    </p>
                  </div>
                  <div className="self-start border-s border-[#D8DDD8] p-6 bg-white shadow-sm rounded-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#7B847F]">{t("Where to start", "من أين تبدأ", "Where to start")}</p>
                    <Link href={`/industries/${industry.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#6453C2] hover:text-[#5342AE]">
                      {t("Explore this industry", "استكشف هذا القطاع", "Explore this industry")}
                      <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="border-y border-[#D8DDD8] bg-[#EAEDEA]">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-[1.5fr_1fr] lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#6453C2]">{t("A better brief", "ملخص أفضل", "A better brief")}</p>
              <h2 className="mt-5 text-4xl font-extrabold tracking-[-.05em] text-[#1F2925]">
                {t("Start with the operation. Then define the system.", "ابدأ بالعملية. ثم حدّد النظام.", "Start with the operation. Then define the system.")}
              </h2>
            </div>
            <div className="flex items-end">
              <Link href="/consultation">
                <Button className="h-12 rounded-md bg-[#6453C2] px-5 font-bold text-white hover:bg-[#5342AE]">
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
