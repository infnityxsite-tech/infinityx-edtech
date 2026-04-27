import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TrackCards from "@/components/academy/TrackCards";
import LearningRoadmap from "@/components/academy/LearningRoadmap";
import FAQAccordion from "@/components/academy/FAQAccordion";
import ValueProposition from "@/components/academy/ValueProposition";
import { schoolsData } from "@/components/academy/schoolData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function SchoolDeepDive() {
  const [, params] = useRoute("/academy/:school");
  const slug = params?.school || "";
  const school = schoolsData[slug];
  const { isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!school) {
    return (
      <div className={`min-h-screen ${isLight ? "bg-[#f8fafc]" : "bg-[#020617]"}`}>
        <Navigation />
        <div className="pt-32 text-center px-6">
          <h1 className={`text-3xl font-bold mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
            {t("School Not Found", "الكلية غير موجودة", "Not Found")}
          </h1>
          <Link href="/academy">
            <Button className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl">
              {t("Back to Academy", "العودة للأكاديمية", "Back")}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const SchoolIcon = school.icon;

  return (
    <div
      className={`min-h-screen font-sans ${isRTL ? "rtl" : "ltr"} ${isLight ? "bg-[#f8fafc] text-slate-900" : "bg-[#020617] text-white"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navigation />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[70vh] flex items-center pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={school.image} alt={school.title} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 ${isLight ? "bg-white/75" : "bg-[#020617]/80"}`} />
        </div>
        <div className={`absolute inset-0 pointer-events-none ${isLight ? "bg-gradient-to-t from-[#f8fafc] via-transparent to-transparent" : "bg-gradient-to-t from-[#020617] via-transparent to-transparent"}`} />
        <div className={`absolute inset-0 ${isLight ? "opacity-[0.03]" : "opacity-[0.04]"}`} style={{ backgroundImage: `linear-gradient(${isLight ? "rgba(0,0,0,.05)" : "rgba(255,255,255,.08)"} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? "rgba(0,0,0,.05)" : "rgba(255,255,255,.08)"} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          {/* Back to Academy */}
          <Link href="/academy">
            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold mb-8 cursor-pointer transition-colors ${isLight ? "text-indigo-600 hover:text-indigo-700" : "text-indigo-400 hover:text-indigo-300"}`}>
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {t("Back to Academy", "العودة للأكاديمية", "Back")}
            </span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${school.gradient} flex items-center justify-center shadow-lg`}>
              <SchoolIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] ${isLight ? "text-slate-900" : "text-white"}`}>
              {t(school.title, school.titleAr, school.title)}
            </h1>
            <p className={`text-lg max-w-2xl mx-auto font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              {t(school.subtitle, school.subtitleAr, school.subtitle)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ VALUE PROPOSITION ═══ */}
      <ValueProposition data={school.value} gradient={school.gradient} />

      {/* ═══ TRACKS ═══ */}
      <TrackCards tracks={school.tracks} />

      {/* ═══ ROADMAP ═══ */}
      <LearningRoadmap steps={school.roadmap} gradient={school.gradient} />

      {/* ═══ FAQ ═══ */}
      <FAQAccordion faqs={school.faqs} />

      {/* ═══ CTA ═══ */}
      <section className={`py-24 border-t ${isLight ? "border-slate-200 bg-slate-50/50" : "border-white/[0.04] bg-[#030712]"}`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className={`text-3xl md:text-4xl font-black mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
            {t("Ready to Start Your Journey?", "مستعد لبدء رحلتك؟", "Ready?")}
          </h2>
          <p className={`text-base font-medium mb-8 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            {t(
              "Applications are open. Secure your spot in the next cohort and start building your future.",
              "باب التقديم مفتوح — احجز مقعدك في الدفعة القادمة وابدأ ببناء مستقبلك.",
              "Apply now."
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className={`h-14 px-10 rounded-xl font-bold text-lg bg-gradient-to-r ${school.gradient} text-white shadow-lg`}>
                {t("Apply Now", "قدّم الآن", "Apply")}
                <ArrowRight className={`w-5 h-5 ${isRTL ? "me-2 rotate-180" : "ms-2"}`} />
              </Button>
            </Link>
            <a href="https://academy.infx.space/" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className={`h-14 px-10 rounded-xl font-bold text-lg ${isLight ? "border-slate-300 text-slate-800" : "border-white/[0.15] text-white"}`}>
                {t("Visit LMS Portal", "زيارة منصة التعلم", "LMS Portal")}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
