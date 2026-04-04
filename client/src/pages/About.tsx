import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Loader2, Target, Eye, Users, Award, MapPin, Rocket, Cpu, BookOpen, Sparkles
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function About() {
  const { isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const { data: pageContent, isLoading } = trpc.admin.getPageContent.useQuery({ pageKey: "about" });

  const missionImageUrl = "/uploads/Gemini_Generated_Image_g1ud5zg1ud5zg1ud-min.png";
  const visionImageUrl = "/uploads/Gemini_Generated_Image_bv1myvbv1myvbv1m.png";
  const founderImageUrl = "/uploads/poster.png";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0e1a]">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'} ${isLight ? 'bg-[#f0f4f8] text-slate-900' : 'bg-[#0a0e1a] text-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* === HERO === */}
      <section className={`relative pt-36 pb-24 overflow-hidden ${isLight ? '' : 'text-white'}`}>
        <div className={`absolute inset-0 pointer-events-none ${isLight ? 'opacity-10' : 'opacity-[0.03]'}`} style={{ backgroundImage: `linear-gradient(${isLight ? '#94a3b8' : '#334155'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#94a3b8' : '#334155'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[200px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("Our Story", "قصتنا", "Our Story")}</span>
          </div>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("About ", "عن ", "About ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">InfinityX</span>
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-8 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {t(
              "Empowering the next generation of tech leaders through innovative education and hands-on training.",
              "تمكين الجيل القادم من قادة التكنولوجيا من خلال التعليم المبتكر والتدريب العملي.",
              "Empowering the next generation of tech leaders."
            )}
          </p>
        </div>
      </section>

      {/* === REGIONAL IMPACT === */}
      <section className="py-16 relative z-20 -mt-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10 border ${isLight ? 'bg-white border-slate-200 shadow-slate-200/50' : 'bg-[#0d1225]/80 border-white/[0.06]'}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h2 className={`text-3xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {t("Our Regional Footprint", "بصمتنا الإقليمية", "Our Regional Footprint")}
                </h2>
                <p className={`text-lg mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t("InfinityX is proud to serve talents across the MENA region, bridging borders with technology.", "تفخر إنفينيتي إكس بخدمة المواهب في جميع أنحاء منطقة الشرق الأوسط وشمال أفريقيا.", "Serving talents across MENA.")}
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Egypt', 'Saudi Arabia', 'Syria', 'North Africa'].map((country) => (
                    <div key={country} className="flex items-center bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-full font-semibold text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      {t(country, country === 'Egypt' ? 'مصر' : country === 'Saudi Arabia' ? 'السعودية' : country === 'Syria' ? 'سوريا' : 'شمال أفريقيا', country)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 grid grid-cols-2 gap-4">
                <div className={`p-6 rounded-xl text-center border ${isLight ? 'bg-white border-slate-200' : 'bg-white/[0.04] border-white/[0.06]'}`}>
                  <div className="text-4xl font-bold text-cyan-400 mb-2">5+</div>
                  <div className="text-xs uppercase tracking-widest text-slate-500">{t("Years Experience", "سنوات خبرة", "Years Experience")}</div>
                </div>
                <div className={`p-6 rounded-xl text-center border ${isLight ? 'bg-white border-slate-200' : 'bg-white/[0.04] border-white/[0.06]'}`}>
                  <div className="text-4xl font-bold text-cyan-400 mb-2">5000+</div>
                  <div className="text-xs uppercase tracking-widest text-slate-500">{t("Community Members", "عضو في المجتمع", "Community Members")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === MISSION & VISION === */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Mission */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className={`${isRTL ? 'md:order-2' : ''}`}>
              <div className={`backdrop-blur-xl rounded-2xl p-8 border ${isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#0d1225]/80 border-white/[0.06]'}`}>
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500/15 border border-blue-500/20 p-3 rounded-xl mr-4"><Target className="w-8 h-8 text-blue-400" /></div>
                  <h2 className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Our Mission", "مهمتنا", "Our Mission")}</h2>
                </div>
                <p className={`text-lg leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t((pageContent as any)?.missionText || undefined, pageContent?.missionTextAr || undefined, "To bridge the gap between academic theory and industry demands.")}
                </p>
                <ul className="space-y-3">
                  {[t("Accessible Education", "تعليم متاح للجميع", "Accessible Education"), t("Practical Skills First", "المهارات العملية أولاً", "Practical Skills First"), t("Industry Integration", "تكامل مع سوق العمل", "Industry Integration")].map((item, idx) => (
                    <li key={idx} className={`flex items-center font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={`relative ${isRTL ? 'md:order-1' : ''}`}>
              <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-3 opacity-20 scale-105" />
              <img src={missionImageUrl} alt="Mission" className="relative rounded-2xl shadow-xl w-full" />
            </div>
          </div>

          {/* Vision */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-600 rounded-2xl -rotate-3 opacity-20 scale-105" />
              <img src={visionImageUrl} alt="Vision" className="relative rounded-2xl shadow-xl w-full" />
            </div>
            <div>
              <div className={`backdrop-blur-xl rounded-2xl p-8 border ${isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#0d1225]/80 border-white/[0.06]'}`}>
                <div className="flex items-center mb-6">
                  <div className="bg-purple-500/15 border border-purple-500/20 p-3 rounded-xl mr-4"><Eye className="w-8 h-8 text-purple-400" /></div>
                  <h2 className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Our Vision", "رؤيتنا", "Our Vision")}</h2>
                </div>
                <p className={`text-lg leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t(pageContent?.visionText || undefined, pageContent?.visionTextAr || undefined, "Building the tech workforce of tomorrow.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === INNOVATION HUB === */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block bg-blue-500/10 text-blue-400 font-bold px-4 py-1 rounded-full text-sm mb-6 border border-blue-500/20">
            {t("BEYOND THE CLASSROOM", "ما وراء الفصول الدراسية", "BEYOND THE CLASSROOM")}
          </div>
          <h2 className={`text-4xl font-bold mb-12 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("The InfinityX Innovation Lab", "مختبر ابتكار إنفينيتي إكس", "The InfinityX Innovation Lab")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { icon: Rocket, color: "pink", title: t("Aerospace Analytics", "تحليلات الفضاء والطيران", "Aerospace Analytics"), desc: t("Active research in Earth observation data and autonomous systems using deep learning models.", "أبحاث نشطة في بيانات مراقبة الأرض والأنظمة المستقلة باستخدام نماذج التعلم العميق.", "Active research in Earth observation.") },
              { icon: Cpu, color: "blue", title: t("AI Systems", "أنظمة الذكاء الاصطناعي", "AI Systems"), desc: t("Developing smart classifiers and computer vision systems for industrial applications.", "تطوير مصنفات ذكية وأنظمة رؤية حاسوبية للتطبيقات الصناعية.", "Developing smart classifiers.") },
              { icon: BookOpen, color: "green", title: t("Open Source", "المصدر المفتوح", "Open Source"), desc: t("Contributing to the global developer community through open-source educational tools.", "المساهمة في مجتمع المطورين العالمي من خلال أدوات تعليمية مفتوحة المصدر.", "Contributing to open-source.") },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`p-8 rounded-2xl transition-all border ${isLight ? 'bg-white border-slate-200 hover:shadow-lg' : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08]'}`}>
                  <Icon className={`w-10 h-10 text-${item.color}-400 mb-6`} />
                  <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.title}</h3>
                  <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === FOUNDER === */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`backdrop-blur-xl rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0d1225]/80 border-white/[0.06]'}`}>
            <div className="md:w-1/3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-6 opacity-20" />
                <img src={founderImageUrl} alt="Founder" className="relative rounded-2xl shadow-lg w-full object-cover aspect-[3/4]" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-2">
                {t("Meet the Founder", "قابل المؤسس", "Meet the Founder")}
              </h2>
              <h3 className={`text-4xl font-bold mb-6 flex items-center gap-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t((pageContent as any)?.founderName || undefined, "أحمد فرحات", (pageContent as any)?.founderName || "Ahmed Farahat")}
                <a href="https://linkedin.com/in/ahmed-s-farahat" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
              </h3>
              <div className={`space-y-4 text-lg leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <p>{t((pageContent as any)?.founderBio || "With over 5 years of experience in tech education...", pageContent?.founderBioAr || "مع أكثر من 5 سنوات من الخبرة في التعليم التقني...", "Experienced tech educator.")}</p>
                <p>{t("Ahmed specializes in Deep Learning and Computer Vision, with a passion for simplifying complex concepts for students across the Arab world.", "يتخصص أحمد في التعلم العميق والرؤية الحاسوبية، ولديه شغف بتبسيط المفاهيم المعقدة للطلاب في جميع أنحاء العالم العربي.", "Specializes in Deep Learning.")}</p>
              </div>
              <div className="mt-8 border-l-4 border-cyan-500 pl-6 py-2">
                <p className={`italic font-medium text-xl ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  "{t((pageContent as any)?.founderMessage || "Education is the most powerful tool...", pageContent?.founderMessageAr || "التعليم هو أقوى أداة لدينا لتغيير العالم...", "Education changes the world.")}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}