import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, Building2, CheckCircle2, GraduationCap, Loader2, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSEO } from "@/hooks/useSEO";

type Intent = "project" | "academy" | "general";

export default function Contact() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [intent, setIntent] = useState<Intent>("project");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const copy = (en: string, ar: string) => t(en, ar, en);
  const intents = [
    { id: "project" as const, title: copy("Enterprise project", "مشروع مؤسسي"), detail: copy("Discuss a system, operation, or technical capability.", "ناقش نظاماً أو عملية أو قدرة تقنية."), icon: Building2 },
    { id: "academy" as const, title: copy("Academy question", "سؤال عن الأكاديمية"), detail: copy("Ask about programs, applications, or learning formats.", "اسأل عن البرامج أو التقديم أو أنماط التعلم."), icon: GraduationCap },
    { id: "general" as const, title: copy("General inquiry", "استفسار عام"), detail: copy("Get in touch about another Infinity X matter.", "تواصل معنا بخصوص أمر آخر يتعلق بإنفينيتي إكس."), icon: MessageCircle },
  ];
  const mutation = trpc.admin.createMessage.useMutation({
    onSuccess: () => { setLoading(false); setSent(true); },
    onError: () => { setLoading(false); toast.error(copy("We could not send your message. Please try again.", "تعذر إرسال رسالتك. يرجى المحاولة مرة أخرى.")); },
  });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error(copy("Complete the required fields before sending.", "أكمل الحقول المطلوبة قبل الإرسال.")); return; }
    setLoading(true);
    mutation.mutate({ name: form.name, email: form.email, message: `[${intent}] ${form.message}`, messageType: "contact" });
  };
  const rule = isLight ? "border-[#D8DDD8]" : "border-white/10";
  const muted = isLight ? "text-[#5E6862]" : "text-slate-300";
  const panel = isLight ? "bg-white" : "bg-[#141A16]";

  return <div className={`ix-page ${isRTL ? "rtl" : "ltr"} ${isLight ? "bg-[#F5F4EF] text-[#1F2925]" : "bg-[#07111b] text-white"}`} dir={isRTL ? "rtl" : "ltr"}>
    <Navigation />
    <main>
      <section className={`border-b pt-12 sm:pt-16 ${rule}`}><div className="mx-auto grid max-w-7xl gap-10 px-6 pb-14 lg:grid-cols-[1fr_1fr] lg:px-8 lg:pb-20"><div className="self-end"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{copy("Contact Infinity X", "تواصل مع إنفينيتي إكس")}</p><h1 className="mt-6 max-w-2xl text-5xl font-extrabold tracking-[-.065em] text-[#1F2925] sm:text-6xl">{copy("Start with the conversation that fits your next move.", "ابدأ بالمحادثة التي تناسب خطوتك التالية.")}</h1></div><p className={`self-end max-w-xl border-s ps-0 text-lg leading-8 lg:ps-12 ${rule} ${muted}`}>{copy("Whether you are evaluating an enterprise system, choosing an Academy offering, or have another question, route your message to the right conversation.", "سواء كنت تقيّم نظاماً للمؤسسة، أو تختار عرضاً من الأكاديمية، أو لديك سؤال آخر، وجّه رسالتك إلى المحادثة المناسبة.")}</p></div></section>
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16"><div className="grid border-t md:grid-cols-3" style={{ borderColor: isLight ? "#D8DDD8" : "rgba(255,255,255,.1)" }}>{intents.map(({ id, title, detail, icon: Icon }, index) => <button key={id} type="button" onClick={() => setIntent(id)} aria-pressed={intent === id} className={`ix-interactive border-b p-6 text-start md:border-e md:last:border-e-0 ${rule} ${intent === id ? isLight ? "bg-[#E4EBE6]" : "bg-white/[.06]" : "bg-white"}`}><div className="flex items-start justify-between"><Icon className="h-5 w-5 text-[#52735F]" /><span className="text-sm font-bold text-[#52735F]">0{index + 1}</span></div><h2 className="mt-9 text-xl font-bold tracking-[-.025em] text-[#1F2925]">{title}</h2><p className={`mt-3 text-sm leading-6 ${muted}`}>{detail}</p></button>)}</div></section>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 lg:grid-cols-[1.2fr_.8fr] lg:px-8 lg:pb-28">
        <div className={`border ${rule} ${panel}`}>{sent ? <div className="p-8 sm:p-12"><CheckCircle2 className="h-9 w-9 text-[#52735F]" /><p className="mt-8 text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{copy("Message sent", "تم إرسال الرسالة")}</p><h2 className="mt-4 text-4xl font-extrabold tracking-[-.05em] text-[#1F2925]">{copy("Thank you. We have your message.", "شكراً لك. استلمنا رسالتك.")}</h2><p className={`mt-5 max-w-lg leading-7 ${muted}`}>{copy("The Infinity X team will use the contact details you provided to continue this conversation.", "سيستخدم فريق إنفينيتي إكس بيانات الاتصال التي قدمتها لمتابعة هذه المحادثة.")}</p><Button variant="outline" className="mt-9 h-11 rounded-md" onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}>{copy("Send another message", "أرسل رسالة أخرى")}</Button></div> : <form onSubmit={submit} className="p-7 sm:p-10"><div className="border-b border-[#D8DDD8] pb-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{intents.find((item) => item.id === intent)?.title}</p><h2 className="mt-3 text-2xl font-extrabold tracking-[-.035em] text-[#1F2925]">{copy("Tell us what you need.", "أخبرنا بما تحتاجه.")}</h2></div><div className="mt-8 grid gap-6 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="name">{copy("Full name", "الاسم الكامل")} <span aria-hidden="true">*</span></Label><Input id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required className="h-11 rounded-md border-[#D8DDD8]" placeholder={copy("Your name", "اسمك")} /></div><div className="space-y-2"><Label htmlFor="email">{copy("Email", "البريد الإلكتروني")} <span aria-hidden="true">*</span></Label><Input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required className="h-11 rounded-md border-[#D8DDD8]" placeholder="name@example.com" /></div></div><div className="mt-6 space-y-2"><Label htmlFor="message">{copy("Message", "الرسالة")} <span aria-hidden="true">*</span></Label><Textarea id="message" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} rows={7} required className="resize-none rounded-md border-[#D8DDD8]" placeholder={intent === "project" ? copy("Describe the operating challenge, system, or outcome you are considering.", "صف التحدي التشغيلي أو النظام أو النتيجة التي تفكر فيها.") : copy("How can we help?", "كيف يمكننا مساعدتك؟")} /></div><div className={`mt-8 flex flex-col gap-4 border-t pt-7 sm:flex-row sm:items-center sm:justify-between ${rule}`}><p className={`max-w-sm text-xs leading-5 ${muted}`}>{copy("We use these details only to respond to your inquiry.", "نستخدم هذه البيانات فقط للرد على استفسارك.")}</p><Button type="submit" disabled={loading} className="h-12 rounded-md bg-[#52735F] px-5 font-bold text-white hover:bg-[#43614F]">{loading ? <><Loader2 className="me-2 h-4 w-4 animate-spin" />{copy("Sending", "جارٍ الإرسال")}</> : <>{copy("Send message", "إرسال الرسالة")}<Send className="ms-2 h-4 w-4" /></>}</Button></div></form>}</div>
        <aside className={`self-start border-s ps-0 pt-2 lg:ps-8 ${rule}`}><p className="text-xs font-bold uppercase tracking-[.16em] text-[#52735F]">{copy("Direct contact", "تواصل مباشر")}</p><div className={`mt-6 space-y-6 border-t pt-6 ${rule}`}><div className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#52735F]" /><div><p className="text-sm font-bold text-[#1F2925]">{copy("Email", "البريد الإلكتروني")}</p><a className={`mt-1 inline-block text-sm ${muted} hover:text-[#52735F]`} href="mailto:support@infx.space">support@infx.space</a></div></div><div className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#52735F]" /><div><p className="text-sm font-bold text-[#1F2925]">{copy("Phone", "الهاتف")}</p><a className={`mt-1 inline-block text-sm ${muted} hover:text-[#52735F]`} href="tel:+201100135225">+20 110 013 5225</a></div></div><div className="flex gap-3"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#52735F]" /><div><p className="text-sm font-bold text-[#1F2925]">WhatsApp</p><a className={`mt-1 inline-block text-sm ${muted} hover:text-[#52735F]`} href="https://wa.me/201100135225" target="_blank" rel="noreferrer">{copy("Start a WhatsApp conversation", "ابدأ محادثة عبر واتساب")}</a></div></div></div></aside>
      </section>
    </main>
    <Footer />
  </div>;
}
