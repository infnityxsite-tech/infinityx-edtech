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
  ChevronDown,
  Video,
  Library,
  MessageCircle,
  Zap,
  Check
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
  const certImage = "https://images.unsplash.com/photo-1589330694653-418b725487c7?auto=format&fit=crop&q=80&w=800"; // Placeholder for certificate

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
            
            {/* Trust Badges */}
            <div className="mt-12 flex items-center gap-6 text-sm text-slate-400 font-medium">
               <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {t("Certified Curriculum", "مناهج معتمدة", "Certified Curriculum")}</div>
               <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {t("Live Mentorship", "توجيه مباشر", "Live Mentorship")}</div>
               <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {t("Project-Based", "قائم على المشاريع", "Project-Based")}</div>
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

      {/* === LEARNING EXPERIENCE (Live + Platform) - NEW SECTION === */}
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
                        {t("Join expert instructors on Google Meet. Ask questions in real-time, code together, and get immediate feedback on your work.", "انضم إلى الخبراء عبر Google Meet. اسأل في الوقت الفعلي، برمج معهم، واحصل على تعليقات فورية.", "Live sessions on Google Meet.")}
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-100 p-8 rounded-2xl text-center hover:shadow-lg transition-all">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Library className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">{t("Dedicated LMS Platform", "منصة تعليمية متكاملة", "Dedicated LMS Platform")}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                        {t("Missed a session? No problem. Access high-quality recordings, slides, source code, and extra resources on our private portal 24/7.", "فاتتك محاضرة؟ لا مشكلة. ادخل إلى التسجيلات، الشرائح، والأكواد المصدرية على بوابتنا الخاصة 24/7.", "Access resources 24/7.")}
                    </p>
                </div>

                <div className="bg-green-50 border border-green-100 p-8 rounded-2xl text-center hover:shadow-lg transition-all">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <MessageCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">{t("Community & Support", "مجتمع ودعم مستمر", "Community & Support")}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                        {t("Join private discord/whatsapp groups for your batch. Collaborate on projects and get unstuck with help from mentors and peers.", "انضم إلى مجموعات خاصة بدفعتك. تعاون في المشاريع واحصل على المساعدة من الموجهين والزملاء.", "Join private community groups.")}
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* === SCHOOLS (Updated Space Logic) === */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t("Specialized Schools", "كليات متخصصة", "Specialized Schools")}
            </h2>
            <p className="text-slate-400 max-w-2xl">
              {t("Curriculum designed for the modern industry demands.", "مناهج مصممة لمتطلبات الصناعة الحديثة.", "Curriculum designed for modern industry.")}
            </p>
          </div>

          <div className="space-y-12">
            
            {/* SPACE TECH (The Star) */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-blue-700/50 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
               <div className="md:w-3/5 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded mb-4">
                        <Rocket className="w-4 h-4" /> {t("FLAGSHIP PROGRAM", "البرنامج الرائد", "FLAGSHIP PROGRAM")}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6">{t("School of Space Technology & AI", "مدرسة تكنولوجيا الفضاء والذكاء الاصطناعي", "School of Space Technology & AI")}</h3>
                    
                    <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                        {t(
                            "We bridge the gap between AI and Orbital Sciences. This is not just simulation—this is applying Deep Learning to solve real challenges in the commercial space sector.",
                            "نحن نجسّر الفجوة بين الذكاء الاصطناعي وعلوم المدارات. هذه ليست مجرد محاكاة، بل تطبيق للتعلم العميق لحل تحديات حقيقية في قطاع الفضاء التجاري.",
                            "Bridging AI and Orbital Sciences."
                        )}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{t("AI for Orbital Debris Mitigation", "الذكاء الاصطناعي للحد من الحطام الفضائي", "AI for Debris")}</span>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{t("Satellite Imagery Analysis (CNNs)", "تحليل صور الأقمار الصناعية", "Satellite Imagery")}</span>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{t("Predictive Maintenance for Space Assets", "الصيانة التنبؤية للأصول الفضائية", "Predictive Maintenance")}</span>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{t("Commercial Space Data Applications", "تطبيقات بيانات الفضاء التجارية", "Commercial Space Data")}</span>
                        </div>
                    </div>
                    
                    <Link href="/programs/space">
                        <Button className="bg-white text-blue-900 hover:bg-blue-50 font-bold">
                            {t("View Space Curriculum", "عرض منهج الفضاء", "View Curriculum")}
                        </Button>
                    </Link>
               </div>
               <div className="md:w-2/5 flex justify-center relative">
                    <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20"></div>
                    <Satellite className="w-64 h-64 text-blue-200 relative z-10 drop-shadow-2xl animate-pulse-slow" />
               </div>
            </div>

            {/* AI & SOFTWARE (Side by Side) */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 hover:border-green-500/50 transition-colors group">
                    <Brain className="w-12 h-12 text-green-500 mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold mb-4 text-white">{t("School of AI & Data", "مدرسة الذكاء الاصطناعي", "School of AI")}</h3>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        {t("From Python fundamentals to advanced Computer Vision. Build smart classifiers that can see and understand the world.", "من أساسيات بايثون إلى الرؤية الحاسوبية المتقدمة. ابنِ مصنفات ذكية يمكنها رؤية وفهم العالم.", "Build smart classifiers.")}
                    </p>
                    <Link href="/programs/ai">
                        <Button variant="link" className="text-green-400 p-0 h-auto group-hover:underline">
                            {t("Explore AI Track", "استكشف مسار الذكاء الاصطناعي", "Explore AI Track")} <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 hover:border-purple-500/50 transition-colors group">
                    <Code className="w-12 h-12 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold mb-4 text-white">{t("Software Engineering", "هندسة البرمجيات", "Software Engineering")}</h3>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        {t("Don't just write code; architect systems. Full-Stack MERN development with a focus on scalability and clean architecture.", "لا تكتب كوداً فقط؛ هندس أنظمة. تطوير MERN كامل مع التركيز على القابلية للتوسع.", "Architect systems.")}
                    </p>
                    <Link href="/programs/software">
                        <Button variant="link" className="text-purple-400 p-0 h-auto group-hover:underline">
                            {t("Explore Software Track", "استكشف مسار البرمجيات", "Explore Software Track")} <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* === STUDENT PROJECTS (Proof of Competence) === */}
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
                        <Lock className="w-16 h-16 text-slate-400" />
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

      {/* === COMPARISON TABLE (Density) === */}
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
                            {feat: t("Space Tech Focus", "التركيز على الفضاء", "Space Tech"), us: t("AI & Commercial Application", "تطبيقات تجارية وذكاء اصطناعي", "AI & Commercial"), them: t("Theory & Simulation", "نظرية ومحاكاة", "Theory only")},
                            {feat: t("Support", "الدعم", "Support"), us: t("Private Mentorship Groups", "مجموعات توجيه خاصة", "Private Mentorship"), them: t("Email Support Only", "دعم عبر البريد فقط", "Email only")},
                            {feat: t("Projects", "المشاريع", "Projects"), us: t("Production-Ready Portfolio", "معرض أعمال جاهز للسوق", "Production Portfolio"), them: t("Basic Tutorials", "دروس أساسية", "Basic Tutorials")},
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

      {/* === FAQ SECTION (Expanded & Specific) === */}
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
                        q: t("Is the Space track just physics simulation?", "هل مسار الفضاء مجرد محاكاة فيزيائية؟", "Space track physics?"), 
                        a: t("No. While we understand orbital mechanics, our main focus is linking this with AI technologies to solve commercial data problems (debris, navigation, imagery).", "لا. بينما نفهم ميكانيكا المدارات، تركيزنا الأساسي هو ربط ذلك بتقنيات الذكاء الاصطناعي لحل مشاكل البيانات التجارية.", "Focus on AI & Commercial.")
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