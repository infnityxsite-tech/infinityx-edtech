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
  Satellite,
  Video,
  Library,
  MessageCircle,
  Zap,
  Mail
} from "lucide-react";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const { lang, isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const { data: pageContent, isLoading } = trpc.admin.getPageContent.useQuery(
    { pageKey: "home" },
    {
      staleTime: 0, refetchOnMount: true, refetchOnWindowFocus: true
    }
  );

  // Fetch active sponsors
  const { data: sponsors = [], isLoading: isLoadingSponsors } = trpc.admin.getActiveSponsors.useQuery();

  const heroImageUrl = "/uploads/Gemini_Generated_Image_3p3go53p3go53p3g.png";

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

      {/* === HERO SECTION === */}
      <section
        className={`relative min-h-[85vh] lg:min-h-[90vh] flex items-center bg-cover bg-center pt-28 pb-16 md:pt-36 md:pb-24 ${isLight ? 'text-slate-900' : 'text-white'}`}
        style={{
          backgroundImage: `linear-gradient(${isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(5, 10, 25, 0.9)'}, ${isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(5, 10, 25, 0.8)'}), url(${heroImageUrl})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className={`max-w-4xl ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Logo */}
            <div className="mb-6 md:mb-8">
              <img
                src="/uploads/logo.png"
                alt="InfinityX EdTech Logo"
                className="h-16 md:h-20 lg:h-24 w-auto object-contain filter drop-shadow-lg"
              />
            </div>

            {/* Announcement Badge */}
            <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-8 backdrop-blur-md shadow-sm ${isLight ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className={`font-medium text-xs tracking-wider uppercase ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                {t("Accepting New Partners 2026", "نقبل شركاء جدد لعام 2026", "Accepting New Partners 2026")}
              </span>
            </div>

            {/* Heading */}
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t("Infinity X EdTech", "إنفينيتي إكس إديوتك", "Infinity X EdTech")}
            </h1>

            {/* Subtitle */}
            <p className={`text-base md:text-xl max-w-2xl font-medium leading-relaxed mb-10 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              {t(pageContent?.subHeadline || undefined, pageContent?.subHeadlineAr || undefined, "Empowering the Next Generation of Tech Leaders through hands-on learning and global standards.")}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/courses">
                <Button size="lg" className={`border text-base md:text-lg px-8 py-6 rounded-xl transition-all hover:-translate-y-1 font-semibold ${isLight ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'}`}>
                  {t("Explore Courses", "استكشف الكورسات", "Explore Courses")} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/programs">
                <Button size="lg" variant="outline" className={`text-base md:text-lg px-8 py-6 rounded-xl backdrop-blur-sm transition-colors font-medium border ${isLight ? 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-800' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                  {t("Browse Programs", "تصفح المسارات", "Browse Programs")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === QUICK CATEGORY PREVIEW === */}
      <section className="relative z-20 -mt-10 md:-mt-16 w-full max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { title: t("AI & Data", "الذكاء الاصطناعي", "AI & Data"), icon: Brain, href: "/programs/ai", color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { title: t("Software Engineering", "هندسة البرمجيات", "Software Eng"), icon: Code, href: "/programs/software", color: "text-purple-500", bg: "bg-purple-500/10" },
            { title: t("Cybersecurity", "الأمن السيبراني", "Cybersecurity"), icon: Shield, href: "/programs/security", color: "text-red-500", bg: "bg-red-500/10" },
            { title: t("Space & Robotics", "الفضاء والروبوتات", "Space Tech"), icon: Satellite, href: "/programs/space", color: "text-blue-500", bg: "bg-blue-500/10" }
          ].map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link key={idx} href={cat.href}>
                <div className={`backdrop-blur-xl rounded-2xl p-5 border transition-all flex flex-col items-center justify-center text-center cursor-pointer group hover:-translate-y-1 ${isLight ? 'bg-white/80 border-slate-200 hover:border-cyan-400 shadow-sm hover:shadow-md' : 'bg-[#0d1225]/80 shadow-xl border-white/[0.06] hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-900/10'}`}>
                  <div className={`w-12 h-12 rounded-full ${cat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <h3 className={`font-semibold text-sm md:text-base group-hover:text-cyan-400 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {cat.title}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* === TECH STACK TICKER === */}
      <div className={`border-b py-6 overflow-hidden ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0d1225]/60 border-white/[0.04]'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8">
          <p className={`whitespace-nowrap text-xs font-bold uppercase tracking-widest ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>
            {t("We Teach Industry Standards:", "نحن ندرّس معايير الصناعة:", "We Teach Industry Standards:")}
          </p>
          <div className="flex flex-1 justify-between items-center opacity-70 hover:opacity-100 transition-all duration-500 gap-8 overflow-x-auto no-scrollbar">
            {["Python", "TensorFlow", "React", "Node.js", "Docker", "AWS", "Kubernetes", "Linux", "STK", "OpenCV"].map(tool => (
              <span key={tool} className={`font-bold text-lg whitespace-nowrap ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{tool}</span>
            ))}
          </div>
        </div>
      </div>

      {/* === LEARNING EXPERIENCE (Hybrid) === */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t("The InfinityX Hybrid Experience", "تجربة التعلم الهجينة في إنفينيتي إكس", "The InfinityX Hybrid Experience")}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {t("We combine the energy of live classrooms with the flexibility of a digital platform.", "نجمع بين طاقة الفصول المباشرة ومرونة المنصات الرقمية.", "Combining live energy with digital flexibility.")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`backdrop-blur-xl p-8 rounded-2xl text-center border transition-all hover:shadow-lg ${isLight ? 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-blue-900/5' : 'bg-[#0d1225]/80 border-blue-500/10 hover:border-blue-500/30 hover:shadow-blue-900/10'}`}>
              <div className="bg-blue-500/10 border border-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Live Interactive Sessions", "محاضرات تفاعلية مباشرة", "Live Interactive Sessions")}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {t("Join expert instructors on Google Meet. Ask questions in real-time, code together, and get immediate feedback.", "انضم إلى الخبراء عبر Google Meet. اسأل في الوقت الفعلي واحصل على تعليقات فورية.", "Live sessions on Google Meet.")}
              </p>
            </div>

            <div className={`backdrop-blur-xl p-8 rounded-2xl text-center border transition-all hover:shadow-lg ${isLight ? 'bg-white border-purple-200 hover:border-purple-400 hover:shadow-purple-900/5' : 'bg-[#0d1225]/80 border-purple-500/10 hover:border-purple-500/30 hover:shadow-purple-900/10'}`}>
              <div className="bg-purple-500/10 border border-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Library className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Dedicated LMS Platform", "منصة تعليمية متكاملة", "Dedicated LMS Platform")}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {t("Access high-quality recordings, slides, source code, and extra resources on our private portal 24/7.", "ادخل إلى التسجيلات، الشرائح، والأكواد المصدرية على بوابتنا الخاصة 24/7.", "Access resources 24/7.")}
              </p>
            </div>

            <div className={`backdrop-blur-xl p-8 rounded-2xl text-center border transition-all hover:shadow-lg ${isLight ? 'bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-900/5' : 'bg-[#0d1225]/80 border-emerald-500/10 hover:border-emerald-500/30 hover:shadow-emerald-900/10'}`}>
              <div className="bg-emerald-500/10 border border-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Community & Support", "مجتمع ودعم مستمر", "Community & Support")}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {t("Join private groups for your batch. Collaborate on projects and get unstuck with help from mentors.", "انضم إلى مجموعات خاصة بدفعتك. تعاون في المشاريع واحصل على المساعدة من الموجهين.", "Join private community groups.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === SCHOOLS (BALANCED LAYOUT) === */}
      <section className={`py-16 md:py-24 ${isLight ? 'bg-slate-100' : 'bg-slate-900'} text-white`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className={`inline-block text-sm font-bold px-4 py-1 rounded-full mb-4 ${isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-white/90'}`}>
              {t("CHOOSE YOUR PATH", "اختر مسارك", "CHOOSE YOUR PATH")}
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t("Our Specialized Schools", "كلياتنا المتخصصة", "Our Specialized Schools")}
            </h2>
            <p className={`max-w-2xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t("Four pillars of excellence. Each designed to take you from beginner to professional.", "أربعة ركائز للتميز. كل منها مصمم ليأخذك من مبتدئ إلى محترف.", "Four pillars of excellence.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* 1. SCHOOL OF AI */}
            <div className={`rounded-3xl p-8 md:p-10 relative overflow-hidden group border transition-all ${isLight ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200 hover:shadow-emerald-900/10' : 'bg-gradient-to-br from-emerald-900 to-slate-900 border-emerald-500/30 hover:shadow-emerald-500/10'} hover:shadow-2xl`}>
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Brain className="w-48 h-48 text-emerald-400" />
              </div>
              <div className="relative z-10">
                <div className={`w-fit p-3 rounded-xl mb-6 backdrop-blur-sm border ${isLight ? 'bg-emerald-100/50 border-emerald-200' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
                  <Brain className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("School of AI & Data", "مدرسة الذكاء الاصطناعي", "School of AI")}</h3>
                <p className={`mb-6 leading-relaxed h-16 ${isLight ? 'text-slate-600' : 'text-emerald-100/80'}`}>
                  {t("Build smart systems that see, hear, and predict. From Computer Vision to Predictive Maintenance.", "بناء أنظمة ذكية ترى وتسمع وتتنبأ. من الرؤية الحاسوبية إلى الصيانة التنبؤية.", "Build smart systems.")}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className={`flex items-center text-sm ${isLight ? 'text-slate-700' : 'text-emerald-200'}`}><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> TensorFlow & Deep Learning</li>
                  <li className={`flex items-center text-sm ${isLight ? 'text-slate-700' : 'text-emerald-200'}`}><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Computer Vision (YOLO/CNN)</li>
                  <li className={`flex items-center text-sm ${isLight ? 'text-slate-700' : 'text-emerald-200'}`}><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Predictive Maintenance Models</li>
                </ul>
                <Link href="/programs/ai">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
                    {t("View AI Tracks", "عرض مسارات الذكاء الاصطناعي", "View AI Tracks")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* 2. SCHOOL OF SOFTWARE */}
            <div className={`rounded-3xl p-8 md:p-10 relative overflow-hidden group border transition-all ${isLight ? 'bg-gradient-to-br from-purple-50 to-white border-purple-200 hover:shadow-purple-900/10' : 'bg-gradient-to-br from-purple-900 to-slate-900 border-purple-500/30 hover:shadow-purple-500/10'} hover:shadow-2xl`}>
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Code className="w-48 h-48 text-purple-400" />
              </div>
              <div className="relative z-10">
                <div className={`w-fit p-3 rounded-xl mb-6 backdrop-blur-sm border ${isLight ? 'bg-purple-100/50 border-purple-200' : 'bg-purple-500/20 border-purple-500/30'}`}>
                  <Code className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("School of Software Engineering", "مدرسة هندسة البرمجيات", "Software Engineering")}</h3>
                <p className={`mb-6 leading-relaxed h-16 ${isLight ? 'text-slate-600' : 'text-purple-100/80'}`}>
                  {t("Architect scalable web solutions. Master the MERN stack, Cloud deployment, and System Design.", "هندسة حلول ويب قابلة للتوسع. أتقن MERN Stack، والنشر السحابي، وتصميم الأنظمة.", "Architect scalable web solutions.")}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className={`flex items-center text-sm ${isLight ? 'text-slate-700' : 'text-purple-200'}`}><CheckCircle className="w-4 h-4 mr-2 text-purple-500" /> Full-Stack MERN</li>
                  <li className={`flex items-center text-sm ${isLight ? 'text-slate-700' : 'text-purple-200'}`}><CheckCircle className="w-4 h-4 mr-2 text-purple-500" /> Microservices & APIs</li>
                  <li className={`flex items-center text-sm ${isLight ? 'text-slate-700' : 'text-purple-200'}`}><CheckCircle className="w-4 h-4 mr-2 text-purple-500" /> Cloud Architecture (AWS)</li>
                </ul>
                <Link href="/programs/software">
                  <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold">
                    {t("View Software Tracks", "عرض مسارات البرمجة", "View Software Tracks")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* 3. SCHOOL OF CYBERSECURITY */}
            <div className={`rounded-3xl p-8 md:p-10 relative overflow-hidden group border transition-all ${isLight ? 'bg-gradient-to-br from-red-50 to-white border-red-200 hover:shadow-red-900/10' : 'bg-gradient-to-br from-red-900 to-slate-900 border-red-500/30 hover:shadow-red-500/10'} hover:shadow-2xl`}>
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield className="w-48 h-48 text-red-400" />
              </div>
              <div className="relative z-10">
                <div className={`w-fit p-3 rounded-xl mb-6 backdrop-blur-sm border ${isLight ? 'bg-red-100/50 border-red-200' : 'bg-red-500/20 border-red-500/30'}`}>
                  <Shield className="w-8 h-8 text-red-500" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("School of Cybersecurity", "مدرسة الأمن السيبراني", "School of Cybersecurity")}</h3>
                <p className={`mb-6 leading-relaxed h-16 ${isLight ? 'text-slate-600' : 'text-red-100/80'}`}>
                  {t("Defend the digital world. Learn Offensive Security, Penetration Testing, and SOC Analysis.", "الدفاع عن العالم الرقمي. تعلم الأمن الهجومي، واختبار الاختراق، وتحليل SOC.", "Defend the digital world.")}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className={`flex items-center text-sm ${isLight ? 'text-slate-700' : 'text-red-200'}`}><CheckCircle className="w-4 h-4 mr-2 text-red-500" /> Ethical Hacking</li>
                  <li className={`flex items-center text-sm ${isLight ? 'text-slate-700' : 'text-red-200'}`}><CheckCircle className="w-4 h-4 mr-2 text-red-500" /> Penetration Testing</li>
                  <li className={`flex items-center text-sm ${isLight ? 'text-slate-700' : 'text-red-200'}`}><CheckCircle className="w-4 h-4 mr-2 text-red-500" /> SOC Analysis</li>
                </ul>
                <Link href="/programs/security">
                  <Button className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold">
                    {t("View Security Tracks", "عرض مسارات الأمن", "View Security Tracks")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* 4. SCHOOL OF SPACE TECH (Balanced with others) */}
            <div className={`rounded-3xl p-8 md:p-10 relative overflow-hidden group border transition-all ${isLight ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200 hover:shadow-blue-900/10' : 'bg-gradient-to-br from-blue-900 to-slate-900 border-blue-500/30 hover:shadow-blue-500/10'} hover:shadow-2xl`}>
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Satellite className="w-48 h-48 text-blue-400" />
              </div>
              <div className="relative z-10">
                <div className={`w-fit p-3 rounded-xl mb-6 backdrop-blur-sm border ${isLight ? 'bg-blue-100/50 border-blue-200' : 'bg-blue-500/20 border-blue-500/30'}`}>
                  <Rocket className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("School of Space & AI", "مدرسة الفضاء والذكاء الاصطناعي", "School of Space & AI")}</h3>
                <p className={`mb-6 leading-relaxed h-16 ${isLight ? 'text-slate-600' : 'text-blue-100/80'}`}>
                  {t("Applying AI to Space challenges. Commercial space data analysis, autonomous systems, and Earth observation.", "تطبيق الذكاء الاصطناعي على تحديات الفضاء. تحليل البيانات التجارية، والأنظمة المستقلة، ومراقبة الأرض.", "Applying AI to Space challenges.")}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className={`flex items-center text-sm ${isLight ? 'text-slate-700' : 'text-blue-200'}`}><CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Autonomous Systems & AI</li>
                  <li className={`flex items-center text-sm ${isLight ? 'text-slate-700' : 'text-blue-200'}`}><CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Satellite Image Analysis</li>
                  <li className={`flex items-center text-sm ${isLight ? 'text-slate-700' : 'text-blue-200'}`}><CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Deep Learning for Sensing</li>
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
      <section className="py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className={`text-3xl font-bold text-center mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("What Our Students Build", "ماذا يبني طلابنا", "What Our Students Build")}</h2>
          <p className="text-center text-slate-500 mb-16 max-w-2xl mx-auto">{t("Real projects solving real problems. This is the output of our training.", "مشاريع حقيقية تحل مشاكل واقعية. هذا هو نتاج تدريبنا.", "Real projects solving real problems.")}</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className={`backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border group relative cursor-pointer transform hover:-translate-y-2 ${isLight ? 'bg-white border-slate-200 hover:shadow-blue-900/5' : 'bg-[#0d1225]/80 border-white/[0.06] hover:shadow-blue-900/10'}`}>
              <div className="h-56 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Satellite className="w-20 h-20 text-blue-400 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10" />
                <div className="absolute bottom-4 right-4 bg-blue-500/20 backdrop-blur-sm text-blue-200 text-xs px-2 py-1 rounded">Data Science / AI</div>
              </div>
              <div className="p-8 relative z-10">
                <h4 className={`font-bold text-xl mb-3 group-hover:text-blue-400 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>VisionCore AI System</h4>
                <p className={`text-sm mb-6 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>An enterprise-grade Deep Learning model that identifies and classifies complex objects from raw sensor imagery with 99% accuracy for industrial use.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-bold border border-blue-500/20">PYTHON</span>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-bold border border-blue-500/20">TENSORFLOW</span>
                </div>
              </div>
              <div className="h-1 w-0 bg-blue-500 group-hover:w-full transition-all duration-500 absolute bottom-0 left-0"></div>
            </div>

            {/* Project 2 */}
            <div className={`backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border group relative cursor-pointer transform hover:-translate-y-2 delay-75 ${isLight ? 'bg-white border-slate-200 hover:shadow-emerald-900/5' : 'bg-[#0d1225]/80 border-white/[0.06] hover:shadow-emerald-900/10'}`}>
              <div className="h-56 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/connected.png')] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Brain className="w-20 h-20 text-green-400 transform group-hover:scale-110 transition-all duration-500 animate-[pulse_3s_ease-in-out_infinite] relative z-10" />
                <div className="absolute bottom-4 right-4 bg-green-500/20 backdrop-blur-sm text-green-200 text-xs px-2 py-1 rounded">Computer Vision</div>
              </div>
              <div className="p-8 relative z-10">
                <h4 className={`font-bold text-xl mb-3 group-hover:text-green-400 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>AgroVision</h4>
                <p className={`text-sm mb-6 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Computer Vision system for early detection of plant diseases in large-scale farms using drone footage.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-bold border border-green-500/20">OPENCV</span>
                  <span className="text-[10px] bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-bold border border-green-500/20">YOLO</span>
                  <span className="text-[10px] bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-bold border border-green-500/20">FASTAPI</span>
                </div>
              </div>
              <div className="h-1 w-0 bg-green-500 group-hover:w-full transition-all duration-500 absolute bottom-0 left-0"></div>
            </div>

            {/* Project 3 */}
            <div className={`backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border group relative cursor-pointer transform hover:-translate-y-2 delay-150 ${isLight ? 'bg-white border-slate-200 hover:shadow-purple-900/5' : 'bg-[#0d1225]/80 border-white/[0.06] hover:shadow-purple-900/10'}`}>
              <div className="h-56 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Shield className="w-20 h-20 text-purple-400 transform group-hover:-translate-y-2 transition-all duration-500 relative z-10" />
                <div className="absolute bottom-4 right-4 bg-purple-500/20 backdrop-blur-sm text-purple-200 text-xs px-2 py-1 rounded">Cybersecurity</div>
              </div>
              <div className="p-8 relative z-10">
                <h4 className={`font-bold text-xl mb-3 group-hover:text-purple-400 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>SecureChat</h4>
                <p className={`text-sm mb-6 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>End-to-end encrypted messaging platform built with MERN stack and Socket.io for real-time secure comms.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full font-bold border border-purple-500/20">REACT</span>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full font-bold border border-purple-500/20">NODE.JS</span>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full font-bold border border-purple-500/20">WEBSOCKETS</span>
                </div>
              </div>
              <div className="h-1 w-0 bg-purple-500 group-hover:w-full transition-all duration-500 absolute bottom-0 left-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* === OUR SPONSORS (NEW) === */}
      {!isLoadingSponsors && sponsors.length > 0 && (
        <section className="py-20 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-10 text-slate-500 uppercase tracking-widest text-sm">
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
                  <div className="w-32 md:w-40 h-16 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-all duration-300">
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm brightness-200"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === COMPARISON TABLE === */}
      <section className="py-24 border-t border-slate-200 dark:border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Why Choose InfinityX?", "لماذا تختار إنفينيتي إكس؟", "Why Choose InfinityX?")}</h2>
          <div className={`overflow-x-auto backdrop-blur-xl rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-200' : 'bg-[#0d1225]/80 border-white/[0.06]'}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isLight ? 'border-slate-100' : 'border-white/[0.06]'}`}>
                  <th className="p-4 text-slate-500 font-medium w-1/3">{t("Feature", "الميزة", "Feature")}</th>
                  <th className="p-4 text-cyan-600 dark:text-cyan-400 font-bold w-1/3 text-lg">InfinityX</th>
                  <th className="p-4 text-slate-500 font-medium w-1/3">{t("Traditional Courses", "الدورات التقليدية", "Traditional Courses")}</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                {[
                  { feat: t("Instruction Mode", "نظام التعليم", "Instruction Mode"), us: t("Live + Recorded LMS", "مباشر + منصة مسجلة", "Live + Recorded"), them: t("Pre-recorded only", "مسجل فقط", "Recorded only") },
                  { feat: t("Curriculum", "المنهج", "Curriculum"), us: t("Project-Based & AI-Integrated", "قائم على المشاريع ودمج الذكاء الاصطناعي", "Project-Based"), them: t("Theoretical", "نظري", "Theoretical") },
                  { feat: t("Support", "الدعم", "Support"), us: t("Private Mentorship Groups", "مجموعات توجيه خاصة", "Private Mentorship"), them: t("Email Support Only", "دعم عبر البريد فقط", "Email only") },
                  { feat: t("Career", "المسار المهني", "Career"), us: t("Portfolio Building", "بناء معرض أعمال", "Portfolio"), them: t("Certificate Only", "شهادة فقط", "Certificate") },
                ].map((row, idx) => (
                  <tr key={idx} className={`border-b transition-colors ${isLight ? 'border-slate-100 hover:bg-slate-50' : 'border-white/[0.04] hover:bg-white/[0.02]'}`}>
                    <td className="p-4 font-semibold text-slate-400">{row.feat}</td>
                    <td className={`p-4 font-bold ${isLight ? 'text-slate-900 bg-cyan-50' : 'text-white bg-cyan-500/[0.05]'}`}>{row.us}</td>
                    <td className="p-4 text-slate-600">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === FAQ SECTION === */}
      <section className={`py-24 ${isLight ? 'bg-[#f0f4f8] text-slate-900 border-t border-slate-200' : 'bg-slate-900 text-white'}`}>
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
              <div key={idx} className={`border rounded-xl p-6 transition-all ${isLight ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                <h4 className={`font-bold text-lg mb-2 flex items-center ${isLight ? 'text-blue-600' : 'text-blue-200'}`}>
                  <Zap className="w-4 h-4 mr-2" /> {item.q}
                </h4>
                <p className={`text-sm leading-relaxed pl-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}