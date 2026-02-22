import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Loader2,
  Brain,
  Shield,
  Code,
  Rocket,
  ArrowRight,
  CheckCircle,
  Globe,
  Satellite,
  Video,
  Library,
  MessageCircle,
  Zap
} from "lucide-react";

export default function Home() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const { data: pageContent, isLoading } = trpc.admin.getPageContent.useQuery(
    { pageKey: "home" },
    {
      staleTime: 0, refetchOnMount: true, refetchOnWindowFocus: true
    }
  );

  // Fetch active sponsors
  const { data: sponsors = [], isLoading: isLoadingSponsors } = trpc.admin.getActiveSponsors.useQuery();

  // ✅ Translation Helper
  const t = (en: string | undefined, ar: string | undefined, fallback: string) => {
    return lang === 'ar' ? (ar || fallback) : (en || fallback);
  };

  const isRTL = lang === 'ar';
  const heroImageUrl = "/uploads/Gemini_Generated_Image_3p3go53p3go53p3g.png";

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

      {/* === LANGUAGE TOGGLE === */}
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
          backgroundImage: `linear-gradient(rgba(5, 10, 25, 0.9), rgba(5, 10, 25, 0.8)), url(${heroImageUrl})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className={`max-w-4xl ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-500/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-blue-200 font-semibold text-xs tracking-wide uppercase">
                {t("Accepting New Applications for 2025", "فتح باب التقديم لدفعة 2025", "Accepting New Applications for 2025")}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              {t(pageContent?.headline || undefined, pageContent?.headlineAr || undefined, "Empowering the Next Generation of Tech Leaders")}
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-slate-300 leading-relaxed max-w-2xl">
              {t(pageContent?.subHeadline || undefined, pageContent?.subHeadlineAr || undefined, "Master cutting-edge technologies through hands-on learning.")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/programs">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105">
                  {t("Explore Departments", "استكشف التخصصات", "Explore Departments")}
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl backdrop-blur-sm">
                  {t("About InfinityX", "عن المنصة", "About InfinityX")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === TECH STACK TICKER === */}
      <div className="bg-slate-50 border-b border-slate-200 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8">
          <p className="whitespace-nowrap text-slate-400 text-xs font-bold uppercase tracking-widest">
            {t("We Teach Industry Standards:", "نحن ندرّس معايير الصناعة:", "We Teach Industry Standards:")}
          </p>
          <div className="flex flex-1 justify-between items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500 gap-8 overflow-x-auto no-scrollbar">
            {["Python", "TensorFlow", "React", "Node.js", "Docker", "AWS", "Kubernetes", "Linux", "STK", "OpenCV"].map(tool => (
              <span key={tool} className="font-bold text-lg text-slate-700 whitespace-nowrap">{tool}</span>
            ))}
          </div>
        </div>
      </div>

      {/* === LEARNING EXPERIENCE (Hybrid) === */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t("The InfinityX Hybrid Experience", "تجربة التعلم الهجينة في إنفينيتي إكس", "The InfinityX Hybrid Experience")}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {t("We combine the energy of live classrooms with the flexibility of a digital platform.", "نجمع بين طاقة الفصول المباشرة ومرونة المنصات الرقمية.", "Combining live energy with digital flexibility.")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl text-center hover:shadow-lg transition-all">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Video className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{t("Live Interactive Sessions", "محاضرات تفاعلية مباشرة", "Live Interactive Sessions")}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {t("Join expert instructors on Google Meet. Ask questions in real-time, code together, and get immediate feedback.", "انضم إلى الخبراء عبر Google Meet. اسأل في الوقت الفعلي واحصل على تعليقات فورية.", "Live sessions on Google Meet.")}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-100 p-8 rounded-2xl text-center hover:shadow-lg transition-all">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Library className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{t("Dedicated LMS Platform", "منصة تعليمية متكاملة", "Dedicated LMS Platform")}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {t("Access high-quality recordings, slides, source code, and extra resources on our private portal 24/7.", "ادخل إلى التسجيلات، الشرائح، والأكواد المصدرية على بوابتنا الخاصة 24/7.", "Access resources 24/7.")}
              </p>
            </div>

            <div className="bg-green-50 border border-green-100 p-8 rounded-2xl text-center hover:shadow-lg transition-all">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{t("Community & Support", "مجتمع ودعم مستمر", "Community & Support")}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {t("Join private groups for your batch. Collaborate on projects and get unstuck with help from mentors.", "انضم إلى مجموعات خاصة بدفعتك. تعاون في المشاريع واحصل على المساعدة من الموجهين.", "Join private community groups.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === SCHOOLS (BALANCED LAYOUT) === */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-white/10 text-white/90 text-sm font-bold px-4 py-1 rounded-full mb-4">
              {t("CHOOSE YOUR PATH", "اختر مسارك", "CHOOSE YOUR PATH")}
            </div>
            <h2 className="text-4xl font-bold mb-4">
              {t("Our Specialized Schools", "كلياتنا المتخصصة", "Our Specialized Schools")}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {t("Four pillars of excellence. Each designed to take you from beginner to professional.", "أربعة ركائز للتميز. كل منها مصمم ليأخذك من مبتدئ إلى محترف.", "Four pillars of excellence.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* 1. SCHOOL OF AI */}
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-10 relative overflow-hidden group border border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Brain className="w-48 h-48 text-emerald-400" />
              </div>
              <div className="relative z-10">
                <div className="bg-emerald-500/20 w-fit p-3 rounded-xl mb-6 backdrop-blur-sm border border-emerald-500/30">
                  <Brain className="w-8 h-8 text-emerald-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{t("School of AI & Data", "مدرسة الذكاء الاصطناعي", "School of AI")}</h3>
                <p className="text-emerald-100/80 mb-6 leading-relaxed h-16">
                  {t("Build smart systems that see, hear, and predict. From Computer Vision to Predictive Maintenance.", "بناء أنظمة ذكية ترى وتسمع وتتنبأ. من الرؤية الحاسوبية إلى الصيانة التنبؤية.", "Build smart systems.")}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm text-emerald-200"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> TensorFlow & Deep Learning</li>
                  <li className="flex items-center text-sm text-emerald-200"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Computer Vision (YOLO/CNN)</li>
                  <li className="flex items-center text-sm text-emerald-200"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Predictive Maintenance Models</li>
                </ul>
                <Link href="/programs/ai">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
                    {t("View AI Tracks", "عرض مسارات الذكاء الاصطناعي", "View AI Tracks")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* 2. SCHOOL OF SOFTWARE */}
            <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-3xl p-10 relative overflow-hidden group border border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Code className="w-48 h-48 text-purple-400" />
              </div>
              <div className="relative z-10">
                <div className="bg-purple-500/20 w-fit p-3 rounded-xl mb-6 backdrop-blur-sm border border-purple-500/30">
                  <Code className="w-8 h-8 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{t("School of Software Engineering", "مدرسة هندسة البرمجيات", "Software Engineering")}</h3>
                <p className="text-purple-100/80 mb-6 leading-relaxed h-16">
                  {t("Architect scalable web solutions. Master the MERN stack, Cloud deployment, and System Design.", "هندسة حلول ويب قابلة للتوسع. أتقن MERN Stack، والنشر السحابي، وتصميم الأنظمة.", "Architect scalable web solutions.")}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm text-purple-200"><CheckCircle className="w-4 h-4 mr-2 text-purple-500" /> Full-Stack MERN</li>
                  <li className="flex items-center text-sm text-purple-200"><CheckCircle className="w-4 h-4 mr-2 text-purple-500" /> Microservices & APIs</li>
                  <li className="flex items-center text-sm text-purple-200"><CheckCircle className="w-4 h-4 mr-2 text-purple-500" /> Cloud Architecture (AWS)</li>
                </ul>
                <Link href="/programs/software">
                  <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold">
                    {t("View Software Tracks", "عرض مسارات البرمجة", "View Software Tracks")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* 3. SCHOOL OF CYBERSECURITY */}
            <div className="bg-gradient-to-br from-red-900 to-slate-900 rounded-3xl p-10 relative overflow-hidden group border border-red-500/30 hover:shadow-2xl hover:shadow-red-500/10 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield className="w-48 h-48 text-red-400" />
              </div>
              <div className="relative z-10">
                <div className="bg-red-500/20 w-fit p-3 rounded-xl mb-6 backdrop-blur-sm border border-red-500/30">
                  <Shield className="w-8 h-8 text-red-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{t("School of Cybersecurity", "مدرسة الأمن السيبراني", "School of Cybersecurity")}</h3>
                <p className="text-red-100/80 mb-6 leading-relaxed h-16">
                  {t("Defend the digital world. Learn Offensive Security, Penetration Testing, and SOC Analysis.", "الدفاع عن العالم الرقمي. تعلم الأمن الهجومي، واختبار الاختراق، وتحليل SOC.", "Defend the digital world.")}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm text-red-200"><CheckCircle className="w-4 h-4 mr-2 text-red-500" /> Ethical Hacking</li>
                  <li className="flex items-center text-sm text-red-200"><CheckCircle className="w-4 h-4 mr-2 text-red-500" /> Penetration Testing</li>
                  <li className="flex items-center text-sm text-red-200"><CheckCircle className="w-4 h-4 mr-2 text-red-500" /> SOC Analysis</li>
                </ul>
                <Link href="/programs/security">
                  <Button className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold">
                    {t("View Security Tracks", "عرض مسارات الأمن", "View Security Tracks")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* 4. SCHOOL OF SPACE TECH (Balanced with others) */}
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-10 relative overflow-hidden group border border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Satellite className="w-48 h-48 text-blue-400" />
              </div>
              <div className="relative z-10">
                <div className="bg-blue-500/20 w-fit p-3 rounded-xl mb-6 backdrop-blur-sm border border-blue-500/30">
                  <Rocket className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{t("School of Space & AI", "مدرسة الفضاء والذكاء الاصطناعي", "School of Space & AI")}</h3>
                <p className="text-blue-100/80 mb-6 leading-relaxed h-16">
                  {t("Applying AI to Space challenges. Commercial space data analysis, Debris classification, and Orbital mechanics.", "تطبيق الذكاء الاصطناعي على تحديات الفضاء. تحليل البيانات التجارية، وتصنيف الحطام.", "Applying AI to Space challenges.")}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm text-blue-200"><CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Orbital Mechanics & AI</li>
                  <li className="flex items-center text-sm text-blue-200"><CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Satellite Image Analysis</li>
                  <li className="flex items-center text-sm text-blue-200"><CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Debris Mitigation</li>
                </ul>
                <Link href="/programs/space">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                    {t("View Space Tracks", "عرض مسارات الفضاء", "View Space Tracks")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* === STUDENT PROJECTS (UPGRADED) === */}
      <section className="py-24 bg-slate-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">{t("What Our Students Build", "ماذا يبني طلابنا", "What Our Students Build")}</h2>
          <p className="text-center text-slate-500 mb-16 max-w-2xl mx-auto">{t("Real projects solving real problems. This is the output of our training.", "مشاريع حقيقية تحل مشاكل واقعية. هذا هو نتاج تدريبنا.", "Real projects solving real problems.")}</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 group relative cursor-pointer transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-56 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Satellite className="w-20 h-20 text-blue-400 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10" />
                <div className="absolute bottom-4 right-4 bg-blue-500/20 backdrop-blur-sm text-blue-200 text-xs px-2 py-1 rounded">Space / AI</div>
              </div>
              <div className="p-8 relative z-10">
                <h4 className="font-bold text-xl mb-3 text-slate-800 group-hover:text-blue-600 transition-colors">DebrisTracker AI</h4>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">A Deep Learning model that identifies and classifies space debris from raw telescope imagery with 92% accuracy.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-100 shadow-sm">PYTHON</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-100 shadow-sm">TENSORFLOW</span>
                </div>
              </div>
              <div className="h-1 w-0 bg-blue-500 group-hover:w-full transition-all duration-500 absolute bottom-0 left-0"></div>
            </div>

            {/* Project 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 group relative cursor-pointer transform hover:-translate-y-2 delay-75">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-56 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/connected.png')] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Brain className="w-20 h-20 text-green-400 transform group-hover:scale-110 transition-all duration-500 animate-[pulse_3s_ease-in-out_infinite] relative z-10" />
                <div className="absolute bottom-4 right-4 bg-green-500/20 backdrop-blur-sm text-green-200 text-xs px-2 py-1 rounded">Computer Vision</div>
              </div>
              <div className="p-8 relative z-10">
                <h4 className="font-bold text-xl mb-3 text-slate-800 group-hover:text-green-600 transition-colors">AgroVision</h4>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">Computer Vision system for early detection of plant diseases in large-scale farms using drone footage.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold border border-green-100 shadow-sm">OPENCV</span>
                  <span className="text-[10px] bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold border border-green-100 shadow-sm">YOLO</span>
                  <span className="text-[10px] bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold border border-green-100 shadow-sm">FASTAPI</span>
                </div>
              </div>
              <div className="h-1 w-0 bg-green-500 group-hover:w-full transition-all duration-500 absolute bottom-0 left-0"></div>
            </div>

            {/* Project 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 group relative cursor-pointer transform hover:-translate-y-2 delay-150">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-56 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Shield className="w-20 h-20 text-purple-400 transform group-hover:-translate-y-2 transition-all duration-500 relative z-10" />
                <div className="absolute bottom-4 right-4 bg-purple-500/20 backdrop-blur-sm text-purple-200 text-xs px-2 py-1 rounded">Cybersecurity</div>
              </div>
              <div className="p-8 relative z-10">
                <h4 className="font-bold text-xl mb-3 text-slate-800 group-hover:text-purple-600 transition-colors">SecureChat</h4>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">End-to-end encrypted messaging platform built with MERN stack and Socket.io for real-time secure comms.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-bold border border-purple-100 shadow-sm">REACT</span>
                  <span className="text-[10px] bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-bold border border-purple-100 shadow-sm">NODE.JS</span>
                  <span className="text-[10px] bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-bold border border-purple-100 shadow-sm">WEBSOCKETS</span>
                </div>
              </div>
              <div className="h-1 w-0 bg-purple-500 group-hover:w-full transition-all duration-500 absolute bottom-0 left-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* === OUR SPONSORS (NEW) === */}
      {!isLoadingSponsors && sponsors.length > 0 && (
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-10 text-slate-400 uppercase tracking-widest text-sm">
              {t("Supported By Our Incredible Partners", "بدعم من شركائنا الرائعين", "Supported By Our Incredible Partners")}
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
              {sponsors.map((sponsor: any) => (
                <a
                  key={sponsor.id}
                  href={sponsor.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block ${!sponsor.url && 'pointer-events-none'}`}
                >
                  <div className="w-32 md:w-40 h-16 flex items-center justify-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === COMPARISON TABLE === */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">{t("Why Choose InfinityX?", "لماذا تختار إنفينيتي إكس؟", "Why Choose InfinityX?")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="p-4 text-slate-500 font-medium w-1/3">{t("Feature", "الميزة", "Feature")}</th>
                  <th className="p-4 text-blue-600 font-bold w-1/3 text-lg bg-blue-50/50 rounded-t-xl">InfinityX</th>
                  <th className="p-4 text-slate-400 font-medium w-1/3">{t("Traditional Courses", "الدورات التقليدية", "Traditional Courses")}</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                {[
                  { feat: t("Instruction Mode", "نظام التعليم", "Instruction Mode"), us: t("Live + Recorded LMS", "مباشر + منصة مسجلة", "Live + Recorded"), them: t("Pre-recorded only", "مسجل فقط", "Recorded only") },
                  { feat: t("Curriculum", "المنهج", "Curriculum"), us: t("Project-Based & AI-Integrated", "قائم على المشاريع ودمج الذكاء الاصطناعي", "Project-Based"), them: t("Theoretical", "نظري", "Theoretical") },
                  { feat: t("Support", "الدعم", "Support"), us: t("Private Mentorship Groups", "مجموعات توجيه خاصة", "Private Mentorship"), them: t("Email Support Only", "دعم عبر البريد فقط", "Email only") },
                  { feat: t("Career", "المسار المهني", "Career"), us: t("Portfolio Building", "بناء معرض أعمال", "Portfolio"), them: t("Certificate Only", "شهادة فقط", "Certificate") },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-700">{row.feat}</td>
                    <td className="p-4 text-slate-900 font-bold bg-blue-50/30 border-x border-white">{row.us}</td>
                    <td className="p-4 text-slate-500">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === FAQ SECTION === */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">{t("Common Questions", "أسئلة شائعة", "FAQ")}</h2>
          <div className="space-y-6">
            {[
              {
                q: t("How do I attend the sessions?", "كيف أحضر المحاضرات؟", "How to attend?"),
                a: t("All live sessions are conducted via Google Meet for maximum interaction. Links are shared in your private cohort group.", "جميع المحاضرات المباشرة تتم عبر Google Meet لضمان التفاعل. يتم مشاركة الروابط في مجموعتك الخاصة.", "Via Google Meet.")
              },
              {
                q: t("What if I miss a lecture?", "ماذا لو فاتني درس؟", "Missed lecture?"),
                a: t("You have 24/7 access to our Learning Platform. Every session is recorded and uploaded along with the slides and code materials.", "لديك وصول 24/7 لمنصتنا التعليمية. يتم تسجيل كل جلسة ورفعها مع الشرائح والأكواد.", "Recorded on platform.")
              },
              {
                q: t("Do I need prior experience?", "هل أحتاج لخبرة سابقة؟", "Prior experience?"),
                a: t("It depends on the track. We have beginner-friendly foundation courses and advanced tracks. Check the prerequisites for each school.", "يعتمد على المسار. لدينا دورات تأسيسية للمبتدئين ومسارات متقدمة. تحقق من المتطلبات لكل مدرسة.", "Depends on track.")
              },
              {
                q: t("Can I access the material from my phone?", "هل يمكنني الوصول من الهاتف؟", "Mobile access?"),
                a: t("Yes, our platform is fully responsive. You can watch recordings and read materials from any device.", "نعم، منصتنا متجاوبة بالكامل. يمكنك مشاهدة التسجيلات وقراءة المواد من أي جهاز.", "Yes, fully responsive.")
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <h4 className="font-bold text-lg mb-2 text-blue-200 flex items-center">
                  <Zap className="w-4 h-4 mr-2" /> {item.q}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CONNECT WITH US === */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10 text-slate-900">{t("Connect With Us", "تواصل معنا", "Connect With Us")}</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {/* Website */}
            <a href="https://infx.space" target="_blank" rel="noreferrer" title="Website" className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-700 hover:text-white transition-all hover:scale-110 shadow-sm">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </a>

            {/* LinkedIn Company */}
            <a href="https://www.linkedin.com/company/infinity-x-edtech/" target="_blank" rel="noreferrer" title="LinkedIn" className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all hover:scale-110 shadow-sm">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>

            {/* Facebook */}
            <a href="https://facebook.com/InfinityXEdTech" target="_blank" rel="noreferrer" title="Facebook" className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all hover:scale-110 shadow-sm">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>

            {/* YouTube */}
            <a href="https://www.youtube.com/@infinityXEdTech" target="_blank" rel="noreferrer" title="YouTube" className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all hover:scale-110 shadow-sm">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </a>

            {/* Telegram */}
            <a href="https://t.me/AhmedSFarahat" target="_blank" rel="noreferrer" title="Telegram" className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-all hover:scale-110 shadow-sm">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.601.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.202-.656-.639.135-.953l11.57-4.458c.535-.195 1.002.128.831.939z" /></svg>
            </a>

            {/* WhatsApp Contact */}
            <a href="https://wa.me/qr/DPIFTRQ4NI3VP1" target="_blank" rel="noreferrer" title="WhatsApp Direct" className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all hover:scale-110 shadow-sm">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M12.031 0C5.394 0 .004 5.385.004 12.022c0 2.115.553 4.191 1.603 6.01L.002 24l6.115-1.602c1.745.962 3.738 1.47 5.912 1.47 6.637 0 12.025-5.385 12.025-12.02S18.668 0 12.031 0zm0 19.98c-1.801 0-3.565-.483-5.111-1.4L6.5 18.33l-3.66.96.974-3.568-.276-.44c-.98-1.565-1.498-3.414-1.498-5.26 0-5.54 4.51-10.05 10.05-10.05 5.54 0 10.05 4.51 10.05 10.05s-4.51 10.05-10.05 10.05zm5.514-7.534c-.302-.15-1.792-.885-2.068-.985-.276-.1-.478-.15-.679.15-.202.302-.78 1-.956 1.202-.176.202-.352.226-.654.126-2.583-1.077-4.14-2.887-4.706-3.832-.176-.302.213-.257.653-1.144.1-.202.05-.377-.025-.528-.075-.15-.679-1.636-.93-2.24-.244-.59-.492-.51-.679-.52-.176-.008-.377-.01-.578-.01-.202 0-.528.075-.805.377-.276.302-1.056 1.03-1.056 2.515 0 1.484 1.08 2.918 1.232 3.12.15.202 2.138 3.262 5.176 4.568.723.312 1.287.498 1.727.638.726.23 1.386.197 1.907.12.585-.088 1.792-.732 2.043-1.438.252-.707.252-1.314.177-1.44-.076-.126-.277-.202-.579-.353z" /></svg>
            </a>

            {/* WhatsApp Community */}
            <a href="https://chat.whatsapp.com/DA6lCJWgYXqDSADJLo8LjW" target="_blank" rel="noreferrer" title="WhatsApp Community" className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all hover:scale-110 shadow-sm relative">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12c0 2.13.68 4.1 1.83 5.7L2.4 21.6l3.96-1.37A9.973 9.973 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm3.64 12.57c-.24.68-1.25 1.15-1.74 1.22l-.12.02c-.39.06-1.13.2-3.32-.71-2.61-1.09-4.22-3.72-4.35-3.89-.13-.17-1.05-1.38-1.05-2.63s.66-1.87.89-2.12c.23-.25.5-.32.66-.32h.5c.2 0 .46.03.62.4.24.59.81 1.95.89 2.11.07.17.11.36.01.55-.1.2-.15.31-.3.48-.15.17-.32.37-.45.5-.15.16-.31.33-.13.63.18.3 1.05 1.72 2.34 2.89 1.66 1.49 3.09 1.96 3.4 2.11.3.16.48.13.67-.09.19-.22.8-1.06 1.02-1.43.22-.36.42-.31.79-.17.37.14 2.3.92 2.7 1.12.39.2.66.3.75.47.09.17.09.95-.15 1.63z" /></svg>
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">Group</div>
            </a>
          </div>
        </div>
      </section>

      {/* === FOOTER CALL TO ACTION === */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">
            {t("Ready to Transform Your Future?", "هل أنت مستعد لتغيير مستقبلك؟", "Ready to Transform Your Future?")}
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            {t("Join the fastest growing tech community in the MENA region.", "انضم إلى المجتمع التقني الأسرع نمواً في الشرق الأوسط.", "Join the fastest growing tech community.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programs">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-6 rounded-xl font-bold shadow-xl">
                {t("Browse All Courses", "تصفح جميع الكورسات", "Browse All Courses")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}