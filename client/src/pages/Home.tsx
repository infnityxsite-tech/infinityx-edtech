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

      {/* === STUDENT PROJECTS === */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">{t("What Our Students Build", "ماذا يبني طلابنا", "What Our Students Build")}</h2>
            <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">{t("Real projects solving real problems. This is the output of our training.", "مشاريع حقيقية تحل مشاكل واقعية. هذا هو نتاج تدريبنا.", "Real projects.")}</p>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-xl transition-all">
                    <div className="h-48 bg-slate-200 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors"></div>
                        <Satellite className="w-16 h-16 text-slate-400" />
                    </div>
                    <div className="p-6">
                        <h4 className="font-bold text-lg mb-2">DebrisTracker AI</h4>
                        <p className="text-slate-600 text-sm mb-4">A Deep Learning model that identifies and classifies space debris from raw telescope imagery with 92% accuracy.</p>
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">PYTHON</span>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">TENSORFLOW</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-xl transition-all">
                    <div className="h-48 bg-slate-200 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-green-900/10 group-hover:bg-transparent transition-colors"></div>
                        <Brain className="w-16 h-16 text-slate-400" />
                    </div>
                    <div className="p-6">
                        <h4 className="font-bold text-lg mb-2">AgroVision</h4>
                        <p className="text-slate-600 text-sm mb-4">Computer Vision system for early detection of plant diseases in large-scale farms using drone footage.</p>
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">OPENCV</span>
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">YOLO</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-xl transition-all">
                    <div className="h-48 bg-slate-200 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-transparent transition-colors"></div>
                        <Shield className="w-16 h-16 text-slate-400" />
                    </div>
                    <div className="p-6">
                        <h4 className="font-bold text-lg mb-2">SecureChat</h4>
                        <p className="text-slate-600 text-sm mb-4">End-to-end encrypted messaging platform built with MERN stack and Socket.io for real-time secure comms.</p>
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold">REACT</span>
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold">SOCKET.IO</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

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
                            {feat: t("Instruction Mode", "نظام التعليم", "Instruction Mode"), us: t("Live + Recorded LMS", "مباشر + منصة مسجلة", "Live + Recorded"), them: t("Pre-recorded only", "مسجل فقط", "Recorded only")},
                            {feat: t("Curriculum", "المنهج", "Curriculum"), us: t("Project-Based & AI-Integrated", "قائم على المشاريع ودمج الذكاء الاصطناعي", "Project-Based"), them: t("Theoretical", "نظري", "Theoretical")},
                            {feat: t("Support", "الدعم", "Support"), us: t("Private Mentorship Groups", "مجموعات توجيه خاصة", "Private Mentorship"), them: t("Email Support Only", "دعم عبر البريد فقط", "Email only")},
                            {feat: t("Career", "المسار المهني", "Career"), us: t("Portfolio Building", "بناء معرض أعمال", "Portfolio"), them: t("Certificate Only", "شهادة فقط", "Certificate")},
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