import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail, Phone, MessageCircle, MapPin, Send, Loader2, Sparkles, Clock, ArrowRight
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const createMessage = trpc.admin.createMessage.useMutation({
    onSuccess: () => {
      toast.success(t("Your message has been sent successfully!", "تم إرسال رسالتك بنجاح!", "Message sent!"));
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    },
    onError: () => {
      toast.error(t("Failed to send your message. Please try again.", "فشل إرسال رسالتك. حاول مرة أخرى.", "Failed to send."));
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(t("Please fill all fields before sending your message.", "يرجى ملء جميع الحقول قبل الإرسال.", "Fill all fields."));
      return;
    }
    setLoading(true);
    createMessage.mutate({ name: form.name, email: form.email, message: form.message, messageType: "contact" });
  };

  const siteInfo = {
    email: "support@infx.space",
    phone: "+20 110 013 5225",
    whatsapp: "https://wa.me/201100135225",
    location: t("Cairo, Egypt", "القاهرة، مصر", "Cairo, Egypt"),
  };

  return (
    <div className={`min-h-screen font-sans ${isLight ? 'bg-[#f0f4f8] text-slate-900' : 'bg-[#0a0e1a] text-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* Hero */}
      <section className={`relative pt-36 pb-24 overflow-hidden ${isLight ? '' : 'bg-[#0b1120] text-white'}`}>
        <div className={`absolute inset-0 pointer-events-none ${isLight ? 'opacity-10' : 'opacity-[0.03]'}`} style={{ backgroundImage: `linear-gradient(${isLight ? '#94a3b8' : '#334155'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#94a3b8' : '#334155'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("24/7 Support Team", "فريق دعم على مدار الساعة", "24/7 Support")}</span>
          </div>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("Let's Start a ", "لنبدأ ", "Let's Start a ")}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{t("Conversation.", "محادثة.", "Conversation.")}</span>
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {t(
              "Whether you're a student with questions, a university looking to partner, or just want to say hi — we're here to help.",
              "سواء كنت طالباً لديك أسئلة، أو جامعة تبحث عن شراكة، أو فقط تريد إلقاء التحية — نحن هنا للمساعدة.",
              "We're here to help."
            )}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Contact Info */}
          <div className="space-y-6">
            <div className={`backdrop-blur-xl rounded-2xl p-8 border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0d1225]/80 border-white/[0.06]'}`}>
              <h3 className={`text-xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Get in Touch", "تواصل معنا", "Get in Touch")}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{t("Email Support", "دعم البريد الإلكتروني", "Email Support")}</p>
                    <a href={`mailto:${siteInfo.email}`} className={`font-semibold hover:text-cyan-400 transition ${isLight ? 'text-slate-900' : 'text-white'}`}>{siteInfo.email}</a>
                    <p className="text-xs text-slate-600 mt-1">{t("Replies within 24 hours", "الرد خلال 24 ساعة", "Replies within 24 hours")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{t("Phone & WhatsApp", "الهاتف والواتساب", "Phone & WhatsApp")}</p>
                    <a href={`tel:${siteInfo.phone}`} className={`font-semibold hover:text-cyan-400 transition block ${isLight ? 'text-slate-900' : 'text-white'}`}>{siteInfo.phone}</a>
                    <a href={siteInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 mt-1">
                      <MessageCircle className="w-3 h-3" /> {t("Chat on WhatsApp", "تحدث عبر الواتساب", "Chat on WhatsApp")}
                    </a>
                    <a href="https://chat.whatsapp.com/EagO7iuBsfM1zlTQSKGLfL" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 mt-1 ml-0 block">
                      <MessageCircle className="w-3 h-3" /> {t("Join WhatsApp Community", "انضم لمجتمع الواتساب", "Join Community")}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{t("Headquarters", "المقر الرئيسي", "Headquarters")}</p>
                    <p className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{siteInfo.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{t("Working Hours", "ساعات العمل", "Working Hours")}</p>
                    <p className={`font-medium text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Sun - Thu: 10:00 AM - 06:00 PM", "الأحد - الخميس: 10:00 ص - 06:00 م", "Sun - Thu: 10 AM - 6 PM")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-slate-800 rounded-2xl h-64 w-full overflow-hidden border border-white/[0.06] relative group">
              <iframe
                title="InfinityX Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.163777727914!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzQwLjAiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sen!2seg!4v1630000000000!5m2!1sen!2seg"
                width="100%" height="100%"
                style={{ border: 0, filter: 'grayscale(100%) brightness(0.6)' }}
                allowFullScreen loading="lazy"
                className="group-hover:brightness-75 transition-all duration-500"
              ></iframe>
              <div className="absolute bottom-4 left-4 bg-[#0d1225]/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-white border border-white/[0.06]">
                Cairo, Egypt
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-2">
            <div className={`backdrop-blur-xl rounded-2xl border h-full ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0d1225]/80 border-white/[0.06]'}`}>
              <div className="p-8 lg:p-10">
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{t("Send us a message", "أرسل لنا رسالة", "Send us a message")}</h2>
                  <p className="text-slate-500 mt-2">{t("Have a specific inquiry? Fill out the form below and our team will get back to you shortly.", "لديك استفسار محدد؟ املأ النموذج أدناه وسيتواصل معك فريقنا قريباً.", "Fill out the form.")}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-semibold text-slate-400">{t("Full Name", "الاسم الكامل", "Full Name")}</label>
                      <Input
                        id="name" placeholder={t("John Doe", "محمد أحمد", "John Doe")} value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })} required
                        className={`h-12 rounded-xl focus:ring-cyan-500/30 focus:border-cyan-500/40 ${isLight ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-slate-400">{t("Email Address", "البريد الإلكتروني", "Email Address")}</label>
                      <Input
                        id="email" type="email" placeholder="john@example.com" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })} required
                        className={`h-12 rounded-xl focus:ring-cyan-500/30 focus:border-cyan-500/40 ${isLight ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold text-slate-400">{t("Message", "الرسالة", "Message")}</label>
                    <Textarea
                      id="message" placeholder={t("How can we help you?", "كيف يمكننا مساعدتك؟", "How can we help?")} rows={8} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })} required
                      className={`resize-none p-4 rounded-xl focus:ring-cyan-500/30 focus:border-cyan-500/40 ${isLight ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600'}`}
                    />
                  </div>
                  <Button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-6 text-lg transition-all shadow-lg shadow-cyan-500/20 rounded-xl">
                    {loading ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t("Sending...", "جاري الإرسال...", "Sending...")}</>) : (<>{t("Send Message", "إرسال الرسالة", "Send Message")} <ArrowRight className="w-5 h-5 ml-2" /></>)}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}