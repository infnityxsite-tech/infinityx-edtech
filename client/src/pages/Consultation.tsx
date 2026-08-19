import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSEO } from "@/hooks/useSEO";

const industries = ["Manufacturing", "Logistics", "Infrastructure", "Energy", "Retail", "Other"];
const projectTypes = ["Automate operations", "Inspect visually", "Predict outcomes", "Build a custom AI system", "Deploy AI infrastructure", "Other"];

export default function Consultation() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const copy = (en: string, ar: string) => t(en, ar, en);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", industry: "", projectType: "", companySize: "", painPoint: "" });
  useSEO({ title: "Start an AI Project | Infinity X", description: "Tell Infinity X about the operational challenge your team needs to solve.", canonical: "https://infx.space/consultation", robots: "noindex, follow" });

  const mutation = trpc.admin.submitConsultationLead.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: () => toast.error(copy("We could not submit your project brief. Please try again.", "تعذر إرسال موجز مشروعك. يرجى المحاولة مرة أخرى.")),
  });

  const set = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.painPoint) {
      toast.error(copy("Name, email, and your challenge are required.", "الاسم والبريد الإلكتروني ووصف التحدي مطلوبة."));
      return;
    }
    mutation.mutate({
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      serviceInterest: form.projectType,
      industryPainPoint: `Industry: ${form.industry || "Not specified"} | Company size: ${form.companySize || "Not specified"} | ${form.painPoint}`,
    });
  };

  const rule = isLight ? "border-[#D8DDD8]" : "border-white/10";
  const panel = isLight ? "bg-white" : "bg-[#141A16]";
  const muted = isLight ? "text-[#5E6862]" : "text-slate-300";
  const control = `mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none transition-colors focus:border-[#52735F] focus:ring-2 focus:ring-[#52735F]/15 ${
    isLight ? "border-[#D8DDD8] bg-white text-[#1F2925]" : "border-white/20 bg-white/[.03] text-white"
  }`;

  return (
    <div className={`ix-page ${isRTL ? "rtl" : "ltr"} ${isLight ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />
      <main>
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <section className={`border-b pt-12 sm:pt-16 ${rule}`}>
          <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-14 lg:grid-cols-[1fr_1fr] lg:px-8 lg:pb-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{copy("Enterprise project brief", "موجز مشروع مؤسسي")}</p>
              <h1 className="mt-6 max-w-2xl text-5xl font-extrabold tracking-[-.065em] text-[#1F2925] sm:text-6xl">
                {copy("Start with the operating challenge, not a technology label.", "ابدأ بالتحدي التشغيلي، لا باسم التقنية.")}
              </h1>
            </div>
            <div className="self-end">
              <p className="max-w-xl text-lg leading-8 text-[#5E6862]">
                {copy(
                  "Share the essential context. Infinity X will use it to understand your operation and continue the right technical conversation.",
                  "شارك السياق الأساسي. ستستخدمه إنفينيتي إكس لفهم عملياتك ومتابعة المحادثة التقنية المناسبة."
                )}
              </p>
              <ol className="mt-8 grid border-t border-[#D8DDD8] sm:grid-cols-3">
                {[copy("Describe", "صف"), copy("Submit", "أرسل"), copy("Continue", "تابع")].map((step, index) => (
                  <li key={step} className="border-b border-[#D8DDD8] py-4 text-sm font-bold sm:border-e sm:px-4 sm:first:ps-0 sm:last:border-e-0">
                    <span className="me-2 text-[#52735F]">0{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── Form and Guidance ────────────────────────────────────────────── */}
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_.8fr] lg:px-8 lg:py-20">
          <div className={`border ${rule} ${panel} shadow-sm`}>
            {submitted ? (
              <div className="p-8 sm:p-12">
                <CheckCircle2 className="h-9 w-9 text-[#52735F]" />
                <p className="mt-8 text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{copy("Project brief received", "تم استلام موجز المشروع")}</p>
                <h2 className="mt-4 text-4xl font-extrabold tracking-[-.05em] text-[#1F2925]">{copy("Thank you. We have the context to begin.", "شكراً لك. لدينا الآن السياق للبدء.")}</h2>
                <p className={`mt-5 max-w-lg leading-7 ${muted}`}>
                  {copy(
                    "The Infinity X team will review the information you provided and use your contact details to continue the conversation.",
                    "سيراجع فريق إنفينيتي إكس المعلومات التي قدمتها ويستخدم بيانات الاتصال لمتابعة المحادثة."
                  )}
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="p-7 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{copy("Your operation", "عملياتك")}</p>
                <h2 className="mt-3 border-b border-[#D8DDD8] pb-7 text-2xl font-extrabold tracking-[-.035em] text-[#1F2925]">
                  {copy("Give the engineering team a useful starting point.", "امنح الفريق الهندسي نقطة بداية مفيدة.")}
                </h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">{copy("Full name", "الاسم الكامل")} *</Label>
                    <Input id="name" value={form.name} onChange={(event) => set("name", event.target.value)} className="mt-2 h-11 rounded-md border-[#D8DDD8]" required />
                  </div>
                  <div>
                    <Label htmlFor="company">{copy("Company", "الشركة")}</Label>
                    <Input id="company" value={form.company} onChange={(event) => set("company", event.target.value)} className="mt-2 h-11 rounded-md border-[#D8DDD8]" />
                  </div>
                  <div>
                    <Label htmlFor="email">{copy("Work email", "البريد الإلكتروني للعمل")} *</Label>
                    <Input id="email" type="email" value={form.email} onChange={(event) => set("email", event.target.value)} className="mt-2 h-11 rounded-md border-[#D8DDD8]" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">{copy("Phone", "الهاتف")}</Label>
                    <Input id="phone" value={form.phone} onChange={(event) => set("phone", event.target.value)} className="mt-2 h-11 rounded-md border-[#D8DDD8]" />
                  </div>
                </div>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="industry">{copy("Industry", "القطاع")}</Label>
                    <select id="industry" value={form.industry} onChange={(event) => set("industry", event.target.value)} className={control}>
                      <option value="">{copy("Select industry", "اختر القطاع")}</option>
                      {industries.map((industry) => (
                        <option key={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="projectType">{copy("What do you need to solve?", "ما الذي تحتاج إلى حله؟")}</Label>
                    <select id="projectType" value={form.projectType} onChange={(event) => set("projectType", event.target.value)} className={control}>
                      <option value="">{copy("Select a starting point", "اختر نقطة بداية")}</option>
                      {projectTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <Label htmlFor="size">{copy("Company size", "حجم الشركة")}</Label>
                  <select id="size" value={form.companySize} onChange={(event) => set("companySize", event.target.value)} className={control}>
                    <option value="">{copy("Select size", "اختر الحجم")}</option>
                    {["1–50", "51–200", "201–500", "500+"].map((size) => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-6">
                  <Label htmlFor="challenge">{copy("Describe the operating challenge", "صف التحدي التشغيلي")} *</Label>
                  <Textarea
                    id="challenge"
                    rows={5}
                    value={form.painPoint}
                    onChange={(event) => set("painPoint", event.target.value)}
                    className="mt-2 resize-none rounded-md border-[#D8DDD8]"
                    required
                    placeholder={copy("Where does work slow down, introduce risk, or need better information?", "أين يتباطأ العمل أو تظهر المخاطر أو تحتاج إلى معلومات أفضل؟")}
                  />
                </div>
                <div className={`mt-8 flex flex-col gap-4 border-t pt-7 sm:flex-row sm:items-center sm:justify-between ${rule}`}>
                  <p className={`max-w-sm text-xs leading-5 ${muted}`}>
                    {copy("This form begins a project conversation. It does not generate a proposal automatically.", "يبدأ هذا النموذج محادثة حول المشروع، ولا ينشئ مقترحاً تلقائياً.")}
                  </p>
                  <Button type="submit" disabled={mutation.isPending} className="h-12 rounded-md bg-[#52735F] px-5 font-bold text-white hover:bg-[#43614F]">
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="me-2 h-4 w-4 animate-spin" />
                        {copy("Sending", "جارٍ الإرسال")}
                      </>
                    ) : (
                      <>
                        {copy("Submit project brief", "إرسال موجز المشروع")}
                        <ChevronRight className={`ms-2 h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
          <aside className={`self-start border-s ps-0 pt-2 lg:ps-8 ${rule}`}>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{copy("A useful brief", "موجز مفيد")}</p>
            <div className={`mt-6 space-y-6 border-t pt-6 ${rule}`}>
              {[
                [copy("Operating context", "السياق التشغيلي"), copy("What happens today, who is involved, and what conditions define the work.", "ما الذي يحدث اليوم، ومن يشارك، وما الظروف التي تحدد العمل.")],
                [copy("Decision to improve", "القرار المراد تحسينه"), copy("The task, signal, or workflow where better information would matter.", "المهمة أو الإشارة أو سير العمل الذي ستفيد فيه معلومات أفضل.")],
                [copy("Practical constraints", "القيود العملية"), copy("Any timing, environment, integration, or ownership constraints you already know.", "أي قيود متعلقة بالتوقيت أو البيئة أو التكامل أو الملكية تعرفها بالفعل.")],
              ].map(([title, detail]) => (
                <div key={title}>
                  <h2 className="text-lg font-bold text-[#1F2925]">{title}</h2>
                  <p className={`mt-2 text-sm leading-6 ${muted}`}>{detail}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
