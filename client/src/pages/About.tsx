import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Loader2, Target, Eye, Award, MapPin, Rocket, Cpu, Sparkles, Shield, Code, Brain, ArrowRight, Layers } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  const { isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { data: pageContent, isLoading } = trpc.admin.getPageContent.useQuery({ pageKey: "about" });

  const founderImageUrl = "/uploads/poster.png";

  if (isLoading) return <div className={`flex items-center justify-center min-h-screen ${isLight ? 'bg-[#f8fafc]' : 'bg-[#020617]'}`}><Loader2 className="w-10 h-10 animate-spin text-cyan-400" /></div>;

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'} ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#020617] text-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      {/* HERO */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/uploads/hero_ai_neural.png" className="w-full h-full object-cover" alt="About" />
          <div className={`absolute inset-0 ${isLight ? 'bg-white/85' : 'bg-[#020617]/88'}`} />
        </div>
        <div className={`absolute inset-0 ${isLight ? 'opacity-[0.04]' : 'opacity-[0.03]'}`} style={{ backgroundImage: `linear-gradient(${isLight ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.1)'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.1)'} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border ${isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
              <Sparkles className="w-3.5 h-3.5" />
              {t("About Infinity X Solutions", "عن إنفينيتي إكس سولوشنز", "About Us")}
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t("We Engineer ", "نهندس ", "We Engineer ")}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{t("Intelligent Systems", "أنظمة ذكية", "Intelligent Systems")}</span>
            </h1>
            <p className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {t("Infinity X Solutions is an enterprise AI studio that architects, deploys, and transfers production-grade artificial intelligence and computer vision systems for organizations across the MENA region.", "إنفينيتي إكس سولوشنز هو استوديو ذكاء اصطناعي للمؤسسات يصمم وينشر ويسلم أنظمة ذكاء اصطناعي ورؤية حاسوبية جاهزة للإنتاج.", "Enterprise AI studio for MENA organizations.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className={`py-24 ${isLight ? 'bg-white' : ''}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className={`text-3xl font-black mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t("Not a Vendor. A Technical Partner.", "لسنا مورداً. شريك تقني.", "Technical Partner.")}
              </h2>
              <p className={`text-lg leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {t("We don't sell off-the-shelf software. We embed ourselves in your engineering organization, build custom AI systems tailored to your specific operational challenges, train your team to independently operate and improve them, then hand over complete source code and IP ownership.", "نحن لا نبيع برمجيات جاهزة. نندمج في مؤسستك الهندسية، نبني أنظمة ذكاء اصطناعي مخصصة لتحدياتك التشغيلية، ندرب فريقك لتشغيلها وتحسينها بشكل مستقل، ثم نسلم الكود المصدري الكامل وملكية الملكية الفكرية.", "Custom AI, full IP transfer.")}
              </p>
              <p className={`text-lg leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {t("Every engagement follows our Build → Train → Transfer model, ensuring you're never dependent on us. We succeed when your internal teams can operate without us.", "كل تعاقد يتبع نموذج البناء ← التدريب ← التسليم، مما يضمن عدم اعتمادك علينا أبداً.", "Build → Train → Transfer.")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "12+", label: t("Enterprise Clients", "عميل مؤسسي", "Clients"), color: "cyan" },
                { stat: "99.8%", label: t("Model Accuracy", "دقة النموذج", "Accuracy"), color: "emerald" },
                { stat: "<12ms", label: t("Inference Latency", "زمن الاستجابة", "Latency"), color: "purple" },
                { stat: "100%", label: t("IP Ownership", "ملكية فكرية", "IP Transfer"), color: "blue" },
              ].map((s, i) => (
                <div key={i} className={`p-6 rounded-2xl border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                  <p className={`text-3xl font-black mb-1 text-${s.color}-${isLight ? '600' : '400'}`}>{s.stat}</p>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className={`py-24 border-y ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.04] bg-[#030712]'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-3xl font-black text-center mb-16 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("Core Capabilities", "القدرات الأساسية", "Capabilities")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Eye, title: t("Computer Vision", "الرؤية الحاسوبية", "CV"), desc: t("Industrial object detection, defect classification, spatial tracking, and autonomous decision-making at the edge using YOLOv11 and TensorRT.", "كشف الأجسام الصناعية، تصنيف العيوب، التتبع المكاني، واتخاذ القرارات المستقلة.", "Industrial CV systems.") },
              { icon: Brain, title: t("AI & Machine Learning", "الذكاء الاصطناعي", "AI/ML"), desc: t("Predictive analytics, NLP pipelines, recommendation engines, and custom model training with full MLOps infrastructure.", "تحليلات تنبؤية، أنظمة معالجة لغات طبيعية، محركات توصية، وتدريب نماذج مخصصة.", "ML pipelines & analytics.") },
              { icon: Layers, title: t("Cloud-Native Architecture", "البنية السحابية", "Cloud"), desc: t("Microservices, Kubernetes orchestration, event-driven systems, and real-time data streaming for enterprise-grade scalability.", "خدمات مصغرة، تنسيق Kubernetes، أنظمة مدفوعة بالأحداث، وبث البيانات في الوقت الفعلي.", "Cloud-native systems.") },
            ].map((cap, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                <cap.icon className={`w-10 h-10 mb-6 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                <h3 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{cap.title}</h3>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REGIONAL */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`rounded-3xl p-8 md:p-12 border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-white/[0.02] border-white/[0.06]'}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className={`text-3xl font-black mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {t("MENA-First. Global Standards.", "الشرق الأوسط أولاً. معايير عالمية.", "MENA-First.")}
                </h2>
                <p className={`text-lg mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t("We serve enterprises across the MENA region with systems built to international standards. Our team understands local regulatory requirements, data residency constraints, and operational contexts.", "نخدم المؤسسات في منطقة الشرق الأوسط بأنظمة مبنية وفق معايير دولية.", "MENA enterprises, global standards.")}
                </p>
                <div className="flex flex-wrap gap-3">
                  {[{n:'Egypt',a:'مصر'},{n:'Saudi Arabia',a:'السعودية'},{n:'UAE',a:'الإمارات'},{n:'North Africa',a:'شمال أفريقيا'}].map(c => (
                    <div key={c.n} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
                      <MapPin className="w-3.5 h-3.5" />{t(c.n, c.a, c.n)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-6 rounded-xl text-center border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/[0.06]'}`}>
                  <p className="text-3xl font-black text-cyan-500 mb-1">5+</p>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t("Years", "سنوات", "Years")}</p>
                </div>
                <div className={`p-6 rounded-xl text-center border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/[0.06]'}`}>
                  <p className="text-3xl font-black text-emerald-500 mb-1">40+</p>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t("Projects Delivered", "مشروع منجز", "Projects")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className={`py-24 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.04] bg-[#030712]'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className={`rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-white/[0.02] border-white/[0.06]'}`}>
            <div className="md:w-1/3">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-600 rounded-2xl rotate-3 opacity-20" />
                <img src={founderImageUrl} alt="Founder" className="relative rounded-2xl shadow-lg w-full object-cover aspect-[3/4]" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-2">{t("Technical Leadership", "القيادة التقنية", "Leadership")}</h2>
              <h3 className={`text-4xl font-bold mb-6 flex items-center gap-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t((pageContent as any)?.founderName || "Ahmed Farahat", "أحمد فرحات", "Ahmed Farahat")}
                <a href="https://linkedin.com/in/ahmed-s-farahat" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
              </h3>
              <div className={`space-y-4 text-lg leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <p>{t("AI engineer and technical architect specializing in computer vision, deep learning, and production MLOps. With experience deploying real-time inference systems for industrial applications, Ahmed leads Infinity X's engineering practice and client engagements.", "مهندس ذكاء اصطناعي ومعماري تقني متخصص في الرؤية الحاسوبية والتعلم العميق وعمليات تعلم الآلة الإنتاجية.", "AI engineer & technical architect.")}</p>
                <p>{t("Beyond enterprise work, Ahmed runs Infinity X Academy — training the next generation of AI engineers across the MENA region through hands-on, project-based curricula.", "إلى جانب العمل المؤسسي، يدير أحمد أكاديمية إنفينيتي إكس لتدريب الجيل القادم من مهندسي الذكاء الاصطناعي.", "Also runs Infinity X Academy.")}</p>
              </div>
              <div className="mt-8 border-l-4 border-cyan-500 pl-6 py-2">
                <p className={`italic font-medium text-xl ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  "{t("We build systems that our clients own forever. That's the only model that creates real value.", "نبني أنظمة يملكها عملاؤنا للأبد. هذا النموذج الوحيد الذي يخلق قيمة حقيقية.", "Systems our clients own forever.")}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Shield className="w-14 h-14 text-cyan-500 mx-auto mb-6" />
          <h2 className={`text-4xl font-black mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t("Ready to Work With Us?", "مستعد للعمل معنا؟", "Ready?")}
          </h2>
          <p className={`text-xl mb-10 max-w-2xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {t("Let's discuss how we can architect the right AI solution for your organization.", "دعنا نناقش كيف يمكننا تصميم الحل المناسب لمؤسستك.", "Discuss your AI needs.")}
          </p>
          <Link href="/consultation">
            <Button size="lg" className="h-16 px-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl text-xl shadow-xl shadow-cyan-500/25">
              {t("Request Consultation", "اطلب استشارة", "Consult")} <ArrowRight className={`w-5 h-5 ${isRTL ? 'me-2 rotate-180' : 'ms-2'}`} />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}