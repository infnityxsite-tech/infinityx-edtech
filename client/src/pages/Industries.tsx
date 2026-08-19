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
  useSEO({ title: "AI Systems by Industry", description: "Operational AI systems for manufacturing, logistics, infrastructure and enterprise operations.", canonical: "https://infx.space/industries", robots: "index, follow" });

  return <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"} ${isLight ? "bg-[#fdfcf9] text-[#102033]" : "bg-[#06101f] text-white"}`} dir={isRTL ? "rtl" : "ltr"}>
    <Navigation />
    <main>
      <section className={`border-b pt-32 ${isLight ? "border-slate-200" : "border-white/10"}`}>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:pb-24">
          <div className="max-w-3xl self-end"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#165dcc]">{t("Operational context", "السياق التشغيلي", "Operational context")}</p><h1 className="mt-6 text-5xl font-extrabold tracking-[-.06em] sm:text-6xl lg:text-7xl">{t("AI systems for the environments where work happens.", "أنظمة ذكاء اصطناعي للبيئات التي يحدث فيها العمل.", "AI systems for real operating environments.")}</h1><p className={`mt-7 max-w-2xl text-lg leading-8 ${isLight ? "text-slate-600" : "text-slate-300"}`}>{t("The right solution starts with the realities of the operation—physical workflows, human decisions, data quality, controls, and deployment conditions.", "يبدأ الحل الصحيح بواقع العملية: سير العمل المادي وقرارات البشر وجودة البيانات والضوابط وظروف النشر.", "The right solution starts with operational reality.")}</p></div>
          <div className={`grid content-end gap-px overflow-hidden border ${isLight ? "border-slate-200 bg-slate-200" : "border-white/10 bg-white/10"}`}><div className={`p-7 ${isLight ? "bg-[#f2f5f8]" : "bg-white/[.03]"}`}><span className="text-xs font-bold text-[#165dcc]">01</span><p className="mt-10 text-2xl font-bold tracking-[-.035em]">{t("Understand the operating environment.", "فهم بيئة التشغيل.", "Understand the operating environment.")}</p></div><div className={`p-7 ${isLight ? "bg-[#fdfcf9]" : "bg-[#06101f]"}`}><span className="text-xs font-bold text-[#165dcc]">02</span><p className="mt-10 text-2xl font-bold tracking-[-.035em]">{t("Apply the system that fits it.", "تطبيق النظام المناسب لها.", "Apply the system that fits it.")}</p></div></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28"><div className="grid gap-5 border-t border-slate-200 dark:border-white/10">{isLoading ? <div className="py-16"><Loader2 className="h-8 w-8 animate-spin text-[#165dcc]" /></div> : industries.map((industry: any, index: number) => <article key={industry.id} className={`grid gap-8 border-b py-10 lg:grid-cols-[105px_1.15fr_.85fr] lg:gap-14 lg:py-14 ${isLight ? "border-slate-200" : "border-white/10"}`}><span className="text-sm font-bold text-[#165dcc]">{String(index + 1).padStart(2, "0")}</span><div><p className="text-xs font-bold uppercase tracking-[.15em] text-slate-500">{t("Industry", "القطاع", "Industry")}</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-.045em] sm:text-4xl">{t(industry.title, industry.titleAr, industry.title)}</h2><p className={`mt-5 max-w-xl text-base leading-7 ${isLight ? "text-slate-600" : "text-slate-300"}`}>{t(industry.overview, industry.overviewAr, industry.overview)}</p></div><div className={`self-start border-s p-6 ${isLight ? "border-slate-200" : "border-white/10"}`}><p className="text-[11px] font-bold uppercase tracking-[.14em] text-slate-500">{t("Where to start", "من أين تبدأ", "Where to start")}</p><Link href={`/industries/${industry.slug}`} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#165dcc]">{t("Explore this industry", "استكشف هذا القطاع", "Explore this industry")}<ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} /></Link></div></article>)}</div></section>
      <section className={`border-y ${isLight ? "border-slate-200 bg-[#f2f5f8]" : "border-white/10 bg-white/[.03]"}`}><div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-[1.5fr_1fr] lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#165dcc]">{t("A better brief", "ملخص أفضل", "A better brief")}</p><h2 className="mt-5 text-4xl font-extrabold tracking-[-.05em]">{t("Start with the operation. Then define the system.", "ابدأ بالعملية. ثم حدّد النظام.", "Start with the operation. Then define the system.")}</h2></div><div className="flex items-end"><Link href="/consultation"><Button className="h-12 rounded-md bg-[#165dcc] px-5 font-bold text-white hover:bg-[#124ead]">{t("Discuss your operation", "ناقش عملياتك", "Discuss your operation")}<ArrowUpRight className="ms-2 h-4 w-4" /></Button></Link></div></div></section>
    </main>
    <Footer />
  </div>;
}
