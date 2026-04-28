import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, CheckCircle, Loader2, FileText, Shield, Clock, Zap, Building } from "lucide-react";

const BUDGET_RANGES = ["< $10,000", "$10,000 - $25,000", "$25,000 - $50,000", "$50,000 - $100,000", "$100,000 - $250,000", "$250,000+"];
const TIMELINES_EN = ["< 1 month", "1-3 months", "3-6 months", "6-12 months", "12+ months"];
const TIMELINES_AR = ["أقل من شهر", "١-٣ أشهر", "٣-٦ أشهر", "٦-١٢ شهراً", "أكثر من ١٢ شهراً"];
const INDUSTRIES_EN = ["Manufacturing", "Logistics & Supply Chain", "Enterprise Operations", "Smart Infrastructure", "Energy & Utilities", "Healthcare", "Finance", "Other"];
const INDUSTRIES_AR = ["التصنيع", "الخدمات اللوجستية وسلاسل الإمداد", "العمليات المؤسسية", "البنية التحتية الذكية", "الطاقة والمرافق", "الرعاية الصحية", "المالية", "أخرى"];

export default function ProposalGenerator({ services, preSelectedServiceId, preSelectedPackageType, onClose }: {
  services: any[];
  preSelectedServiceId?: number;
  preSelectedPackageType?: string;
  onClose?: () => void;
}) {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [step, setStep] = useState(preSelectedServiceId ? 2 : 1);
  const [form, setForm] = useState({
    selectedServiceId: preSelectedServiceId || 0,
    selectedPackageType: preSelectedPackageType || "",
    name: "", company: "", email: "", phone: "",
    industry: "", budgetRange: "", timelineExpectation: "",
    painPoint: "", requiresFullIp: false,
  });

  const mutation = trpc.admin.submitProposalLead.useMutation({
    onSuccess: () => setStep(5),
    onError: () => toast.error("Failed to submit. Please try again."),
  });

  const selectedService = services.find((s: any) => s.id === form.selectedServiceId);
  const set = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    if (!form.name || !form.email) return toast.error("Name and email are required.");
    const summary = {
      service: selectedService?.title || "Not specified",
      package: form.selectedPackageType || "Not specified",
      budget: form.budgetRange,
      timeline: form.timelineExpectation,
      ipOwnership: form.requiresFullIp,
    };
    mutation.mutate({
      name: form.name, company: form.company, email: form.email, phone: form.phone,
      industryPainPoint: `Industry: ${form.industry} | ${form.painPoint}`,
      serviceInterest: selectedService?.title,
      selectedServiceId: form.selectedServiceId || undefined,
      selectedPackageType: form.selectedPackageType || undefined,
      budgetRange: form.budgetRange || undefined,
      timelineExpectation: form.timelineExpectation || undefined,
      requiresFullIp: form.requiresFullIp,
      proposalSummarySnapshot: summary,
    });
  };

  const cardCls = `rounded-2xl border p-8 ${isLight ? 'bg-white border-slate-200 shadow-2xl shadow-slate-200/60' : 'bg-[#0a0e1a] border-white/[0.08]'}`;
  const selectCls = `w-full h-11 rounded-xl px-4 text-sm border focus:outline-none focus:ring-2 transition-colors appearance-none cursor-pointer ${isLight ? "bg-white border-slate-200 text-slate-900 focus:ring-cyan-500/20" : "bg-[#0d1225] border-white/[0.08] text-white focus:ring-cyan-500/20 [color-scheme:dark]"}`;
  const inputCls = `rounded-xl h-11 ${isLight ? "bg-white border-slate-200 text-slate-900" : "bg-white/[0.04] border-white/[0.08] text-white"} focus:ring-cyan-500/20`;
  const labelCls = `text-xs mb-1.5 block font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`;

  const steps = [
    { num: 1, label: t("Service", "الخدمة", "Service") },
    { num: 2, label: t("Package", "الباقة", "Package") },
    { num: 3, label: t("Details", "التفاصيل", "Details") },
    { num: 4, label: t("Summary", "الملخص", "Summary") },
  ];

  return (
    <div className={cardCls}>
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-1 mb-8">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s.num ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : isLight ? 'bg-slate-100 text-slate-400' : 'bg-white/[0.05] text-slate-500'}`}>
              {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
            </div>
            {i < steps.length - 1 && <div className={`w-8 h-0.5 mx-1 ${step > s.num ? 'bg-cyan-500' : isLight ? 'bg-slate-200' : 'bg-white/[0.06]'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Select Service */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className={`text-lg font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Select a Service", "اختر الخدمة", "Select Service")}</h3>
            <p className={`text-sm mb-6 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t("Which solution are you interested in?", "ما الحل الذي تهتم به؟", "Which solution?")}</p>
            <div className="grid grid-cols-2 gap-3">
              {services.filter((s: any) => s.status === 'active').map((s: any) => (
                <button key={s.id} onClick={() => { set("selectedServiceId", s.id); setStep(2); }}
                  className={`p-4 rounded-xl border text-start transition-all ${form.selectedServiceId === s.id ? 'border-cyan-500 bg-cyan-500/5 ring-2 ring-cyan-500/20' : isLight ? 'border-slate-200 hover:border-slate-300' : 'border-white/[0.08] hover:border-white/[0.15]'}`}>
                  <span className={`text-sm font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>{t(s.title, s.title_ar, s.title)}</span>
                  <span className={`text-[10px] mt-1 block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{s.price_tier || 'Enterprise'}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: Select Package */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className={`text-lg font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Select Engagement Model", "اختر نموذج التعاقد", "Select Package")}</h3>
            <p className={`text-sm mb-6 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t("How would you like to engage with us?", "كيف تود التعامل معنا؟", "Engagement model?")}</p>
            <div className="space-y-3">
              {[
                { type: "Discovery", label: t("Discovery Package", "باقة الاستكشاف", "Discovery"), desc: t("Assessment, feasibility study, architecture proposal", "تقييم ودراسة جدوى ومقترح معماري", "Assessment & proposal"), range: "$5,000 - $15,000" },
                { type: "Implementation", label: t("Implementation Package", "باقة التنفيذ", "Implementation"), desc: t("Full development, deployment, and integration", "تطوير كامل ونشر وتكامل", "Full development"), range: "$25,000 - $150,000" },
                { type: "Retainer", label: t("Retainer Package", "باقة الدعم المستمر", "Retainer"), desc: t("Ongoing support, optimization, and strategic advisory", "دعم مستمر وتحسين واستشارات استراتيجية", "Ongoing support"), range: "$3,000 - $15,000/mo" },
              ].map(pkg => (
                <button key={pkg.type} onClick={() => { set("selectedPackageType", pkg.type); setStep(3); }}
                  className={`w-full p-4 rounded-xl border text-start flex items-center justify-between transition-all ${form.selectedPackageType === pkg.type ? 'border-cyan-500 bg-cyan-500/5 ring-2 ring-cyan-500/20' : isLight ? 'border-slate-200 hover:border-slate-300' : 'border-white/[0.08] hover:border-white/[0.15]'}`}>
                  <div>
                    <span className={`text-sm font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>{pkg.label}</span>
                    <span className={`text-xs block mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{pkg.desc}</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/[0.05] text-slate-300'}`}>{pkg.range}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className={`mt-4 text-sm flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}><ArrowLeft className="w-3 h-3" /> {t("Back", "رجوع", "Back")}</button>
          </motion.div>
        )}

        {/* STEP 3: Qualification Form */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className={`text-lg font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Your Details", "بياناتك", "Your Details")}</h3>
            <p className={`text-sm mb-6 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t("Help us prepare your personalized proposal.", "ساعدنا في إعداد مقترحك المخصص.", "Personalized proposal.")}</p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div><label className={labelCls}>{t("Full Name *", "الاسم الكامل *", "Name *")}</label>
                <Input value={form.name} onChange={e => set("name", e.target.value)} className={inputCls} placeholder="John Doe" /></div>
              <div><label className={labelCls}>{t("Company", "الشركة", "Company")}</label>
                <Input value={form.company} onChange={e => set("company", e.target.value)} className={inputCls} placeholder="Acme Corp" /></div>
              <div><label className={labelCls}>{t("Email *", "البريد الإلكتروني *", "Email *")}</label>
                <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputCls} placeholder="john@acme.com" /></div>
              <div><label className={labelCls}>{t("Phone", "الهاتف", "Phone")}</label>
                <Input value={form.phone} onChange={e => set("phone", e.target.value)} className={inputCls} placeholder="+971 50 123 4567" /></div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div><label className={labelCls}>{t("Industry", "القطاع", "Industry")}</label>
                <select value={form.industry} onChange={e => set("industry", e.target.value)} className={selectCls}>
                  <option value="">{t("Select", "اختر", "Select")}</option>
                  {(isRTL ? INDUSTRIES_AR : INDUSTRIES_EN).map((ind, idx) => <option key={idx} value={INDUSTRIES_EN[idx]}>{ind}</option>)}
                </select></div>
              <div><label className={labelCls}>{t("Budget Range", "نطاق الميزانية", "Budget")}</label>
                <select value={form.budgetRange} onChange={e => set("budgetRange", e.target.value)} className={selectCls}>
                  <option value="">{t("Select", "اختر", "Select")}</option>
                  {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                </select></div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div><label className={labelCls}>{t("Timeline", "الجدول الزمني", "Timeline")}</label>
                <select value={form.timelineExpectation} onChange={e => set("timelineExpectation", e.target.value)} className={selectCls}>
                  <option value="">{t("Select", "اختر", "Select")}</option>
                  {(isRTL ? TIMELINES_AR : TIMELINES_EN).map((tl, idx) => <option key={idx} value={TIMELINES_EN[idx]}>{tl}</option>)}
                </select></div>
              <div className="flex items-end">
                <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border w-full ${form.requiresFullIp ? 'border-cyan-500 bg-cyan-500/5' : isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
                  <input type="checkbox" checked={form.requiresFullIp} onChange={e => set("requiresFullIp", e.target.checked)} className="sr-only" />
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${form.requiresFullIp ? 'bg-cyan-500 border-cyan-500' : isLight ? 'border-slate-300' : 'border-white/20'}`}>
                    {form.requiresFullIp && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{t("Need full IP ownership?", "هل تحتاج ملكية فكرية كاملة؟", "Full IP?")}</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className={labelCls}>{t("Describe your challenge", "صف التحدي الذي تواجهه", "Your challenge")}</label>
              <textarea value={form.painPoint} onChange={e => set("painPoint", e.target.value)} rows={3}
                className={`w-full rounded-xl px-4 py-3 text-sm border resize-none focus:outline-none focus:ring-2 ${isLight ? "bg-white border-slate-200 text-slate-900 focus:ring-cyan-500/20" : "bg-white/[0.04] border-white/[0.08] text-white focus:ring-cyan-500/20"}`}
                placeholder={t("e.g., We need a real-time defect detection system...", "مثلاً، نحتاج نظام كشف عيوب...", "Describe...")} />
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => setStep(2)} className={`text-sm flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}><ArrowLeft className="w-3 h-3" /> {t("Back", "رجوع", "Back")}</button>
              <Button onClick={handleSubmit} disabled={mutation.isPending} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 rounded-xl shadow-lg">
                {mutation.isPending ? <><Loader2 className="w-4 h-4 me-2 animate-spin" /> {t("Generating...", "جاري التوليد...", "Generating...")}</>
                  : <>{t("Generate Proposal", "إنشاء المقترح", "Generate")} <ArrowRight className="ms-2 w-4 h-4" /></>}
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 5: Summary */}
        {step === 5 && (
          <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Your Proposal Summary", "ملخص مقترحك", "Proposal Summary")}</h3>
              <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t("Our team will review and contact you within 24 hours.", "سيراجع فريقنا ويتواصل معك خلال ٢٤ ساعة.", "We'll contact you within 24h.")}</p>
            </div>

            <div className={`rounded-xl border p-6 space-y-4 mb-6 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.06]'}`}>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{t("Service", "الخدمة", "Service")}</span>
                <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedService?.title || "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{t("Package", "الباقة", "Package")}</span>
                <span className={`text-sm font-bold ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>{form.selectedPackageType || "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{t("Budget", "الميزانية", "Budget")}</span>
                <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{form.budgetRange || "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{t("Timeline", "الجدول الزمني", "Timeline")}</span>
                <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{form.timelineExpectation || "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{t("IP Ownership", "الملكية الفكرية", "IP")}</span>
                <span className={`text-sm font-bold ${form.requiresFullIp ? 'text-emerald-500' : isLight ? 'text-slate-900' : 'text-white'}`}>{form.requiresFullIp ? t("Full Transfer", "نقل كامل", "Full") : t("Standard", "قياسي", "Standard")}</span>
              </div>
            </div>

            <div className={`rounded-xl border p-5 ${isLight ? 'bg-cyan-50 border-cyan-200' : 'bg-cyan-500/5 border-cyan-500/20'}`}>
              <h4 className={`text-sm font-bold mb-2 ${isLight ? 'text-cyan-800' : 'text-cyan-300'}`}>{t("Suggested Next Step", "الخطوة التالية المقترحة", "Next Step")}</h4>
              <p className={`text-sm ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                {form.selectedPackageType === 'Discovery'
                  ? t("Book a 30-minute discovery call with our solutions architect to scope your project.", "احجز مكالمة استكشاف لمدة ٣٠ دقيقة مع مهندس الحلول لتحديد نطاق مشروعك.", "Book discovery call.")
                  : t("Our engineering team will prepare a detailed technical proposal with architecture diagrams, timeline, and cost breakdown within 48 hours.", "سيعد فريقنا الهندسي مقترحاً تقنياً مفصلاً مع مخططات البنية والجدول الزمني وتفصيل التكاليف خلال ٤٨ ساعة.", "Detailed proposal in 48h.")}
              </p>
            </div>

            {onClose && (
              <Button onClick={onClose} variant="outline" className={`w-full mt-4 h-11 rounded-xl ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                {t("Close", "إغلاق", "Close")}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
