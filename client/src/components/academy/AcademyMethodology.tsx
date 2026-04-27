import { motion } from "framer-motion";
import { Video, MonitorPlay, Wrench, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

export default function AcademyMethodology() {
  const { isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const pillars = [
    {
      icon: Video,
      title: t("Live Interactive Sessions", "جلسات تفاعلية حية", "Live Sessions"),
      description: t(
        "Real-time classes led by industry engineers. Ask questions, solve problems live, and get instant feedback in sessions designed for deep understanding.",
        "حصص مباشرة يقودها مهندسون من الصناعة — اطرح أسئلتك، حُل المشكلات لحظياً، واحصل على تغذية راجعة فورية في بيئة مصممة للفهم العميق.",
        "Live classes with engineers."
      ),
      gradient: "from-cyan-500 to-blue-600",
      glow: isLight ? "bg-cyan-50" : "bg-cyan-500/10",
      iconColor: isLight ? "text-cyan-600" : "text-cyan-400",
    },
    {
      icon: MonitorPlay,
      title: t("Recorded & On-Demand", "محتوى مسجّل حسب الطلب", "Recorded Content"),
      description: t(
        "Lifetime access to professionally produced video content. Learn at your own pace, rewatch complex topics, and build your knowledge foundation.",
        "وصول مدى الحياة لمحتوى فيديو احترافي — تعلّم بالسرعة التي تناسبك، أعد مشاهدة المواضيع المعقدة، وابنِ أساساً معرفياً متيناً.",
        "On-demand video content."
      ),
      gradient: "from-purple-500 to-indigo-600",
      glow: isLight ? "bg-purple-50" : "bg-purple-500/10",
      iconColor: isLight ? "text-purple-600" : "text-purple-400",
    },
    {
      icon: Wrench,
      title: t("Project-Based Learning", "التعلم القائم على المشاريع العملية", "Project-Based"),
      description: t(
        "Every track culminates in real-world capstone projects. Build production-grade systems, compile your portfolio, and graduate with tangible proof of your skills.",
        "كل مسار ينتهي بمشاريع تخرّج حقيقية — ابنِ أنظمة بمستوى الإنتاج، جهّز معرض أعمالك، وتخرّج بإثبات ملموس لمهاراتك.",
        "Capstone projects."
      ),
      gradient: "from-emerald-500 to-teal-600",
      glow: isLight ? "bg-emerald-50" : "bg-emerald-500/10",
      iconColor: isLight ? "text-emerald-600" : "text-emerald-400",
    },
  ];

  return (
    <section className="py-24 relative">
      {/* Background glow */}
      <div className={`absolute top-0 start-1/3 w-[500px] h-[500px] rounded-full blur-[200px] pointer-events-none ${isLight ? "bg-indigo-100/40" : "bg-indigo-500/5"}`} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>
            {t("Our Methodology", "منهجيتنا التعليمية", "Methodology")}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            {t(
              "A proven three-pillar approach that combines the best of live instruction, self-paced learning, and hands-on project experience.",
              "نهج ثلاثي الركائز مُثبت الفعالية يجمع بين أفضل ما في التدريس المباشر والتعلم الذاتي والخبرة العملية في المشاريع.",
              "Three-pillar proven approach."
            )}
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className={`group rounded-3xl border p-8 transition-all duration-300 ${isLight ? "bg-white border-slate-200 shadow-sm hover:shadow-xl" : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${pillar.glow}`}>
                <pillar.icon className={`w-7 h-7 ${pillar.iconColor}`} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                {pillar.title}
              </h3>
              <p className={`text-sm leading-relaxed font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* LMS Integration Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-3xl border p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 ${isLight ? "bg-gradient-to-r from-indigo-50 to-cyan-50 border-indigo-200/50" : "bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 border-white/[0.08]"}`}
        >
          <div className="flex-1">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider ${isLight ? "bg-indigo-100 text-indigo-700" : "bg-indigo-500/20 text-indigo-300"}`}>
              {t("Learning Management System", "منصة إدارة التعلم", "LMS")}
            </div>
            <h3 className={`text-2xl md:text-3xl font-black mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>
              {t("Your Dedicated LMS Portal", "بوابتك التعليمية المخصصة", "LMS Portal")}
            </h3>
            <p className={`text-sm font-medium leading-relaxed max-w-xl ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              {t(
                "Access all your courses, assignments, quizzes, and progress tracking through our dedicated learning management system. A seamless, integrated learning experience.",
                "تابع جميع دوراتك ومهامك واختباراتك وتقدمك من خلال منصتنا التعليمية المخصصة — تجربة تعلم سلسة ومتكاملة.",
                "Access courses via our LMS."
              )}
            </p>
          </div>
          <a href="https://academy.infx.space/" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className={`h-14 px-8 rounded-xl font-bold text-lg shrink-0 ${isLight ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20" : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25"}`}
            >
              <ExternalLink className={`w-5 h-5 ${isRTL ? "ms-2" : "me-2"}`} />
              {t("Visit LMS Portal", "زيارة منصة التعلم", "Visit LMS")}
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
