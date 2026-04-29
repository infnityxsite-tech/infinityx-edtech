import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { Brain, Eye, Code, ArrowRight, CheckCircle, Database, Cpu, Globe, Zap, Shield, Layers, Cloud, ChevronRight, Loader2, BarChart3, Target, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
} as any;

const IconMap: any = { Eye, Database, Cloud, BarChart3, Brain, Code, Cpu, Layers };

export default function Solutions() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { data: hubData, isLoading } = trpc.admin.getSolutionsHub.useQuery(undefined, { staleTime: 1000 * 60 * 5 });
  const services = hubData?.allServices || [];
  const caseStudies = hubData?.caseStudies || [];
  const utils = trpc.useUtils();

  return (
    <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"} ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#020617] text-white'}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/uploads/solutions_hub_header.png" className="w-full h-full object-cover" alt="Solutions" />
          <div className={`absolute inset-0 ${isLight ? 'bg-white/85' : 'bg-[#020617]/88'}`} />
        </div>
        <div className={`absolute inset-0 ${isLight ? 'opacity-[0.04]' : 'opacity-[0.03]'}`} style={{ backgroundImage: `linear-gradient(${isLight ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.1)'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.1)'} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-8 ${isLight ? 'bg-cyan-50 border-cyan-200' : 'bg-white/[0.03] border-white/[0.08]'}`}>
              <Layers className="w-4 h-4 text-cyan-500" />
              <span className={`font-bold text-xs tracking-wider uppercase ${isLight ? 'text-cyan-800' : 'text-slate-400'}`}>
                {t("Enterprise Solutions", "الحلول المؤسسية", "Enterprise Solutions")}
              </span>
            </div>
            <h1 className={`text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t("Our Solutions", "حلولنا الهندسية", "Solutions")}
            </h1>
            <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-10 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t("Production-grade AI and software systems, each backed by dedicated engineering teams, comprehensive deliverables, and structured engagement models.", "أنظمة ذكاء اصطناعي وبرمجيات على مستوى الإنتاج — مدعومة بفرق هندسية متخصصة، مخرجات تفصيلية، ونماذج تعاقد منظمة.", "Production-grade AI and software systems.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className={`py-24 ${isLight ? 'bg-white' : ''}`}>
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-cyan-500" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((svc: any, i: number) => {
                const Icon = IconMap[svc.icon] || Cpu;
                return (
                  <motion.div key={svc.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    onMouseEnter={() => { if (svc.slug) utils.admin.getSolutionBySlug.prefetch({ slug: svc.slug }, { staleTime: 1000 * 60 * 5 }); }}
                    className={`rounded-3xl border overflow-hidden group transition-all ${isLight ? 'bg-white border-slate-200 shadow-lg hover:shadow-2xl' : 'bg-[#0a0e1a] border-white/[0.08] hover:border-cyan-500/30'}`}>
                    
                    {/* Hero Image */}
                    <div className="h-56 overflow-hidden relative">
                      <img src={svc.hero_image_url || '/uploads/hero_ai_neural.png'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={svc.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute top-4 end-4">
                        <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md ${isLight ? 'bg-white/90 text-slate-700' : 'bg-black/50 text-white border border-white/20'}`}>
                          {svc.price_tier || "Enterprise"}
                        </span>
                      </div>
                      <div className="absolute bottom-4 start-4 end-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-extrabold text-white drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{t(svc.title, svc.title_ar, svc.title)}</h3>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {(svc.techStack || []).slice(0, 4).map((tech: string) => (
                            <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 backdrop-blur-md text-white border border-white/15">{tech}</span>
                          ))}
                          {(svc.techStack || []).length > 4 && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">+{svc.techStack.length - 4}</span>}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8">
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                        {svc.deliverableCount || 0} {t("deliverables", "مخرجات", "deliverables")} · {svc.useCaseCount || 0} {t("use cases", "حالات استخدام", "use cases")}
                      </p>
                      <p className={`text-sm font-medium leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {t(svc.problem_statement || svc.description, svc.problem_statement_ar || svc.description_ar, svc.description)}
                      </p>
                      
                      {/* Stats */}
                      <div className={`grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/[0.04]'}`}>
                        <div>
                          <p className={`text-lg font-black ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>{svc.deliverableCount || 0}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{t("Deliverables", "مخرجات مستلمة", "Deliverables")}</p>
                        </div>
                        <div>
                          <p className={`text-lg font-black ${isLight ? 'text-purple-600' : 'text-purple-400'}`}>{svc.useCaseCount || 0}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{t("Use Cases", "حالات الاستخدام", "Use Cases")}</p>
                        </div>
                      </div>
                      
                      <Link href={`/solutions/${svc.slug}`}>
                        <Button variant="outline" className={`w-full h-12 rounded-xl text-sm font-bold ${isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-50' : 'border-white/[0.15] text-white hover:bg-white/[0.05]'}`}>
                          {t("View Full Solution", "استعرض الحل بالتفصيل", "View Solution")} <ArrowRight className="ms-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Case Studies */}
      {caseStudies.length > 0 && (
        <section className={`py-24 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.04] bg-[#030712]'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <h2 className={`text-3xl md:text-4xl font-black text-center mb-16 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t("Client Results", "نتائج حققناها لعملائنا", "Client Results")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {caseStudies.map((cs: any, i: number) => (
                <motion.div key={cs.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className={`rounded-3xl border overflow-hidden ${isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                  {cs.image_url && <div className="h-40 overflow-hidden"><img src={cs.image_url} className="w-full h-full object-cover" alt={cs.client_name} /></div>}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-4 h-4 text-cyan-500" />
                      <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{cs.industry}</span>
                    </div>
                    <h3 className={`text-lg font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{cs.client_name}</h3>
                    <div className={`p-3 rounded-xl border mb-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/[0.04]'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">{t("Challenge", "التحدي", "Challenge")}</span>
                      <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{cs.challenge}</p>
                    </div>
                    {cs.outcome && (
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">{t("Result", "النتيجة", "Result")}</span>
                        <p className={`text-sm mt-1 font-medium ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>{cs.outcome}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={`py-32 border-t relative overflow-hidden ${isLight ? 'border-slate-200' : 'border-white/[0.04]'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Shield className="w-16 h-16 text-cyan-500 mx-auto mb-8" />
            <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t("Start Your Project", "ابدأ مشروعك الآن", "Start Project")}
            </h2>
            <p className={`text-xl mb-10 font-medium max-w-2xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t("Request a custom proposal. Our architects will review your requirements within 24 hours.", "اطلب مقترحاً تقنياً مخصصاً لمشروعك. فريقنا الهندسي سيراجع متطلباتك خلال ٢٤ ساعة.", "Request custom proposal.")}
            </p>
            <Link href="/consultation">
              <Button size="lg" className="h-16 px-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl text-xl shadow-xl shadow-cyan-500/25 hover:-translate-y-1 transition-all">
                {t("Request Enterprise Proposal", "اطلب مقترحاً مؤسسياً", "Request Proposal")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
