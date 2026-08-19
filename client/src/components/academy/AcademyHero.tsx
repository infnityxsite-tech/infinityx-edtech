import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function AcademyHero() {
  const { isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className="relative min-h-[min(760px,92vh)] flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/uploads/academy_hero_bg.png"
          alt="Academy"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${isLight ? "bg-[#fdfcf9]/88" : "bg-[#020617]/84"}`} />
      </div>

      {/* Gradient overlays */}
      <div className={`absolute inset-0 pointer-events-none ${isLight ? "bg-gradient-to-br from-indigo-50/60 via-transparent to-cyan-50/40" : "bg-gradient-to-br from-indigo-900/30 via-transparent to-cyan-900/20"}`} />

      {/* Grid pattern */}
      <div
        className={`absolute inset-0 ${isLight ? "opacity-[0.03]" : "opacity-[0.04]"}`}
        style={{
          backgroundImage: `linear-gradient(${isLight ? "rgba(0,0,0,.05)" : "rgba(255,255,255,.08)"} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? "rgba(0,0,0,.05)" : "rgba(255,255,255,.08)"} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className={`absolute top-1/3 start-1/4 w-[400px] h-[400px] rounded-full blur-[150px] pointer-events-none ${isLight ? "bg-indigo-300/30" : "bg-indigo-500/15"}`} />
      <div className={`absolute bottom-1/4 end-1/4 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none ${isLight ? "bg-cyan-300/25" : "bg-cyan-500/10"}`} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-2 border rounded-full px-5 py-2 mb-8 ${isLight ? "bg-indigo-50/80 border-indigo-200 text-indigo-700" : "bg-white/[0.04] border-white/[0.1] text-indigo-300"}`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-bold text-xs tracking-wider uppercase">
              {t("Infinity X Academy", "أكاديمية إنفينيتي إكس", "Infinity X Academy")}
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-[-0.055em] mb-8 leading-[1.02] ${isLight ? "text-slate-950" : "text-white"}`}>
            {t("Build practical", "ابنِ مهارات عملية", "Build practical")}
            <br />
            <span className={isLight ? "text-[#165dcc]" : "text-cyan-300"}>
              {t("technology expertise.", "في التكنولوجيا.", "technology expertise.")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            {t(
              "Project-based programs in AI, cybersecurity, full-stack engineering, and space technology — built around the work teams actually do.",
              "أكاديمية قائمة على المشاريع العملية ومُصممة وفق متطلبات السوق — نقدم تدريباً تفاعلياً حياً ومسجلاً في الذكاء الاصطناعي والأمن السيبراني وتطوير البرمجيات وتكنولوجيا الفضاء.",
              "Project-based, industry-driven academy."
            )}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programs">
              <Button
                size="lg"
                className="h-14 bg-[#165dcc] hover:bg-[#124ead] text-white font-bold px-8 rounded-md shadow-none text-base w-full sm:w-auto"
              >
                <BookOpen className="me-2 h-5 w-5" />{t("Explore programs", "استكشف البرامج", "Explore programs")}
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                size="lg"
                variant="outline"
                className={`h-14 px-8 rounded-md text-base font-bold w-full sm:w-auto ${isLight ? "border-slate-300 text-slate-800 hover:bg-slate-100" : "border-white/[0.15] text-white hover:bg-white/[0.08]"}`}
              >
                {t("Live & recorded learning", "التعلم المباشر والمسجل", "Live & recorded learning")}
                <ArrowRight className={`w-5 h-5 ${isRTL ? "me-2 rotate-180" : "ms-2"}`} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
