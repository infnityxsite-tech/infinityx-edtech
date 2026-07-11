import { useState } from "react";
import { useRoute, Link } from "wouter";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Rocket, Brain, Code, Shield, ArrowRight, BookOpen, Clock, Wifi, Video,
  ChevronDown, ChevronRight, Loader2, Layers
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";

// === SCHOOL META ===
const schoolMeta: Record<string, { title: string; titleAr: string; description: string; color: string; icon: any; gradient: string }> = {
  space: {
    title: "School of Space Technology",
    titleAr: "مدرسة تكنولوجيا الفضاء",
    description: "The region's premier program for Autonomous Systems, Satellite Data Analysis, and Earth Observation AI.",
    color: "blue", icon: Rocket, gradient: "from-blue-600 to-cyan-500",
  },
  ai: {
    title: "School of AI & Data Science",
    titleAr: "مدرسة الذكاء الاصطناعي وعلوم البيانات",
    description: "Master the algorithms shaping the future. From Computer Vision to Predictive Analytics and Large Language Models.",
    color: "green", icon: Brain, gradient: "from-emerald-600 to-teal-500",
  },
  software: {
    title: "School of Software Engineering",
    titleAr: "مدرسة هندسة البرمجيات",
    description: "Build scalable, robust systems. Full-stack development with a focus on cloud architecture and microservices.",
    color: "purple", icon: Code, gradient: "from-purple-600 to-indigo-500",
  },
  security: {
    title: "School of Cybersecurity",
    titleAr: "مدرسة الأمن السيبراني",
    description: "Defend against the threats of tomorrow. Ethical hacking, penetration testing, and SOC analysis.",
    color: "red", icon: Shield, gradient: "from-red-600 to-rose-500",
  },
};

const CATEGORY_SEO: Record<string, { title: string; description: string }> = {
  space: {
    title: "School of Space Technology — Programs",
    description: "Explore our Space Technology programs: Autonomous Systems, Satellite Data Analysis, and Earth Observation AI. The region's premier space tech curriculum.",
  },
  ai: {
    title: "School of AI & Data Science — Programs",
    description: "Master AI, Machine Learning, Computer Vision, and Predictive Analytics with structured learning paths from beginner to expert.",
  },
  software: {
    title: "School of Software Engineering — Programs",
    description: "Build scalable, robust systems with our Full-Stack, Cloud Architecture, and Microservices engineering programs.",
  },
  security: {
    title: "School of Cybersecurity — Programs",
    description: "Learn ethical hacking, penetration testing, and SOC analysis. Defend against tomorrow's threats with our Cybersecurity programs.",
  },
};

export default function SchoolLanding() {
  const [, params] = useRoute("/programs/:category");
  const category = params?.category || "space";
  const meta = schoolMeta[category] || schoolMeta.space;
  const IconComponent = meta.icon;

  const { lang, isRTL, t: _t } = useLanguage();
  const t = (en: string, ar: string) => _t(en, ar, en);

  const { data: allPrograms = [], isLoading } = trpc.admin.getPrograms.useQuery();
  const programs = (allPrograms as any[]).filter((p: any) => p.category === category);

  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

  const seoMeta = CATEGORY_SEO[category] || CATEGORY_SEO.space;
  useSEO({
    title: seoMeta.title,
    description: seoMeta.description,
    canonical: `https://infx.space/programs/${category}`,
  });

  return (
    <div className={`min-h-screen bg-[#0a0e1a] text-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* === HERO === */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br ${meta.gradient} opacity-[0.08] blur-[120px] rounded-full pointer-events-none`} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            {t(meta.title, meta.titleAr)}
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed">
            {meta.description}
          </p>
        </div>
      </section>

      {/* === PROGRAMS ROADMAP === */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {t("Learning Paths", "مسارات التعلم")}
            </h2>
            <p className="text-slate-500 text-sm">{t("Structured programs designed to take you from beginner to expert.", "برامج منظمة لأخذك من المبتدئ إلى الخبير.")}</p>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-slate-500 mx-auto mb-3" />
              <p className="text-slate-500">Loading programs...</p>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-700 rounded-2xl bg-slate-900/50">
              <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-400 mb-1">{t("No Programs Yet", "لا يوجد برامج بعد")}</h3>
              <p className="text-sm text-slate-600">{t("Programs for this school are coming soon.", "برامج هذه المدرسة قادمة قريباً.")}</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent" />

              <div className="space-y-6">
                {programs.map((program: any, idx: number) => {
                  const isExpanded = expandedProgram === String(program.id);
                  const priceEgp = Number(program.priceEgp);
                  const priceUsd = Number(program.priceUsd);
                  const skills = program.skills ? program.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

                  return (
                    <div key={program.id} className="relative pl-16 md:pl-20">
                      {/* Timeline node */}
                      <div className={`absolute left-4 md:left-6 w-4 h-4 rounded-full border-2 border-slate-600 bg-slate-900 top-6 z-10 
                        ${isExpanded ? `bg-gradient-to-br ${meta.gradient} border-transparent shadow-lg` : ""}`} />
                      {/* Step number */}
                      <span className="absolute left-0 md:left-1 top-5 text-[10px] font-bold text-slate-600">{String(idx + 1).padStart(2, '0')}</span>

                      <div className={`bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-sm
                        ${isExpanded ? "border-slate-600/80 shadow-lg" : "hover:border-slate-600/50"}`}>

                        {/* Header */}
                        <button
                          onClick={() => setExpandedProgram(isExpanded ? null : String(program.id))}
                          className="w-full text-left p-5 md:p-6 flex items-start gap-4"
                        >
                          {program.imageUrl ? (
                            <img src={program.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-700" />
                          ) : (
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center flex-shrink-0 opacity-60`}>
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base md:text-lg font-bold text-white mb-1 group-hover:text-white/90">{program.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              {program.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {program.duration}</span>}
                              {program.deliveryMode && <span className="flex items-center gap-1">
                                {program.deliveryMode === 'Live' ? <Wifi className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                                {program.deliveryMode}
                              </span>}
                              {priceEgp > 0 && <span className="text-emerald-400 font-semibold">{priceEgp.toLocaleString()} EGP</span>}
                              {priceUsd > 0 && <span className="text-emerald-400 font-semibold">${priceUsd.toLocaleString()}</span>}
                              {priceEgp === 0 && priceUsd === 0 && <span className="text-emerald-400 font-semibold">Free</span>}
                            </div>
                            {program.description && (
                              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{program.description}</p>
                            )}
                          </div>
                          <div className="flex-shrink-0 mt-1">
                            {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                          </div>
                        </button>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t border-slate-700/50 px-5 md:px-6 pb-5 md:pb-6 pt-4">
                            {/* Skills */}
                            {skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {skills.map((skill: string, i: number) => (
                                  <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600/50">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Pricing breakdown */}
                            <div className="bg-slate-900/60 rounded-xl p-4 mb-4 border border-slate-700/30">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Pricing</h4>
                              <div className="flex items-baseline gap-4">
                                {priceEgp > 0 && (
                                  <div>
                                    <span className="text-2xl font-extrabold text-white">{priceEgp.toLocaleString()}</span>
                                    <span className="text-xs text-slate-500 ml-1">EGP</span>
                                  </div>
                                )}
                                {priceUsd > 0 && (
                                  <div>
                                    <span className="text-2xl font-extrabold text-white">${priceUsd.toLocaleString()}</span>
                                    <span className="text-xs text-slate-500 ml-1">USD</span>
                                  </div>
                                )}
                                {priceEgp === 0 && priceUsd === 0 && (
                                  <span className="text-2xl font-extrabold text-emerald-400">Free</span>
                                )}
                              </div>
                            </div>

                            {/* CTA */}
                            <div className="flex gap-4">
                              <Link href={`/program/${program.id}`} className="flex-1">
                                <Button variant="outline" className={`w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white h-10 font-medium text-sm rounded-xl`}>
                                  {t("View Details", "عرض التفاصيل")}
                                </Button>
                              </Link>
                              <Link href={`/apply?programId=${program.id}&programName=${encodeURIComponent(program.title)}`} className="flex-1">
                                <Button className={`w-full bg-gradient-to-r ${meta.gradient} text-white h-10 font-semibold text-sm rounded-xl shadow-sm`}>
                                  {t("Apply Now", "قدّم الآن")} <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* === CTA === */}
      <section className="py-16 border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("Ready to Begin?", "مستعد للبدء؟")}</h2>
          <p className="text-slate-500 text-sm mb-6">{t("Applications are open. Secure your spot in the next cohort.", "باب التقديم مفتوح. احجز مقعدك.")}</p>
          <Link href="/programs">
            <Button className={`bg-gradient-to-r ${meta.gradient} text-white px-8 py-5 text-sm font-semibold rounded-xl`}>
              {t("View All Programs", "عرض كل البرامج")} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}