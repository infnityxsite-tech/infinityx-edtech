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
  Code,
  Rocket,
  ArrowRight,
  CheckCircle,
  Globe,
  Satellite,
  PlayCircle,
  Award,
  Terminal,
  Database,
  Cpu,
  Lock,
  ChevronDown
} from "lucide-react";

export default function Home() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // ✅ Fetch text content
  const { data: pageContent, isLoading } = trpc.admin.getPageContent.useQuery(
    { pageKey: "home" },
    { 
      staleTime: 0, cacheTime: 0, refetchOnMount: true, refetchOnWindowFocus: true
    }
  );

  // ✅ Translation Helper
  const t = (en: string | undefined, ar: string | undefined, fallback: string) => {
    return lang === 'ar' ? (ar || fallback) : (en || fallback);
  };

  const isRTL = lang === 'ar';

  // ✅ IMAGES
  const heroImageUrl = "/uploads/Gemini_Generated_Image_3p3go53p3go53p3g.png";
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
              <Link href="/programs">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105">
                  {t("Explore Departments", "استكشف التخصصات", "Explore Departments")} 
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === TECH STACK STRIP (New - Increases Professionalism) === */}
      <div className="bg-slate-50 border-b border-slate-200 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                {t("Master the Industry Standard Tools", "أتقن أدوات الصناعة القياسية", "Master the Industry Standard Tools")}
            </p>
            <div className="flex justify-between items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500 gap-8 overflow-x-auto">
                {/* Text placeholders for logos */}
                <span className="font-bold text-xl text-slate-600">Python</span>
                <span className="font-bold text-xl text-slate-600">TensorFlow</span>
                <span className="font-bold text-xl text-slate-600">React</span>
                <span className="font-bold text-xl text-slate-600">AWS</span>
                <span className="font-bold text-xl text-slate-600">Docker</span>
                <span className="font-bold text-xl text-slate-600">Kubernetes</span>
                <span className="font-bold text-xl text-slate-600">Linux</span>
            </div>
        </div>
      </div>

      {/* === MAIN PROGRAMS (The "Flagship" Design for ALL) === */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              {t("Our Schools of Excellence", "كليات التميز لدينا", "Our Schools of Excellence")}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t("Four specialized tracks. One world-class standard of education.", "أربعة مسارات متخصصة. معيار عالمي واحد للتعليم.", "Four specialized tracks.")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* 1. SCHOOL OF SPACE TECH */}
            <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group border border-slate-800 shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <Satellite className="w-64 h-64 text-blue-400 transform rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="bg-blue-500/20 w-fit p-3 rounded-lg mb-6 backdrop-blur-sm border border-blue-500/30">
                  <Rocket className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-3xl font-bold mb-4">{t("School of Space Technology", "مدرسة تكنولوجيا الفضاء", "School of Space Technology")}</h3>
                <p className="text-blue-100 mb-8 max-w-2xl text-lg leading-relaxed">
                  {t("The region's premier program for Orbital Mechanics and Satellite Data Analysis. Learn to detect space debris and analyze planetary data using AI.", "البرنامج الرائد في المنطقة لميكانيكا المدارات وتحليل بيانات الأقمار الصناعية. تعلم كيفية اكتشاف الحطام الفضائي وتحليل بيانات الكواكب باستخدام الذكاء الاصطناعي.", "Region's premier program for Space Tech.")}
                </p>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <ul className="space-y-3">
                        <li className="flex items-center text-blue-200"><CheckCircle className="w-5 h-5 mr-3 text-blue-400" /> Orbital Mechanics</li>
                        <li className="flex items-center text-blue-200"><CheckCircle className="w-5 h-5 mr-3 text-blue-400" /> Satellite Image Processing</li>
                    </ul>
                    <ul className="space-y-3">
                        <li className="flex items-center text-blue-200"><CheckCircle className="w-5 h-5 mr-3 text-blue-400" /> Space Debris Mitigation</li>
                        <li className="flex items-center text-blue-200"><CheckCircle className="w-5 h-5 mr-3 text-blue-400" /> STK & Python</li>
                    </ul>
                </div>
                <Link href="/programs/space">
                    <Button className="bg-white text-blue-900 hover:bg-blue-50 border-0 text-lg px-8 py-6 h-auto">
                        {t("Explore Space Track", "استكشف مسار الفضاء", "Explore Space Track")}
                    </Button>
                </Link>
              </div>
            </div>

            {/* 2. SCHOOL OF AI & DATA (Now Premium) */}
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                <Brain className="w-48 h-48 text-emerald-400" />
              </div>
              <div className="relative z-10">
                <div className="bg-emerald-500/20 w-fit p-3 rounded-lg mb-6 backdrop-blur-sm border border-emerald-500/30">
                  <Brain className="w-8 h-8 text-emerald-300" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t("School of AI & Data Science", "مدرسة الذكاء الاصطناعي", "School of AI & Data")}</h3>
                <p className="text-emerald-100 mb-6 leading-relaxed">
                  {t("Master the algorithms shaping the future. From Computer Vision to Predictive Analytics.", "أتقن الخوارزميات التي تشكل المستقبل. من الرؤية الحاسوبية إلى التحليلات التنبؤية.", "Master AI algorithms.")}
                </p>
                <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-emerald-100/80"><Database className="w-4 h-4 mr-2" /> Python & TensorFlow</div>
                    <div className="flex items-center text-sm text-emerald-100/80"><Eye className="w-4 h-4 mr-2" /> Computer Vision & CNNs</div>
                    <div className="flex items-center text-sm text-emerald-100/80"><Cpu className="w-4 h-4 mr-2" /> Smart Classifiers</div>
                </div>
                <Link href="/programs/ai">
                    <Button variant="outline" className="w-full border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white">
                        {t("View AI Curriculum", "عرض منهج الذكاء الاصطناعي", "View AI Curriculum")}
                    </Button>
                </Link>
              </div>
            </div>

            {/* 3. SCHOOL OF SOFTWARE (Now Premium) */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                <Code className="w-48 h-48 text-indigo-400" />
              </div>
              <div className="relative z-10">
                <div className="bg-indigo-500/20 w-fit p-3 rounded-lg mb-6 backdrop-blur-sm border border-indigo-500/30">
                  <Terminal className="w-8 h-8 text-indigo-300" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t("Software Engineering", "هندسة البرمجيات", "Software Engineering")}</h3>
                <p className="text-indigo-100 mb-6 leading-relaxed">
                  {t("Build scalable, robust systems. Full-stack development with a focus on architecture.", "بناء أنظمة قابلة للتوسع وقوية. تطوير متكامل مع التركيز على الهيكلة.", "Build scalable systems.")}
                </p>
                <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-indigo-100/80"><Globe className="w-4 h-4 mr-2" /> MERN Stack (React & Node)</div>
                    <div className="flex items-center text-sm text-indigo-100/80"><Database className="w-4 h-4 mr-2" /> API Design & Microservices</div>
                    <div className="flex items-center text-sm text-indigo-100/80"><Cpu className="w-4 h-4 mr-2" /> Cloud Architecture</div>
                </div>
                <Link href="/programs/software">
                    <Button variant="outline" className="w-full border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white">
                        {t("View Software Curriculum", "عرض منهج البرمجيات", "View Software Curriculum")}
                    </Button>
                </Link>
              </div>
            </div>

            {/* 4. SCHOOL OF CYBERSECURITY (Now Premium) */}
            <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-slate-900 to-red-900 rounded-3xl p-10 text-white relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 right-0 p-10 opacity-10">
                <Shield className="w-64 h-64 text-red-400" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-2/3">
                    <div className="bg-red-500/20 w-fit p-3 rounded-lg mb-6 backdrop-blur-sm border border-red-500/30">
                    <Lock className="w-8 h-8 text-red-300" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{t("Cybersecurity & Defense", "الأمن السيبراني والدفاع", "Cybersecurity")}</h3>
                    <p className="text-red-100 mb-6 leading-relaxed max-w-xl">
                    {t("Defend against the threats of tomorrow. Learn ethical hacking, penetration testing, and SOC analysis in our advanced security labs.", "دافع ضد تهديدات الغد. تعلم الاختراق الأخلاقي، واختبار الاختراق، وتحليل مراكز العمليات الأمنية.", "Defend against threats.")}
                    </p>
                    <div className="flex flex-wrap gap-4 mb-6">
                        <span className="bg-red-900/50 border border-red-700 px-3 py-1 rounded-full text-xs text-red-200">Penetration Testing</span>
                        <span className="bg-red-900/50 border border-red-700 px-3 py-1 rounded-full text-xs text-red-200">Network Defense</span>
                        <span className="bg-red-900/50 border border-red-700 px-3 py-1 rounded-full text-xs text-red-200">SOC Analysis</span>
                    </div>
                </div>
                <div className="md:w-1/3 flex justify-end w-full">
                     <Link href="/programs/security">
                        <Button variant="outline" className="w-full md:w-auto border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-8 py-6 h-auto text-lg">
                            {t("View Security Track", "عرض مسار الأمن", "View Security Track")}
                        </Button>
                    </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* === WEBINAR / BLOG SECTION (Fixed Link) === */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row">
            <div className="md:w-1/2 relative min-h-[300px]">
              <img 
                src={eventImage} 
                alt="Event" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/20"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="bg-red-600 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">LIVE REPLAY</span>
                <h4 className="font-bold text-lg">Hosted by Ahmed Farahat</h4>
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-4 text-slate-900">AGE OF AI: The New Era Begins</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {t("Join us for a deep dive into Generative AI with industry expert Elsayed Ghonaim. Understand the shifts in the software landscape.", "انضم إلينا للتعمق في الذكاء الاصطناعي التوليدي مع الخبير السيد غنيم.", "Join us for a deep dive into Generative AI.")}
              </p>
              <div className="flex gap-4">
                {/* ✅ LINK FIXED: Goes to /blog now */}
                <Link href="/blog">
                    <Button className="bg-slate-900 text-white hover:bg-slate-800">
                    <PlayCircle className="mr-2 h-4 w-4" /> {t("Watch Recording", "شاهد التسجيل", "Watch Recording")}
                    </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS (New Section) === */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">{t("Student Success Stories", "قصص نجاح الطلاب", "Student Success Stories")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                        <div className="flex text-yellow-400 mb-4">
                            {[1,2,3,4,5].map(s => <Award key={s} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-slate-600 italic mb-6">"The Space Technology track was a game changer for me. I never thought I could learn orbital mechanics online with such depth."</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">S</div>
                            <div>
                                <div className="font-bold text-slate-900">Sarah Ahmed</div>
                                <div className="text-xs text-slate-500">Cairo, Egypt</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* === FAQ SECTION (New Section) === */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">{t("Common Questions", "أسئلة شائعة", "FAQ")}</h2>
            <div className="space-y-4 text-left">
                {[
                    {q: "Do I need prior experience?", a: "For our foundation courses, no. For advanced tracks like Space Tech, some math background helps."},
                    {q: "Are the certificates recognized?", a: "Yes, our certificates are recognized by our partners including ZIM Academy."},
                    {q: "How do I access the labs?", a: "All labs are cloud-based. You just need a browser and an internet connection."}
                ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all cursor-pointer">
                        <h4 className="font-bold text-lg mb-2 flex justify-between items-center">
                            {item.q} <ChevronDown className="w-5 h-5 text-slate-400" />
                        </h4>
                        <p className="text-slate-400 text-sm">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

    </div>
  );
}

// Helper component for icons to avoid import errors if not used
function Eye({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
}