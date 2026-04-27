import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, Brain, Eye, Code, CheckCircle, Cpu, BarChart3, Database, Cloud, Loader2, Target, Package, MessageCircle, ChevronDown, Image, Globe, Layers, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const IconMap: any = { Eye, Database, Cloud, BarChart3, Brain, Code, Cpu, Layers };

export default function SolutionDetail() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [, params] = useRoute("/solutions/:slug");
  const slug = params?.slug || "ai";
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { data: solution, isLoading } = trpc.admin.getSolutionBySlug.useQuery({ slug }, { staleTime: 1000 * 60 * 5 });

  if (isLoading) return (
    <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-[#f8fafc]' : 'bg-[#020617]'}`}>
      <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
    </div>
  );

  if (!solution) return (
    <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-[#f8fafc]' : 'bg-[#020617]'}`}>
      <div className="text-center">
        <h1 className={`text-4xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Solution Not Found</h1>
        <Link href="/solutions"><Button className="bg-cyan-600 text-white">Back to Solutions</Button></Link>
      </div>
    </div>
  );

  const Icon = IconMap[solution.icon] || Cpu;
  const deliverables = solution.deliverables || [];
  const useCases = solution.useCases || [];
  const techStack = solution.techStack || [];
  const gallery = solution.gallery || [];
  const faq = solution.faq || [];
  const pricingModels = solution.pricingModels || [];
  const caseStudies = solution.relatedCaseStudies || [];

  return (
    <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"} ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#020617] text-white'}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />

      {/* 1. HERO */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={solution.hero_image_url || '/uploads/hero_ai_neural.png'} className="w-full h-full object-cover" alt={solution.title} />
          <div className={`absolute inset-0 ${isLight ? 'bg-white/80' : 'bg-[#020617]/85'}`} />
        </div>
        <div className={`absolute inset-0 ${isLight ? 'opacity-[0.04]' : 'opacity-[0.03]'}`} style={{ backgroundImage: `linear-gradient(${isLight ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.1)'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.1)'} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/solutions">
              <span className={`inline-flex items-center gap-1.5 text-sm mb-8 cursor-pointer ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}>
                <ArrowLeft className="w-4 h-4" /> {t("Back to Solutions", "العودة إلى الحلول", "Back")}
              </span>
            </Link>
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 ${isLight ? 'bg-cyan-50 border border-cyan-200 text-cyan-700' : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'}`}>
              <Icon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{solution.category_name || "Enterprise Solution"}</span>
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t(solution.title, solution.title_ar, solution.title)}
            </h1>
            <p className={`text-lg max-w-3xl leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t(solution.description, solution.description_ar, solution.description)}
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link href="/consultation">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-6 rounded-xl shadow-lg">
                  {t("Request Proposal", "اطلب مقترحاً تقنياً", "Request Proposal")} <ArrowRight className="ms-2 w-5 h-5" />
                </Button>
              </Link>
              <div className="flex gap-3">
                <div className={`px-4 py-2 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-white/[0.03] border-white/[0.08]'}`}>
                  <span className={`text-lg font-black ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>{deliverables.length}</span>
                  <span className={`text-xs ms-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t("Deliverables", "مخرجات", "Deliverables")}</span>
                </div>
                <div className={`px-4 py-2 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-white/[0.03] border-white/[0.08]'}`}>
                  <span className={`text-lg font-black ${isLight ? 'text-purple-600' : 'text-purple-400'}`}>{useCases.length}</span>
                  <span className={`text-xs ms-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t("Use Cases", "حالات استخدام", "Use Cases")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className={`${isLight ? 'bg-white' : 'bg-[#030712]'}`}>
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

          {/* 2. PROBLEM + OVERVIEW */}
          {solution.problem_statement && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className={`p-8 rounded-2xl border-l-4 border-amber-500 ${isLight ? 'bg-amber-50 border border-amber-200' : 'bg-amber-500/5 border border-amber-500/20'}`}>
                <h3 className={`text-lg font-bold mb-3 ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>{t("The Problem", "التحدي الذي نعالجه", "Problem")}</h3>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-amber-900' : 'text-amber-200'}`}>{t(solution.problem_statement, solution.problem_statement_ar, solution.problem_statement)}</p>
              </div>
            </motion.div>
          )}

          {solution.overview_long && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className={`text-2xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Overview", "نظرة عامة على الحل", "Overview")}</h2>
              <div className={`prose max-w-none text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {(solution.overview_long || '').split('\n\n').map((p: string, i: number) => <p key={i} className="mb-4">{t(p, solution.overview_long_ar ? (solution.overview_long_ar.split('\n\n')[i] || p) : p, p)}</p>)}
              </div>
            </motion.div>
          )}

          {/* 3. DELIVERABLES */}
          {deliverables.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className={`text-2xl font-bold mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("What You Receive", "المخرجات التي تحصل عليها", "Deliverables")}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {deliverables.map((d: any) => (
                  <div key={d.id} className={`p-5 rounded-xl border flex gap-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                    <CheckCircle className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{d.title}</h4>
                      <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{d.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 4. USE CASES */}
          {useCases.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className={`text-2xl font-bold mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Use Cases", "حالات الاستخدام", "Use Cases")}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {useCases.map((uc: any) => (
                  <div key={uc.id} className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                    <Target className={`w-8 h-8 mb-4 ${isLight ? 'text-purple-500' : 'text-purple-400'}`} />
                    <h4 className={`font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{uc.title}</h4>
                    <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{uc.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 5. TECH STACK */}
          {techStack.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className={`text-2xl font-bold mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Technology Stack", "التقنيات المستخدمة", "Tech Stack")}</h2>
              <div className="flex flex-wrap gap-3">
                {techStack.map((ts: any) => (
                  <div key={ts.id} className={`px-5 py-3 rounded-xl border font-bold text-sm ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white/[0.03] border-white/[0.08] text-white'}`}>
                    {ts.name}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 6. GALLERY */}
          {gallery.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className={`text-2xl font-bold mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Gallery", "معرض الأعمال", "Gallery")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((g: any) => (
                  <div key={g.id} className="rounded-xl overflow-hidden relative group">
                    <img src={g.image_url} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" alt={g.caption || 'Gallery'} />
                    {g.caption && <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent"><span className="text-white text-xs font-medium">{g.caption}</span></div>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 7. PRICING */}
          {pricingModels.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className={`text-2xl font-bold mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Engagement Models", "نماذج التعاقد", "Pricing")}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {pricingModels.map((pm: any) => {
                  let features: string[] = [];
                  try { features = JSON.parse(pm.features_json || '[]'); } catch {}
                  return (
                    <div key={pm.id} className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                      <Package className={`w-8 h-8 mb-4 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                      <h4 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{pm.model_type}</h4>
                      <div className="mb-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${isLight ? 'bg-cyan-50 text-cyan-700' : 'bg-cyan-500/10 text-cyan-400'}`}>USD</span>
                          <span className={`text-lg font-black ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>{pm.starting_price}</span>
                        </div>
                        {pm.price_egp && (
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isLight ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400'}`}>EGP</span>
                            <span className={`text-sm font-bold ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>{pm.price_egp}</span>
                          </div>
                        )}
                      </div>
                      <p className={`text-sm mb-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{pm.description}</p>
                      {features.length > 0 && (
                        <ul className="space-y-2">
                          {features.map((f, i) => (
                            <li key={i} className={`flex items-center gap-2 text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 8. FAQ */}
          {faq.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className={`text-2xl font-bold mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("FAQ", "الأسئلة الشائعة", "FAQ")}</h2>
              <div className="space-y-3">
                {faq.map((item: any, i: number) => (
                  <div key={item.id} className={`rounded-xl border overflow-hidden ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className={`w-full text-start px-6 py-4 flex items-center justify-between ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}`}>
                      <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t(item.question, item.question_ar, item.question)}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${isLight ? 'text-slate-400' : 'text-slate-500'} ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className={`px-6 pb-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            <p className="text-sm leading-relaxed">{t(item.answer, item.answer_ar, item.answer)}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 9. CASE STUDIES */}
          {caseStudies.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className={`text-2xl font-bold mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Related Case Studies", "دراسات حالة ذات صلة", "Case Studies")}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {caseStudies.map((cs: any) => (
                  <div key={cs.id} className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                    <div className="flex items-center gap-2 mb-3"><Globe className="w-4 h-4 text-cyan-500" /><span className={`text-xs font-bold uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{cs.industry}</span></div>
                    <h4 className={`font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{cs.client_name}</h4>
                    <p className={`text-sm mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{cs.challenge}</p>
                    {cs.outcome && <p className="text-sm font-medium text-emerald-500">{cs.outcome}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 10. CTA */}
      <section className={`py-20 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.04]'}`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Cpu className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
          <h2 className={`text-3xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("Ready to Build This?", "مستعد لبناء هذا النظام؟", "Ready?")}
          </h2>
          <p className={`mb-8 max-w-lg mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {t("Get a custom proposal with timeline, deliverables, and pricing within 48 hours.", "احصل على مقترح تقني مخصص يتضمن الجدول الزمني والمخرجات والتسعير خلال ٤٨ ساعة.", "Custom proposal in 48 hours.")}
          </p>
          <Link href="/consultation">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-10 py-6 rounded-xl shadow-lg">
              {t("Request Proposal for " + solution.title, "اطلب مقترحاً لـ " + (solution.title_ar || solution.title), "Request Proposal")}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
