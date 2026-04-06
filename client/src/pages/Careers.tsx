import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Rocket, 
  Heart, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Globe,
  Zap
} from "lucide-react";
import { useLocation, Link } from "wouter";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Careers() {
  const { data: jobs = [], isLoading } = trpc.admin.getJobListings.useQuery(); 
  const [location, navigate] = useLocation();
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen font-sans ${isLight ? 'bg-[#f0f4f8] text-slate-900' : 'bg-[#0a0e1a] text-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* 🏛️ HERO SECTION */}
      <section className={`relative pt-36 pb-24 overflow-hidden ${isLight ? '' : 'bg-[#0b1120] text-white'}`}>
        {/* Tech Grid Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>
        
        {/* Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 ${isLight ? 'bg-emerald-100 border border-emerald-200 text-emerald-700' : 'bg-emerald-900/40 border border-emerald-700/50 text-emerald-300'}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("We are hiring!", "نحن نوظف!", "We are hiring!")}</span>
          </div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("Build the Future of ", "ابنِ مستقبل ", "Build the Future of ")}<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{t("EdTech.", "التعليم التقني.", "EdTech.")}</span>
          </h1>
          
          <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed font-light ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {t("Join a team of innovators, engineers, and educators dedicated to transforming how the world learns Artificial Intelligence and Space Tech.", "انضم إلى فريق من المبتكرين والمهندسين والمعلمين المكرسين لتحويل طريقة تعلم العالم للذكاء الاصطناعي وتكنولوجيا الفضاء.", "Join our team.")}
          </p>

          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-full px-8" onClick={() => {
                document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth' });
            }}>
                {t("View Open Roles", "عرض الوظائف المتاحة", "View Open Roles")}
            </Button>
          </div>
        </div>
      </section>

      {/* 🌟 CULTURE / VALUES SECTION */}
      <section className="py-20 relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Value 1 */}
                <Card className={`border p-0 gap-0 ${isLight ? 'border-slate-200 bg-white/80' : 'border-white/[0.06] bg-[#0d1225]/80 backdrop-blur-xl'}`}>
                    <CardContent className="p-8 text-center">
                        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
                            <Rocket className="w-7 h-7" />
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Innovation First", "الابتكار أولاً", "Innovation First")}</h3>
                        <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            {t("We don't just teach tech; we build it. Work with cutting-edge AI, Satellite Data, and modern stacks.", "لا نعلّم التكنولوجيا فحسب، بل نبنيها. اعمل مع أحدث تقنيات الذكاء الاصطناعي وبيانات الأقمار الصناعية.", "We build tech.")}
                        </p>
                    </CardContent>
                </Card>

                <Card className={`border p-0 gap-0 ${isLight ? 'border-slate-200 bg-white/80' : 'border-white/[0.06] bg-[#0d1225]/80 backdrop-blur-xl'}`}>
                    <CardContent className="p-8 text-center">
                        <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Collaborative Culture", "ثقافة تعاونية", "Collaborative Culture")}</h3>
                        <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            {t("No silos. Engineers, instructors, and designers work together to create world-class experiences.", "لا حواجز. المهندسون والمدربون والمصممون يعملون معاً لإنشاء تجارب عالمية.", "Work together.")}
                        </p>
                    </CardContent>
                </Card>

                <Card className={`border p-0 gap-0 ${isLight ? 'border-slate-200 bg-white/80' : 'border-white/[0.06] bg-[#0d1225]/80 backdrop-blur-xl'}`}>
                    <CardContent className="p-8 text-center">
                        <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-400">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("High Impact", "تأثير كبير", "High Impact")}</h3>
                        <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            {t("Your code and content will directly impact thousands of students launching their careers.", "الكود والمحتوى الذي تنشئه سيؤثر مباشرة على آلاف الطلاب في انطلاق مسيرتهم المهنية.", "Direct impact.")}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </section>

      {/* 📋 JOB LISTINGS */}
      <section id="open-roles" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
            <div>
                <h2 className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Open Positions", "الوظائف المتاحة", "Open Positions")}</h2>
                <p className={`mt-2 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{t("Find your next challenge.", "اعثر على تحديك القادم.", "Find your next challenge.")}</p>
            </div>
        </div>

        {isLoading ? (
          <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0d1225]/80 border-white/[0.06]'}`}>
            <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mb-4" />
            <p className="text-slate-500 font-medium">Loading opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className={`text-center py-24 rounded-2xl border border-dashed ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#0d1225]/80 border-white/[0.06]'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isLight ? 'bg-slate-200' : 'bg-white/[0.04]'}`}>
              <Briefcase className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className={`text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("No open roles right now", "لا توجد وظائف شاغرة حالياً", "No open roles")}</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              {t("We are currently fully staffed, but we are always looking for talent. Check back soon or email us your resume.", "فريقنا مكتمل حالياً، لكننا دائماً نبحث عن المواهب. تحقق لاحقاً أو أرسل سيرتك الذاتية.", "Check back soon.")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job: any) => (
              <div 
                key={job.id}
                className={`group backdrop-blur-xl rounded-xl border p-6 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 ${isLight ? 'bg-white border-slate-200 hover:shadow-emerald-900/5' : 'bg-[#0d1225]/80 border-white/[0.06] hover:shadow-emerald-900/10'}`}
              >
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-xl font-bold group-hover:text-emerald-400 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {job.title}
                        </h3>
                        {job.type && (
                            <Badge variant="secondary" className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-normal">
                                {job.type}
                            </Badge>
                        )}
                    </div>
                    
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4 max-w-2xl">
                        {job.description || "Join our team to help build the next generation of education technology."}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        {job.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {job.location}
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{t("Posted Recently", "نُشر مؤخراً", "Posted Recently")}</span>
                        </div>
                    </div>
                </div>

                <div className="shrink-0">
                    <Button 
                        onClick={() => navigate(`/careers/apply`)}
                        className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-medium px-6 py-2 h-10 transition-colors rounded-xl shadow-lg shadow-emerald-500/20"
                    >
                        {t("Apply Now", "قدّم الآن", "Apply Now")}
                    </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 📧 CTA SECTION */}
      <section className={`py-24 text-center mt-12 relative overflow-hidden ${isLight ? 'bg-slate-100 text-slate-900 border-t border-slate-200' : 'bg-[#020617] text-white'}`}>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Badge variant="outline" className={`mb-6 px-3 py-1 ${isLight ? 'border-emerald-300 text-emerald-600' : 'border-emerald-500/50 text-emerald-400'}`}>{t("General Application", "تقديم عام", "General Application")}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{t("Don't see the right fit?", "لم تجد الوظيفة المناسبة؟", "Don't see the right fit?")}</h2>
          <p className={`mb-8 text-lg max-w-xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {t("We are always growing. Send us your portfolio and CV, and we'll keep you in mind for future roles.", "نحن في نمو دائم. أرسل لنا ملفك وسيرتك الذاتية، وسنضعك في الاعتبار للأدوار المستقبلية.", "Send us your CV.")}
          </p>
          <Button 
            onClick={() => navigate("/contact")}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 shadow-lg shadow-emerald-900/50"
          >
            {t("Contact Recruitment Team", "تواصل مع فريق التوظيف", "Contact Recruitment")} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}