import { CheckCircle, Shield, Clock, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface PricingModel {
  id: number;
  model_type: string;
  model_type_ar?: string;
  starting_price: string;
  typical_range?: string;
  description?: string;
  description_ar?: string;
  scope_summary?: string;
  scope_summary_ar?: string;
  features_json?: string;
  deliverables_json?: string;
  optional_add_ons_json?: string;
  support_terms?: string;
  support_terms_ar?: string;
  ip_ownership_notes?: string;
  ip_ownership_notes_ar?: string;
  price_egp?: string;
}

export default function PackageComparison({ pricingModels, serviceTitle }: { pricingModels: PricingModel[]; serviceTitle?: string }) {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!pricingModels || pricingModels.length === 0) return null;

  const tierColors: Record<string, { gradient: string; badge: string; border: string }> = {
    Discovery: { gradient: "from-blue-500 to-cyan-500", badge: isLight ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-blue-500/10 text-blue-400 border-blue-500/20", border: isLight ? "border-blue-200 hover:border-blue-400" : "border-blue-500/20 hover:border-blue-500/40" },
    Implementation: { gradient: "from-cyan-500 to-emerald-500", badge: isLight ? "bg-cyan-50 text-cyan-700 border-cyan-200" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", border: isLight ? "border-cyan-300 hover:border-cyan-500 ring-2 ring-cyan-500/10" : "border-cyan-500/30 hover:border-cyan-500/50 ring-2 ring-cyan-500/10" },
    Retainer: { gradient: "from-purple-500 to-pink-500", badge: isLight ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-purple-500/10 text-purple-400 border-purple-500/20", border: isLight ? "border-purple-200 hover:border-purple-400" : "border-purple-500/20 hover:border-purple-500/40" },
  };

  const parseJson = (s?: string) => { try { return JSON.parse(s || '[]'); } catch { return []; } };

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className={`text-2xl md:text-3xl font-extrabold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {t("Engagement Models", "نماذج التعاقد والتسعير", "Engagement Models")}
        </h2>
        <p className={`text-sm max-w-2xl mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          {t("Transparent pricing ranges. Choose the engagement model that fits your scope, timeline, and budget.", "نطاقات تسعير شفافة. اختر نموذج التعاقد المناسب لنطاق عملك وجدولك الزمني وميزانيتك.", "Transparent pricing.")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {pricingModels.map((pm, idx) => {
          const features = parseJson(pm.features_json);
          const deliverables = parseJson(pm.deliverables_json);
          const addOns = parseJson(pm.optional_add_ons_json);
          const colors = tierColors[pm.model_type] || tierColors.Discovery;
          const isPopular = pm.model_type === 'Implementation';

          return (
            <motion.div key={pm.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 ${isLight ? 'bg-white shadow-lg' : 'bg-white/[0.02]'} ${colors.border}`}>

              {isPopular && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${colors.gradient} text-white shadow-lg`}>
                  {t("Most Popular", "الأكثر طلباً", "Popular")}
                </div>
              )}

              {/* Header */}
              <div className="mb-5">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-3 ${colors.badge}`}>
                  {t(pm.model_type, pm.model_type_ar || pm.model_type, pm.model_type)}
                </span>
                <div className="mb-2">
                  <span className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{pm.starting_price}</span>
                </div>
                {pm.typical_range && (
                  <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t("Typical range:", "النطاق المعتاد:", "Range:")} {pm.typical_range}
                  </p>
                )}
              </div>

              {/* Scope Summary */}
              {pm.scope_summary && (
                <p className={`text-sm leading-relaxed mb-5 pb-5 border-b ${isLight ? 'text-slate-600 border-slate-100' : 'text-slate-400 border-white/[0.06]'}`}>
                  {t(pm.scope_summary, pm.scope_summary_ar || pm.scope_summary, pm.scope_summary)}
                </p>
              )}

              {/* Deliverables */}
              {(deliverables.length > 0 || features.length > 0) && (
                <div className="mb-5 flex-1">
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t("Included", "المشمول", "Included")}
                  </h4>
                  <ul className="space-y-2">
                    {(deliverables.length > 0 ? deliverables : features).map((f: string, i: number) => (
                      <li key={i} className={`flex items-start gap-2 text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add-ons */}
              {addOns.length > 0 && (
                <div className={`mb-5 p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.02] border-white/[0.04]'}`}>
                  <h5 className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t("Optional Add-ons", "إضافات اختيارية", "Add-ons")}
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {addOns.map((a: string, i: number) => (
                      <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-medium ${isLight ? 'bg-white border border-slate-200 text-slate-600' : 'bg-white/[0.04] border border-white/[0.08] text-slate-400'}`}>{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms */}
              <div className={`space-y-2 mb-6 text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {pm.support_terms && (
                  <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-cyan-500 shrink-0" /> {t(pm.support_terms, pm.support_terms_ar || pm.support_terms, pm.support_terms)}</div>
                )}
                {pm.ip_ownership_notes && (
                  <div className="flex items-center gap-2"><Shield className="w-3 h-3 text-emerald-500 shrink-0" /> {t(pm.ip_ownership_notes, pm.ip_ownership_notes_ar || pm.ip_ownership_notes, pm.ip_ownership_notes)}</div>
                )}
              </div>

              {/* CTA */}
              <Link href="/consultation">
                <button
                  className={`w-full h-11 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all hover:opacity-90 ${isPopular ? `bg-gradient-to-r ${colors.gradient} shadow-lg` : ''}`}
                  style={isPopular
                    ? { color: '#fff' }
                    : isLight
                      ? { backgroundColor: '#1e293b', color: '#fff' }
                      : { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
                  }
                >
                  {t("Get Started", "ابدأ الآن", "Get Started")} <ArrowRight className="ms-2 w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
