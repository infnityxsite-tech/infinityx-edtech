import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle, Building, ArrowRight, Shield, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const INDUSTRIES = ["Manufacturing", "Logistics", "Space", "Defense", "Other"];
const PROJECT_TYPES = ["Computer Vision", "MLOps", "Custom Web", "Other"];
const COMPANY_SIZES = ["1-50 Employees", "51-200 Employees", "201-500 Employees", "500+ Employees"];

export default function Consultation() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
    industry: "", projectType: "", companySize: "", painPoint: "",
  });

  const mutation = trpc.admin.submitConsultationLead.useMutation({
    onSuccess: () => { setSubmitted(true); toast.success("Consultation request submitted!"); },
    onError: () => toast.error("Failed to submit. Please try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error("Name and email are required.");
    mutation.mutate({
      name: form.name, company: form.company, email: form.email, phone: form.phone,
      industryPainPoint: `Industry: ${form.industry} | Company Size: ${form.companySize} | ${form.painPoint}`,
      serviceInterest: form.projectType,
    });
  };

  const set = (key: string, val: string) => setForm({ ...form, [key]: val });

  const selectCls = `w-full h-11 rounded-xl px-4 text-sm border focus:outline-none focus:ring-2 transition-colors appearance-none cursor-pointer ${
    isLight ? "bg-white border-slate-200 text-slate-900 focus:ring-cyan-500/20 focus:border-cyan-500" : "bg-[#0d1225] border-white/[0.08] text-white focus:ring-cyan-500/20 focus:border-cyan-500/40 [color-scheme:dark]"
  }`;

  const inputCls = `rounded-xl h-11 ${isLight ? "bg-white border-slate-200 text-slate-900" : "bg-white/[0.04] border-white/[0.08] text-white"} focus:ring-cyan-500/20`;

  if (submitted) {
    return (
      <div className={`min-h-screen ${isLight ? "bg-[#f8fafc]" : "bg-[#020617]"} text-white`} dir={isRTL ? "rtl" : "ltr"}>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div className="text-center max-w-md px-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className={`text-3xl font-bold mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>{t("Request Received", "تم استلام الطلب", "Request Received")}</h1>
            <p className={`mb-8 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{t("Our team will review your project requirements and reach out within 24 hours.", "سيراجع فريقنا متطلبات مشروعك ويتواصل معك خلال 24 ساعة.", "We'll reach out within 24 hours.")}</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"} ${isLight ? "bg-[#f8fafc]" : "bg-[#020617]"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />

      <section className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Left Column — Value Prop */}
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border ${isLight ? "bg-cyan-50 border-cyan-200 text-cyan-700" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"}`}>
                <Building className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{t("Enterprise Consultation", "استشارة مؤسسية", "Enterprise Consultation")}</span>
              </div>

              <h1 className={`text-3xl md:text-4xl font-extrabold mb-6 tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                {t("Let's Architect Your", "دعنا نصمم", "Let's Architect Your")}
                <br />
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  {t("Next AI System", "نظامك الذكي القادم", "Next AI System")}
                </span>
              </h1>

              <p className={`text-sm leading-relaxed mb-10 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                {t("Tell us about your project and our engineering team will prepare a custom technical proposal within 48 hours — including architecture diagrams, timeline, and cost estimate.",
                  "أخبرنا عن مشروعك وسيقوم فريقنا الهندسي بإعداد مقترح تقني مخصص خلال 48 ساعة — يتضمن مخططات البنية والجدول الزمني وتقدير التكلفة.",
                  "We'll prepare a custom technical proposal.")}
              </p>

              <div className="space-y-4">
                {[
                  { icon: Zap, text: t("Free initial consultation & AI audit", "استشارة أولية مجانية وتدقيق ذكاء اصطناعي", "Free consultation") },
                  { icon: Shield, text: t("NDA-protected discussions", "مناقشات محمية باتفاقية عدم إفصاح", "NDA-protected") },
                  { icon: CheckCircle, text: t("Technical proposal within 48 hours", "مقترح تقني خلال 48 ساعة", "48-hour proposal") },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    <item.icon className="w-5 h-5 text-cyan-500 shrink-0" />
                    {item.text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column — Form */}
            <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <form onSubmit={handleSubmit} className={`rounded-2xl p-8 border ${isLight ? "bg-white border-slate-200 shadow-xl shadow-slate-200/50" : "bg-white/[0.02] border-white/[0.06]"}`}>
                <h2 className={`text-xl font-bold mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>{t("Project Details", "تفاصيل المشروع", "Project Details")}</h2>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div><Label className={`text-xs mb-1.5 block ${isLight ? "text-slate-600" : "text-slate-400"}`}>{t("Full Name *", "الاسم الكامل *", "Full Name *")}</Label>
                    <Input value={form.name} onChange={e => set("name", e.target.value)} className={inputCls} placeholder="John Doe" /></div>
                  <div><Label className={`text-xs mb-1.5 block ${isLight ? "text-slate-600" : "text-slate-400"}`}>{t("Company", "الشركة", "Company")}</Label>
                    <Input value={form.company} onChange={e => set("company", e.target.value)} className={inputCls} placeholder="Acme Corp" /></div>
                  <div><Label className={`text-xs mb-1.5 block ${isLight ? "text-slate-600" : "text-slate-400"}`}>{t("Email *", "البريد الإلكتروني *", "Email *")}</Label>
                    <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputCls} placeholder="john@acme.com" /></div>
                  <div><Label className={`text-xs mb-1.5 block ${isLight ? "text-slate-600" : "text-slate-400"}`}>{t("Phone", "الهاتف", "Phone")}</Label>
                    <Input value={form.phone} onChange={e => set("phone", e.target.value)} className={inputCls} placeholder="+971 50 123 4567" /></div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className={`text-xs mb-1.5 block ${isLight ? "text-slate-600" : "text-slate-400"}`}>{t("Industry", "القطاع", "Industry")}</Label>
                    <select value={form.industry} onChange={e => set("industry", e.target.value)} className={selectCls}>
                      <option value="">{t("Select Industry", "اختر القطاع", "Select")}</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className={`text-xs mb-1.5 block ${isLight ? "text-slate-600" : "text-slate-400"}`}>{t("Project Type", "نوع المشروع", "Project Type")}</Label>
                    <select value={form.projectType} onChange={e => set("projectType", e.target.value)} className={selectCls}>
                      <option value="">{t("Select Type", "اختر النوع", "Select")}</option>
                      {PROJECT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <Label className={`text-xs mb-1.5 block ${isLight ? "text-slate-600" : "text-slate-400"}`}>{t("Company Size", "حجم الشركة", "Company Size")}</Label>
                  <select value={form.companySize} onChange={e => set("companySize", e.target.value)} className={selectCls}>
                    <option value="">{t("Select Size", "اختر الحجم", "Select")}</option>
                    {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="mb-6">
                  <Label className={`text-xs mb-1.5 block ${isLight ? "text-slate-600" : "text-slate-400"}`}>{t("Describe your challenge", "صف التحدي الذي تواجهه", "Your challenge")}</Label>
                  <textarea value={form.painPoint} onChange={e => set("painPoint", e.target.value)} rows={4}
                    className={`w-full rounded-xl px-4 py-3 text-sm border resize-none focus:outline-none focus:ring-2 ${
                      isLight ? "bg-white border-slate-200 text-slate-900 focus:ring-cyan-500/20" : "bg-white/[0.04] border-white/[0.08] text-white focus:ring-cyan-500/20"
                    }`}
                    placeholder={t("e.g., We need a real-time defect detection system for our production line...", "مثلاً، نحتاج نظام كشف عيوب في الوقت الفعلي لخط الإنتاج...", "Describe your project needs...")} />
                </div>

                <Button type="submit" disabled={mutation.isPending} className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 text-base">
                  {mutation.isPending ? <><Loader2 className="w-5 h-5 me-2 animate-spin" /> {t("Submitting...", "جاري الإرسال...", "Submitting...")}</>
                    : <>{t("Submit Consultation Request", "إرسال طلب الاستشارة", "Submit Request")} <ArrowRight className="ms-2 w-5 h-5" /></>}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
