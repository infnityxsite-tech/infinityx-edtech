import { motion } from "framer-motion";
import { Users, Globe2, Award, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5 } }),
};

export default function AcademyStats() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const stats = [
    {
      icon: Users,
      value: "+500",
      label: t("Students Trained", "متدرب ومتدربة", "Students"),
      color: "from-cyan-400 to-blue-500",
      glow: isLight ? "bg-cyan-100" : "bg-cyan-500/10",
      iconColor: isLight ? "text-cyan-600" : "text-cyan-400",
    },
    {
      icon: Globe2,
      value: t("MENA Region", "الشرق الأوسط", "MENA"),
      label: t("Serving the MENA Region with confidence", "نخدم منطقة الشرق الأوسط وشمال إفريقيا بثقة", "Serving MENA"),
      color: "from-indigo-400 to-purple-500",
      glow: isLight ? "bg-indigo-100" : "bg-indigo-500/10",
      iconColor: isLight ? "text-indigo-600" : "text-indigo-400",
    },
    {
      icon: Award,
      value: "98%",
      label: t("Completion Rate", "نسبة إتمام البرامج", "Completion"),
      color: "from-emerald-400 to-teal-500",
      glow: isLight ? "bg-emerald-100" : "bg-emerald-500/10",
      iconColor: isLight ? "text-emerald-600" : "text-emerald-400",
    },
    {
      icon: BookOpen,
      value: "4",
      label: t("Specialized Schools", "كليات متخصصة", "Schools"),
      color: "from-amber-400 to-orange-500",
      glow: isLight ? "bg-amber-100" : "bg-amber-500/10",
      iconColor: isLight ? "text-amber-600" : "text-amber-400",
    },
  ];

  return (
    <section className={`py-16 border-y relative overflow-hidden ${isLight ? "border-slate-200 bg-slate-50/50" : "border-white/[0.04] bg-[#030712]"}`}>
      {/* Subtle glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full blur-[120px] pointer-events-none ${isLight ? "bg-indigo-100/50" : "bg-indigo-500/5"}`} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className={`relative group rounded-2xl border p-6 text-center transition-all duration-300 ${isLight ? "bg-white border-slate-200 shadow-sm hover:shadow-lg" : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"}`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${stat.glow}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>

              {/* Value */}
              <h3 className={`text-2xl sm:text-3xl font-black mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </h3>

              {/* Label */}
              <p className={`text-xs sm:text-sm font-semibold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {stat.label}
              </p>

              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${isLight ? "bg-gradient-to-br from-indigo-50/50 to-cyan-50/50" : "bg-gradient-to-br from-indigo-500/5 to-cyan-500/5"}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
