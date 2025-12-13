import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Target, 
  Eye, 
  Users, 
  Award, 
  Globe, 
  MapPin, 
  Rocket, 
  Cpu, 
  BookOpen 
} from "lucide-react";

export default function About() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // ✅ Fetch text content
  const { data: pageContent, isLoading } = trpc.admin.getPageContent.useQuery(
    { pageKey: "about" },
    { 
      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true
    }
  );

  // ✅ Translation Helper
  const t = (en: string | undefined, ar: string | undefined, fallback: string) => {
    if (lang === 'ar') return ar || fallback;
    return en || fallback;
  };

  const isRTL = lang === 'ar';

  // ✅ HARDCODED IMAGES
  const missionImageUrl = "/uploads/Gemini_Generated_Image_g1ud5zg1ud5zg1ud-min.png";
  const visionImageUrl = "/uploads/Gemini_Generated_Image_bv1myvbv1myvbv1m.png";
  const founderImageUrl = "/uploads/poster.png"; // Using the poster image as founder placeholder based on your files
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white text-slate-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* === LANGUAGE TOGGLE (Floating) === */}
      <div className={`fixed top-24 ${isRTL ? 'left-6' : 'right-6'} z-50`}>
        <Button 
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="shadow-xl bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-full px-4 py-2 flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          {lang === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>

      {/* === HERO SECTION === */}
      <section className="relative bg-slate-900 text-white py-24 md:py-32 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            {t("About InfinityX", "عن إنفينيتي إكس", "About InfinityX")}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t(
              "Empowering the next generation of tech leaders through innovative education and hands-on training.", 
              "تمكين الجيل القادم من قادة التكنولوجيا من خلال التعليم المبتكر والتدريب العملي.", 
              "Empowering the next generation of tech leaders."
            )}
          </p>
        </div>
      </section>

      {/* === REGIONAL IMPACT (New Section) === */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-slate-900">
                {t("Our Regional Footprint", "بصمتنا الإقليمية", "Our Regional Footprint")}
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                {t(
                  "InfinityX is proud to serve talents across the MENA region, bridging borders with technology.",
                  "تفخر إنفينيتي إكس بخدمة المواهب في جميع أنحاء منطقة الشرق الأوسط وشمال أفريقيا.",
                  "Serving talents across MENA."
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                {['Egypt', 'Saudi Arabia', 'Syria', 'North Africa'].map((country) => (
                  <div key={country} className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
                    <MapPin className="w-4 h-4 mr-2" /> 
                    {t(country, country === 'Egypt' ? 'مصر' : country === 'Saudi Arabia' ? 'السعودية' : country === 'Syria' ? 'سوريا' : 'شمال أفريقيا', country)}
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">5+</div>
                  <div className="text-xs uppercase tracking-widest text-slate-500">{t("Years Experience", "سنوات خبرة", "Years Experience")}</div>
               </div>
               <div className="bg-slate-50 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
                  <div className="text-xs uppercase tracking-widest text-slate-500">{t("Community Members", "عضو في المجتمع", "Community Members")}</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* === MISSION & VISION (Dense Layout) === */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Mission */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className={`${isRTL ? 'md:order-2' : ''}`}>
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900">{t("Our Mission", "مهمتنا", "Our Mission")}</h2>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                {t(pageContent?.missionText, pageContent?.mission_text_ar, "To democratize tech education.")}
              </p>
              <ul className="space-y-4">
                {[
                    {t: t("Accessible Education", "تعليم متاح للجميع", "Accessible Education")},
                    {t: t("Practical Skills First", "المهارات العملية أولاً", "Practical Skills First")},
                    {t: t("Industry Integration", "تكامل مع سوق العمل", "Industry Integration")}
                ].map((item, idx) => (
                    <li key={idx} className="flex items-center text-slate-700 font-medium">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {item.t}
                    </li>
                ))}
              </ul>
            </div>
            <div className={`relative ${isRTL ? 'md:order-1' : ''}`}>
              <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-3 opacity-10 transform scale-105"></div>
              <img
                src={missionImageUrl}
                alt="Mission"
                className="relative rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>

          {/* Vision */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-600 rounded-2xl -rotate-3 opacity-10 transform scale-105"></div>
              <img
                src={visionImageUrl}
                alt="Vision"
                className="relative rounded-2xl shadow-xl w-full"
              />
            </div>
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <Eye className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900">{t("Our Vision", "رؤيتنا", "Our Vision")}</h2>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                {t(pageContent?.visionText, pageContent?.vision_text_ar, "Building the tech workforce of tomorrow.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === INNOVATION HUB (Research & Space) === */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-block bg-blue-500/20 text-blue-300 font-bold px-4 py-1 rounded-full text-sm mb-6 border border-blue-500/30">
                {t("BEYOND THE CLASSROOM", "ما وراء الفصول الدراسية", "BEYOND THE CLASSROOM")}
            </div>
            <h2 className="text-4xl font-bold mb-12">
                {t("The InfinityX Innovation Lab", "مختبر ابتكار إنفينيتي إكس", "The InfinityX Innovation Lab")}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all">
                    <Rocket className="w-10 h-10 text-pink-500 mb-6" />
                    <h3 className="text-xl font-bold mb-4">{t("Space Tech Research", "أبحاث تكنولوجيا الفضاء", "Space Tech Research")}</h3>
                    <p className="text-slate-400 leading-relaxed">
                        {t(
                            "Active research in orbital mechanics and space debris mitigation using deep learning models.",
                            "أبحاث نشطة في ميكانيكا المدارات والحد من الحطام الفضائي باستخدام نماذج التعلم العميق.",
                            "Active research in orbital mechanics."
                        )}
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all">
                    <Cpu className="w-10 h-10 text-blue-500 mb-6" />
                    <h3 className="text-xl font-bold mb-4">{t("AI Systems", "أنظمة الذكاء الاصطناعي", "AI Systems")}</h3>
                    <p className="text-slate-400 leading-relaxed">
                        {t(
                            "Developing smart classifiers and computer vision systems for industrial applications.",
                            "تطوير مصنفات ذكية وأنظمة رؤية حاسوبية للتطبيقات الصناعية.",
                            "Developing smart classifiers."
                        )}
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all">
                    <BookOpen className="w-10 h-10 text-green-500 mb-6" />
                    <h3 className="text-xl font-bold mb-4">{t("Open Source", "المصدر المفتوح", "Open Source")}</h3>
                    <p className="text-slate-400 leading-relaxed">
                        {t(
                            "Contributing to the global developer community through open-source educational tools.",
                            "المساهمة في مجتمع المطورين العالمي من خلال أدوات تعليمية مفتوحة المصدر.",
                            "Contributing to open-source."
                        )}
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* === FOUNDER SECTION === */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 border border-blue-100 shadow-sm">
            <div className="md:w-1/3">
              <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-6 opacity-20"></div>
                  <img
                    src={founderImageUrl}
                    alt="Founder"
                    className="relative rounded-2xl shadow-lg w-full object-cover aspect-[3/4]"
                  />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">
                {t("Meet the Founder", "قابل المؤسس", "Meet the Founder")}
              </h2>
              <h3 className="text-4xl font-bold mb-6 text-slate-900">
                {t(pageContent?.founderName, "أحمد فرحات", pageContent?.founderName || "Ahmed Farahat")}
              </h3>
              
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                <p>
                    {t(
                        pageContent?.founderBio || "With over 5 years of experience in tech education...", 
                        pageContent?.founder_bio_ar || "مع أكثر من 5 سنوات من الخبرة في التعليم التقني وتطوير البرمجيات...", 
                        "Experienced tech educator."
                    )}
                </p>
                <p>
                    {t(
                        "Ahmed specializes in Deep Learning and Computer Vision, with a passion for simplifying complex concepts for students across the Arab world.",
                        "يتخصص أحمد في التعلم العميق والرؤية الحاسوبية، ولديه شغف بتبسيط المفاهيم المعقدة للطلاب في جميع أنحاء العالم العربي.",
                        "Specializes in Deep Learning."
                    )}
                </p>
              </div>

              <div className="mt-8 border-l-4 border-blue-600 pl-6 py-2">
                <p className="text-slate-800 italic font-medium text-xl">
                  "{t(
                      pageContent?.founderMessage || "Education is the most powerful tool...", 
                      pageContent?.founder_message_ar || "التعليم هو أقوى أداة لدينا لتغيير العالم...", 
                      "Education changes the world."
                  )}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}