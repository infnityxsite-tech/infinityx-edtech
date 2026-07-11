import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PackageComparison from "@/components/solutions/PackageComparison";
import ProposalGenerator from "@/components/solutions/ProposalGenerator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, CheckCircle, Cpu, BarChart3, Database, Cloud, Loader2, Target, Package, ChevronDown, Globe, Layers, Zap, Eye, Brain, Code, TrendingUp, Shield, Clock, AlertTriangle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";

const IconMap: any = { Eye, Database, Cloud, BarChart3, Brain, Code, Cpu, Layers, Zap, Target };

export default function SolutionDetail() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [, params] = useRoute("/solutions/:slug");
  const slug = params?.slug || "ai";
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showProposal, setShowProposal] = useState(false);

  const { data: solution, isLoading } = trpc.admin.getSolutionBySlug.useQuery({ slug }, { staleTime: 1000 * 60 * 5 });
  const { data: hubData } = trpc.admin.getSolutionsHub.useQuery(undefined, { staleTime: 1000 * 60 * 5 });

  // SEO: inject per-solution title, description, canonical, and OG tags
  useSEO({
    title: solution?.title ? `${solution.title} — AI Solutions` : isLoading ? "Loading Solution..." : "Solution Not Found",
    description: solution?.description
      ? solution.description.slice(0, 155)
      : `Enterprise-grade ${slug.replace(/-/g, " ")} solutions by Infinity X — AI, Computer Vision, and custom software for MENA businesses.`,
    canonical: `https://infx.space/solutions/${slug}`,
    robots: solution ? "index, follow" : "noindex, follow",
  });

  if (isLoading) return (<div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-[#f8fafc]' : 'bg-[#020617]'}`}><Loader2 className="w-10 h-10 animate-spin text-cyan-500" /></div>);
  if (!solution) return (<div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-[#f8fafc]' : 'bg-[#020617]'}`}><div className="text-center"><h1 className={`text-4xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Solution Not Found</h1><Link href="/solutions"><Button className="bg-cyan-600 text-white">Back to Solutions</Button></Link></div></div>);

  const Icon = IconMap[solution.icon] || Cpu;
  const deliverables = solution.deliverables || [];
  const useCases = solution.useCases || [];
  const techStack = solution.techStack || [];
  const gallery = solution.gallery || [];
  const faq = solution.faq || [];
  const pricingModels = solution.pricingModels || [];
  const caseStudies = solution.relatedCaseStudies || [];
  const impactMetrics = solution.impactMetrics || [];
  let methodology: any[] = [];
  try { methodology = JSON.parse(solution.process_methodology_json || '[]'); } catch {}
  const allServices = hubData?.allServices || [];

  const sectionTitle = (en: string, ar: string) => (
    <h2 className={`text-2xl md:text-3xl font-extrabold mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t(en, ar, en)}</h2>
  );

  return (
    <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"} ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#020617] text-white'}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />

      {/* HERO */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={solution.hero_image_url || '/uploads/hero_ai_neural.png'} className="w-full h-full object-cover" alt={solution.title} />
          <div className={`absolute inset-0 ${isLight ? 'bg-white/80' : 'bg-[#020617]/85'}`} />
        </div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/solutions"><span className={`inline-flex items-center gap-1.5 text-sm mb-8 cursor-pointer ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}><ArrowLeft className="w-4 h-4" /> {t("Back to Solutions", "العودة إلى الحلول", "Back")}</span></Link>
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 ${isLight ? 'bg-cyan-50 border border-cyan-200 text-cyan-700' : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'}`}>
              <Icon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{solution.category_name || "Enterprise Solution"}</span>
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t(solution.title, solution.title_ar, solution.title)}</h1>
            <p className={`text-lg max-w-3xl leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t(solution.description, solution.description_ar, solution.description)}</p>
            <div className="flex flex-wrap gap-4 items-center">
              <Button onClick={() => setShowProposal(true)} size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-cyan-500/20">
                {t("Request Proposal", "اطلب مقترحاً تقنياً", "Request Proposal")} <ArrowRight className="ms-2 w-5 h-5" />
              </Button>
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

      {/* Proposal Modal */}
      <AnimatePresence>
        {showProposal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowProposal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <ProposalGenerator services={allServices} preSelectedServiceId={solution.id} onClose={() => setShowProposal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${isLight ? 'bg-white' : 'bg-[#030712]'}`}>
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

          {/* PROBLEM */}
          {solution.problem_statement && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className={`p-8 rounded-2xl border-l-4 border-amber-500 ${isLight ? 'bg-amber-50 border border-amber-200' : 'bg-amber-500/5 border border-amber-500/20'}`}>
                <div className="flex items-center gap-2 mb-3"><AlertTriangle className={`w-5 h-5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                  <h3 className={`text-lg font-bold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>{t("The Problem", "التحدي الذي نعالجه", "Problem")}</h3>
                </div>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-amber-900' : 'text-amber-200'}`}>{t(solution.problem_statement, solution.problem_statement_ar, solution.problem_statement)}</p>
              </div>
            </motion.div>
          )}

          {/* IMPACT METRICS */}
          {impactMetrics.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {sectionTitle("Proof of Impact", "إثبات الأثر")}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {impactMetrics.map((m: any) => (
                  <div key={m.id} className={`p-6 rounded-2xl border text-center ${isLight ? 'bg-gradient-to-br from-slate-50 to-white border-slate-200' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                    <TrendingUp className={`w-6 h-6 mx-auto mb-3 ${m.impact_category === 'cost_reduction' ? 'text-emerald-500' : m.impact_category === 'risk_reduction' ? 'text-amber-500' : 'text-cyan-500'}`} />
                    <p className={`text-3xl font-black mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{m.metric_value}</p>
                    <p className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{t(m.metric_title, m.metric_title_ar, m.metric_title)}</p>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t(m.metric_description, m.metric_description_ar, m.metric_description)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* OVERVIEW */}
          {solution.overview_long && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {sectionTitle("Overview", "نظرة عامة على الحل")}
              <div className={`prose max-w-none text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {(solution.overview_long || '').split('\n\n').map((p: string, i: number) => <p key={i} className="mb-4">{t(p, solution.overview_long_ar ? (solution.overview_long_ar.split('\n\n')[i] || p) : p, p)}</p>)}
              </div>
            </motion.div>
          )}

          {/* DELIVERABLES */}
          {deliverables.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {sectionTitle("What You Receive", "المخرجات التي تحصل عليها")}
              <div className="grid md:grid-cols-2 gap-4">
                {deliverables.map((d: any) => (
                  <div key={d.id} className={`p-5 rounded-xl border flex gap-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                    <CheckCircle className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className={`font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t(d.title, d.title_ar || d.title, d.title)}</h4>
                      <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t(d.description, d.description_ar || d.description, d.description)}</p>
                      {d.expected_timeline && <span className={`inline-flex items-center gap-1 mt-2 text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}><Clock className="w-3 h-3" /> {d.expected_timeline}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* USE CASES */}
          {useCases.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {sectionTitle("Use Cases", "حالات الاستخدام")}
              <div className="grid md:grid-cols-3 gap-6">
                {useCases.map((uc: any) => (
                  <div key={uc.id} className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                    <Target className={`w-8 h-8 mb-4 ${isLight ? 'text-purple-500' : 'text-purple-400'}`} />
                    {uc.industry && <span className={`text-[10px] font-bold uppercase tracking-wider mb-2 block ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>{uc.industry}</span>}
                    <h4 className={`font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t(uc.title, uc.title_ar || uc.title, uc.title)}</h4>
                    <p className={`text-sm mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t(uc.description, uc.description_ar || uc.description, uc.description)}</p>
                    {uc.business_impact && <div className={`p-2 rounded-lg text-xs font-medium ${isLight ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400'}`}>{t(uc.business_impact, uc.business_impact_ar || uc.business_impact, uc.business_impact)}</div>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TECH STACK */}
          {techStack.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {sectionTitle("Technology Stack", "التقنيات المستخدمة")}
              <div className="flex flex-wrap gap-3">
                {techStack.map((ts: any) => (
                  <div key={ts.id} className={`px-5 py-3 rounded-xl border font-bold text-sm ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white/[0.03] border-white/[0.08] text-white'}`}>{ts.name}</div>
                ))}
              </div>
            </motion.div>
          )}

          {/* METHODOLOGY */}
          {methodology.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {sectionTitle("Delivery Methodology", "منهجية التسليم")}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {methodology.map((step: any, i: number) => (
                  <div key={i} className="text-center">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-black bg-gradient-to-br from-cyan-500 to-blue-600 text-white`}>{step.step || i + 1}</div>
                    <h4 className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t(step.title, step.titleAr || step.title, step.title)}</h4>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{step.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* GALLERY */}
          {gallery.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {sectionTitle("Gallery", "معرض الأعمال")}
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

          {/* PACKAGES */}
          {pricingModels.length > 0 && <PackageComparison pricingModels={pricingModels} serviceTitle={solution.title} />}

          {/* FAQ */}
          {faq.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {sectionTitle("FAQ", "الأسئلة الشائعة")}
              <div className="space-y-3">
                {faq.map((item: any, i: number) => (
                  <div key={item.id} className={`rounded-xl border overflow-hidden ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className={`w-full text-start px-6 py-4 flex items-center justify-between ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}`}>
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

          {/* CASE STUDIES */}
          {caseStudies.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {sectionTitle("Related Case Studies", "دراسات حالة ذات صلة")}
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

      {/* CTA */}
      <section className={`py-20 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.04]'}`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Cpu className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
          <h2 className={`text-3xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Ready to Build This?", "مستعد لبناء هذا النظام؟", "Ready?")}</h2>
          <p className={`mb-8 max-w-lg mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t("Get a custom proposal with timeline, deliverables, and pricing within 48 hours.", "احصل على مقترح تقني مخصص يتضمن الجدول الزمني والمخرجات والتسعير خلال ٤٨ ساعة.", "Custom proposal in 48 hours.")}</p>
          <Button onClick={() => setShowProposal(true)} size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-10 py-6 rounded-xl shadow-lg shadow-cyan-500/20">
            {t("Request Proposal", "اطلب مقترحاً", "Request Proposal")}
          </Button>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className={`fixed bottom-6 end-6 z-40`}>
        <Button onClick={() => setShowProposal(true)} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-2xl shadow-cyan-500/30 hover:-translate-y-1 transition-all">
          <FileText className="w-4 h-4 me-2" /> {t("Get Proposal", "اطلب مقترحاً", "Proposal")}
        </Button>
      </div>

      <Footer />
    </div>
  );
}
