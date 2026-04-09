import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Loader2, 
  Clock, 
  Wifi, 
  Video, 
  MapPin, 
  Award, 
  ArrowRight,
  BookOpen,
  LayoutGrid,
  CheckCircle2,
  ChevronDown,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SyllabusModal } from "@/components/SyllabusModal";
import { ExternalLink } from "lucide-react";

export default function ProgramDetails() {
  const [, params] = useRoute("/program/:id");
  const programId = params?.id;
  
  const { lang, isRTL, t: _t } = useLanguage();
  const t = (en: string, ar: string) => _t(en, ar, en);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const { data: programData, isLoading } = trpc.admin.getProgramComplete.useQuery(
    { id: programId || "" },
    { enabled: !!programId }
  );

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-[#f0f4f8]' : 'bg-[#0a0e1a]'}`}>
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!programData || !programData.info) {
    return (
      <div className={`min-h-screen ${isLight ? 'bg-[#f0f4f8] text-slate-900' : 'bg-[#0a0e1a] text-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Navigation />
        <div className="pt-40 pb-20 text-center">
          <h1 className="text-3xl font-bold mb-4">{t("Program Not Found", "البرنامج غير موجود")}</h1>
          <Link href="/programs">
            <Button className="bg-cyan-600 text-white border-0">{t("Back to Programs", "العودة للبرامج")}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { info: program, modules } = programData;
  const priceEgp = Number(program.priceEgp);
  const priceUsd = Number(program.priceUsd);
  const skills = program.skills ? program.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

  return (
    <div className={`min-h-screen font-sans ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#0a0e1a] text-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Patterns */}
        <div className={`absolute inset-0 opacity-[0.04] pointer-events-none ${isLight ? '' : 'opacity-10'}`}
          style={{ backgroundImage: `linear-gradient(${isLight ? '#64748b' : '#334155'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#64748b' : '#334155'} 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
        
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-40 left-0 -ml-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
              ${isLight ? 'bg-cyan-100 text-cyan-800' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
              <Award className="w-4 h-4" />
              <span>{t("Master Program", "برنامج ماجستير")}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {t(program.title, program.titleAr)}
            </h1>
            
            <p className={`text-lg md:text-xl font-light leading-relaxed max-w-2xl
              ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t(program.description, program.descriptionAr)}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {program.duration && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  ${isLight ? 'bg-white shadow-sm border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                  <Clock className="w-4 h-4 text-cyan-500" />
                  <span>{program.duration}</span>
                </div>
              )}
              {program.deliveryMode && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  ${isLight ? 'bg-white shadow-sm border border-slate-200' : 'bg-white/5 border border-white/10'}`}>
                  {program.deliveryMode === 'Live' || program.deliveryMode === 'Hybrid' ? (
                     <Wifi className="w-4 h-4 text-emerald-500" />
                  ) : (
                     <Video className="w-4 h-4 text-purple-500" />
                  )}
                  <span>{program.deliveryMode}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6">
              <Link href={`/apply?programId=${program.id}&programName=${encodeURIComponent(program.title)}`}>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white h-14 px-8 text-lg font-bold rounded-xl shadow-lg shadow-cyan-500/25 border-0">
                  {t("Apply Now", "قدم الآن")} <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              </Link>
            </div>
          </div>

          {program.imageUrl && (
            <div className="w-full md:w-5/12 perspective-1000">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img src={program.imageUrl} alt={program.title} className="w-full h-auto object-cover aspect-[4/3]" />
                <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                   {skills.slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-1 rounded bg-black/50 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider">
                         {skill}
                      </span>
                   ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CURRICULUM TIMELINE SECTION */}
      <section className="py-16 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <LayoutGrid className="w-8 h-8 text-cyan-500" />
              {t("Program Curriculum", "منهج البرنامج")}
            </h2>
            <p className={`mt-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t("A structured learning path designed for mastery. Step by step.", "مسار تعليمي منظم مصمم للوصول بك إلى الاحتراف. خطوة بخطوة.")}
            </p>
          </div>

          <div className="relative">
            {/* Main Vertical Timeline Line */}
            <div className="absolute left-6 md:left-8 top-8 bottom-8 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/20 to-transparent z-0 hidden md:block" />

            <div className="space-y-6 md:space-y-10 relative z-10">
              {modules.length === 0 ? (
                <div className={`text-center py-12 rounded-2xl border border-dashed ${isLight ? 'bg-white border-slate-300' : 'bg-slate-800/30 border-slate-700'}`}>
                  <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
                  <p className="text-slate-500">{t("Modules are being prepared for this program.", "جاري إعداد الوحدات لهذا البرنامج.")}</p>
                </div>
              ) : (
                modules.map((mod: any, index: number) => {
                  const isExpanded = expandedModules[mod.id] ?? true; // Default expanded

                  return (
                    <div key={mod.id} className="relative md:pl-20">
                      {/* Timeline Node */}
                      <div className="absolute left-6 top-8 w-4 h-4 rounded-full border-[3px] border-[#0a0e1a] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] z-20 hidden md:block" />
                      
                      {/* Step Number Badge */}
                      <div className={`absolute left-0 top-6 w-12 text-center text-xs font-black tracking-widest uppercase hidden md:block
                        ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                        M{String(index + 1).padStart(2, '0')}
                      </div>

                      {/* Module Card */}
                      <div className={`rounded-2xl transition-all duration-300 overflow-hidden border shadow-sm
                        ${isLight 
                          ? 'bg-white border-slate-200 shadow-slate-200/50 hover:shadow-md' 
                          : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700/80 backdrop-blur-sm'}`}>
                        
                        <Collapsible open={isExpanded} onOpenChange={() => toggleModule(mod.id)}>
                          <div className={`p-5 md:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 cursor-pointer hover:bg-black/[0.02] transition-colors`}
                               onClick={() => toggleModule(mod.id)}>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded
                                  ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'}`}>
                                  {t("Module", "وحدة")} {index + 1}
                                </span>
                                {mod.duration && (
                                  <span className={`text-[10px] font-semibold flex items-center gap-1
                                    ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <Clock className="w-3 h-3" /> {mod.duration}
                                  </span>
                                )}
                              </div>
                              <h3 className={`text-xl font-bold mb-2 leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                {mod.title}
                              </h3>
                              {mod.description && (
                                <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                                  {mod.description}
                                </p>
                              )}
                            </div>

                            <div className="flex-shrink-0 mt-2 md:mt-0">
                               <Button variant="ghost" size="icon" className={`rounded-full ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}>
                                 <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                               </Button>
                            </div>
                          </div>

                          <CollapsibleContent>
                            <div className={`p-5 md:p-6 pt-0 border-t border-dashed mx-6 mt-2 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                              
                              <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 pt-4 flex items-center gap-2
                                ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                                <BookOpen className="w-3.5 h-3.5" />
                                {t("Courses in this Module", "الدورات في هذه الوحدة")}
                              </h4>

                              <div className="space-y-3">
                                {(!mod.courses || mod.courses.length === 0) ? (
                                  <p className="text-sm text-slate-500 italic">{t("No courses attached yet.", "لا توجد دورات مرفقة بعد.")}</p>
                                ) : (
                                  mod.courses.map((course: any, cIdx: number) => (
                                    <div key={course.junctionId} 
                                         className={`flex flex-col sm:flex-row items-stretch sm:items-center p-3 rounded-xl gap-4 transition-all
                                           ${isLight 
                                             ? 'bg-slate-50 border border-slate-200 hover:border-cyan-300' 
                                             : 'bg-black/20 border border-white/5 hover:border-white/10'}`}>
                                      
                                      {/* Course Image Thumbnail */}
                                      <div className="w-full sm:w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800 relative">
                                        {course.imageUrl ? (
                                          <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full bg-gradient-to-br from-cyan-900 to-blue-900 flex items-center justify-center">
                                            <BookOpen className="w-5 h-5 text-white/30" />
                                          </div>
                                        )}
                                        {/* Status badge */}
                                        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                      </div>

                                      {/* Course Info */}
                                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h5 className={`font-semibold text-sm sm:text-base leading-tight mb-1 truncate ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                                          {course.title}
                                        </h5>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                          {course.duration && (
                                            <span className="flex items-center gap-1.5 font-medium"><Clock className="w-3 h-3" /> {course.duration}</span>
                                          )}
                                          {course.level && (
                                            <span className="flex items-center gap-1.5 font-medium"><Award className="w-3 h-3" /> {course.level}</span>
                                          )}
                                          {course.courseType && (
                                            <span className="flex items-center gap-1.5 font-medium">
                                              {course.courseType === 'Live' ? <Wifi className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                                              {course.courseType}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Action button inside course */}
                                      <div className="flex-shrink-0 flex items-center justify-end sm:justify-center pr-2 gap-2">
                                         {course.courseLink && (
                                           <SyllabusModal
                                             courseTitle={course.title}
                                             courseLink={course.courseLink}
                                             trigger={
                                                <Button variant="ghost" size="sm" className={`text-xs h-8 px-3 rounded-full ${isLight ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-amber-500/10 text-amber-400'}`}>
                                                  {t("Syllabus", "المنهج")} <ExternalLink className={`w-3 h-3 ${isRTL ? 'mr-1' : 'ml-1'}`} />
                                                </Button>
                                             }
                                           />
                                         )}
                                         <Link href={`/apply?courseId=${course.courseId}&courseName=${encodeURIComponent(course.title)}`}>
                                            <Button variant="ghost" size="sm" className={`text-xs h-8 pl-3 pr-2 rounded-full ${isLight ? 'hover:bg-cyan-50 text-cyan-600' : 'hover:bg-cyan-500/10 text-cyan-400'}`}>
                                              {t("Enroll", "تسجيل")} <ChevronDown className={`w-3 h-3 ${isRTL ? 'mr-1 rotate-90' : 'ml-1 -rotate-90'}`} />
                                            </Button>
                                         </Link>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING ENROLLMENT CTA */}
      <section className={`py-16 mt-8 border-t ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/30'}`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">{t("Invest in Your Future", "استثمر في مستقبلك")}</h2>
          
          <div className="flex justify-center items-end gap-3 mb-8">
            {priceEgp > 0 && (
              <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
                {priceEgp.toLocaleString()} <span className="text-xl font-bold text-slate-500">EGP</span>
              </div>
            )}
            {priceEgp > 0 && priceUsd > 0 && <span className="text-lg text-slate-500 mx-2">/</span>}
            {priceUsd > 0 && (
              <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                ${priceUsd.toLocaleString()} <span className="text-xl font-bold text-slate-500">USD</span>
              </div>
            )}
            {priceEgp === 0 && priceUsd === 0 && (
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-500">Free</div>
            )}
          </div>

          <Link href={`/apply?programId=${program.id}&programName=${encodeURIComponent(program.title)}`}>
            <Button className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white h-14 px-12 text-lg font-bold rounded-xl shadow-lg shadow-cyan-500/25 border-0">
              {t("Start Application Process", "ابدأ عملية التسجيل")} <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
          </Link>
          <p className={`mt-4 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {t("Seats are limited. Applications are reviewed on a rolling basis.", "المقاعد محدودة. يتم مراجعة الطلبات بشكل دوري.")}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
