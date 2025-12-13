import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Loader2,
  Users,
  Brain,
  Shield,
  Laptop,
  Code,
  Rocket,
  ArrowRight,
  CheckCircle,
  Globe,
  Satellite,
  Microscope,
  PlayCircle,
  Award
} from "lucide-react";

export default function Home() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // ✅ Fetch text content from database (now includes Arabic fields)
  const { data: pageContent, isLoading } = trpc.admin.getPageContent.useQuery(
    { pageKey: "home" },
    { 
      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true
    }
  );

  // ✅ Helper to switch text based on language
  const t = (en: string | undefined, ar: string | undefined, fallback: string) => {
    if (lang === 'ar') return ar || fallback;
    return en || fallback;
  };

  const isRTL = lang === 'ar';

  // ✅ HARDCODED IMAGES (Optimized for Professional Look)
  const heroImageUrl = "/uploads/Gemini_Generated_Image_3p3go53p3go53p3g.png";
  const visionImageUrl = "/uploads/Gemini_Generated_Image_9qv2m9qv2m9qv2m9.png";
  
  // Placeholder for webinar/event image
  const eventImage = "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=800"; 

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
      <section
        className="relative text-white py-32 md:py-48 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 15, 30, 0.85), rgba(10, 15, 30, 0.7)), url(${heroImageUrl})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className={`max-w-4xl ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="inline-block bg-blue-600/20 border border-blue-400/30 rounded-full px-4 py-1 mb-6 backdrop-blur-sm">
              <span className="text-blue-200 font-medium text-sm tracking-wide uppercase">
                {t("InfinityX EdTech Platform", "منصة إنفينيتي إكس للتعليم التقني", "InfinityX EdTech Platform")}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              {t(pageContent?.headline, pageContent?.headline_ar, "Empowering the Next Generation of Tech Leaders")}
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-slate-300 leading-relaxed max-w-2xl">
              {t(pageContent?.subHeadline, pageContent?.subHeadline_ar, "Master cutting-edge technologies through hands-on learning.")}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/courses">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105">
                  {t("Explore Our Schools", "استكشف الكليات", "Explore Our Schools")} 
                  {!isRTL && <ArrowRight className="ml-2 h-5 w-5" />}
                  {isRTL && <ArrowRight className="mr-2 h-5 w-5 rotate-180" />}
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl"
                >
                  {t("Start Free Trial", "ابدأ تجربة مجانية", "Start Free Trial")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === PARTNERS STRIP === */}
      <section className="py-10 border-b border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-400 text-sm font-semibold uppercase tracking-widest mb-6">
            {t("Trusted by Industry Leaders & Partners", "موثوق به من قبل قادة الصناعة والشركاء", "Trusted by Industry Leaders")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for logos - replace with real images later */}
            <div className="font-bold text-2xl text-slate-700">ZIM ACADEMY</div>
            <div className="font-bold text-2xl text-slate-700">EAGLE VISION</div>
            <div className="font-bold text-2xl text-slate-700">ORBITAL SYSTEMS</div>
            <div className="font-bold text-2xl text-slate-700">TECH HORIZON</div>
          </div>
        </div>
      </section>

      {/* === STATS & IMPACT === */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <div className="p-4">
              <div className="text-5xl font-bold text-blue-600 mb-2">{pageContent?.studentsTrained || 500}+</div>
              <div className="text-slate-500 font-medium uppercase text-sm tracking-wider">
                {t("Students Trained", "طالب تم تدريبهم", "Students Trained")}
              </div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-bold text-blue-600 mb-2">{pageContent?.expertInstructors || 15}+</div>
              <div className="text-slate-500 font-medium uppercase text-sm tracking-wider">
                {t("Expert Mentors", "خبير وموجه", "Expert Mentors")}
              </div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-bold text-blue-600 mb-2">4</div>
              <div className="text-slate-500 font-medium uppercase text-sm tracking-wider">
                {t("MENA Countries", "دول في الشرق الأوسط", "MENA Countries")}
              </div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-bold text-blue-600 mb-2">{pageContent?.jobPlacementRate || 95}%</div>
              <div className="text-slate-500 font-medium uppercase text-sm tracking-wider">
                {t("Employment Rate", "معدل التوظيف", "Employment Rate")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === THE INFINITY METHODOLOGY (New Section) === */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("The InfinityX Methodology", "منهجية إنفينيتي إكس", "The InfinityX Methodology")}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {t("We don't just teach theory. We build careers through a rigorous 4-step process designed for the modern tech landscape.", "نحن لا ندرّس النظرية فقط. نحن نبني المهن من خلال عملية صارمة من 4 خطوات مصممة لسوق العمل الحديث.")}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                icon: <Brain className="w-10 h-10 text-blue-400" />, 
                title: t("Foundation", "التأسيس", "Foundation"), 
                desc: t("Deep dive into core concepts and theoretical frameworks.", "فهم عميق للمفاهيم الأساسية والأطر النظرية.", "Deep dive into theory.") 
              },
              { 
                icon: <Code className="w-10 h-10 text-purple-400" />, 
                title: t("Application", "التطبيق", "Application"), 
                desc: t("Intensive hands-on labs and coding challenges.", "معامل عملية مكثفة وتحديات برمجية.", "Intensive hands-on labs.") 
              },
              { 
                icon: <Rocket className="w-10 h-10 text-pink-400" />, 
                title: t("Innovation", "الابتكار", "Innovation"), 
                desc: t("Build real-world capstone projects solving actual problems.", "بناء مشاريع تخرج حقيقية تحل مشاكل واقعية.", "Build real-world projects.") 
              },
              { 
                icon: <Award className="w-10 h-10 text-green-400" />, 
                title: t("Certification", "الاعتماد", "Certification"), 
                desc: t("Industry-recognized certification and career support.", "شهادات معتمدة ودعم وظيفي كامل.", "Industry-recognized certification.") 
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all cursor-default">
                <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SPECIALIZED SCHOOLS (The Dense Part) === */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                {t("Explore Our Schools", "استكشف كلياتنا المتخصصة", "Explore Our Schools")}
              </h2>
              <p className="text-slate-600 max-w-xl">
                {t("Specialized tracks designed to make you an expert in your chosen field.", "مسارات متخصصة مصممة لتجعلك خبيراً في مجالك المختار.", "Specialized tracks designed to make you an expert.")}
              </p>
            </div>
            <Link href="/programs">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 mt-4 md:mt-0">
                {t("View All Programs", "عرض جميع البرامج", "View All Programs")} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* SCHOOL OF SPACE TECH (Featured) */}
            <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="bg-blue-500/20 w-fit p-3 rounded-lg mb-6 backdrop-blur-sm">
                  <Satellite className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  {t("School of Space Technology", "مدرسة تكنولوجيا الفضاء", "School of Space Technology")}
                </h3>
                <p className="text-blue-200 mb-8 max-w-lg leading-relaxed">
                  {t("Join the only specialized program in the region focusing on Orbital Mechanics, Satellite Image Analysis, and Space Debris Mitigation using AI.", "انضم إلى البرنامج الوحيد في المنطقة الذي يركز على ميكانيكا المدارات، تحليل صور الأقمار الصناعية، والحد من الحطام الفضائي باستخدام الذكاء الاصطناعي.", "Join the only specialized program in the region focusing on Orbital Mechanics.")}
                </p>
                <div className="flex gap-4">
                  <Link href="/courses/space">
                    <Button className="bg-white text-blue-900 hover:bg-blue-50">
                      {t("Explore Space Track", "استكشف مسار الفضاء", "Explore Space Track")}
                    </Button>
                  </Link>
                </div>
              </div>
              <Rocket className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* SCHOOL OF AI */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all group">
              <div className="bg-green-100 w-fit p-3 rounded-lg mb-6">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">
                {t("School of AI & Data", "مدرسة الذكاء الاصطناعي", "School of AI & Data")}
              </h3>
              <p className="text-slate-600 mb-6 text-sm">
                Deep Learning, Computer Vision, and Predictive Analytics.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Python & TensorFlow
                </li>
                <li className="flex items-center text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Smart Classifiers
                </li>
              </ul>
              <Link href="/courses/ai">
                <Button variant="outline" className="w-full group-hover:bg-green-50 group-hover:text-green-700 group-hover:border-green-200">
                  {t("View Curriculum", "عرض المنهج", "View Curriculum")}
                </Button>
              </Link>
            </div>

            {/* SCHOOL OF SOFTWARE */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all group">
              <div className="bg-purple-100 w-fit p-3 rounded-lg mb-6">
                <Code className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">
                {t("Software Engineering", "هندسة البرمجيات", "Software Engineering")}
              </h3>
              <p className="text-slate-600 mb-6 text-sm">
                Full-Stack Web Development, API Design, and Cloud Architecture.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-purple-500 mr-2" /> React & Node.js
                </li>
                <li className="flex items-center text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-purple-500 mr-2" /> Microservices
                </li>
              </ul>
              <Link href="/courses/software">
                <Button variant="outline" className="w-full group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:border-purple-200">
                  {t("View Curriculum", "عرض المنهج", "View Curriculum")}
                </Button>
              </Link>
            </div>

            {/* SCHOOL OF CYBERSECURITY */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all group">
              <div className="bg-red-100 w-fit p-3 rounded-lg mb-6">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">
                {t("Cybersecurity", "الأمن السيبراني", "Cybersecurity")}
              </h3>
              <p className="text-slate-600 mb-6 text-sm">
                Network defense, ethical hacking, and security operations.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-red-500 mr-2" /> Penetration Testing
                </li>
                <li className="flex items-center text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-red-500 mr-2" /> SOC Analysis
                </li>
              </ul>
              <Link href="/courses/security">
                <Button variant="outline" className="w-full group-hover:bg-red-50 group-hover:text-red-700 group-hover:border-red-200">
                  {t("View Curriculum", "عرض المنهج", "View Curriculum")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === LATEST EVENTS (Dynamic Feel) === */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">
              {t("Latest from InfinityX Hub", "أحدث الأخبار من إنفينيتي إكس", "Latest from InfinityX Hub")}
            </h2>
            <p className="text-slate-500">
              {t("Webinars, Workshops, and Challenges", "ندوات، ورش عمل، وتحديات", "Webinars, Workshops, and Challenges")}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <div className="md:w-1/2 relative min-h-[300px]">
              <img 
                src={eventImage} 
                alt="Event" 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent"></div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-white">
              <div className="inline-block bg-red-600 text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit">
                {t("WEBINAR REPLAY", "مشاهدة الندوة", "WEBINAR REPLAY")}
              </div>
              <h3 className="text-3xl font-bold mb-4">AGE OF AI: The New Era Begins</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                {t("Hosted by Ahmed Farahat featuring guest expert Elsayed Ghonaim. Discover how Generative AI is reshaping the software landscape.", "تقديم أحمد فرحات مع الضيف الخبير السيد غنيم. اكتشف كيف يعيد الذكاء الاصطناعي التوليدي تشكيل مشهد البرمجيات.", "Hosted by Ahmed Farahat featuring guest expert Elsayed Ghonaim.")}
              </p>
              <div className="flex gap-4">
                <Button className="bg-white text-slate-900 hover:bg-slate-100">
                  <PlayCircle className="mr-2 h-4 w-4" /> {t("Watch Recording", "شاهد التسجيل", "Watch Recording")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-24 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            {t("Ready to Transform Your Future?", "هل أنت مستعد لتغيير مستقبلك؟", "Ready to Transform Your Future?")}
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            {t("Join the fastest growing tech community in the MENA region. 40% Discount ends soon!", "انضم إلى المجتمع التقني الأسرع نمواً في الشرق الأوسط. خصم 40% ينتهي قريباً!", "Join the fastest growing tech community in the MENA region.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programs">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-6 rounded-xl">
                {t("Browse All Courses", "تصفح جميع الكورسات", "Browse All Courses")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}