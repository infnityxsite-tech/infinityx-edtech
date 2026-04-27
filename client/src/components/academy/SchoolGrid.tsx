import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Brain, Shield, Code, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6 } }),
};

interface SchoolData {
  slug: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  image: string;
  icon: any;
  gradient: string;
  borderHover: string;
}

const schools: SchoolData[] = [
  {
    slug: "ai-and-data-science",
    title: "School of AI & Data Science",
    titleAr: "كلية الذكاء الاصطناعي وعلوم البيانات",
    subtitle: "Master neural networks, computer vision, NLP, and predictive analytics. From fundamentals to production deployment.",
    subtitleAr: "أتقن الشبكات العصبية والرؤية الحاسوبية ومعالجة اللغة الطبيعية والتحليلات التنبؤية — من الأساسيات إلى النشر الإنتاجي.",
    image: "/uploads/school_ai_cover.png",
    icon: Brain,
    gradient: "from-cyan-500 to-blue-600",
    borderHover: "hover:border-cyan-500/40",
  },
  {
    slug: "cybersecurity",
    title: "School of Cybersecurity",
    titleAr: "كلية الأمن السيبراني",
    subtitle: "Ethical hacking, penetration testing, SOC analysis, and digital forensics. Defend critical infrastructure against modern threats.",
    subtitleAr: "الاختراق الأخلاقي واختبار الاختراق وتحليل مراكز العمليات الأمنية والتحقيق الرقمي — حماية البنية التحتية الحيوية من التهديدات المعاصرة.",
    image: "/uploads/school_cyber_cover.png",
    icon: Shield,
    gradient: "from-red-500 to-amber-500",
    borderHover: "hover:border-red-500/40",
  },
  {
    slug: "full-stack-solutions",
    title: "School of Full Stack Solutions",
    titleAr: "كلية تطوير النظم المتكاملة",
    subtitle: "React, Node.js, cloud architecture, databases, and DevOps. Build scalable systems from front-end to infrastructure.",
    subtitleAr: "React وNode.js والبنية السحابية وقواعد البيانات وDevOps — ابنِ أنظمة قابلة للتوسع من الواجهة الأمامية إلى البنية التحتية.",
    image: "/uploads/school_fullstack_cover.png",
    icon: Code,
    gradient: "from-emerald-500 to-teal-500",
    borderHover: "hover:border-emerald-500/40",
  },
  {
    slug: "space-solutions",
    title: "School of Space Solutions",
    titleAr: "كلية تكنولوجيا الفضاء",
    subtitle: "Satellite systems, Earth observation AI, autonomous navigation, and aerospace data pipelines. The MENA region's premier space tech program.",
    subtitleAr: "أنظمة الأقمار الاصطناعية وذكاء رصد الأرض والملاحة الذاتية وأنابيب بيانات الفضاء — البرنامج الرائد في تكنولوجيا الفضاء بمنطقة الشرق الأوسط.",
    image: "/uploads/school_space_cover.png",
    icon: Rocket,
    gradient: "from-indigo-500 to-purple-600",
    borderHover: "hover:border-indigo-500/40",
  },
];

export default function SchoolGrid() {
  const { isRTL, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section id="schools" className="py-24 relative">
      {/* Background glow */}
      <div className={`absolute bottom-0 end-1/4 w-[500px] h-[500px] rounded-full blur-[200px] pointer-events-none ${isLight ? "bg-cyan-100/30" : "bg-cyan-500/5"}`} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>
            {t("Our Schools", "كلياتنا المتخصصة", "Our Schools")}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            {t(
              "Four specialized faculties, each designed to produce industry-ready professionals in high-demand technology fields.",
              "أربع كليات متخصصة، كل واحدة مصممة لتخريج محترفين جاهزين لسوق العمل في مجالات تكنولوجية مطلوبة بشدة.",
              "Four specialized faculties."
            )}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {schools.map((school, i) => (
            <motion.div
              key={school.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Link href={`/academy/${school.slug}`}>
                <div
                  className={`group relative rounded-3xl border overflow-hidden transition-all duration-500 cursor-pointer ${isLight ? "bg-white border-slate-200 shadow-lg hover:shadow-2xl" : `bg-[#0a0e1a] border-white/[0.06] ${school.borderHover}`}`}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={school.image}
                      alt={school.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Icon badge */}
                    <div className={`absolute top-4 ${isRTL ? "right-4" : "left-4"} w-12 h-12 rounded-xl bg-gradient-to-br ${school.gradient} flex items-center justify-center shadow-lg`}>
                      <school.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Arrow indicator */}
                    <div className={`absolute bottom-4 ${isRTL ? "left-4" : "right-4"} w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0`}>
                      <ArrowRight className={`w-5 h-5 text-white ${isRTL ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-2 group-hover:bg-gradient-to-r group-hover:${school.gradient} group-hover:bg-clip-text transition-colors ${isLight ? "text-slate-900" : "text-white"}`}>
                      {t(school.title, school.titleAr, school.title)}
                    </h3>
                    <p className={`text-sm leading-relaxed font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      {t(school.subtitle, school.subtitleAr, school.subtitle)}
                    </p>

                    {/* Explore link */}
                    <div className={`mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition-colors ${isLight ? "text-indigo-600 group-hover:text-indigo-700" : "text-indigo-400 group-hover:text-indigo-300"}`}>
                      {t("Explore School", "استكشف الكلية", "Explore")}
                      <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
