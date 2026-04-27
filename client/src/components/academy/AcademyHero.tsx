import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function AcademyHero() {
  const { isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className="relative min-h-[85vh] flex items-center pt-28 pb-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/uploads/academy_hero_bg.png"
          alt="Academy"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${isLight ? "bg-white/80" : "bg-[#020617]/80"}`} />
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
          <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] ${isLight ? "text-slate-900" : "text-white"}`}>
            {t("Shape the Future", "اصنع المستقبل", "Shape the Future")}
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {t("With Technology.", "بالتكنولوجيا.", "With Technology.")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            {t(
              "A project-based, industry-driven academy offering live and recorded training across AI, Cybersecurity, Full-Stack Development, and Space Technology.",
              "أكاديمية قائمة على المشاريع العملية ومُصممة وفق متطلبات السوق — نقدم تدريباً تفاعلياً حياً ومسجلاً في الذكاء الاصطناعي والأمن السيبراني وتطوير البرمجيات وتكنولوجيا الفضاء.",
              "Project-based, industry-driven academy."
            )}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#schools">
              <Button
                size="lg"
                className="h-14 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold px-10 rounded-xl shadow-lg shadow-indigo-500/25 text-lg w-full sm:w-auto border border-indigo-400/30"
              >
                {t("Explore Our Schools", "استكشف كلياتنا", "Explore Schools")}
              </Button>
            </a>
            <a href="https://academy.infx.space/" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className={`h-14 px-10 rounded-xl text-lg font-bold w-full sm:w-auto ${isLight ? "border-slate-300 text-slate-800 hover:bg-slate-100" : "border-white/[0.15] text-white hover:bg-white/[0.08]"}`}
              >
                {t("Go to LMS Portal", "الدخول لمنصة التعلم", "LMS Portal")}
                <ArrowRight className={`w-5 h-5 ${isRTL ? "me-2 rotate-180" : "ms-2"}`} />
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
