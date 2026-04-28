import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, Loader2, Cpu, Globe, Factory, Truck, Building2, Wifi, Eye, Database, Cloud, BarChart3, Brain, Code, Layers, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const IconMap: any = { Eye, Database, Cloud, BarChart3, Brain, Code, Cpu, Layers, Zap, Target };
const IndustryIcons: any = { manufacturing: Factory, logistics: Truck, 'enterprise-operations': Building2, 'smart-infrastructure': Wifi };

export default function IndustryLanding() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [, params] = useRoute("/industries/:slug");
  const slug = params?.slug || "";

  const { data: industry, isLoading } = trpc.admin.getIndustryBySlug.useQuery({ slug }, { staleTime: 1000 * 60 * 5 });

  if (isLoading) return (<div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-[#f8fafc]' : 'bg-[#020617]'}`}><Loader2 className="w-10 h-10 animate-spin text-cyan-500" /></div>);
  if (!industry) return (<div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-[#f8fafc]' : 'bg-[#020617]'}`}><div className="text-center"><h1 className={`text-4xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Industry Not Found</h1><Link href="/solutions"><Button className="bg-cyan-600 text-white">Back to Solutions</Button></Link></div></div>);

  const IndIcon = IndustryIcons[slug] || Factory;
  let painPoints: string[] = [];
  let painPointsAr: string[] = [];
  try { painPoints = JSON.parse(industry.painPointsJson || '[]'); } catch {}
  try { painPointsAr = JSON.parse(industry.painPointsArJson || '[]'); } catch {}
  const services = industry.services || [];
  const caseStudies = industry.caseStudies || [];

  return (
    <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"} ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#020617] text-white'}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />

      {/* Hero */}
      <section className={`pt-32 pb-20 relative overflow-hidden ${isLight ? 'bg-gradient-to-br from-slate-50 to-cyan-50/30' : ''}`}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/solutions"><span className={`inline-flex items-center gap-1.5 text-sm mb-8 cursor-pointer ${isLight ? 'text-slate-500' : 'text-slate-400'}`}><ArrowLeft className="w-4 h-4" /> {t("All Solutions", "كل الحلول", "Solutions")}</span></Link>
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 ${isLight ? 'bg-cyan-50 border border-cyan-200 text-cyan-700' : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'}`}>
              <IndIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{t("Industry Solutions", "حلول القطاع", "Industry")}</span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t(industry.title, industry.titleAr, industry.title)}</h1>
            <p className={`text-lg max-w-3xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t(industry.overview, industry.overviewAr, industry.overview)}</p>
          </motion.div>
        </div>
      </section>

      <div className={`${isLight ? 'bg-white' : 'bg-[#030712]'}`}>
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

          {/* Pain Points */}
          {painPoints.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className={`text-2xl font-extrabold mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Industry Challenges", "تحديات القطاع", "Challenges")}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {painPoints.map((pain, i) => (
                  <div key={i} className={`p-5 rounded-xl border-l-4 border-amber-500 ${isLight ? 'bg-amber-50 border border-amber-200' : 'bg-amber-500/5 border border-amber-500/20'}`}>
                    <p className={`text-sm font-medium ${isLight ? 'text-amber-900' : 'text-amber-200'}`}>{t(pain, painPointsAr[i] || pain, pain)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Mapped Solutions */}
          {services.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className={`text-2xl font-extrabold mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Solutions for This Industry", "حلول لهذا القطاع", "Solutions")}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((svc: any) => {
                  const SvcIcon = IconMap[svc.icon] || Cpu;
                  return (
                    <Link key={svc.id} href={`/solutions/${svc.slug}`}>
                      <div className={`p-6 rounded-2xl border group cursor-pointer transition-all ${isLight ? 'bg-white border-slate-200 shadow-lg hover:shadow-xl hover:border-cyan-300' : 'bg-white/[0.02] border-white/[0.06] hover:border-cyan-500/30'}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-cyan-50' : 'bg-cyan-500/10'}`}><SvcIcon className="w-5 h-5 text-cyan-500" /></div>
                          <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t(svc.title, svc.title_ar, svc.title)}</h3>
                        </div>
                        <p className={`text-sm mb-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t(svc.description, svc.description_ar, svc.description)}</p>
                        <span className={`text-sm font-bold flex items-center gap-1 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>{t("View Solution", "عرض الحل", "View")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Case Studies */}
          {caseStudies.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className={`text-2xl font-extrabold mb-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Industry Case Studies", "دراسات حالة القطاع", "Case Studies")}</h2>
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
          <IndIcon className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
          <h2 className={`text-3xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t(`Transform Your ${industry.title} Operations`, `حوّل عمليات ${industry.titleAr}`, "Transform Operations")}</h2>
          <p className={`mb-8 max-w-lg mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t("Get a custom proposal tailored to your industry challenges.", "احصل على مقترح مخصص لتحديات قطاعك.", "Custom proposal.")}</p>
          <Link href="/consultation"><Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-10 py-6 rounded-xl shadow-lg">{t("Request Industry Proposal", "اطلب مقترحاً للقطاع", "Request Proposal")}</Button></Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
