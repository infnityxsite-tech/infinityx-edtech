import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CheckCircle2, CircleAlert, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSEO } from "@/hooks/useSEO";

export default function Apply() {
  const [, navigate] = useLocation();
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const search = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
  const preSelectedId = search.get("programId") || search.get("courseId") || "";
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", courseId: "", message: "" });
  const { data: programs = [], isLoading: programsLoading } = trpc.admin.getPrograms.useQuery();
  const { data: courses = [], isLoading: coursesLoading } = trpc.admin.getCourses.useQuery();
  const isLoadingData = programsLoading || coursesLoading;
  const copy = (en: string, ar: string) => t(en, ar, en);

  useSEO({ title: "Apply to Infinity X Academy", description: "Apply to an Infinity X Academy program or short course.", canonical: "https://infx.space/apply", robots: "noindex, follow" });

  useEffect(() => { if (preSelectedId) setForm((current) => ({ ...current, courseId: preSelectedId })); }, [preSelectedId]);

  const offerings = useMemo(() => [...(programs as any[]), ...(courses as any[])], [programs, courses]);
  const selected = offerings.find((offering) => String(offering.id) === form.courseId);
  const createApplication = trpc.admin.createApplication.useMutation({
    onSuccess: () => { setSubmitting(false); setSubmitted(true); },
    onError: (error) => { toast.error(`${copy("We could not submit your application.", "تعذر إرسال طلبك.")} ${error.message}`); setSubmitting(false); },
  });
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.courseId) { toast.error(copy("Complete the required fields before submitting.", "أكمل الحقول المطلوبة قبل الإرسال.")); return; }
    setSubmitting(true);
    createApplication.mutate(form);
  };

  const rule = isLight ? "border-[#D8DDD8]" : "border-white/10";
  const panel = isLight ? "bg-white" : "bg-[#141A16]";
  const muted = isLight ? "text-[#5E6862]" : "text-slate-300";

  return (
    <div className={`ix-page ${isRTL ? "rtl" : "ltr"} ${isLight ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />
      <main>
        <section className={`border-b pt-12 sm:pt-16 ${rule}`}>
          <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-14 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:pb-20">
            <div className="self-end">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{copy("Infinity X Academy", "أكاديمية إنفينيتي إكس")}</p>
              <h1 className="mt-6 max-w-xl text-5xl font-extrabold tracking-[-.065em] text-[#1F2925] sm:text-6xl">{copy("Start your application with a clear next step.", "ابدأ طلبك بخطوة تالية واضحة.")}</h1>
            </div>
            <div className={`self-end border-s ps-0 lg:ps-12 ${rule}`}>
              <p className={`max-w-xl text-lg leading-8 ${muted}`}>
                {copy("Choose your offering, share the essentials, and our admissions team will review your application. We will contact you with the next steps.", "اختر عرضك التعليمي وشارك البيانات الأساسية، وسيراجع فريق القبول طلبك ويتواصل معك بشأن الخطوات التالية.")}
              </p>
              <ol className={`mt-8 grid border-t ${rule} sm:grid-cols-3`}>
                {[copy("Choose offering", "اختر العرض"), copy("Submit details", "أرسل البيانات"), copy("Receive next steps", "استلم الخطوات التالية")].map((step, index) => (
                  <li key={step} className={`border-b border-[#D8DDD8] py-4 text-sm font-bold sm:border-e sm:px-4 sm:first:ps-0 sm:last:border-e-0`}>
                    <span className="me-2 text-[#52735F]">0{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.2fr_.8fr] lg:px-8 lg:py-16">
          <div className={`border ${rule} ${panel} shadow-sm`}>
            {submitted ? (
              <div className="px-7 py-12 sm:px-10 sm:py-16">
                <CheckCircle2 className="h-9 w-9 text-[#52735F]" />
                <p className="mt-8 text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{copy("Application received", "تم استلام الطلب")}</p>
                <h2 className="mt-4 text-4xl font-extrabold tracking-[-.05em] text-[#1F2925]">{copy("Thank you. Your next step is on its way.", "شكراً لك. خطوتك التالية في الطريق.")}</h2>
                <p className={`mt-5 max-w-lg leading-7 ${muted}`}>
                  {copy("The admissions team will review the details you provided and contact you using your submitted information.", "سيراجع فريق القبول البيانات التي قدمتها ويتواصل معك باستخدام معلوماتك المرسلة.")}
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href="/academy">
                    <Button className="h-11 rounded-md bg-[#52735F] text-white hover:bg-[#43614F]">{copy("Return to Academy", "العودة إلى الأكاديمية")}</Button>
                  </Link>
                  <Button variant="outline" className="h-11 rounded-md border-[#D8DDD8]" onClick={() => navigate("/")}>
                    {copy("Return home", "العودة للرئيسية")}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-7 sm:p-10">
                <div className="flex items-start justify-between gap-5 border-b border-[#D8DDD8] pb-7">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{copy("Application details", "بيانات الطلب")}</p>
                    <h2 className="mt-3 text-2xl font-extrabold tracking-[-.035em] text-[#1F2925]">{copy("Tell us how to reach you.", "أخبرنا بكيفية التواصل معك.")}</h2>
                  </div>
                  <Sparkles className="h-5 w-5 shrink-0 text-[#52735F]" />
                </div>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{copy("Full name", "الاسم الكامل")} <span aria-hidden="true">*</span></Label>
                    <Input id="fullName" required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} placeholder={copy("Your name", "اسمك")} className="h-11 rounded-md border-[#D8DDD8]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{copy("Phone / WhatsApp", "الهاتف / واتساب")} <span aria-hidden="true">*</span></Label>
                    <Input id="phone" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+20 …" className="h-11 rounded-md border-[#D8DDD8]" />
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <Label htmlFor="email">{copy("Email", "البريد الإلكتروني")} <span aria-hidden="true">*</span></Label>
                  <Input id="email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@example.com" className="h-11 rounded-md border-[#D8DDD8]" />
                </div>
                <div className="mt-6 space-y-2">
                  <Label htmlFor="offering">{copy("Program or short course", "البرنامج أو الدورة القصيرة")} <span aria-hidden="true">*</span></Label>
                  {isLoadingData ? (
                    <div className={`h-11 animate-pulse border ${rule}`} />
                  ) : (
                    <Select value={form.courseId} onValueChange={(courseId) => setForm({ ...form, courseId })}>
                      <SelectTrigger id="offering" className="h-11 rounded-md border-[#D8DDD8]">
                        <SelectValue placeholder={copy("Choose an Academy offering", "اختر عرضاً من الأكاديمية")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{copy("Programs", "البرامج")}</SelectLabel>
                          {(programs as any[]).map((program) => (
                            <SelectItem key={program.id} value={String(program.id)}>
                              {copy(program.title, program.titleAr || program.title)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>{copy("Short courses", "الدورات القصيرة")}</SelectLabel>
                          {(courses as any[]).map((course) => (
                            <SelectItem key={course.id} value={String(course.id)}>
                              {copy(course.title, course.titleAr || course.title)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                  {selected && (
                    <p className="flex items-center gap-2 text-xs font-semibold text-[#52735F]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {copy("Selected:", "الاختيار:")} {copy(selected.title, selected.titleAr || selected.title)}
                    </p>
                  )}
                </div>
                <div className="mt-6 space-y-2">
                  <Label htmlFor="message">
                    {copy("What do you want to achieve?", "ما الذي تريد تحقيقه؟")} <span className="font-normal text-[#7B847F]">{copy("Optional", "اختياري")}</span>
                  </Label>
                  <Textarea id="message" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder={copy("Share your goal or any question for admissions.", "شارك هدفك أو أي سؤال لفريق القبول.")} rows={4} className="resize-none rounded-md border-[#D8DDD8]" />
                </div>
                <div className={`mt-8 flex flex-col gap-4 border-t border-[#D8DDD8] pt-7 sm:flex-row sm:items-center sm:justify-between`}>
                  <p className={`max-w-sm text-xs leading-5 ${muted}`}>
                    {copy("By submitting, you are asking Infinity X Academy to contact you about this application.", "بتقديم الطلب، فإنك تطلب من أكاديمية إنفينيتي إكس التواصل معك بشأن هذا الطلب.")}
                  </p>
                  <Button type="submit" disabled={submitting} className="h-12 shrink-0 rounded-md bg-[#52735F] px-5 font-bold text-white hover:bg-[#43614F]">
                    {submitting ? (
                      <>
                        <Loader2 className="me-2 h-4 w-4 animate-spin" />
                        {copy("Submitting", "جارٍ الإرسال")}
                      </>
                    ) : (
                      <>
                        {copy("Submit application", "إرسال الطلب")}
                        <ArrowRight className={`ms-2 h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
          <aside className={`self-start border-s ps-0 pt-3 lg:ps-8 ${rule}`}>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{copy("Before you submit", "قبل الإرسال")}</p>
            <div className={`mt-6 space-y-6 border-t border-[#D8DDD8] pt-6`}>
              <div>
                <h2 className="text-lg font-bold text-[#1F2925]">{copy("Choose the right offering", "اختر العرض المناسب")}</h2>
                <p className={`mt-2 text-sm leading-6 ${muted}`}>
                  {copy("Explore Programs for structured, project-based study, or Short Courses for a focused learning format.", "استكشف البرامج للدراسة المنظمة القائمة على المشاريع، أو الدورات القصيرة لتعلم مركز.")}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1F2925]">{copy("Keep your details current", "حافظ على دقة بياناتك")}</h2>
                <p className={`mt-2 text-sm leading-6 ${muted}`}>
                  {copy("Use an email and phone number where the admissions team can reach you.", "استخدم بريداً إلكترونياً ورقم هاتف يمكن لفريق القبول التواصل معك من خلالهما.")}
                </p>
              </div>
              <div className={`flex gap-3 border-s ps-4 text-sm leading-6 border-[#52735F]`}>
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#52735F]" />
                <p className="text-[#5E6862]">{copy("Applications are reviewed with the information provided. Submitting does not create a student account.", "تتم مراجعة الطلبات بناءً على المعلومات المقدمة. لا يؤدي التقديم إلى إنشاء حساب طالب.")}</p>
              </div>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
