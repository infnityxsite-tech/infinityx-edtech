import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Brain, Eye, Code, ArrowRight, Shield, Activity, Database, Cpu, Zap, BarChart3, Cloud, CheckCircle2, Layers, Target, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
} as any;

const IconMap: any = { Eye, Database, Cloud, BarChart3, Brain, Code, Cpu, Layers };

export default function Home() {
  const { isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { data: sponsors = [] } = trpc.admin.getActiveSponsors.useQuery(undefined, { staleTime: 1000 * 60 * 10 });
  const { data: hubData } = trpc.admin.getSolutionsHub.useQuery(undefined, { staleTime: 1000 * 60 * 5 });
  const services = hubData?.allServices || [];
  const caseStudies = hubData?.caseStudies || [];

  return (
    <div className={`min-h-screen font-sans ${isRTL ? 'rtl' : 'ltr'} ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#020617] text-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/uploads/Gemini_Generated_Image_3p3go53p3go53p3g.png" alt="Hero" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 ${isLight ? 'bg-white/80' : 'bg-[#020617]/85'}`} />
        </div>
        <div className={`absolute inset-0 pointer-events-none ${isLight ? 'bg-gradient-to-br from-cyan-50/50 via-transparent to-indigo-50/30' : 'bg-gradient-to-br from-cyan-600/10 via-transparent to-purple-600/10'}`} />
        <div className={`absolute inset-0 ${isLight ? 'opacity-[0.04]' : 'opacity-[0.03]'}`} style={{ backgroundImage: `linear-gradient(${isLight ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.1)'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.1)'} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        <div className={`absolute top-1/4 start-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none ${isLight ? 'bg-cyan-200/40' : 'bg-cyan-500/15'}`} />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: isRTL ? 40 : -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-8 ${isLight ? 'bg-cyan-50/80 border-cyan-200' : 'bg-white/[0.03] border-white/[0.08]'}`}>
              <Shield className="w-4 h-4 text-cyan-500" />
              <span className={`font-bold text-xs tracking-wider uppercase ${isLight ? 'text-cyan-800' : 'text-slate-300'}`}>
                {t("Enterprise AI Solutions", "حلول الذكاء الاصطناعي المؤسسية", "Enterprise AI Solutions")}
              </span>
            </div>
            <h1 className={`text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-[1.15] ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t("We Build", "نهندس", "We Build")}<br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                {t("Production AI Systems.", "أنظمة ذكاء اصطناعي جاهزة للإنتاج.", "Production AI.")}
              </span>
            </h1>
            <p className={`text-xl max-w-xl mb-10 leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {t("End-to-end AI and Computer Vision pipelines architected, deployed, and handed over to MENA enterprises. Full IP ownership. Zero vendor lock-in.", "نصمم وننشر ونسلّم أنظمة رؤية حاسوبية وذكاء اصطناعي متكاملة للمؤسسات في منطقة الشرق الأوسط. ملكية فكرية كاملة للعميل — بدون أي تبعية لمورد خارجي.", "AI & CV pipelines for enterprises.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/consultation">
                <Button size="lg" className="h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-10 rounded-xl shadow-lg shadow-cyan-500/25 text-lg w-full sm:w-auto border border-cyan-400/50">
                  {t("Book a Free AI Audit", "احجز استشارة تقنية مجانية", "Book AI Audit")}
                </Button>
              </Link>
              <Link href="/solutions">
                <Button size="lg" variant="outline" className={`h-14 px-10 rounded-xl text-lg font-bold w-full sm:w-auto ${isLight ? 'border-slate-300 text-slate-800 hover:bg-slate-100' : 'border-white/[0.15] text-white hover:bg-white/[0.08]'}`}>
                  {t("Explore Solutions", "اكتشف حلولنا", "Explore Solutions")} <ArrowRight className={`w-5 h-5 ${isRTL ? "me-2 rotate-180" : "ms-2"}`} />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden lg:block">
            <div className={`relative rounded-3xl overflow-hidden border p-2 backdrop-blur-md shadow-2xl ${isLight ? 'bg-white/40 border-white shadow-slate-200/50' : 'bg-white/[0.02] border-white/[0.08]'}`}>
              <div className="grid grid-cols-2 gap-3 h-[500px]">
                <div className="col-span-2 rounded-2xl overflow-hidden relative group h-48">
                  <img src="/uploads/hero_cv_industrial.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="CV Pipeline" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <div className="flex items-center gap-2 mb-2"><Eye className="w-5 h-5 text-cyan-400" /><span className="text-white font-bold">{t("Industrial CV Pipeline", "خط أنابيب الرؤية الحاسوبية الصناعية", "Industrial CV Pipeline")}</span></div>
                    <div className="flex gap-3 text-xs">
                      <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">{t("FPS: 60+", "الإطارات: +٦٠", "FPS: 60+")}</span>
                      <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">{t("Latency: <12ms", "زمن الاستجابة: >١٢مل‌ث", "Latency: <12ms")}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden relative group">
                  <img src="/uploads/hero_analytics_dash.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Analytics" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">{t("Predictive Analytics", "التحليلات التنبؤية", "Predictive Analytics")}</span>
                  </div>
                </div>
                <div className={`rounded-2xl border p-5 flex flex-col justify-center ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0e1a] border-white/[0.08]'}`}>
                  <Activity className="w-8 h-8 text-purple-500 mb-4" />
                  <h4 className={`text-2xl font-black mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>99.8%</h4>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t("Model Accuracy", "دقة النموذج", "Model Accuracy")}</p>
                  <div className={`mt-4 h-2 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 w-[99.8%]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TECH TICKER ═══ */}
      <div className={`border-y py-4 overflow-hidden relative z-20 ${isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-white/[0.08] bg-[#030712]'}`}>
        <div className="relative"><div className="flex gap-8 items-center whitespace-nowrap animate-marquee w-max">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex items-center gap-8 px-4">
              {["Python","TensorFlow","PyTorch","YOLOv11","OpenCV","Docker","AWS","Kubernetes","PostgreSQL","FastAPI","TensorRT","React","Node.js"].map(tech => (
                <div key={`${rep}-${tech}`} className="flex items-center gap-8">
                  <span className={`font-black text-lg tracking-wide uppercase ${isLight ? 'text-slate-400/80' : 'text-slate-500/50'}`}>{tech}</span>
                  <span className={isLight ? 'text-slate-300' : 'text-slate-800'}>•</span>
                </div>
              ))}
            </div>
          ))}
        </div></div>
        <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { animation: marquee 30s linear infinite; }`}</style>
      </div>

      {/* ═══ SERVICES FROM DB ═══ */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t("What We Build", "خدماتنا الهندسية", "What We Build")}
            </h2>
            <p className={`text-xl max-w-2xl font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t("Production-grade AI systems, deployed and handed over with full IP ownership.", "أنظمة ذكاء اصطناعي على مستوى الإنتاج، يتم نشرها وتسليمها مع ملكية فكرية كاملة للعميل.", "Production-grade AI systems.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((svc: any, i: number) => {
              const Icon = IconMap[svc.icon] || Cpu;
              return (
                <motion.div key={svc.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className={`group rounded-3xl border overflow-hidden transition-all ${isLight ? 'bg-white border-slate-200 shadow-lg hover:shadow-xl' : 'bg-[#0a0e1a] border-white/[0.08] hover:border-cyan-500/30'}`}>
                  {svc.hero_image_url && (
                    <div className="h-48 overflow-hidden relative">
                      <img src={svc.hero_image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={svc.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 start-4 flex gap-2">
                        {(svc.techStack || []).slice(0, 3).map((t: string) => (
                          <span key={t} className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 backdrop-blur-md text-white border border-white/20">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isLight ? 'bg-cyan-50 text-cyan-600' : 'bg-cyan-500/10 text-cyan-400'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t(svc.title, svc.title_ar, svc.title)}</h3>
                        <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{svc.deliverableCount} {t("deliverables", "مخرجات", "deliverables")} · {svc.useCaseCount} {t("use cases", "حالات استخدام", "use cases")}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-medium leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {t(svc.problem_statement || svc.description, svc.problem_statement_ar || svc.description_ar, svc.description)}
                    </p>
                    <Link href={`/solutions/${svc.slug}`}>
                      <Button variant="outline" className={`w-full h-11 rounded-xl text-sm font-bold ${isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-50' : 'border-white/[0.15] text-white hover:bg-white/[0.05]'}`}>
                        {t("View Solution Details", "استعرض تفاصيل الحل", "View Details")} <ChevronRight className="w-4 h-4 ms-1" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ ENGAGEMENT MODEL ═══ */}
      <section className={`py-24 border-y ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.04] bg-[#030712]'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-3xl md:text-4xl font-black text-center mb-16 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("How We Work", "كيف نعمل", "How We Work")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: t("1. Discover", "١. الاكتشاف والتحليل", "1. Discover"), desc: t("Technical assessment, feasibility study, and architecture proposal. We map your problem space before writing a single line of code.", "نبدأ بتقييم تقني شامل ودراسة جدوى متعمقة وتصميم معماري دقيق — لا نكتب سطر كود واحد قبل أن نفهم التحدي بالكامل.", "Technical assessment & proposal.") },
              { icon: Code, title: t("2. Build & Deploy", "٢. التطوير والنشر", "2. Build"), desc: t("End-to-end development, model training, system integration, and production deployment with full CI/CD pipelines.", "تطوير شامل من الصفر، تدريب نماذج الذكاء الاصطناعي، تكامل مع الأنظمة القائمة، ونشر في بيئة الإنتاج مع أنابيب CI/CD كاملة.", "Development & deployment.") },
              { icon: Layers, title: t("3. Transfer & Support", "٣. التسليم والدعم المستمر", "3. Transfer"), desc: t("Full source code handover, team training, architectural documentation, and ongoing advisory retainer.", "تسليم الكود المصدري بالكامل، تدريب فريقك على التشغيل والصيانة، توثيق معماري شامل، ودعم استشاري مستمر.", "IP transfer & ongoing support.") },
            ].map((phase, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className={`rounded-3xl p-8 border ${isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-white/[0.02] border-white/[0.08]'}`}>
                <phase.icon className={`w-10 h-10 mb-6 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                <h3 className={`text-2xl font-black mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{phase.title}</h3>
                <p className={`text-sm font-medium leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CASE STUDIES ═══ */}
      {caseStudies.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className={`text-3xl md:text-4xl font-black mb-16 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t("Client Results", "نتائج حققناها لعملائنا", "Client Results")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {caseStudies.slice(0, 3).map((cs: any, i: number) => (
                <motion.div key={cs.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className={`rounded-3xl border overflow-hidden ${isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                  {cs.image_url && (
                    <div className="h-40 overflow-hidden">
                      <img src={cs.image_url} className="w-full h-full object-cover" alt={cs.client_name} />
                    </div>
                  )}
                  <div className="p-6">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>{cs.industry}</span>
                    <h3 className={`text-lg font-bold mt-2 mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{cs.client_name}</h3>
                    <p className={`text-sm mb-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{cs.challenge}</p>
                    {cs.outcome && (
                      <div className={`p-3 rounded-xl border ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                        <span className="text-xs font-bold text-emerald-500 uppercase">{t("Result", "النتيجة", "Result")}</span>
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

      {/* ═══ SPONSORS ═══ */}
      {sponsors.length > 0 && (
        <section className={`py-16 border-y ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.04] bg-[#030712]'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <h2 className={`text-xs font-black text-center mb-8 uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>{t("Trusted By Industry Leaders", "شركاء يثقون بنا", "Trusted By")}</h2>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
              {sponsors.map((s: any) => (
                <a key={s.id} href={s.url || '#'} target="_blank" rel="noopener noreferrer" className={`group block ${!s.url && 'pointer-events-none'}`}>
                  <div className="h-12 flex items-center justify-center opacity-40 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300">
                    <img src={s.logoUrl} alt={s.name} className="max-w-full max-h-full object-contain" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ACADEMY ═══ */}
      <section className={`py-24 border-t ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#030712] border-white/[0.04]'}`}>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6 ${isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
              <Brain className="w-4 h-4" /><span className="font-bold text-xs tracking-wider uppercase">{t("Talent Infrastructure", "بناء الكفاءات التقنية", "Talent")}</span>
            </div>
            <h2 className={`text-4xl font-black mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Infinity X Academy", "أكاديمية إنفينيتي إكس", "Infinity X Academy")}</h2>
            <p className={`text-lg font-medium mb-8 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t("Train your teams to independently operate and scale the AI systems we deploy. Build internal capability, not dependency.", "ندرّب فِرق عملائنا على تشغيل وتوسيع أنظمة الذكاء الاصطناعي التي ننشرها بشكل مستقل — نبني قدرات داخلية حقيقية، لا تبعية خارجية.", "Train teams on deployed systems.")}
            </p>
            <Link href="/academy"><Button size="lg" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25">
              {t("Explore Academy", "استكشف الأكاديمية", "Explore Academy")} <ArrowRight className={`w-5 h-5 ${isRTL ? 'me-2 rotate-180' : 'ms-2'}`} />
            </Button></Link>
          </div>
          <div className={`rounded-3xl p-8 border backdrop-blur-md ${isLight ? 'bg-white shadow-xl border-slate-200' : 'bg-white/[0.02] border-white/[0.08]'}`}>
            <div className="grid grid-cols-2 gap-4">
              {[{ stat: "24+", label: t("Courses", "دورة تدريبية", "Courses") }, { stat: "1,500+", label: t("Students", "متدرب", "Students") }, { stat: "98%", label: t("Completion", "نسبة إتمام", "Completion") }, { stat: "1-on-1", label: t("Mentorship", "إرشاد فردي", "Mentorship") }].map((s, i) => (
                <div key={i} className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/[0.04]'}`}>
                  <p className={`text-2xl font-black mb-1 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>{s.stat}</p>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 pointer-events-none" />
        <div className={`max-w-4xl mx-auto px-6 relative z-10 text-center border p-12 md:p-16 rounded-3xl backdrop-blur-xl shadow-2xl ${isLight ? 'bg-white/80 border-slate-200' : 'bg-white/[0.02] border-white/[0.1]'}`}>
          <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-8" />
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("Ready to Build?", "مستعد لبناء نظامك الذكي؟", "Ready?")}
          </h2>
          <p className={`text-xl mb-10 max-w-2xl mx-auto font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {t("Schedule a technical consultation with our engineering leadership.", "حدّد موعداً لاستشارة تقنية مع فريق القيادة الهندسية لدينا — نبدأ بفهم تحديك قبل أي التزام.", "Schedule consultation.")}
          </p>
          <Link href="/consultation">
            <Button size="lg" className="h-16 px-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl text-xl shadow-xl shadow-cyan-500/25">
              {t("Request Enterprise Proposal", "اطلب مقترحاً مؤسسياً", "Request Proposal")}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}