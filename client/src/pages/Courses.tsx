import Navigation from "@/components/Navigation";
import { Link } from "wouter";
import { Video, Wifi, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Courses() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen font-sans ${isLight ? 'bg-[#f0f4f8] text-slate-900' : 'bg-[#0a0e1a] text-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* HERO */}
      <section className={`relative pt-36 pb-24 overflow-hidden text-center ${isLight ? '' : 'bg-[#0b1120] text-white'}`}>
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 z-10">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-6 backdrop-blur-sm ${isLight ? 'bg-cyan-100 border-cyan-200 text-cyan-700' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'}`}>
            <Sparkles className="w-3.5 h-3.5" />
            {t("Choose Your Path", "اختر مسارك", "Choose Your Path")}
          </div>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("World-Class Tech Education", "تعليم تقني عالمي المستوى", "World-Class Tech Education")}
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {t(
              "Select your preferred learning style — Interactive Live Sessions or Self-Paced Recorded Courses.",
              "اختر أسلوب التعلم المفضل لديك — جلسات تفاعلية مباشرة أو دورات مسجلة بالسرعة التي تناسبك.",
              "Select your preferred learning style."
            )}
          </p>
        </div>
      </section>

      {/* SELECTION CARDS */}
      <main className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 -mt-2">

        {/* Live Sessions Card */}
        <Link href="/courses/live">
          <div className={`relative group cursor-pointer rounded-2xl border backdrop-blur-sm p-6 md:p-10 transition-all duration-300 overflow-hidden ${isLight ? 'border-slate-200 bg-white shadow-sm hover:border-orange-300 hover:shadow-orange-500/10' : 'border-white/[0.06] bg-[#0d1225]/80 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5'}`}>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <Wifi className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className={`text-xl md:text-2xl font-bold mb-2 group-hover:text-orange-400 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {t("Live Sessions", "الجلسات المباشرة", "Live Sessions")}
                </h2>
                <p className={`text-sm leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t(
                    "Join interactive, instructor-led cohorts. Real-time feedback, peer collaboration, and structured schedules.",
                    "انضم إلى مجموعات تفاعلية يقودها مدربون. ملاحظات فورية، تعاون مع الزملاء، وجداول منظمة.",
                    "Join interactive cohorts."
                  )}
                </p>
                <div className="flex items-center text-orange-500 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  {t("Explore Live Programs", "استكشف البرامج المباشرة", "Explore")} <ArrowRight className="ml-1.5 w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Recorded Courses Card */}
        <Link href="/courses/recorded">
          <div className={`relative group cursor-pointer rounded-2xl border backdrop-blur-sm p-6 md:p-10 transition-all duration-300 overflow-hidden ${isLight ? 'border-slate-200 bg-white shadow-sm hover:border-indigo-300 hover:shadow-indigo-500/10' : 'border-white/[0.06] bg-[#0d1225]/80 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5'}`}>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <Video className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className={`text-xl md:text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {t("Recorded Courses", "الدورات المسجلة", "Recorded Courses")}
                </h2>
                <p className={`text-sm leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t(
                    "Pre-recorded, high-quality video lessons. Learn at your own pace, anytime, anywhere. Full lifetime access.",
                    "دروس فيديو مسجلة عالية الجودة. تعلم بالسرعة التي تناسبك، في أي وقت ومكان. وصول مدى الحياة.",
                    "Pre-recorded video lessons."
                  )}
                </p>
                <div className="flex items-center text-indigo-500 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  {t("Explore Curriculum", "استكشف المنهج", "Explore")} <ArrowRight className="ml-1.5 w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </main>
    </div>
  );
}